from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
import uvicorn

# Import Services
from services.analysis_service import process_csv_file, query_dataframe
from services.ml_service import train_predict_model
from services.auth_service import signup_user, login_user
from services.project_service import get_all_tasks, create_task, update_task_status, get_team

app = FastAPI(title="DataCopilot API")

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global store (In-memory for simplicity)
current_df = None

@app.get("/")
def read_root():
    return {"status": "online", "service": "DataCopilot Backend"}

# Auth Routes
@app.post("/signup")
async def signup(request: Dict[str, str]):
    email = request.get("email")
    password = request.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password.")
    return await signup_user(email, password)

@app.post("/login")
async def login(request: Dict[str, str]):
    email = request.get("email")
    password = request.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password.")
    
    result = await login_user(email, password)
    if "error" in result:
        raise HTTPException(status_code=401, detail=result["error"])
    return result

# Project & Team Routes
@app.get("/tasks")
async def tasks_get():
    return await get_all_tasks()

@app.post("/tasks")
async def tasks_post(task: Dict[str, Any]):
    return await create_task(task)

@app.put("/tasks/{task_id}/status")
async def tasks_update_status(task_id: str, request: Dict[str, str]):
    new_status = request.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Missing new status")
    return await update_task_status(task_id, new_status)

@app.get("/team")
async def team_get():
    return await get_team()

# Analytics Routes
@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    global current_df
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    contents = await file.read()
    try:
        result = process_csv_file(contents, file.filename)
        current_df = result["df"]
        return result["payload"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")

@app.post("/query")
async def query_data(request: Dict[str, str]):
    global current_df
    if current_df is None:
        raise HTTPException(status_code=400, detail="No data uploaded.")
    
    query = request.get("query", "")
    return query_dataframe(current_df, query)

@app.post("/predict")
async def predict(request: Dict[str, Any]):
    global current_df
    if current_df is None:
        raise HTTPException(status_code=400, detail="No data uploaded.")
    
    target = request.get("target")
    features = request.get("features", [])
    
    if not target or target not in current_df.columns:
        raise HTTPException(status_code=400, detail="Invalid target column.")
    
    try:
        return train_predict_model(current_df, target, features)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ML Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8010)
