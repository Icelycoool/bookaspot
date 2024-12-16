from flask import request, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token,  jwt_required, get_jwt_identity, get_jwt
from flask_restx import fields, Resource, Namespace
from werkzeug.security import generate_password_hash, check_password_hash
from models import User

auth_ns = Namespace("auth", description = "User Authentication")


# Serilization models
signup_model = auth_ns.model("Signup", {
    "id": fields.Integer(),
    "firstname": fields.String(required=True),
    "lastname": fields.String(required=True),
    "username": fields.String(required=True),
    "email": fields.String(required=True),
    "password": fields.String(required=True),
    "password_confirmation": fields.String(required=True),
    "profile": fields.String(),
    "verified": fields.Boolean(default=False),
    "is_owner": fields.Boolean(default=False)
})


login_model = auth_ns.model("Login", {
    "username": fields.String(required=True),
    "password": fields.String(required=True)
})

@auth_ns.route("/signup")
class SignupResource(Resource):
    """User Signup Resource"""
    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()

        # Check required fields
        required_fields = ["firstname", "lastname", "email", "password", "password_confirmation"]
        for field in required_fields:
            if not data.get(field):
                return  make_response(jsonify({"message": f"{field} is required"}), 400)

        # check if username already exists
        username = data.get("username")
        db_user = User.query.filter_by(username=username).first()
        if db_user:
            return make_response(jsonify({"message": "Username already exists"}), 400)

        # check if email already exists
        email = data.get("email")
        db_user = User.query.filter_by(email=email).first()
        if db_user:
            return make_response(jsonify({"message": f"An account with {email} already exists"}), 400)

        # check password confirmation
        password = data.get("password")
        password_confirmation = data.get("password_confirmation")
        if password != password_confirmation:
            return make_response(jsonify({"message": "Passwords do not match"}), 400)

        # Check user type
        is_owner = data.get("is_owner", False)
        if isinstance(is_owner, str):
            is_owner = is_owner.lower() == "true"

        # create new user
        new_user = User(
            firstname = data.get("firstname"),
            lastname = data.get("lastname"),
            username = data.get("username"),
            email = data.get("email"),
            password = generate_password_hash(data.get("password")),
            verified = False,
            is_owner = is_owner
        )

        new_user.save()

        return make_response(jsonify({
            "message": "User created successfully",
            "user": {
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201)

@auth_ns.route('/login')
class LoginResource(Resource):
    """User Login Resource"""
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        # Check if both fields are provides
        if not username or not password:
            return make_response(jsonify({"message": "Both Username and Password are required"}), 400)

        # Check if the user exits
        db_user = User.query.filter_by(username=username).first()
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.id)
            refresh_token = create_refresh_token(identity=db_user.id)
            return make_response(jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token,
                "username": username
            }), 201)

        return make_response(jsonify({"message": "Invalid username or password"}), 404)

@auth_ns.route('/refresh')
class RefreshResource(Resource):
    """Refreshes the access token"""
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user, fresh=False)
        return make_response(jsonify({"access_token": new_access_token}), 200)


@auth_ns.route('/logout')
class LogoutResource(Resource):
    """Logs out a User"""
    jwt_blocklist = set()

    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]
        self.jwt_blocklist.add(jti)
        return make_response(jsonify({"message": "Successfully logged out"}), 201)
