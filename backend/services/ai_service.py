import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY", "")

try:
    client = genai.Client(api_key=api_key) if api_key else None
except Exception:
    client = None

def get_data_insights(payload):
    if not api_key:
        return "**AI suggestions are disabled.**\n\nPlease create a `.env` file in the backend directory with your `GOOGLE_API_KEY` to enable generative insights from Gemini."
    
    try:
        prompt = f"""
        You are a data analyst AI. 
        I have a dataset with the following properties:
        - Total columns: {payload.get("cols")}
        - Total rows: {payload.get("rows")}
        - Columns and their types: {payload.get("col_types")}
        - Number of missing values per column: {payload.get("missing")}
        
        Based on these properties, please provide:
        1. A brief summary of what this dataset might represent.
        2. 3 concrete suggestions for further analysis or machine learning use-cases.
        Keep it concise and format as Markdown.
        """
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Could not generate insights at this time: {str(e)}"

def chat_with_data(payload, query):
    if not api_key:
        return "Sorry, the AI is disabled because GOOGLE_API_KEY is not set."
    try:
        prompt = f"""
        You are a helpful AI assistant in a data dashboard platform called DataCopilot.
        The user has uploaded a dataset with the following properties:
        - Total columns: {payload.get("cols")}
        - Total rows: {payload.get("rows")}
        - Columns: {payload.get("headers")}
        
        The user is asking a question: "{query}"
        
        Answer the question to the best of your ability. Keep it concise.
        """
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Could not query AI at this time: {str(e)}"
