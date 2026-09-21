import sqlite3
import os
import uuid
import bcrypt
from datetime import datetime
from typing import Optional, Dict, Any, Tuple

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
DB_PATH = os.path.join(DB_DIR, "users.db")

def get_db_connection() -> sqlite3.Connection:
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def init_auth_db():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL COLLATE NOCASE,
                hashed_password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'Store Operations Lead',
                role_badge TEXT NOT NULL DEFAULT 'User',
                avatar TEXT,
                store_name TEXT DEFAULT 'Downtown Flagship & Omni-channel',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

        # Seed initial demonstration account if empty
        cursor.execute("SELECT COUNT(*) as count FROM users")
        count = cursor.fetchone()["count"]
        if count == 0:
            default_id = f"user-{uuid.uuid4().hex[:8]}"
            default_hashed_pwd = hash_password("Password123!")
            cursor.execute("""
                INSERT INTO users (id, name, email, hashed_password, role, role_badge, avatar, store_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                default_id,
                "Sarah Jenkins",
                "sarah.jenkins@retailpulse.io",
                default_hashed_pwd,
                "Store Operations Director",
                "Admin",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                "Downtown Flagship & Omni-channel"
            ))
            conn.commit()
    finally:
        conn.close()

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (email.strip(),))
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None
    finally:
        conn.close()

def register_user(name: str, email: str, password: str, role: str = "Store Operations Lead", store_name: str = "Local Retail POS Node") -> Dict[str, Any]:
    email_clean = email.strip().lower()
    name_clean = name.strip()

    if not name_clean:
        raise ValueError("Full Name is required.")
    if not email_clean or "@" not in email_clean:
        raise ValueError("A valid email address is required.")
    if not password or len(password) < 6:
        raise ValueError("Password must be at least 6 characters long.")

    existing = get_user_by_email(email_clean)
    if existing:
        raise ValueError("An account with this email already exists.")

    new_id = f"user-{uuid.uuid4().hex[:8]}"
    hashed_pwd = hash_password(password)
    avatar = f"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"

    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (id, name, email, hashed_password, role, role_badge, avatar, store_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (new_id, name_clean, email_clean, hashed_pwd, role, "User", avatar, store_name))
        conn.commit()
    finally:
        conn.close()

    return {
        "id": new_id,
        "name": name_clean,
        "email": email_clean,
        "role": role,
        "role_badge": "User",
        "avatar": avatar,
        "store_name": store_name
    }

def authenticate_user(email: str, password: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    email_clean = email.strip().lower()
    if not email_clean:
        return None, "Email address is required."
    if not password:
        return None, "Password is required."

    user_row = get_user_by_email(email_clean)
    if not user_row:
        return None, "No account found with this email address."

    if not verify_password(password, user_row["hashed_password"]):
        return None, "Incorrect password. Please verify and try again."

    return {
        "id": user_row["id"],
        "name": user_row["name"],
        "email": user_row["email"],
        "role": user_row["role"],
        "role_badge": user_row["role_badge"],
        "avatar": user_row["avatar"],
        "store_name": user_row["store_name"]
    }, None
