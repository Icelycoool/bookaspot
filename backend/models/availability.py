from datetime import datetime
from exts import db


class Availability(db.Model):
    """Defines an availability model"""
    __tablename__ = "availability"

    amenity_id = db.Column(db.Integer(), ForeignKey("amenities.id"), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    end_time = db.Column(db.DateTime(), nullable=False)
    status = db.Column(db.Enum("free", "booked", name="availability_status"), default="free")

    amenity = db.relationship("Amenity", back_populates="calendar")
