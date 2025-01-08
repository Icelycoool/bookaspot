from flask import jsonify, make_response, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields

from models import Amenity, Category, Media, Review, User

from .images import delete_image_file, save_image

amenities_ns = Namespace("Amenities", description="Amenities management")

# Media serialization model
media_model = amenities_ns.model(
    "Media",
    {
        "id": fields.Integer(readonly=True),
        "url": fields.String(),
        "amenity_id": fields.Integer(),
        "type": fields.String(),
    },
)

# Amenities serialization model
amenities_model = amenities_ns.model(
    "Amenity",
    {
        "id": fields.Integer(readonly=True),
        "name": fields.String(required=True),
        "description": fields.String(required=True),
        "price_per_hour": fields.Float(required=True),
        "address": fields.String(required=True),
        "category_id": fields.Integer(required=True),
        "owner_id": fields.Integer(readonly=True),
    },
)


@amenities_ns.route("")
class AmenitiesListResource(Resource):
    # @amenities_ns.marshal_list_with(amenities_model)
    def get(self):
        """Lists all amenities"""
        amenities = Amenity.query.all()
        response = []
        for amenity in amenities:
            avg_rating = (
                sum(review.rating for review in amenity.reviews) / len(amenity.reviews)
                if amenity.reviews
                else 0
            )
            images = [media.url for media in amenity.images]

            response.append(
                {
                    "id": amenity.id,
                    "name": amenity.name,
                    "description": amenity.description,
                    "price_per_hour": amenity.price_per_hour,
                    "address": amenity.address,
                    "category_id": amenity.category_id,
                    "owner_id": amenity.owner_id,
                    "images": images,
                    "rating": avg_rating,
                }
            )

        return response, 200

    @jwt_required()
    @amenities_ns.expect(amenities_model)
    @amenities_ns.marshal_with(amenities_model)
    def post(self):
        """Create a new amenity"""
        data = request.form.to_dict()
        user_id = get_jwt_identity()
        category_name = data.get("category")
        category = Category.query.filter_by(name=category_name).first()

        new_amenity = Amenity(
            name=data.get("name"),
            description=data.get("description"),
            price_per_hour=data.get("price_per_hour"),
            address=data.get("address"),
            category_id=category.id,
            owner_id=user_id,
        )
        new_amenity.save()

        images = request.files.getlist("images")
        for image in images:
            filename = save_image(image)
            if filename:
                media = Media(url=filename, type="image", amenity_id=new_amenity.id)
                media.save()

        return new_amenity, 201


@amenities_ns.route("/<int:id>")
class AmenityResource(Resource):

    def get(self, id):
        amenity = Amenity.query.get_or_404(id)

        avg_rating = (
            sum(review.rating for review in amenity.reviews) / len(amenity.reviews)
            if amenity.reviews
            else 0
        )
        images = [media.url for media in amenity.images]
        response = {
            "name": amenity.name,
            "description": amenity.description,
            "price_per_hour": amenity.price_per_hour,
            "address": amenity.address,
            "category_id": amenity.category_id,
            "owner_id": amenity.owner_id,
            "images": images,
            "rating": avg_rating,
        }
        return response, 200

    @jwt_required()
    @amenities_ns.marshal_with(amenities_model)
    def put(self, id):
        """Update an amenity"""
        amenity = Amenity.query.get_or_404(id)
        user_id = get_jwt_identity()

        if amenity.owner_id != user_id:
            amenities_ns.abort(403, message="Not authorized to update this amenity")

        # Update basic amenity data
        amenity_data = request.form.to_dict()
        amenity.update(
            name=amenity_data.get("name"),
            description=amenity_data.get("description"),
            price_per_hour=(
                float(amenity_data.get("price_per_hour"))
                if amenity_data.get("price_per_hour")
                else None
            ),
            address=amenity_data.get("address"),
            category_id=(
                int(amenity_data.get("category_id"))
                if amenity_data.get("category_id")
                else None
            ),
        )

        # Handle image updates
        if (
            "delete_all_images" in request.form
            and request.form["delete_all_images"].lower() == "true"
        ):
            # Delete all existing images
            for media in amenity.images:
                delete_image_file(media.file_path)
                media.delete()

        # Add new images
        images = request.files.getlist("images")
        for image in images:
            filename = save_image(image)
            if filename:
                media = Media(url=filename, amenity_id=amenity.id, type="image")
                media.save()

        return amenity, 200

    @jwt_required()
    def delete(self, id):
        """Delete an amenity"""
        amenity = Amenity.query.get_or_404(id)
        user_id = get_jwt_identity()

        if amenity.owner_id != user_id:
            amenities_ns.abort(403, message="Not authorized to delete this amenity")

        # Delete all associated images
        for media in amenity.images:
            delete_image_file(media.url)
            media.delete()

        # Delete the amenity
        amenity.delete()

        return make_response(jsonify({"message": "Amenity deleted successfully"}), 200)


@amenities_ns.route("/categories")
class AmenityResourceCategory(Resource):
    def get(self):
        """Fetches all the categories"""
        categories = Category.query.all()
        category_names = [
            {
                "id": category.id,
                "name": category.name,
            }
            for category in categories
        ]
        return category_names, 200
