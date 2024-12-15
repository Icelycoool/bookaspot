from datetime import datetime
from exts import db


class Booking(db.Model):
    __tablename__ = "bookings"

    user_id = db.Column(db.Integer(), ForeignKey("users.id"), nullable=False)
    amenity_id = db.Column(db.Integer(), ForeignKey("amenities.id"), nullable=False)
    start_time = db.Column(db.DateTime(), nullable=False)
    end_time = db.Column(db.DateTime(), nullable=False)
    status = db.Column(db.Enum("pending", "confirmed", "canceled", "checked_in", name="booking_status"), default="pending")
    qr_code = db.Column(db.String(), nullable=True)
    expires_at = db.Column(db.DateTime(), nullable=True)

    user = db.relationship("User")
    amenity = db.relationship("Amenity", back_populates="bookings")
    payment = db.relationship("Payment", back_populates="booking", uselist=False, cascade="all, delete-orphan")