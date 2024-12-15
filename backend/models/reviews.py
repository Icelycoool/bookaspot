from datetime import datetime
from exts import db


class Review(Base):
    """Defines a reviews model"""
    __tablename__ = "reviews"

    user_id = db.Column(db.Integer(), ForeignKey("users.id"), nullable=False)
    amenity_id = Column(db.Integer(), ForeignKey("amenities.id"), nullable=False)
    rating = Column(db.Integer(), nullable=False) 
    comment = Column(db.Text(), nullable=True)

    user = relationship("User", back_populates="reviews")
    amenity = relationship("Amenity", back_populates="reviews")