import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', 'routes', '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv(
    'DATABASE_URL',
    'postgresql://postgres:postgres@localhost:5432/asthma_db'
)


def get_db():
    """Return a new PostgreSQL connection with dict-style rows."""
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn


def init_db():
    """Create tables if they don't already exist."""
    conn = get_db()
    cur = conn.cursor()

    # ── Users table (patients + caretakers) ─────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id               SERIAL PRIMARY KEY,
            name             VARCHAR(100) NOT NULL,
            email            VARCHAR(255) UNIQUE NOT NULL,
            password_hash    VARCHAR(255) NOT NULL,
            role             VARCHAR(20)  NOT NULL
                             CHECK (role IN ('patient', 'caretaker')),
            linked_patient_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
            created_at       TIMESTAMP DEFAULT NOW()
        );
    """)

    # ── Predictions table ────────────────────────────────────────────────────
    cur.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id                 SERIAL PRIMARY KEY,
            patient_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
            patient_name       VARCHAR(100),
            status             VARCHAR(20)  NOT NULL,
            confidence         FLOAT        NOT NULL,
            raw_probabilities  JSONB,
            created_at         TIMESTAMP DEFAULT NOW()
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("[db] PostgreSQL tables ready.")
