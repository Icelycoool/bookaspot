from flask import Flask
from flask_restx import Api, Resource
from flask_migrate import Migrate
from exts import db

from models import User, Amenity, Availability, Booking, Category, Media, Review


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    migrate = Migrate(app, db)

    api = Api(app,
              title='Bookaspot',
              version='1.0',
              description='Bookaspot is an online platform where users can easily rent and lease various amenities such as swimming pools, event halls, and football stadiums.')

    @api.route('/hello')
    class Hello(Resource):
        def get(self):
            return {'message': 'Hello World!'}


    return app