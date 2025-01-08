from flask import jsonify, make_response, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields

from models import Amenity, Review

reviews_ns = Namespace("Reviews", description="Reviews management")

# Review serialization model
review_model = reviews_ns.model(
    "Review",
    {
        "id": fields.Integer(readonly=True),
        "user_id": fields.Integer(readonly=True),
        "amenity_id": fields.Integer(required=True),
        "rating": fields.Float(required=True, min=1, max=5),
        "comment": fields.String(required=False),
    },
)


@reviews_ns.route("")
class ReviewListResource(Resource):
    @jwt_required()
    @reviews_ns.marshal_with(review_model)
    def post(self):
        """Create a new review"""
        user_id = get_jwt_identity()
        data = request.get_json()

        # Check if the amenity exists
        amenity = Amenity.query.get(data["amenity_id"])
        if not amenity:
            return make_response(jsonify({"message": "Amenity not found"}), 404)

        # Check if the user has already left a review
        existing_review = Review.query.filter_by(
            user_id=user_id, amenity_id=data["amenity_id"]
        ).first()
        if existing_review:
            return make_response(
                jsonify({"message": "You have reviewed this amenity"}), 400
            )

        new_review = Review(
            user_id=user_id,
            amenity_id=data["amenity_id"],
            rating=data["rating"],
            comment=data["comment"],
        )
        new_review.save()
        return new_review, 201


@reviews_ns.route("/amenity/<int:amenity_id>")
class AmenityReviewsResource(Resource):
    def get(self, amenity_id):
        """Get all reviews for a specific amenity"""
        # Verify amenity exists
        Amenity.query.get_or_404(amenity_id)

        reviews = Review.query.filter_by(amenity_id=amenity_id).all()
        if not reviews:
            return make_response(
                jsonify({"message": "No reviews found for this amenity"}), 404
            )

        review_response = [
            {
                "user_id": review.user_id,
                "username": review.user.username,
                "rating": review.rating,
                "comment": review.comment,
            }
            for review in reviews
        ]

        return review_response, 200
