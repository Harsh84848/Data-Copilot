from database import get_db
from bson import ObjectId
from datetime import datetime

async def get_all_tasks():
    db = await get_db()
    cursor = db.tasks.find({})
    tasks = await cursor.to_list(length=100)
    # Convert ObjectId to string
    for t in tasks:
        t["_id"] = str(t["_id"])
    return tasks

async def create_task(task_data):
    db = await get_db()
    task_data["created_at"] = datetime.now()
    result = await db.tasks.insert_one(task_data)
    return {"id": str(result.inserted_id), "status": "Task created"}

async def update_task_status(task_id, new_status):
    db = await get_db()
    result = await db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": new_status}}
    )
    return {"modified_count": result.modified_count}

async def get_team():
    db = await get_db()
    cursor = db.team.find({})
    team = await cursor.to_list(length=100)
    for m in team:
        m["_id"] = str(m["_id"])
    return team
