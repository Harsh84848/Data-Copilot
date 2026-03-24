import pandas as pd
import io
import numpy as np

def process_csv_file(contents, filename):
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    headers = list(df.columns)
    col_types = {col: str(df[col].dtype) for col in headers}
    summary = df.describe().to_dict()
    missing = df.isnull().sum().to_dict()
    
    # KPIs for dashboard
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    kpis = {
        "total_records": len(df),
        "total_cols": len(headers),
        "total_missing": int(df.isnull().sum().sum()),
        "numeric_avg": float(df[numeric_cols[0]].mean()) if numeric_cols else 0
    }
    
    return {
        "df": df,
        "payload": {
            "filename": filename,
            "rows": len(df),
            "cols": len(headers),
            "headers": headers,
            "col_types": col_types,
            "missing": missing,
            "summary": summary,
            "kpis": kpis,
            "sample_rows": df.head(10).fillna('').to_dict('records')
        }
    }

def query_dataframe(df, query):
    query = query.lower()
    headers = list(df.columns)
    numeric_cols = [c for c in headers if pd.api.types.is_numeric_dtype(df[c])]
    categorical_cols = [c for c in headers if not pd.api.types.is_numeric_dtype(df[c])]

    result_text = "Analyzing your data..."
    chart_data = None

    if "highest" in query or "max" in query or "top" in query:
        target_col = next((c for c in numeric_cols if c.lower() in query), numeric_cols[0] if numeric_cols else None)
        if target_col:
            max_val = df[target_col].max()
            result_text = f"The highest {target_col} is {max_val}."
            if categorical_cols:
                group_col = categorical_cols[0]
                top_group = df.groupby(group_col)[target_col].max().sort_values(ascending=False).head(10)
                chart_data = {"chartType": "bar", "title": f"Top 10 {group_col} by {target_col}", "data": [{"name": k, "value": float(v)} for k, v in top_group.items()], "xKey": "name", "yKey": "value"}

    elif "average" in query or "mean" in query:
        target_col = next((c for c in numeric_cols if c.lower() in query), numeric_cols[0] if numeric_cols else None)
        if target_col:
            avg_val = df[target_col].mean()
            result_text = f"The average {target_col} is {avg_val:.2f}."
            if categorical_cols:
                group_col = categorical_cols[0]
                avg_group = df.groupby(group_col)[target_col].mean().sort_values(ascending=False).head(10)
                chart_data = {"chartType": "bar", "title": f"Avg {target_col} by {group_col}", "data": [{"name": k, "value": float(v)} for k, v in avg_group.items()], "xKey": "name", "yKey": "value"}

    # Add more rules as needed...
    return {"text": result_text, "chart": chart_data}
