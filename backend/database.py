from sqlalchemy import create_engine, Column, Integer, String, Float, Enum, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import enum

# Load environment variables
load_dotenv()

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_lT6b0MtEpcnr@ep-raspy-paper-a2t4l65n-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Define enums for condition ratings
class ConditionRating(str, enum.Enum):
    PERFECT = "perfect"
    GOOD = "good"
    BAD = "bad"
    CRITICAL = "critical"

# Define models
class VehicleFormulary(Base):
    __tablename__ = "vehicle_formularies"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, nullable=False)
    employee_name = Column(String, nullable=False)
    job_id = Column(Integer, nullable=False)
    job_place = Column(String, nullable=False)
    vehicle_id = Column(Integer, nullable=False)
    vehicle_condition = Column(String, nullable=False)
    vehicle_clean = Column(String, nullable=False)
    comments = Column(String, nullable=True)
    timestamp = Column(DateTime, nullable=False)
    
    # Composite unique constraint
    __table_args__ = (
        UniqueConstraint('job_id', 'vehicle_id', 'employee_id', name='uix_vehicle_form'),
    )

class JobFormulary(Base):
    __tablename__ = "job_formularies"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, nullable=False)
    employee_name = Column(String, nullable=False)
    job_id = Column(Integer, nullable=False)
    job_place = Column(String, nullable=False)
    time_to_commute = Column(Float, nullable=False)
    time_of_work = Column(Float, nullable=False)
    vehicle_id = Column(Integer, nullable=False)
    nails_used = Column(Integer, nullable=False)
    
    # Composite unique constraint
    __table_args__ = (
        UniqueConstraint('employee_id', 'job_id', 'vehicle_id', name='uix_job_form'),
    )

# Function to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables in the database
def create_tables():
    Base.metadata.create_all(bind=engine) 