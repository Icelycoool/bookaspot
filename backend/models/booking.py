from datetime import datetime
from exts import db


class Booking(db.Model):
    __tablename__ = "bookings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable=False)
    amenity_id = db.Column(db.Integer(), db.ForeignKey("amenities.id"), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    end_time = db.Column(db.DateTime(), nullable=False)
    status = db.Column(db.Enum("booked", "canceled", "checked_in", name="booking_status"), default="pending")
    qr_code = db.Column(db.String(), nullable=True)
    expires_at = db.Column(db.DateTime(), nullable=True)

    user = db.relationship("User")
    amenity = db.relationship("Amenity", back_populates="bookings")


    def save(self):
        """Method to save a booking"""
        db.session.add(self)
        db.session.commit()

    def update(self, **kwargs):
        """Method to update booking information"""
        for key, value in kwargs.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Method to delete a booking"""
        db.session.delete(self)
        db.session.commit()