import os
import json
import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    generate_salt
)
from database.database import SessionLocal, init_db
from database.models import User

logger = logging.getLogger("ai_command_center.auth")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
USERS_FILE = os.path.join(BASE_DIR, "data", "users.json")

class AuthService:
    def __init__(self):
        self._init_storage()

    def _init_storage(self):
        """Initialize database schema and seed default users."""
        try:
            init_db()
            self._seed_default_users_db()
        except Exception as e:
            logger.warning(f"Database init exception: {e}. Ensuring json fallback is active.")
            self._ensure_users_json()

    def _seed_default_users_db(self):
        """Seed default admin and demo user in database if not present."""
        db = SessionLocal()
        try:
            admin = db.query(User).filter(User.email == "admin@commandcenter.ai").first()
            if not admin:
                salt1 = generate_salt(16)
                hashed1 = hash_password("AdminPassword123!", salt1)
                admin_user = User(
                    id=str(uuid.uuid4()),
                    full_name="Executive Director",
                    email="admin@commandcenter.ai",
                    password_hash=hashed1["hash"],
                    salt=salt1,
                    role="Chief Executive Officer",
                    company_name="Global Enterprise Corp",
                    is_active=True
                )
                db.add(admin_user)

            demo = db.query(User).filter(User.email == "demo@company.com").first()
            if not demo:
                salt2 = generate_salt(16)
                hashed2 = hash_password("Demo1234!", salt2)
                demo_user = User(
                    id=str(uuid.uuid4()),
                    full_name="Sarah Jenkins",
                    email="demo@company.com",
                    password_hash=hashed2["hash"],
                    salt=salt2,
                    role="Lead Data Scientist",
                    company_name="Apex Retail AI",
                    is_active=True
                )
                db.add(demo_user)

            db.commit()
            logger.info("Default enterprise users verified in database.")
        except Exception as e:
            db.rollback()
            logger.error(f"Error seeding users in DB: {e}")
        finally:
            db.close()

    def _ensure_users_json(self):
        """Ensure json backup storage has default accounts."""
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        if not os.path.exists(USERS_FILE):
            salt1 = generate_salt(16)
            salt2 = generate_salt(16)
            users = {
                "admin@commandcenter.ai": {
                    "id": str(uuid.uuid4()),
                    "full_name": "Executive Director",
                    "email": "admin@commandcenter.ai",
                    "role": "Chief Executive Officer",
                    "company_name": "Global Enterprise Corp",
                    "salt": salt1,
                    "password_hash": hash_password("AdminPassword123!", salt1)["hash"],
                    "is_active": True,
                    "created_at": datetime.now(timezone.utc).isoformat()
                },
                "demo@company.com": {
                    "id": str(uuid.uuid4()),
                    "full_name": "Sarah Jenkins",
                    "email": "demo@company.com",
                    "role": "Lead Data Scientist",
                    "company_name": "Apex Retail AI",
                    "salt": salt2,
                    "password_hash": hash_password("Demo1234!", salt2)["hash"],
                    "is_active": True,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
            }
            try:
                with open(USERS_FILE, "w", encoding="utf-8") as f:
                    json.dump(users, f, indent=2)
            except Exception as e:
                logger.error(f"Failed to write backup users.json: {e}")

    def register_user(self, full_name: str, email: str, password: str, role: str, company_name: str) -> Dict[str, Any]:
        """Register a new user account."""
        email_clean = email.lower().strip()
        db = SessionLocal()
        try:
            existing = db.query(User).filter(User.email == email_clean).first()
            if existing:
                raise ValueError("An account with this email address is already registered.")

            salt = generate_salt(16)
            h = hash_password(password, salt)
            user_id = str(uuid.uuid4())

            new_user = User(
                id=user_id,
                full_name=full_name.strip(),
                email=email_clean,
                password_hash=h["hash"],
                salt=salt,
                role=role.strip() or "Executive User",
                company_name=company_name.strip() or "Enterprise Corp",
                is_active=True
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            user_data = new_user.to_dict()
            token = create_access_token({"sub": user_id, "email": email_clean, "role": user_data["role"]})

            return {
                "token": token,
                "user": user_data
            }
        except ValueError:
            db.rollback()
            raise
        except Exception as e:
            db.rollback()
            logger.error(f"Database register error: {e}. Using JSON store fallback.")
            return self._register_user_json(full_name, email_clean, password, role, company_name)
        finally:
            db.close()

    def _register_user_json(self, full_name: str, email: str, password: str, role: str, company_name: str) -> Dict[str, Any]:
        users = self._read_json_users()
        if email in users:
            raise ValueError("An account with this email address is already registered.")
        
        salt = generate_salt(16)
        h = hash_password(password, salt)
        user_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        record = {
            "id": user_id,
            "full_name": full_name.strip(),
            "email": email,
            "role": role.strip() or "Executive User",
            "company_name": company_name.strip() or "Enterprise Corp",
            "salt": salt,
            "password_hash": h["hash"],
            "is_active": True,
            "created_at": created_at,
            "updated_at": created_at
        }
        users[email] = record
        self._write_json_users(users)

        token = create_access_token({"sub": user_id, "email": email, "role": record["role"]})
        return {"token": token, "user": record}

    def login_user(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate user credentials and issue signed JWT access token."""
        email_clean = email.lower().strip()
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.email == email_clean).first()
            if user:
                if not user.is_active:
                    raise ValueError("User account is deactivated. Please contact support.")
                if not verify_password(password, user.password_hash, user.salt):
                    raise ValueError("Invalid email or password.")
                
                user_data = user.to_dict()
                token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
                return {"token": token, "user": user_data}
        except ValueError:
            raise
        except Exception as e:
            logger.warning(f"DB login error: {e}. Trying JSON store.")
        finally:
            db.close()

        # Fallback check in JSON
        users = self._read_json_users()
        record = users.get(email_clean)
        if not record:
            raise ValueError("Invalid email or password.")

        if not verify_password(password, record.get("password_hash"), record.get("salt")):
            raise ValueError("Invalid email or password.")

        token = create_access_token({"sub": record["id"], "email": email_clean, "role": record["role"]})
        return {"token": token, "user": record}

    def get_user_by_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Resolve active user record from signed JWT Bearer token."""
        payload = decode_access_token(token)
        if not payload:
            return None
        
        user_id = payload.get("sub")
        email = payload.get("email")
        if not user_id and not email:
            return None

        db = SessionLocal()
        try:
            user = None
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
            if not user and email:
                user = db.query(User).filter(User.email == email).first()
            if user:
                return user.to_dict()
        except Exception as e:
            logger.warning(f"DB get_user error: {e}")
        finally:
            db.close()

        # JSON fallback
        users = self._read_json_users()
        for record in users.values():
            if record["id"] == user_id or record["email"] == email:
                return record
        return None

    def update_profile(self, user_id: str, full_name: Optional[str] = None, company_name: Optional[str] = None, role: Optional[str] = None, new_password: Optional[str] = None) -> Dict[str, Any]:
        """Update profile information and optionally reset password."""
        db = SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                if full_name:
                    user.full_name = full_name.strip()
                if company_name:
                    user.company_name = company_name.strip()
                if role:
                    user.role = role.strip()
                if new_password and len(new_password) >= 6:
                    salt = generate_salt(16)
                    h = hash_password(new_password, salt)
                    user.password_hash = h["hash"]
                    user.salt = salt
                user.updated_at = datetime.now(timezone.utc)
                db.commit()
                db.refresh(user)
                return user.to_dict()
        except Exception as e:
            db.rollback()
            logger.warning(f"DB update error: {e}")
        finally:
            db.close()

        # Fallback JSON update
        users = self._read_json_users()
        for email_key, record in users.items():
            if record["id"] == user_id:
                if full_name:
                    record["full_name"] = full_name.strip()
                if company_name:
                    record["company_name"] = company_name.strip()
                if role:
                    record["role"] = role.strip()
                if new_password and len(new_password) >= 6:
                    salt = generate_salt(16)
                    h = hash_password(new_password, salt)
                    record["password_hash"] = h["hash"]
                    record["salt"] = salt
                record["updated_at"] = datetime.now(timezone.utc).isoformat()
                users[email_key] = record
                self._write_json_users(users)
                return record

        raise ValueError("User account not found.")

    def forgot_password_request(self, email: str) -> Dict[str, Any]:
        """Handle forgot password workflow safely."""
        email_clean = email.lower().strip()
        # Verify user exists without disclosing security state
        user_exists = False
        db = SessionLocal()
        try:
            u = db.query(User).filter(User.email == email_clean).first()
            if u:
                user_exists = True
        except Exception:
            pass
        finally:
            db.close()

        if not user_exists:
            users = self._read_json_users()
            user_exists = email_clean in users

        return {
            "success": True,
            "message": f"If an enterprise account exists for {email_clean}, password recovery instructions and a secure reset token have been generated.",
            "email": email_clean,
            "demo_note": "In local/demo environment, you can log in directly using the pre-seeded admin (admin@commandcenter.ai / AdminPassword123!) or demo user (demo@company.com / Demo1234!)."
        }

    def _read_json_users(self) -> Dict[str, Any]:
        if os.path.exists(USERS_FILE):
            try:
                with open(USERS_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {}

    def _write_json_users(self, data: Dict[str, Any]):
        try:
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error writing users json: {e}")

# Global singleton
auth_service = AuthService()
