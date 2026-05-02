import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://datacopilot:kJl8CJgROTtKInU7@cluster0.if12nyw.mongodb.net/?appName=Cluster0"

async def ping_server():
    client = AsyncIOMotorClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())
    try:
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print("Connection failed:", e)

asyncio.run(ping_server())
