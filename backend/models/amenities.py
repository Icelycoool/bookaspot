from datetime import datetime
from exts import db


class Amenity(db.Model):
    """Defines an amenity model"""
    __tablename__ = "amenities"

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(255), unique=True, nullable=False)
    description = db.Column(db.Text(), nullable=False)
    price_per_hour = db.Column(db.Float(), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    category_id = db.Column(db.Integer(), db.ForeignKey("categories.id"), nullable=False)
    owner_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable=False)

    calendar = db.relationship("Availability", back_populates="amenity", cascade="all, delete-orphan")
    images = db.relationship("Media", back_populates="amenity", cascade="all, delete-orphan")
    category = db.relationship("Category", back_populates="amenities")
    owner = db.relationship("User", back_populates="amenities")
    bookings = db.relationship("Booking", back_populates="amenity", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="amenity", cascade="all, delete-orphan")
