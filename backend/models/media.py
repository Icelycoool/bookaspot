from datetime import datetime

from exts import db


class Media(db.Model):
    """Defines a media model"""

    __tablename__ = "media"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    amenity_id = db.Column(db.Integer(), db.ForeignKey("amenities.id"), nullable=False)
    url = db.Column(db.String(), nullable=False)
    type = db.Column(db.Enum("image", "video", name="media_type"), nullable=False)

    amenity = db.relationship("Amenity", back_populates="images")

    def save(self):
        """Method to save a media"""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Method to delete a media"""
        db.session.delete(self)
        db.session.commit()
