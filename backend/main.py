from fastapi import FastAPI, Depends, HTTPException, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, Column, String
from typing import List, Optional
from datetime import datetime, timedelta
import pandas as pd
from io import BytesIO
from fastapi.responses import StreamingResponse
from fastapi.responses import JSONResponse

from database import get_db, Coche, Trabajador, Trabajo, FormularioCoche, FormularioTrabajo, create_tables
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
class CocheCreate(BaseModel):
    placa: int
    marca: str
    modelo: str
    fecha_fabricacion: str
    fecha_compra: str
    password: str

class CocheUpdate(BaseModel):
    marca: Optional[str] = None
    modelo: Optional[str] = None
    fecha_fabricacion: Optional[str] = None
    fecha_compra: Optional[str] = None
    password: str

class TrabajadorCreate(BaseModel):
    dni: int
    nombre: str
    apellido: str
    fecha_nacimiento: str
    fecha_empleo: str
    password: str

class TrabajadorUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    fecha_nacimiento: Optional[str] = None
    fecha_empleo: Optional[str] = None
    password: str

class TrabajoCreate(BaseModel):
    id: int
    cliente: str
    fecha: str
    password: str

class TrabajoUpdate(BaseModel):
    cliente: Optional[str] = None
    fecha: Optional[str] = None
    password: str

class FormularioCocheCreate(BaseModel):
    placa_coche: int
    dni_trabajador: int
    id_trabajo: int
    otros: Optional[str] = None
    fecha: Optional[str] = None
    hora_partida: Optional[str] = None
    estado_coche: Optional[str] = None

class FormularioTrabajoCreate(BaseModel):
    placa_coche: int
    dni_trabajador: int
    id_trabajo: int
    otros: Optional[str] = None
    fecha: Optional[str] = None
    hora_final: Optional[str] = None
    horas_trabajadas: Optional[float] = None
    lugar_trabajo: Optional[str] = None
    tiempo_llegada: Optional[int] = None

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Service Company API is running"}

# Coche endpoints
@app.post("/coche/")
def create_coche(coche: CocheCreate, db: Session = Depends(get_db)):
    try:
        db_coche = Coche(
            placa=coche.placa,
            marca=coche.marca,
            modelo=coche.modelo,
            fecha_fabricacion=coche.fecha_fabricacion,
            fecha_compra=coche.fecha_compra,
            password=coche.password
        )
        db.add(db_coche)
        db.commit()
        db.refresh(db_coche)
        return {"success": True, "message": "Coche creado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear coche: {str(e)}")

@app.put("/coche/{placa}")
def update_coche(placa: int, coche: CocheUpdate, db: Session = Depends(get_db)):
    try:
        db_coche = db.query(Coche).filter(Coche.placa == placa).first()
        if not db_coche:
            raise HTTPException(status_code=404, detail="Coche no encontrado")
        
        # Verify password
        if db_coche.password != coche.password:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
        # Update fields if provided
        if coche.marca is not None:
            db_coche.marca = coche.marca
        if coche.modelo is not None:
            db_coche.modelo = coche.modelo
        if coche.fecha_fabricacion is not None:
            db_coche.fecha_fabricacion = coche.fecha_fabricacion
        if coche.fecha_compra is not None:
            db_coche.fecha_compra = coche.fecha_compra
        
        db.commit()
        db.refresh(db_coche)
        return {"success": True, "message": "Coche actualizado exitosamente"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar coche: {str(e)}")

@app.get("/coche/{placa}")
def get_coche(placa: int, db: Session = Depends(get_db)):
    db_coche = db.query(Coche).filter(Coche.placa == placa).first()
    if not db_coche:
        raise HTTPException(status_code=404, detail="Coche no encontrado")
    
    return {
        "placa": db_coche.placa,
        "marca": db_coche.marca,
        "modelo": db_coche.modelo,
        "fecha_fabricacion": db_coche.fecha_fabricacion,
        "fecha_compra": db_coche.fecha_compra
    }

@app.get("/coches/")
def get_all_coches(db: Session = Depends(get_db)):
    coches = db.query(Coche).all()
    return [
        {
            "placa": coche.placa,
            "marca": coche.marca,
            "modelo": coche.modelo,
            "fecha_fabricacion": coche.fecha_fabricacion,
            "fecha_compra": coche.fecha_compra
        }
        for coche in coches
    ]

# Trabajador endpoints
@app.post("/trabajador/")
def create_trabajador(trabajador: TrabajadorCreate, db: Session = Depends(get_db)):
    try:
        db_trabajador = Trabajador(
            dni=trabajador.dni,
            nombre=trabajador.nombre,
            apellido=trabajador.apellido,
            fecha_nacimiento=trabajador.fecha_nacimiento,
            fecha_empleo=trabajador.fecha_empleo,
            password=trabajador.password
        )
        db.add(db_trabajador)
        db.commit()
        db.refresh(db_trabajador)
        return {"success": True, "message": "Trabajador creado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear trabajador: {str(e)}")

@app.put("/trabajador/{dni}")
def update_trabajador(dni: int, trabajador: TrabajadorUpdate, db: Session = Depends(get_db)):
    try:
        db_trabajador = db.query(Trabajador).filter(Trabajador.dni == dni).first()
        if not db_trabajador:
            raise HTTPException(status_code=404, detail="Trabajador no encontrado")
        
        # Verify password
        if db_trabajador.password != trabajador.password:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
        # Update fields if provided
        if trabajador.nombre is not None:
            db_trabajador.nombre = trabajador.nombre
        if trabajador.apellido is not None:
            db_trabajador.apellido = trabajador.apellido
        if trabajador.fecha_nacimiento is not None:
            db_trabajador.fecha_nacimiento = trabajador.fecha_nacimiento
        if trabajador.fecha_empleo is not None:
            db_trabajador.fecha_empleo = trabajador.fecha_empleo
        
        db.commit()
        db.refresh(db_trabajador)
        return {"success": True, "message": "Trabajador actualizado exitosamente"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar trabajador: {str(e)}")

@app.get("/trabajador/{dni}")
def get_trabajador(dni: int, db: Session = Depends(get_db)):
    db_trabajador = db.query(Trabajador).filter(Trabajador.dni == dni).first()
    if not db_trabajador:
        raise HTTPException(status_code=404, detail="Trabajador no encontrado")
    
    return {
        "dni": db_trabajador.dni,
        "nombre": db_trabajador.nombre,
        "apellido": db_trabajador.apellido,
        "fecha_nacimiento": db_trabajador.fecha_nacimiento,
        "fecha_empleo": db_trabajador.fecha_empleo
    }

@app.get("/trabajadores/")
def get_all_trabajadores(db: Session = Depends(get_db)):
    trabajadores = db.query(Trabajador).all()
    return [
        {
            "dni": trabajador.dni,
            "nombre": trabajador.nombre,
            "apellido": trabajador.apellido,
            "fecha_nacimiento": trabajador.fecha_nacimiento,
            "fecha_empleo": trabajador.fecha_empleo
        }
        for trabajador in trabajadores
    ]

# Trabajo endpoints
@app.post("/trabajo/")
def create_trabajo(trabajo: TrabajoCreate, db: Session = Depends(get_db)):
    try:
        db_trabajo = Trabajo(
            id=trabajo.id,
            cliente=trabajo.cliente,
            fecha=trabajo.fecha,
            password=trabajo.password
        )
        db.add(db_trabajo)
        db.commit()
        db.refresh(db_trabajo)
        return {"success": True, "message": "Trabajo creado exitosamente"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear trabajo: {str(e)}")

@app.put("/trabajo/{id}")
def update_trabajo(id: int, trabajo: TrabajoUpdate, db: Session = Depends(get_db)):
    try:
        db_trabajo = db.query(Trabajo).filter(Trabajo.id == id).first()
        if not db_trabajo:
            raise HTTPException(status_code=404, detail="Trabajo no encontrado")
        
        # Verify password
        if db_trabajo.password != trabajo.password:
            raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        
        # Update fields if provided
        if trabajo.cliente is not None:
            db_trabajo.cliente = trabajo.cliente
        if trabajo.fecha is not None:
            db_trabajo.fecha = trabajo.fecha
        
        db.commit()
        db.refresh(db_trabajo)
        return {"success": True, "message": "Trabajo actualizado exitosamente"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al actualizar trabajo: {str(e)}")

@app.get("/trabajo/{id}")
def get_trabajo(id: int, db: Session = Depends(get_db)):
    db_trabajo = db.query(Trabajo).filter(Trabajo.id == id).first()
    if not db_trabajo:
        raise HTTPException(status_code=404, detail="Trabajo no encontrado")
    
    return {
        "id": db_trabajo.id,
        "cliente": db_trabajo.cliente,
        "fecha": db_trabajo.fecha
    }

@app.get("/trabajos/")
def get_all_trabajos(db: Session = Depends(get_db)):
    trabajos = db.query(Trabajo).all()
    return [
        {
            "id": trabajo.id,
            "cliente": trabajo.cliente,
            "fecha": trabajo.fecha
        }
        for trabajo in trabajos
    ]

# Formulario Coche endpoints
@app.post("/formulario-coche/")
def create_formulario_coche(formulario: FormularioCocheCreate, db: Session = Depends(get_db)):
    try:
        # Check if coche exists
        coche = db.query(Coche).filter(Coche.placa == formulario.placa_coche).first()
        if not coche:
            raise HTTPException(status_code=404, detail="Coche no encontrado")
        
        # Check if trabajador exists
        trabajador = db.query(Trabajador).filter(Trabajador.dni == formulario.dni_trabajador).first()
        if not trabajador:
            raise HTTPException(status_code=404, detail="Trabajador no encontrado")
        
        # Check if trabajo exists
        trabajo = db.query(Trabajo).filter(Trabajo.id == formulario.id_trabajo).first()
        if not trabajo:
            raise HTTPException(status_code=404, detail="Trabajo no encontrado")
        
        # Check if job already has a car formulary
        existing_formulario = db.query(FormularioCoche).filter(FormularioCoche.id_trabajo == formulario.id_trabajo).first()
        if existing_formulario:
            raise HTTPException(status_code=400, detail="Este trabajo ya tiene un formulario de coche asociado")
        
        # Create formulario
        db_formulario = FormularioCoche(
            placa_coche=formulario.placa_coche,
            dni_trabajador=formulario.dni_trabajador,
            id_trabajo=formulario.id_trabajo,
            otros=formulario.otros,
            fecha=formulario.fecha,
            hora_partida=formulario.hora_partida,
            estado_coche=formulario.estado_coche
        )
        db.add(db_formulario)
        db.commit()
        db.refresh(db_formulario)
        
        return {"success": True, "message": "Formulario de coche creado exitosamente"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear formulario de coche: {str(e)}")

@app.get("/formularios-coche/")
def get_all_formularios_coche(db: Session = Depends(get_db)):
    try:
        formularios = db.query(FormularioCoche).all()
        return [
            {
              "placa_coche": formulario.placa_coche,
              "dni_trabajador": formulario.dni_trabajador,
              "id_trabajo": formulario.id_trabajo,
              "otros": formulario.otros,
              "fecha": formulario.fecha,
              "hora_partida": formulario.hora_partida,
              "estado_coche": formulario.estado_coche
            }
            for formulario in formularios
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener formularios de coche: {str(e)}")

# Formulario Trabajo endpoints
@app.post("/formulario-trabajo/")
def create_formulario_trabajo(formulario: FormularioTrabajoCreate, db: Session = Depends(get_db)):
    try:
        # Check if coche exists
        coche = db.query(Coche).filter(Coche.placa == formulario.placa_coche).first()
        if not coche:
            raise HTTPException(status_code=404, detail="Coche no encontrado")
        
        # Check if trabajador exists
        trabajador = db.query(Trabajador).filter(Trabajador.dni == formulario.dni_trabajador).first()
        if not trabajador:
            raise HTTPException(status_code=404, detail="Trabajador no encontrado")
        
        # Check if trabajo exists
        trabajo = db.query(Trabajo).filter(Trabajo.id == formulario.id_trabajo).first()
        if not trabajo:
            raise HTTPException(status_code=404, detail="Trabajo no encontrado")
        
        # Check if job already has a job formulary
        existing_formulario = db.query(FormularioTrabajo).filter(FormularioTrabajo.id_trabajo == formulario.id_trabajo).first()
        if existing_formulario:
            raise HTTPException(status_code=400, detail="Este trabajo ya tiene un formulario de trabajo asociado")
        
        # Create formulario
        db_formulario = FormularioTrabajo(
            placa_coche=formulario.placa_coche,
            dni_trabajador=formulario.dni_trabajador,
            id_trabajo=formulario.id_trabajo,
            otros=formulario.otros,
            fecha=formulario.fecha,
            hora_final=formulario.hora_final,
            horas_trabajadas=formulario.horas_trabajadas,
            lugar_trabajo=formulario.lugar_trabajo,
            tiempo_llegada=formulario.tiempo_llegada
        )
        db.add(db_formulario)
        db.commit()
        db.refresh(db_formulario)
        
        return {"success": True, "message": "Formulario de trabajo creado exitosamente"}
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error al crear formulario de trabajo: {str(e)}")

@app.get("/formularios-trabajo/")
def get_all_formularios_trabajo(db: Session = Depends(get_db)):
    try:
        formularios = db.query(FormularioTrabajo).all()
        return [
            {
              "placa_coche": formulario.placa_coche,
              "dni_trabajador": formulario.dni_trabajador,
              "id_trabajo": formulario.id_trabajo,
              "otros": formulario.otros,
              "fecha": formulario.fecha,
              "hora_final": formulario.hora_final,
              "horas_trabajadas": formulario.horas_trabajadas,
              "lugar_trabajo": formulario.lugar_trabajo,
              "tiempo_llegada": formulario.tiempo_llegada
            }
            for formulario in formularios
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al obtener formularios de trabajo: {str(e)}")

# Query endpoints for combined data
@app.get("/query/combined-data")
def query_combined_data(
    dni_trabajador: Optional[int] = None,
    id_trabajo: Optional[int] = None,
    placa_coche: Optional[int] = None,
    fecha_inicio: Optional[str] = None,
    fecha_fin: Optional[str] = None,
    format: str = Query("json", description="Response format: json or excel"),
    db: Session = Depends(get_db)
):
    print(f"Query params: dni_trabajador={dni_trabajador}, id_trabajo={id_trabajo}, placa_coche={placa_coche}, fecha_inicio={fecha_inicio}, fecha_fin={fecha_fin}, format={format}")
    
    try:
        # Query formularios coche
        query_coche = db.query(
            FormularioCoche,
            Coche.marca.label("marca_coche"),
            Coche.modelo.label("modelo_coche"),
            Trabajador.nombre.label("nombre_trabajador"),
            Trabajador.apellido.label("apellido_trabajador"),
            Trabajo.cliente.label("cliente_trabajo"),
            Trabajo.fecha.label("fecha_trabajo")
        ).join(
            Coche, FormularioCoche.placa_coche == Coche.placa
        ).join(
            Trabajador, FormularioCoche.dni_trabajador == Trabajador.dni
        ).join(
            Trabajo, FormularioCoche.id_trabajo == Trabajo.id
        )

        # Query formularios trabajo
        query_trabajo = db.query(
            FormularioTrabajo,
            Coche.marca.label("marca_coche"),
            Coche.modelo.label("modelo_coche"),
            Trabajador.nombre.label("nombre_trabajador"),
            Trabajador.apellido.label("apellido_trabajador"),
            Trabajo.cliente.label("cliente_trabajo"),
            Trabajo.fecha.label("fecha_trabajo")
        ).join(
            Coche, FormularioTrabajo.placa_coche == Coche.placa
        ).join(
            Trabajador, FormularioTrabajo.dni_trabajador == Trabajador.dni
        ).join(
            Trabajo, FormularioTrabajo.id_trabajo == Trabajo.id
        )

        # Apply filters
        if dni_trabajador:
            query_coche = query_coche.filter(FormularioCoche.dni_trabajador == dni_trabajador)
            query_trabajo = query_trabajo.filter(FormularioTrabajo.dni_trabajador == dni_trabajador)
        
        if id_trabajo:
            query_coche = query_coche.filter(FormularioCoche.id_trabajo == id_trabajo)
            query_trabajo = query_trabajo.filter(FormularioTrabajo.id_trabajo == id_trabajo)
        
        if placa_coche:
            query_coche = query_coche.filter(FormularioCoche.placa_coche == placa_coche)
            query_trabajo = query_trabajo.filter(FormularioTrabajo.placa_coche == placa_coche)
        
        print(f'fecha_inicio: {fecha_inicio}')
        print(f'fecha_fin: {fecha_fin}')

        # Debug: Print all trabajo dates in the database
        all_trabajos = db.query(Trabajo).all()
        print("All trabajo dates in database:")
        for trabajo in all_trabajos:
            print(f"Trabajo ID: {trabajo.id}, Fecha: {trabajo.fecha}, Type: {type(trabajo.fecha)}")

        if fecha_inicio and fecha_fin and fecha_inicio != "" and fecha_fin != "":
            try:
                # Convert input dates from YYYY-MM-DD to DD/MM/YYYY for comparison
                fecha_inicio_dt = datetime.strptime(fecha_inicio, "%Y-%m-%d")
                fecha_fin_dt = datetime.strptime(fecha_fin, "%Y-%m-%d")
                
                print(f"Date range for comparison:")
                print(f"fecha_inicio: {fecha_inicio_dt}")
                print(f"fecha_fin: {fecha_fin_dt}")

                # Extract components for string comparison
                query_coche = query_coche.filter(
                    func.cast(
                        func.concat(
                            func.substr(Trabajo.fecha, 7, 4), # Year
                            func.substr(Trabajo.fecha, 4, 2), # Month
                            func.substr(Trabajo.fecha, 1, 2)  # Day
                        ),
                        String
                    ).between(
                        fecha_inicio_dt.strftime("%Y%m%d"),
                        fecha_fin_dt.strftime("%Y%m%d")
                    )
                )
                query_trabajo = query_trabajo.filter(
                    func.cast(
                        func.concat(
                            func.substr(Trabajo.fecha, 7, 4), # Year
                            func.substr(Trabajo.fecha, 4, 2), # Month
                            func.substr(Trabajo.fecha, 1, 2)  # Day
                        ),
                        String
                    ).between(
                        fecha_inicio_dt.strftime("%Y%m%d"),
                        fecha_fin_dt.strftime("%Y%m%d")
                    )
                )

                # Print the queries for debugging
                print(f"Query coche SQL: {query_coche.statement.compile(compile_kwargs={'literal_binds': True})}")
                print(f"Query trabajo SQL: {query_trabajo.statement.compile(compile_kwargs={'literal_binds': True})}")

            except ValueError as e:
                print(f"Error in date conversion: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Invalid date format. Use YYYY-MM-DD format: {str(e)}")

        # Execute queries
        results_coche = query_coche.all()
        results_trabajo = query_trabajo.all()

        print(f"Found {len(results_coche)} coche results and {len(results_trabajo)} trabajo results")

        # Transform results
        data_coche = [
            {
                "tipo": "formulario_coche",
                "placa_coche": result.FormularioCoche.placa_coche,
                "marca_coche": result.marca_coche,
                "modelo_coche": result.modelo_coche,
                "dni_trabajador": result.FormularioCoche.dni_trabajador,
                "nombre_trabajador": result.nombre_trabajador,
                "apellido_trabajador": result.apellido_trabajador,
                "id_trabajo": result.FormularioCoche.id_trabajo,
                "cliente_trabajo": result.cliente_trabajo,
                "fecha_trabajo": result.fecha_trabajo,
                "otros": result.FormularioCoche.otros,
                "fecha": result.FormularioCoche.fecha,
                "hora_partida": result.FormularioCoche.hora_partida,
                "estado_coche": result.FormularioCoche.estado_coche
            }
            for result in results_coche
        ]

        data_trabajo = [
            {
                "tipo": "formulario_trabajo",
                "placa_coche": result.FormularioTrabajo.placa_coche,
                "marca_coche": result.marca_coche,
                "modelo_coche": result.modelo_coche,
                "dni_trabajador": result.FormularioTrabajo.dni_trabajador,
                "nombre_trabajador": result.nombre_trabajador,
                "apellido_trabajador": result.apellido_trabajador,
                "id_trabajo": result.FormularioTrabajo.id_trabajo,
                "cliente_trabajo": result.cliente_trabajo,
                "fecha_trabajo": result.fecha_trabajo,
                "otros": result.FormularioTrabajo.otros,
                "fecha": result.FormularioTrabajo.fecha,
                "hora_final": result.FormularioTrabajo.hora_final,
                "horas_trabajadas": result.FormularioTrabajo.horas_trabajadas,
                "lugar_trabajo": result.FormularioTrabajo.lugar_trabajo,
                "tiempo_llegada": result.FormularioTrabajo.tiempo_llegada
            }
            for result in results_trabajo
        ]

        # Prepare response
        combined_data = {
            "formularios_coche": data_coche,
            "formularios_trabajo": data_trabajo
        }

        # Return Excel if requested
        if format.lower() == "excel":
            try:
                if not data_coche and not data_trabajo:
                    return JSONResponse(
                        status_code=404,
                        content={"detail": "No hay datos para exportar con los filtros seleccionados"}
                    )

                df_coche = pd.DataFrame(data_coche) if data_coche else None
                df_trabajo = pd.DataFrame(data_trabajo) if data_trabajo else None

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"datos_combinados_{timestamp}.xlsx"
                output = BytesIO()

                with pd.ExcelWriter(output, engine="openpyxl") as writer:
                    if df_coche is not None and not df_coche.empty:
                        df_coche.to_excel(writer, sheet_name="Formularios Coche", index=False)
                    if df_trabajo is not None and not df_trabajo.empty:
                        df_trabajo.to_excel(writer, sheet_name="Formularios Trabajo", index=False)

                output.seek(0)
                return StreamingResponse(
                    output,
                    media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    headers={
                        "Content-Disposition": f"attachment; filename={filename}",
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        "Pragma": "no-cache",
                        "Expires": "0"
                    }
                )
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error generating Excel file: {str(e)}")

        return combined_data

    except Exception as e:
        print(f"Error in query_combined_data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 