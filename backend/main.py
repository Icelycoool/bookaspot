from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restx import Api, Resource
from flask_migrate import Migrate
from exts import db

from models import User, Amenity, Booking, Category, Media, Review
from endpoints import auth_ns, amenities_ns, reviews_ns, booking_ns


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    db.init_app(app)
    migrate = Migrate(app, db)

    JWTManager(app)

    api = Api(app,
              title='Bookaspot',
              version='1.0',
              description='Bookaspot is an online platform where users can easily rent and lease various amenities such as swimming pools, event halls, and football stadiums.')
    api.add_namespace(auth_ns, path='/api/auth')
    api.add_namespace(amenities_ns, path='/api/amenities')
    api.add_namespace(reviews_ns, path='/api/reviews')
    api.add_namespace(booking_ns, path='/api/booking')

    @api.route('/api/hello')
    class Hello(Resource):
        def get(self):
            return {'message': 'Hello World!'}

    @app.route('/api/<folder>/<filename>')
    def uploaded_file(folder, filename):
        return send_from_directory(f'static/{folder}', filename)

    return app