import pandas as pd
import io
import numpy as np

def process_multiple_data_files(file_data_list):
    dfs = []
    filenames = []
    for contents, filename in file_data_list:
        filename_lower = filename.lower()
        if filename_lower.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename_lower.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(contents))
        elif filename_lower.endswith('.json'):
            df = pd.read_json(io.BytesIO(contents))
        else:
            raise ValueError(f"Unsupported file format: {filename}")
        dfs.append(df)
        filenames.append(filename)
        
    if not dfs:
        raise ValueError("No valid data files provided.")
        
    combined_df = pd.concat(dfs, ignore_index=True)
    
    headers = list(combined_df.columns)
    col_types = {col: str(combined_df[col].dtype) for col in headers}
    summary = combined_df.describe().to_dict()
    missing = combined_df.isnull().sum().to_dict()
    
    # KPIs for dashboard
    numeric_cols = combined_df.select_dtypes(include=[np.number]).columns.tolist()
    kpis = {
        "total_records": len(combined_df),
        "total_cols": len(headers),
        "total_missing": int(combined_df.isnull().sum().sum()),
        "numeric_avg": float(combined_df[numeric_cols[0]].mean()) if numeric_cols else 0
    }
    
    return {
        "df": combined_df,
        "payload": {
            "filename": ", ".join(filenames)[:50] + ("..." if len(", ".join(filenames)) > 50 else ""),
            "rows": len(combined_df),
            "cols": len(headers),
            "headers": headers,
            "col_types": col_types,
            "missing": missing,
            "summary": summary,
            "kpis": kpis,
            "sample_rows": combined_df.head(10).fillna('').to_dict('records')
        }
    }

def clean_dataframe(df):
    # Impute missing values
    for col in df.columns:
        if df[col].isnull().sum() > 0:
            if pd.api.types.is_numeric_dtype(df[col]):
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else "Unknown")
    
    # After cleaning, we return the exact same payload structure as process_csv_file
    headers = list(df.columns)
    col_types = {col: str(df[col].dtype) for col in headers}
    summary = df.describe().to_dict()
    missing = df.isnull().sum().to_dict()
    
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
            "filename": "Cleaned_Data",
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

    elif "lowest" in query or "min" in query or "bottom" in query:
        target_col = next((c for c in numeric_cols if c.lower() in query), numeric_cols[0] if numeric_cols else None)
        if target_col:
            min_val = df[target_col].min()
            result_text = f"The lowest {target_col} is {min_val}."
            if categorical_cols:
                group_col = categorical_cols[0]
                bottom_group = df.groupby(group_col)[target_col].min().sort_values(ascending=True).head(10)
                chart_data = {"chartType": "bar", "title": f"Bottom 10 {group_col} by {target_col}", "data": [{"name": str(k), "value": float(v)} for k, v in bottom_group.items()], "xKey": "name", "yKey": "value"}

    elif "sum" in query or "total" in query:
        target_col = next((c for c in numeric_cols if c.lower() in query), numeric_cols[0] if numeric_cols else None)
        if target_col:
            sum_val = df[target_col].sum()
            result_text = f"The total sum of {target_col} is {sum_val:.2f}."
            if categorical_cols:
                group_col = categorical_cols[0]
                sum_group = df.groupby(group_col)[target_col].sum().sort_values(ascending=False).head(10)
                chart_data = {"chartType": "bar", "title": f"Total {target_col} by {group_col}", "data": [{"name": str(k), "value": float(v)} for k, v in sum_group.items()], "xKey": "name", "yKey": "value"}
                
    elif "count" in query or "how many" in query:
        group_col = next((c for c in categorical_cols if c.lower() in query), categorical_cols[0] if categorical_cols else None)
        if group_col:
            count_group = df[group_col].value_counts().head(10)
            result_text = f"Here is the count distribution for {group_col}."
            chart_data = {"chartType": "bar", "title": f"Count by {group_col}", "data": [{"name": str(k), "value": int(v)} for k, v in count_group.items()], "xKey": "name", "yKey": "value"}
        else:
            result_text = f"There are {len(df)} total rows."

    elif "median" in query:
        target_col = next((c for c in numeric_cols if c.lower() in query), numeric_cols[0] if numeric_cols else None)
        if target_col:
            median_val = df[target_col].median()
            result_text = f"The median {target_col} is {median_val:.2f}."

    elif "explain" in query or "insight" in query or "summary" in query or "overview" in query:
        num_rows = len(df)
        num_cols = len(headers)
        num_missing = df.isnull().sum().sum()
        sparsity = (num_missing / (num_rows * num_cols)) * 100 if (num_rows * num_cols) > 0 else 0
        
        insights = [
            f"Your dataset contains {num_rows:,} rows and {num_cols} columns.",
            f"There are {len(numeric_cols)} numeric columns and {len(categorical_cols)} categorical columns.",
            f"Overall missing values: {num_missing:,} ({sparsity:.1f}% sparsity)."
        ]
        
        if numeric_cols:
            highest_var_col = df[numeric_cols].var().idxmax()
            insights.append(f"The column '{highest_var_col}' has the highest variance (spread of values).")
            
        result_text = "**Data Insights:**\n\n• " + "\n• ".join(insights)
        
        # We also provide a small distribution count of missing values if there are any
        missing_by_col = df.isnull().sum()
        top_missing = missing_by_col[missing_by_col > 0].sort_values(ascending=False).head(5)
        if not top_missing.empty:
            result_text += f"\n\n**Missing Data Alert:** The column '{top_missing.index[0]}' has the most missing values ({top_missing.iloc[0]})."
            chart_data = {"chartType": "bar", "title": "Top Missing Values", "data": [{"name": k, "value": int(v)} for k, v in top_missing.items()], "xKey": "name", "yKey": "value"}

    # Add more rules as needed...
    return {"text": result_text, "chart": chart_data}
