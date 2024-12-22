import os
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import current_app

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_image(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{filename}"
        upload_folder = os.path.join(current_app.root_path, 'static', 'amenities_images')
        os.makedirs(upload_folder, exist_ok=True)
        
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        return unique_filename
    return None

def delete_image_file(file_path):
    upload_dir = os.path.join(current_app.root_path, 'static', 'amenities_images')
    full_path = os.path.join(upload_dir, file_path)
    if os.path.exists(full_path):
        os.remove(full_path)