from datetime import datetime

from flask import jsonify, request
from flask_restx import Namespace, Resource, fields
from sqlalchemy import func

from exts import db
from models import Amenity, Booking, Category, Media, Review

search_ns = Namespace(
    "Search",
    description="Searches for amenities using categories, location, and booking status",
)

# Amenity serialization Model
search_model = search_ns.model(
    "Search",
    {
        "id": fields.Integer(required=True),
        "name": fields.String(required=True),
        "description": fields.String(required=True),
        "price_per_hour": fields.Float(required=True),
        "address": fields.String(required=True),
        "category_name": fields.String(required=True),
        "average_rating": fields.Float(required=False, default=0.0),
        "reviews_count": fields.Integer(required=True),
        "image_url": fields.String(required=False, default=None),
    },
)


# Define the search resource
@search_ns.route("")
class SearchResource(Resource):
    @search_ns.marshal_with(search_model, as_list=True)
    def get(self):
        location = request.args.get("location")
        amenity_type = request.args.get("amenity_type")
        booking_date = request.args.get("booking_date")

        query = Amenity.query

        if location:
            query = query.filter(Amenity.address.ilike(f"%{location}%"))

        if amenity_type:
            category = Category.query.filter_by(name=amenity_type).first()
            if not category:
                return {"error": "Invalid amenity type provided."}, 400
            query = query.filter(Amenity.category_id == category.id)

        if booking_date:
            try:
                booking_date = datetime.strptime(booking_date, "%Y-%m-%d")
                query = query.join(Amenity.bookings).filter(
                    ~(
                        (Booking.start_time <= booking_date)
                        & (Booking.end_time >= booking_date)
                    )
                )
            except ValueError:
                return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400

        query = (
            query.join(Amenity.category)
            .outerjoin(Amenity.reviews)
            .outerjoin(Amenity.images)
        )

        query = query.with_entities(
            Amenity.id,
            Amenity.name,
            Amenity.description,
            Amenity.price_per_hour,
            Amenity.address,
            Category.name.label("category_name"),
            func.avg(Review.rating).label("average_rating"),
            func.count(Review.id).label("reviews_count"),
            Media.url.label("image_url"),
        )

        query = query.group_by(Amenity.id, Category.name, Media.url)

        amenities = query.all()

        formatted_amenities = []
        for amenity in amenities:
            formatted_amenity = {
                "id": amenity.id,
                "name": amenity.name,
                "description": amenity.description,
                "price_per_hour": amenity.price_per_hour,
                "address": amenity.address,
                "category_name": amenity.category_name,
                "average_rating": amenity.average_rating or 0.0,
                "reviews_count": amenity.reviews_count,
                "image_url": amenity.image_url or None,
            }
            formatted_amenities.append(formatted_amenity)

        return formatted_amenities, 200
