from motor.motor_asyncio import AsyncIOMotorClient
import os

# You can replace this with your MongoDB Atlas URI
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "datacopilot"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

async def get_db():
    return db
