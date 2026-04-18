from database import get_db
import hashlib

async def signup_user(email, password, role="customer"):
    db = await get_db()
    existing = await db.users.find_one({"email": email})
    if existing:
        return {"error": "User already exists."}
    
    # Simple hash for this demo (In production use passlib/bcrypt)
    hashed = hashlib.sha256(password.encode()).hexdigest()
    
    user = {
        "email": email,
        "password": hashed,
        "role": role
    }
    await db.users.insert_one(user)
    return {"message": "User created successfully."}

async def login_user(email, password):
    db = await get_db()
    hashed = hashlib.sha256(password.encode()).hexdigest()
    user = await db.users.find_one({"email": email, "password": hashed})
    if user:
        return {"email": user["email"], "role": user.get("role", "customer"), "status": "Logged in"}
    return {"error": "Invalid email or password."}
