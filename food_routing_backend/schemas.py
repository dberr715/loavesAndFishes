from pydantic import BaseModel
from typing import List, Optional


class VolunteerBase(BaseModel):
    first_name: str
    last_name: str
    address: Optional[str] = None
    phone_number: Optional[str] = None


class VolunteerCreate(VolunteerBase):
    pass


class Volunteer(VolunteerBase):
    id: int

    class Config:
        from_attributes = True


class EmployedDriverBase(BaseModel):
    first_name: str
    last_name: str
    address: Optional[str] = None
    phone_number: Optional[str] = None


class EmployedDriverCreate(EmployedDriverBase):
    pass


class EmployedDriver(EmployedDriverBase):
    id: int

    class Config:
        from_attributes = True


class RouteBase(BaseModel):
    driver_type: str
    driver_id: int
    pickup_locations: List[str]
    dropoff_locations: List[str]


class RouteCreate(RouteBase):
    pass


class Route(RouteBase):
    route_number: int

    class Config:
        from_attributes = True
