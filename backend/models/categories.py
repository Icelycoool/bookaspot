from datetime import datetime
from exts import db


class Category(db.Model):
    """Defines a category model"""
    __tablename__ = "categories"

    id = db.Column(db.Integer(), primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(255), unique=True, nullable=False)
    amenities = db.relationship("Amenity", back_populates="category", cascade="all, delete-orphan")

    def save(self):
        """Method to save a category"""
        db.session.add(self)
        db.session.commit()

    def update(self, name=None):
        """Method to update a category"""
        if name:
            self.name = name
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Method to delete a category"""
        db.session.delete(self)
        db.session.commit()