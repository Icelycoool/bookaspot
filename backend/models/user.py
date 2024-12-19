from datetime import datetime
from exts import db
    

class User(db.Model):
    """Defines a user model"""
    __tablename__ = "users"

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, nullable=False)
    firstname = db.Column(db.String(255), nullable=False)
    lastname = db.Column(db.String(255), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255),nullable=False)
    profile = db.Column(db.String)
    verified = db.Column(db.Boolean, default=False)
    is_owner = db.Column(db.Boolean, default=False)

    amenities = db.relationship("Amenity", back_populates="owner", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="user", cascade="all, delete-orphan")

    def save(self):
        """Method to save a user"""
        db.session.add(self)
        db.session.commit()

    def update(self, **kwargs):
        """Method to Update user information"""
        for key, value in kwargs.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)
        db.session.commit()

    def delete(self):
        """Method to Delete user information"""
        db.session.delete(self)
        db.session.commit()
