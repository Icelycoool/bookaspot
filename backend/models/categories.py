from datetime import datetime
from exts import db


class Category(db.Model):
    """Defines a category model"""
    __tablename__ = "categories"

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(255), unique=True, nullable=False)
    amenities = db.relationship("Amenity", back_populates="category", cascade="all, delete-orphan")