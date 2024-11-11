from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine

# Create all the tables in the database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow requests from your React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers (for example, Content-Type, Authorization)
)


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Volunteer Endpoints
@app.post("/volunteers/", response_model=schemas.Volunteer)
def create_volunteer(volunteer: schemas.VolunteerCreate, db: Session = Depends(get_db)):
    return crud.create_volunteer(db=db, volunteer=volunteer)


@app.get("/volunteers/", response_model=list[schemas.Volunteer])
def read_volunteers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    volunteers = crud.get_volunteers(db, skip=skip, limit=limit)
    return volunteers


@app.delete("/volunteers/{volunteer_id}", response_model=schemas.Volunteer)
def delete_volunteer(volunteer_id: int, db: Session = Depends(get_db)):
    db_volunteer = (
        db.query(models.Volunteer).filter(models.Volunteer.id == volunteer_id).first()
    )
    if db_volunteer is None:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    db.delete(db_volunteer)
    db.commit()
    return db_volunteer


# Employed Driver Endpoints
@app.post("/drivers/", response_model=schemas.EmployedDriver)
def create_employed_driver(
    driver: schemas.EmployedDriverCreate, db: Session = Depends(get_db)
):
    return crud.create_employed_driver(db=db, driver=driver)


@app.get("/drivers/", response_model=list[schemas.EmployedDriver])
def read_drivers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    drivers = crud.get_employed_drivers(db, skip=skip, limit=limit)
    return drivers


@app.delete("/drivers/{driver_id}", response_model=schemas.EmployedDriver)
def delete_driver(driver_id: int, db: Session = Depends(get_db)):
    db_driver = (
        db.query(models.EmployedDriver)
        .filter(models.EmployedDriver.id == driver_id)
        .first()
    )
    if db_driver is None:
        raise HTTPException(status_code=404, detail="Driver not found")
    db.delete(db_driver)
    db.commit()
    return db_driver


# Route Endpoints
@app.post("/routes/", response_model=schemas.Route)
def create_route(route: schemas.RouteCreate, db: Session = Depends(get_db)):
    return crud.create_route(db=db, route=route)


@app.get("/routes/", response_model=list[schemas.Route])
def read_routes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    routes = crud.get_routes(db, skip=skip, limit=limit)
    return routes


@app.put("/routes/{route_number}", response_model=schemas.Route)
def update_route(
    route_number: int, updated_route: schemas.RouteCreate, db: Session = Depends(get_db)
):
    db_route = (
        db.query(models.Route).filter(models.Route.route_number == route_number).first()
    )
    if db_route is None:
        raise HTTPException(status_code=404, detail="Route not found")

    db_route.driver_type = updated_route.driver_type
    db_route.driver_id = updated_route.driver_id
    db_route.pickup_locations = updated_route.pickup_locations
    db_route.dropoff_locations = updated_route.dropoff_locations

    db.commit()
    db.refresh(db_route)
    return db_route


@app.delete("/routes/{route_number}", response_model=schemas.Route)
def delete_route(route_number: int, db: Session = Depends(get_db)):
    db_route = (
        db.query(models.Route).filter(models.Route.route_number == route_number).first()
    )
    if db_route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    db.delete(db_route)
    db.commit()
    return db_route
