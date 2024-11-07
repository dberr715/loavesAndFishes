# models.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from database import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    address = Column(Text, nullable=True)
    phone_number = Column(String(15), nullable=True)


class EmployedDriver(Base):
    __tablename__ = "employed_drivers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    address = Column(Text, nullable=True)
    phone_number = Column(String(15), nullable=True)


class Route(Base):
    __tablename__ = "routes"

    route_number = Column(Integer, primary_key=True, index=True)
    driver_type = Column(String(50), nullable=False)
    driver_id = Column(Integer, nullable=False)
    pickup_locations = Column(ARRAY(Text), nullable=True)
    dropoff_locations = Column(ARRAY(Text), nullable=True)

    # Foreign key relationships
    volunteer = relationship("Volunteer")
    employed_driver = relationship("EmployedDriver")

    driver_type_fk = Column(
        ForeignKey("volunteers.id", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    driver_emp_fk = Column(
        ForeignKey("employed_drivers.id", ondelete="SET NULL", onupdate="CASCADE"),
    )
