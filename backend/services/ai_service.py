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

def generate_detailed_report(payload):
    if not api_key:
        return "# Error\nThe AI is disabled because GOOGLE_API_KEY is not set."
    try:
        prompt = f"""
        You are an expert Data Scientist and Business Analyst.
        Please write a highly detailed, professional, and comprehensive Executive Client Report in Markdown format based on the following dataset profile.
        
        Dataset Profile:
        - Filename: {payload.get("filename")}
        - Total columns: {payload.get("cols")}
        - Total rows: {payload.get("rows")}
        - Columns: {payload.get("headers")}
        - Data Types: {payload.get("col_types")}
        - Missing Values: {payload.get("missing")}
        - Statistical Summary (JSON format): {payload.get("summary")}
        - Sample Data Rows: {payload.get("sample_rows")}
        
        Your report MUST include:
        1. **Executive Summary**: A high-level overview of what this data represents.
        2. **Data Quality Assessment**: An analysis of missing values, outliers, and data health.
        3. **Key Statistical Findings**: Deep dive into the statistical summary, highlighting the most important numbers, distributions, and potential correlations.
        4. **Strategic Business Recommendations**: 3-5 actionable steps the client should take based on this data.
        5. **Potential Machine Learning Use Cases**: What predictive models could be built with this data and how they would add value.
        
        Format the output beautifully with headings, bullet points, and bold text. Make it read like a premium McKinsey or BCG consulting report. Do not include any placeholder text; synthesize a real report based on the provided profile.
        """
        response = client.models.generate_content(
            model='gemini-2.5-pro', # Use pro for a more detailed report if possible, or fallback to flash
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"# Report Generation Failed\n\nCould not generate the report: {str(e)}"
