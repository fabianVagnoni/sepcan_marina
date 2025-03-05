from fastapi import FastAPI, Depends, HTTPException, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import pandas as pd
from io import BytesIO
from fastapi.responses import StreamingResponse

from database import get_db, VehicleFormulary, JobFormulary, create_tables
from pydantic import BaseModel, Field

# Initialize FastAPI app
app = FastAPI(title="Service Company API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class VehicleFormularyCreate(BaseModel):
    employee_id: int
    employee_name: str
    job_id: int
    job_place: str
    vehicle_id: int
    vehicle_condition: str
    vehicle_clean: str
    comments: Optional[str] = None
    timestamp: str

class JobFormularyCreate(BaseModel):
    employee_id: int
    employee_name: str
    job_id: int
    job_place: str
    time_to_commute: float
    time_of_work: float
    vehicle_id: int
    nails_used: int

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Service Company API is running"}

# Vehicle Formulary endpoints
@app.post("/vehicle-formulary/")
def create_vehicle_formulary(formulary: VehicleFormularyCreate, db: Session = Depends(get_db)):
    try:
        # Convert timestamp string to datetime
        timestamp = datetime.fromisoformat(formulary.timestamp.replace('Z', '+00:00'))
        
        db_formulary = VehicleFormulary(
            employee_id=formulary.employee_id,
            employee_name=formulary.employee_name,
            job_id=formulary.job_id,
            job_place=formulary.job_place,
            vehicle_id=formulary.vehicle_id,
            vehicle_condition=formulary.vehicle_condition,
            vehicle_clean=formulary.vehicle_clean,
            comments=formulary.comments,
            timestamp=timestamp
        )
        db.add(db_formulary)
        db.commit()
        db.refresh(db_formulary)
        return {"success": True, "message": "Vehicle formulary submitted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error submitting vehicle formulary: {str(e)}")

# Job Formulary endpoints
@app.post("/job-formulary/")
def create_job_formulary(formulary: JobFormularyCreate, db: Session = Depends(get_db)):
    try:
        db_formulary = JobFormulary(
            employee_id=formulary.employee_id,
            employee_name=formulary.employee_name,
            job_id=formulary.job_id,
            job_place=formulary.job_place,
            time_to_commute=formulary.time_to_commute,
            time_of_work=formulary.time_of_work,
            vehicle_id=formulary.vehicle_id,
            nails_used=formulary.nails_used
        )
        db.add(db_formulary)
        db.commit()
        db.refresh(db_formulary)
        return {"success": True, "message": "Job formulary submitted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error submitting job formulary: {str(e)}")

# Query endpoints
@app.get("/query/vehicle-formularies")
def query_vehicle_formularies(
    employee_id: Optional[int] = None,
    job_id: Optional[int] = None,
    vehicle_id: Optional[int] = None,
    format: str = Query("json", description="Response format: json or excel"),
    db: Session = Depends(get_db)
):
    query = db.query(VehicleFormulary)
    
    if employee_id:
        query = query.filter(VehicleFormulary.employee_id == employee_id)
    if job_id:
        query = query.filter(VehicleFormulary.job_id == job_id)
    if vehicle_id:
        query = query.filter(VehicleFormulary.vehicle_id == vehicle_id)
    
    results = query.all()
    
    if format.lower() == "excel":
        # Convert to DataFrame
        data = []
        for item in results:
            data.append({
                "id": item.id,
                "employee_id": item.employee_id,
                "employee_name": item.employee_name,
                "job_id": item.job_id,
                "job_place": item.job_place,
                "vehicle_id": item.vehicle_id,
                "vehicle_condition": item.vehicle_condition,
                "vehicle_clean": item.vehicle_clean,
                "comments": item.comments,
                "timestamp": item.timestamp
            })
        
        df = pd.DataFrame(data)
        
        # Create Excel file
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)
        
        output.seek(0)
        
        # Return Excel file
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=vehicle_formularies.xlsx"}
        )
    
    # Return JSON by default
    return results

@app.get("/query/job-formularies")
def query_job_formularies(
    employee_id: Optional[int] = None,
    job_id: Optional[int] = None,
    vehicle_id: Optional[int] = None,
    format: str = Query("json", description="Response format: json or excel"),
    db: Session = Depends(get_db)
):
    query = db.query(JobFormulary)
    
    if employee_id:
        query = query.filter(JobFormulary.employee_id == employee_id)
    if job_id:
        query = query.filter(JobFormulary.job_id == job_id)
    if vehicle_id:
        query = query.filter(JobFormulary.vehicle_id == vehicle_id)
    
    results = query.all()
    
    if format.lower() == "excel":
        # Convert to DataFrame
        data = []
        for item in results:
            data.append({
                "id": item.id,
                "employee_id": item.employee_id,
                "employee_name": item.employee_name,
                "job_id": item.job_id,
                "job_place": item.job_place,
                "time_to_commute": item.time_to_commute,
                "time_of_work": item.time_of_work,
                "vehicle_id": item.vehicle_id,
                "nails_used": item.nails_used
            })
        
        df = pd.DataFrame(data)
        
        # Create Excel file
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False)
        
        output.seek(0)
        
        # Return Excel file
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=job_formularies.xlsx"}
        )
    
    # Return JSON by default
    return results

# Combined query endpoint
@app.get("/query/combined-data")
def query_combined_data(
    employee_id: Optional[int] = None,
    job_id: Optional[int] = None,
    vehicle_id: Optional[int] = None,
    format: str = Query("json", description="Response format: json or excel"),
    db: Session = Depends(get_db)
):
    # Query vehicle formularies
    vehicle_query = db.query(VehicleFormulary)
    if employee_id:
        vehicle_query = vehicle_query.filter(VehicleFormulary.employee_id == employee_id)
    if job_id:
        vehicle_query = vehicle_query.filter(VehicleFormulary.job_id == job_id)
    if vehicle_id:
        vehicle_query = vehicle_query.filter(VehicleFormulary.vehicle_id == vehicle_id)
    vehicle_results = vehicle_query.all()
    
    # Query job formularies
    job_query = db.query(JobFormulary)
    if employee_id:
        job_query = job_query.filter(JobFormulary.employee_id == employee_id)
    if job_id:
        job_query = job_query.filter(JobFormulary.job_id == job_id)
    if vehicle_id:
        job_query = job_query.filter(JobFormulary.vehicle_id == vehicle_id)
    job_results = job_query.all()
    
    if format.lower() == "excel":
        # Create Excel file with multiple sheets
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Vehicle formularies sheet
            vehicle_data = []
            for item in vehicle_results:
                vehicle_data.append({
                    "id": item.id,
                    "employee_id": item.employee_id,
                    "employee_name": item.employee_name,
                    "job_id": item.job_id,
                    "job_place": item.job_place,
                    "vehicle_id": item.vehicle_id,
                    "vehicle_condition": item.vehicle_condition,
                    "vehicle_clean": item.vehicle_clean,
                    "comments": item.comments,
                    "timestamp": item.timestamp
                })
            pd.DataFrame(vehicle_data).to_excel(writer, sheet_name="Vehicle Formularies", index=False)
            
            # Job formularies sheet
            job_data = []
            for item in job_results:
                job_data.append({
                    "id": item.id,
                    "employee_id": item.employee_id,
                    "employee_name": item.employee_name,
                    "job_id": item.job_id,
                    "job_place": item.job_place,
                    "time_to_commute": item.time_to_commute,
                    "time_of_work": item.time_of_work,
                    "vehicle_id": item.vehicle_id,
                    "nails_used": item.nails_used
                })
            pd.DataFrame(job_data).to_excel(writer, sheet_name="Job Formularies", index=False)
        
        output.seek(0)
        
        # Return Excel file
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=combined_data.xlsx"}
        )
    
    # Return JSON by default
    return {
        "vehicle_formularies": vehicle_results,
        "job_formularies": job_results
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 