from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://datacopilot:kJl8CJgROTtKInU7@cluster0.if12nyw.mongodb.net/?appName=Cluster0"

# Connect via async Motor driver using the provided Atlas URI
client = AsyncIOMotorClient(uri, server_api=ServerApi('1'))
db = client["datacopilot"]

async def get_db():
    """Returns the async MongoDB database instance"""
    return db