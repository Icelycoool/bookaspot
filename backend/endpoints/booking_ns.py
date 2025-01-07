import json
from datetime import datetime, timedelta
from flask import request, jsonify, make_response
from flask_restx import fields, Resource, Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Booking, Amenity
from .qr_code_util import generate_qr_code, delete_qr_code


booking_ns = Namespace("Bookings", description="Amenity Booking Management")

# Booking serialization model
booking_model = booking_ns.model('Booking', {
    'id': fields.Integer(readonly=True),
    'user_id': fields.Integer(required=True),
    'amenity_id': fields.Integer(required=True),
    'start_date': fields.DateTime(required=True),
    'end_date': fields.DateTime(required=True),
    'status': fields.String(required=True),
    'qr_code': fields.String(required=False),
    'expires_at': fields.DateTime(readonly=True),
})


@booking_ns.route("")
class BookingListResource(Resource):
    @jwt_required()
    # @booking_ns.marshal_with(booking_model)
    def get(self):
        """Retrieve all bookings for the authenticated user"""
        user_id = get_jwt_identity()
        bookings = Booking.query.filter_by(user_id=user_id).all()
        serialized_bookings = []
    
        for booking in bookings:
            booked_amenity = Amenity.query.filter_by(id=booking.amenity_id).first()
            serialized_booking = {
                'id': booking.id,
                'amenity_id': booking.amenity_id,
                'amenity': booked_amenity.name,
                'start_time': booking.start_time.strftime('%Y-%m-%d %H:%M:%S'),
                'end_time': booking.end_time.strftime('%Y-%m-%d %H:%M:%S'),
                'status': booking.status,
                'qr_code': booking.qr_code,
                'expires_at': booking.expires_at.strftime('%Y-%m-%d %H:%M:%S') if booking.expires_at else None,
            }
            serialized_bookings.append(serialized_booking)
        
        return jsonify(serialized_bookings)

    @jwt_required()
    def post(self):
        """Create a new booking"""
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate the dates
        start_date = datetime.fromisoformat(data['start_date'])
        end_date = datetime.fromisoformat(data['end_date'])

        # Check if the amenity is booked
        booked = Booking.query.filter_by(
            amenity_id=data['amenity_id'],
            start_time=start_date,
            end_time=end_date,
            status="booked"
        ).first()

        if booked:
            return make_response(jsonify({"message": "Amenity is booked. Try another time"}), 404)
        
        # Generate the booking QRCode
        amenity = Amenity.query.filter_by(id=data['amenity_id']).first()
        qr_code_data = {
            "Amenity": amenity.name, 
            "Start": start_date.isoformat(),
            "End": end_date.isoformat()
        }
        qr_code_link = generate_qr_code(json.dumps(qr_code_data))
        expiry_time = start_date + timedelta(hours=1)

        # Create a new booking
        new_booking = Booking(
            user_id=user_id,
            amenity_id=data['amenity_id'],
            start_time=start_date,
            end_time=end_date,
            status="booked",
            qr_code= qr_code_link,
            expires_at= expiry_time,
        )

        new_booking.save()

        return make_response(jsonify({"message": "Booking successful!"}), 201)


@booking_ns.route('/<int:booking_id>')
class BookingManagementResource(Resource):
    @jwt_required()
    def put(self, booking_id):
        """Update a booking information"""
        user_id = get_jwt_identity()
        data = request.get_json()

        # Check if the booking exists
        booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first_or_404()

        # Update the booking status
        booking.start_time = datetime.fromisoformat(data.get('start_date', booking.start_time.isoformat()))
        booking.end_time = datetime.fromisoformat(data.get('end_date', booking.end_time.isoformat()))
        start_time = datetime.fromisoformat(data.get('start_date', booking.start_time.isoformat()))
        booking.expires_at = start_time + timedelta(hours=1)

        # Regenerate the qr_code
        amenity = Amenity.query.filter_by(id=booking.amenity_id).first()
        booking.qr_code = generate_qr_code(
            json.dumps(
                {
                    "Amenity": amenity.name, 
                    "Start": booking.start_time.isoformat(),
                    "End": booking.end_time.isoformat()
                }
            )
        )

        booking.save()

        return make_response(jsonify({"message": "Booking updated successfully"}), 200)

    @jwt_required()
    def delete(self, booking_id):
        """Delete a booking"""
        user_id = get_jwt_identity()
        booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first_or_404()
        delete_qr_code(booking.qr_code)
        booking.delete()
        return make_response(jsonify({"message": "Booking deleted successfully"}), 200)