from datetime import datetime
from exts import db


class Media(db.Model):
    """Defines a media model"""
    __tablename__ = "media"

    amenity_id = db.Column(db.Integer(), ForeignKey("amenities.id"), nullable=False)
    url = db.Column(db.String(), nullable=False)
    type = db.Column(db.Enum("image", "video", name="media_type"), nullable=False)

    amenity = db.relationship("Amenity", back_populates="images")