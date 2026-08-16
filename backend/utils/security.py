import os
import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
import jwt

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "ai_business_command_center_super_secret_jwt_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7)) # 7 days default

try:
    import bcrypt
    HAS_BCRYPT = True
except ImportError:
    HAS_BCRYPT = False

def generate_salt(length: int = 16) -> str:
    """Generate cryptographically secure random hex salt."""
    return secrets.token_hex(length // 2)

def hash_password(password: str, salt: Optional[str] = None) -> Dict[str, str]:
    """
    Hash a password securely using bcrypt or SHA-256 with cryptographic salt.
    Returns dict containing hashed string and salt.
    """
    if not salt:
        salt = generate_salt(16)
        
    if HAS_BCRYPT:
        # Pre-hash with SHA-256 to prevent 72-byte truncation issues in bcrypt
        prep = hashlib.sha256((password + salt + SECRET_KEY).encode("utf-8")).digest()
        hashed = bcrypt.hashpw(prep, bcrypt.gensalt()).decode("utf-8")
        return {"hash": hashed, "salt": salt}
    else:
        # High-security HMAC-SHA256 fallback
        h = hmac.new(SECRET_KEY.encode("utf-8"), (password + salt).encode("utf-8"), hashlib.sha256)
        return {"hash": h.hexdigest(), "salt": salt}

def verify_password(plain_password: str, password_hash: str, salt: Optional[str] = None) -> bool:
    """Verify plain password against stored hash."""
    if not password_hash:
        return False
    
    salt_val = salt or ""
    
    if HAS_BCRYPT and password_hash.startswith("$2"):
        try:
            prep = hashlib.sha256((plain_password + salt_val + SECRET_KEY).encode("utf-8")).digest()
            return bcrypt.checkpw(prep, password_hash.encode("utf-8"))
        except Exception:
            pass
            
    # SHA-256 fallback verify
    # Check HMAC-SHA256
    h = hmac.new(SECRET_KEY.encode("utf-8"), (plain_password + salt_val).encode("utf-8"), hashlib.sha256).hexdigest()
    if hmac.compare_digest(h, password_hash):
        return True
        
    # Legacy SHA256 fallback compatibility (from existing user json)
    legacy_hash = hashlib.sha256((plain_password + salt_val + SECRET_KEY).encode("utf-8")).hexdigest()
    if hmac.compare_digest(legacy_hash, password_hash):
        return True
        
    return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate signed JWT bearer token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "iss": "ai-business-command-center"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate signed JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], issuer="ai-business-command-center")
        return payload
    except jwt.PyJWTError:
        return None
