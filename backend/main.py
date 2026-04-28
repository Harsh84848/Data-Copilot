from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, List
import uvicorn

# Import Services
from services.analysis_service import process_multiple_data_files, query_dataframe
from services.ml_service import train_predict_model
from services.auth_service import signup_user, login_user
from services.project_service import get_all_tasks, create_task, update_task_status, get_team
from services.ai_service import get_data_insights, chat_with_data

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
    role = request.get("role", "customer")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Missing email or password.")
    return await signup_user(email, password, role)

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
async def upload_file(files: List[UploadFile] = File(...)):
    global current_df
    allowed_extensions = ('.csv', '.xlsx', '.xls', '.json')
    
    file_data_list = []
    for file in files:
        if not file.filename.lower().endswith(allowed_extensions):
            raise HTTPException(status_code=400, detail="Only CSV, Excel, and JSON files are allowed.")
        contents = await file.read()
        file_data_list.append((contents, file.filename))
        
    try:
        from services.analysis_service import process_multiple_data_files
        result = process_multiple_data_files(file_data_list)
        current_df = result["df"]
        return result["payload"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")

@app.post("/clean")
async def clean_data():
    global current_df
    if current_df is None:
        raise HTTPException(status_code=400, detail="No data uploaded.")
    from services.analysis_service import clean_dataframe
    try:
        result = clean_dataframe(current_df)
        current_df = result["df"]
        return result["payload"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error cleaning data: {str(e)}")

@app.post("/query")
async def query_data(request: Dict[str, str]):
    global current_df
    query = request.get("query", "")
    
    if current_df is None:
        # If no data is uploaded, just chat with the general AI assistant
        ai_reply = chat_with_data({}, query)
        return {"text": ai_reply, "chart": None}
    
    # First, try the local algorithmic query engine for basic stats and charts
    local_result = query_dataframe(current_df, query)
    
    # If the local result just returns a standard string, use the AI directly
    if local_result["text"] == "Analyzing your data..." and local_result.get("chart") is None:
        payload = {
            "cols": len(current_df.columns),
            "rows": len(current_df),
            "headers": list(current_df.columns)
        }
        ai_reply = chat_with_data(payload, query)
        return {"text": ai_reply, "chart": None}
        
    return local_result

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

@app.get("/ai-insights")
async def get_ai_insights():
    global current_df
    if current_df is None:
        raise HTTPException(status_code=400, detail="No data uploaded.")
    
    headers = list(current_df.columns)
    col_types = {col: str(current_df[col].dtype) for col in headers}
    missing = current_df.isnull().sum().to_dict()
    payload = {
        "cols": len(headers),
        "rows": len(current_df),
        "col_types": col_types,
        "missing": missing
    }
    insights = get_data_insights(payload)
    return {"insights": insights}

@app.post("/generate-report")
async def generate_report_endpoint(request: Dict[str, Any]):
    from services.ai_service import generate_detailed_report
    # request should contain the dataInfo payload
    payload = request.get("dataInfo")
    if not payload:
        raise HTTPException(status_code=400, detail="Missing dataInfo payload.")
    report_text = generate_detailed_report(payload)
    return {"report": report_text}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8010, reload=True)
