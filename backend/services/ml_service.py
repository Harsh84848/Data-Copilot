import pandas as pd
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import numpy as np

def train_predict_model(df, target, features=[]):
    df_copy = df.copy()
    le = LabelEncoder()
    for col in df_copy.columns:
        if df_copy[col].dtype == 'object':
            df_copy[col] = le.fit_transform(df_copy[col].astype(str))
    
    df_copy = df_copy.dropna()
    X = df_copy[features] if features else df_copy.drop(columns=[target])
    y = df_copy[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    is_regression = pd.api.types.is_numeric_dtype(df[target])
    
    model = RandomForestRegressor(n_estimators=100) if is_regression else RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    
    importances = model.feature_importances_
    feat_imp = [{"feature": f, "importance": float(i)} for f, i in zip(X.columns, importances)]
    feat_imp = sorted(feat_imp, key=lambda x: x["importance"], reverse=True)[:5]
    
    business_report = "Unable to generate business synthesis."
    try:
        from services.ai_service import client
        if client:
            prompt = f"A Machine Learning model was trained to predict '{target}'. The model achieved a score of {score:.2f}. The most important features driving this prediction are: {', '.join([f['feature'] for f in feat_imp])}. Write a concise, 2-sentence business insight interpreting this. For example, 'Sales dropped by 10% primarily driven by X and Y. Focusing on Z could improve future outcomes.'"
            response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
            business_report = response.text
    except Exception:
        pass
    
    return {
        "score": float(score),
        "type": "Regression" if is_regression else "Classification",
        "topFeatures": feat_imp,
        "insight": f"Model trained with {score:.2f} {'R2 score' if is_regression else 'Accuracy'}.",
        "business_report": business_report
    }
