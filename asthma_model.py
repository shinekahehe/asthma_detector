import os
import librosa
import numpy as np
import pandas as pd

# Paths (adjust to your environment)
audio_path = r"D:\asthma_model\respiratory_dataset\Respiratory_Sound_Database\Respiratory_Sound_Database\audio_and_txt_files"
wav_files = [f for f in os.listdir(audio_path) if f.endswith('.wav')]

cycle_X_raw = [] # We store raw audio first for YAMNet
cycle_y = []

for wav_file in wav_files:
    path = os.path.join(audio_path, wav_file)
    txt_path = path.replace(".wav", ".txt")
    
    waveform, sr = librosa.load(path, sr=16000, mono=True)
    
    with open(txt_path) as f:
        for line in f:
            start, end, crackle, wheeze = line.strip().split('\t')
            # GOAL: Detect Asthma via Wheeze
            label = int(wheeze) 
            
            # Extract segment
            start_s, end_s = int(float(start)*sr), int(float(end)*sr)
            segment = waveform[start_s:end_s]
            
            # YAMNet usually needs at least 0.975s, let's pad/trim to 1.5s (24000 samples)
            target_len = 24000 
            if len(segment) >= 16000: # Ignore very short artifacts
                if len(segment) < target_len:
                    segment = np.pad(segment, (0, target_len - len(segment)))
                else:
                    segment = segment[:target_len]
                
                cycle_X_raw.append(segment)
                cycle_y.append(label)

X_audio = np.array(cycle_X_raw)
y = np.array(cycle_y)

import tensorflow as tf
import tensorflow_hub as hub

# 1. Define the Wrapper Layer
class YamnetLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(YamnetLayer, self).__init__(**kwargs)
        # Load the model inside the layer
        self.yamnet = hub.load('https://tfhub.dev/google/yamnet/1')

    def call(self, inputs):
        # inputs will be (Batch, 24000)
        # YAMNet expects a 1D vector for a single sample, or we can use map_fn for batches
        def _extract(audio):
            # YAMNet returns [scores, embeddings, spectrogram]
            _, embeddings, _ = self.yamnet(audio)
            return embeddings

        # Use tf.map_fn to process each audio clip in the batch
        embeddings = tf.map_fn(
            _extract, 
            inputs, 
            fn_output_signature=tf.float32
        )
        return embeddings

# 2. Build the Model using the Wrapper
def build_wheeze_model():
    # Input is 24,000 samples (1.5 seconds at 16kHz)
    input_segment = tf.keras.layers.Input(shape=(24000,), dtype=tf.float32, name='audio_input')
    
    # Use our custom wrapper instead of hub.KerasLayer directly
    embeddings = YamnetLayer(name='yamnet_features')(input_segment)
    
    # embeddings shape: (Batch, TimeFrames, 1024)
    # Average pooling across time frames
    x = tf.keras.layers.GlobalAveragePooling1D()(embeddings)
    
    # Dense Head
    x = tf.keras.layers.Dense(256, activation='relu')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    
    x = tf.keras.layers.Dense(128, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    
    output = tf.keras.layers.Dense(1, activation='sigmoid', name='wheeze_prediction')(x)
    
    return tf.keras.Model(inputs=input_segment, outputs=output)

# Initialize and Compile
model = build_wheeze_model()

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss='binary_crossentropy',
    metrics=['accuracy', tf.keras.metrics.AUC(name='auc')]
)

model.summary()

from sklearn.model_selection import train_test_split
from sklearn.utils.class_weight import compute_class_weight

# Split
X_train, X_test, y_train, y_test = train_test_split(X_audio, y, test_size=0.2, stratify=y)

# Compute Weights
weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
cw_dict = {0: weights[0], 1: weights[1]}

# Train
history = model.fit(
    X_train, y_train,
    validation_split=0.15,
    epochs=50,
    batch_size=32,
    class_weight=cw_dict,
    callbacks=[tf.keras.callbacks.EarlyStopping(monitor='val_auc', patience=7, restore_best_weights=True)]
)

from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Get probability scores from the model
y_probs = model.predict(X_test).ravel()

# Set a threshold (0.5 is standard, but you can adjust this for sensitivity)
y_pred = (y_probs > 0.5).astype(int)

from sklearn.metrics import confusion_matrix, classification_report, roc_auc_score

# 1. Calculate Raw Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix (Numerical):")
print(cm)

# 2. Print Classification Report (Precision, Recall, F1)
print("\nDetailed Classification Report:")
print(classification_report(y_test, y_pred, target_names=['Normal', 'Wheeze']))

# 3. Calculate and Print AUC
# Using y_probs for AUC is more accurate than using binary predictions
auc_value = roc_auc_score(y_test, y_probs)
print(f"\nFinal AUC Value: {auc_value:.4f}")

# Updated saving block for your fresh notebook
model.save("models/asthma_wheeze_model.h5") 

# To verify the file exists
if os.path.exists("D:\asthma_model"):
    print("Verification: .h5 file created successfully.")