import re
import os
import time
from datetime import timedelta
from flask import request, jsonify, make_response, current_app
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token,  jwt_required, get_jwt_identity, get_jwt
from flask_restx import fields, Resource, Namespace
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from models import User


auth_ns = Namespace("auth", description = "User Authentication")


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
    @auth_ns.expect(signup_model)
    def post(self):
        """Create a new User"""
        data = request.get_json()

        # Check required fields
        required_fields = ["firstname", "lastname", "username", "email", "password", "password_confirmation"]
        for field in required_fields:
            if not data.get(field):
                return  make_response(jsonify({"message": f"{field} is required"}), 400)

        # check if user already exists
        existing_user = User.query.filter(
            (User.username == data.get("username")) |
            (User.email == data.get("email"))
        ).first()

        if existing_user:
            return make_response(jsonify({"message": f"User already exists!"}), 400)

        if not re.match(r"[^@]+@[^@]+\.[^@]+", data.get("email", "")):
                return make_response(jsonify({"message": "Invalid email address"}), 400)

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

@auth_ns.route("/user")
class ProfileResource(Resource):

    @auth_ns.marshal_with(signup_model)
    @jwt_required()
    def get(self):
        """Get User by id"""
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first_or_404()
        return user, 200

    @jwt_required()
    def put(self):
        """Updates User by id"""
        user_id = get_jwt_identity()
        user_to_update = User.query.filter_by(id=user_id).first_or_404()

        # Handle form data and file upload
        profile = request.files.get("profile")
        data = request.form.to_dict()
        
        # Check username if provided
        new_username = data.get("username")
        if new_username and User.query.filter_by(username=new_username).first():
            return make_response(jsonify({"message": "Username already taken"}), 400)


        # Handle Profile image upload
        image_path = None
        if profile and allowed_file(profile.filename):
            filename = secure_filename(profile.filename)
            # Create unique filename using user_id and timestamp
            file_extension = filename.rsplit('.', 1)[1].lower()
            unique_filename = f"profile_{user_id}_{int(time.time())}.{file_extension}"
            
            # Ensure upload directory exists
            upload_dir = os.path.join(current_app.root_path, 'static', 'profile_images')
            os.makedirs(upload_dir, exist_ok=True)
            
            # Save the file
            file_path = os.path.join(upload_dir, unique_filename)
            profile.save(file_path)
            
            # Store the relative path in the database
            image_path = f"/static/profile_images/{unique_filename}"
            
            # Delete old profile image if it exists
            if user_to_update.profile:
                old_image_path = os.path.join(current_app.root_path, user_to_update.profile.lstrip('/'))
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)

        user_to_update.update(
            firstname = data.get("firstname"),
            lastname = data.get("lastname"),
            username = new_username,
            email = data.get("email"),
            profile = image_path if image_path else user_to_update.profile
        )

        return make_response(jsonify({"message": "User details have been updated successfully"}), 200)

    @jwt_required()
    def delete(self):
        """Deletes a User"""
        user_id = get_jwt_identity()
        user_to_delete = User.query.filter_by(id=user_id).first_or_404()
        user_to_delete.delete()
        return make_response(jsonify({"message": "User deleted successfully"}), 200)

@auth_ns.route('/login')
class LoginResource(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        """Logs in a User"""
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        # Check if both fields are provides
        if not username or not password:
            return make_response(jsonify({"message": "Both Username and Password are required"}), 400)

        # Check if the user exits
        db_user = User.query.filter_by(username=username).first()
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=db_user.id, expires_delta=timedelta(hours=1))
            refresh_token = create_refresh_token(identity=db_user.id)
            return make_response(jsonify({
                "access_token": access_token,
                "refresh_token": refresh_token,
                "username": username
            }), 201)

        return make_response(jsonify({"message": "Invalid username or password"}), 404)

@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        """Refreshes the access token"""
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user, fresh=False)
        return make_response(jsonify({"access_token": new_access_token}), 200)


@auth_ns.route('/logout')
class LogoutResource(Resource):
    jwt_blocklist = set()

    @jwt_required()
    def post(self):
        """Logs out a User"""
        jti = get_jwt()["jti"]
        self.jwt_blocklist.add(jti)
        return make_response(jsonify({"message": "Successfully logged out"}), 201)
