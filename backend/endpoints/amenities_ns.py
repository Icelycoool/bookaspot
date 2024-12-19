from flask import request, jsonify, make_response
from flask_restx import fields, Resource, Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Amenity, User, Category

amenities_ns = Namespace("Amenities", description="Amenities management")

# Amenities serialization model
amenities_model = amenities_ns.model('Amenity', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True),
    'description': fields.String(required=True),
    'price_per_hour': fields.Float(required=True),
    'address': fields.String(required=True),
    'category_id': fields.Integer(required=True),
    'owner_id': fields.Integer(readonly=True)
})

@amenities_ns.route('')
class AmenitiesListResource(Resource):
    @jwt_required()
    @amenities_ns.marshal_list_with(amenities_model)
    def get(self):
        """Lists all amenities"""
        return Amenity.query.all(), 200

    @jwt_required()
    @amenities_ns.expect(amenities_model)
    @amenities_ns.marshal_with(amenities_model)
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        category_name = data.get('category')
        category = Category.query.filter_by(name=category_name).first()

        new_amenity = Amenity(
            name=data.get('name'),
            description=data.get('description'),
            price_per_hour=data.get('price_per_hour'),
            address=data.get('address'),
            category_id=category.id,
            owner_id=user_id
        )
        new_amenity.save()
        return new_amenity