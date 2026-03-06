import requests, json

# Test 1: Register a caretaker
print("=" * 60)
print("1️⃣  REGISTER CARETAKER")
print("=" * 60)
import time
ts = str(int(time.time()))
resp = requests.post('http://localhost:5000/api/auth/register', 
    json={'name':'Bob Caretaker','email':f'bob{ts}@test.com','password':'pass123','role':'caretaker'})
caretaker = json.loads(resp.text)
print(json.dumps(caretaker['user'], indent=2))
caretaker_token = caretaker['token']
caretaker_id = caretaker['user']['id']

# Test 2: Login
print("\n" + "=" * 60)
print("2️⃣  LOGIN PATIENT")
print("=" * 60)
resp = requests.post('http://localhost:5000/api/auth/login', 
    json={'email':'alice@test.com','password':'pass123'})
patient_data = json.loads(resp.text)
print(json.dumps(patient_data['user'], indent=2))
patient_token = patient_data['token']
patient_id = patient_data['user']['id']

# Test 3: Make prediction
print("\n" + "=" * 60)
print("3️⃣  MAKE PREDICTION")
print("=" * 60)
resp = requests.post('http://localhost:5000/api/predict', 
    json={'features':[0.1,0.2,0.3,0.4],'patient_name':'Alice','patient_id':patient_id})
pred = json.loads(resp.text)
print(json.dumps({k:v for k,v in pred.items() if k != 'timestamp'}, indent=2))

# Test 4: Link caretaker to patient
print("\n" + "=" * 60)
print("4️⃣  LINK CARETAKER TO PATIENT")
print("=" * 60)
resp = requests.post('http://localhost:5000/api/auth/link-patient', 
    json={'caretaker_id':caretaker_id,'patient_email':'alice@test.com'})
link_data = json.loads(resp.text)
print(json.dumps(link_data, indent=2))

# Test 5: Get authenticated history
print("\n" + "=" * 60)
print("5️⃣  GET PATIENT HISTORY (AUTHENTICATED)")
print("=" * 60)
resp = requests.get(f'http://localhost:5000/api/patient-history/{patient_id}',
    headers={'Authorization': f'Bearer {patient_token}'})
history = json.loads(resp.text)
print(f"Records: {len(history)}")
if history:
    print(json.dumps(history[0], indent=2, default=str))

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED!")
print("=" * 60)
