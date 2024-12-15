from datetime import datetime
from exts import db
    

class User(db.Model):
    """Defines a user model"""
    __tablename__ = "users"

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, nullable=Flase)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255),nullable=False)
    profile = db.Column(db.String)
    verified = db.Column(db.Boolean, default=False)
    is_owner = db.Column(db.Boolean, default=False)

    amenity = db.relationship("Amenity", back_populates="owner", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="user", cascade="all, delete-orphan")