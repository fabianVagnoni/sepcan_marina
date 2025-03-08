from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os
from dotenv import load_dotenv

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

# Define models according to ER diagram
class Coche(Base):
    __tablename__ = "coches"
    
    placa = Column(Integer, primary_key=True, index=True)
    marca = Column(String, nullable=False)
    modelo = Column(String, nullable=False)
    fecha_fabricacion = Column(String, nullable=False)
    fecha_compra = Column(String, nullable=False)
    password = Column(String, nullable=False)
    
    # Relationships
    formularios_coche = relationship("FormularioCoche", back_populates="coche")
    formularios_trabajo = relationship("FormularioTrabajo", back_populates="coche")

class Trabajador(Base):
    __tablename__ = "trabajadores"
    
    dni = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    fecha_nacimiento = Column(String, nullable=False)
    fecha_empleo = Column(String, nullable=False)
    password = Column(String, nullable=False)
    
    # Relationships
    formularios_coche = relationship("FormularioCoche", back_populates="trabajador")
    formularios_trabajo = relationship("FormularioTrabajo", back_populates="trabajador")

class Trabajo(Base):
    __tablename__ = "trabajos"
    
    id = Column(Integer, primary_key=True, index=True)
    cliente = Column(String, nullable=False)
    fecha = Column(String, nullable=False)
    password = Column(String, nullable=False)
    
    # Relationships
    formulario_coche = relationship("FormularioCoche", back_populates="trabajo", uselist=False)
    formulario_trabajo = relationship("FormularioTrabajo", back_populates="trabajo", uselist=False)

class FormularioCoche(Base):
    __tablename__ = "formularios_coche"
    
    placa_coche = Column(Integer, ForeignKey("coches.placa"), primary_key=True)
    dni_trabajador = Column(Integer, ForeignKey("trabajadores.dni"), primary_key=True)
    id_trabajo = Column(Integer, ForeignKey("trabajos.id"), primary_key=True)
    otros = Column(String, nullable=True)
    fecha = Column(String, nullable=True)
    hora_partida = Column(String, nullable=True)
    estado_coche = Column(String, nullable=True)
    
    # Relationships
    coche = relationship("Coche", back_populates="formularios_coche")
    trabajador = relationship("Trabajador", back_populates="formularios_coche")
    trabajo = relationship("Trabajo", back_populates="formulario_coche")

class FormularioTrabajo(Base):
    __tablename__ = "formularios_trabajo"
    
    placa_coche = Column(Integer, ForeignKey("coches.placa"), primary_key=True)
    dni_trabajador = Column(Integer, ForeignKey("trabajadores.dni"), primary_key=True)
    id_trabajo = Column(Integer, ForeignKey("trabajos.id"), primary_key=True)
    otros = Column(String, nullable=True)
    fecha = Column(String, nullable=True)
    hora_final = Column(String, nullable=True)
    horas_trabajadas = Column(Float, nullable=True)
    lugar_trabajo = Column(String, nullable=True)
    tiempo_llegada = Column(Integer, nullable=True)
    
    # Relationships
    coche = relationship("Coche", back_populates="formularios_trabajo")
    trabajador = relationship("Trabajador", back_populates="formularios_trabajo")
    trabajo = relationship("Trabajo", back_populates="formulario_trabajo")

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