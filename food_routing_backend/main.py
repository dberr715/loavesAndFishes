from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy import func

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
    try:
        return crud.create_volunteer(db=db, volunteer=volunteer)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Volunteer ID already exists")


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
    try:
        return crud.create_employed_driver(db=db, driver=driver)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Driver ID already exists")


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
    # Generate unique route number by finding the max route_number and adding 1
    max_route_number = db.query(func.max(models.Route.route_number)).scalar()
    route_number = (max_route_number or 0) + 1

    new_route = models.Route(
        route_number=route_number,
        driver_type=route.driver_type,
        driver_id=route.driver_id,
        pickup_locations=route.pickup_locations,
        dropoff_locations=route.dropoff_locations,
    )
    try:
        db.add(new_route)
        db.commit()
        db.refresh(new_route)
        return new_route
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail="Route number or foreign key constraint failed"
        )


@app.get("/routes/", response_model=list[schemas.Route])
def read_routes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    routes = crud.get_routes(db, skip=skip, limit=limit)
    routes_with_driver_names = []

    for route in routes:
        driver_name = "Unknown"
        if route.driver_type == "volunteer":
            volunteer = (
                db.query(models.Volunteer)
                .filter(models.Volunteer.id == route.driver_id)
                .first()
            )
            driver_name = (
                f"{volunteer.first_name} {volunteer.last_name}"
                if volunteer
                else "Unknown Volunteer"
            )
        elif route.driver_type == "employed_driver":
            driver = (
                db.query(models.EmployedDriver)
                .filter(models.EmployedDriver.id == route.driver_id)
                .first()
            )
            driver_name = (
                f"{driver.first_name} {driver.last_name}"
                if driver
                else "Unknown Driver"
            )

        route_dict = route.__dict__.copy()
        route_dict["driver_name"] = driver_name
        routes_with_driver_names.append(route_dict)

    return routes_with_driver_names


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
