from datetime import datetime

from exts import db


class Review(db.Model):
    """Defines a reviews model"""

    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable=False)
    amenity_id = db.Column(db.Integer(), db.ForeignKey("amenities.id"), nullable=False)
    rating = db.Column(db.Integer(), nullable=False)
    comment = db.Column(db.Text(), nullable=True)

    user = db.relationship("User", back_populates="reviews")
    amenity = db.relationship("Amenity", back_populates="reviews")

    def save(self):
        """Method to save a review"""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Method to delete a review"""
        db.session.delete(self)
        db.session.commit()
