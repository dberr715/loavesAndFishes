
from sqlalchemy.orm import Session
import models, schemas


def get_volunteers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Volunteer).offset(skip).limit(limit).all()


def create_volunteer(db: Session, volunteer: schemas.VolunteerCreate):
    db_volunteer = models.Volunteer(
        first_name=volunteer.first_name,
        last_name=volunteer.last_name,
        address=volunteer.address,
        phone_number=volunteer.phone_number,
    )
    db.add(db_volunteer)
    db.commit()
    db.refresh(db_volunteer)
    return db_volunteer


def get_employed_drivers(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.EmployedDriver).offset(skip).limit(limit).all()


def create_employed_driver(db: Session, driver: schemas.EmployedDriverCreate):
    db_driver = models.EmployedDriver(
        first_name=driver.first_name,
        last_name=driver.last_name,
        address=driver.address,
        phone_number=driver.phone_number,
    )
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver


def get_routes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Route).offset(skip).limit(limit).all()


def create_route(db: Session, route: schemas.RouteCreate):
    db_route = models.Route(
        driver_type=route.driver_type,
        driver_id=route.driver_id,
        pickup_locations=route.pickup_locations,
        dropoff_locations=route.dropoff_locations,
    )
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route
