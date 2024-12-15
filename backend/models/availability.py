from datetime import datetime
from sqlalchemy import ForeignKey
from exts import db


class Availability(db.Model):
    """Defines an availability model"""
    __tablename__ = "availability"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    amenity_id = db.Column(db.Integer(), ForeignKey("amenities.id"), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    end_time = db.Column(db.DateTime(), nullable=False)
    status = db.Column(db.Enum("free", "booked", name="availability_status"), default="free")

    amenity = db.relationship("Amenity", back_populates="calendar")
