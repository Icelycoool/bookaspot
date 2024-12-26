import os
import qrcode
from datetime import datetime
from flask import current_app


def generate_qr_code(data: str) -> str:
    """Generate a QR code from the given data"""
    upload_dir = os.path.join(current_app.root_path, 'static', 'bookings_qr')
    os.makedirs(upload_dir, exist_ok=True)
        
    # Generate QR code
    qr_image = qrcode.make(data)
    
    # Create unique filename using timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"qr_{timestamp}.png"
    
    # Create the full file path
    file_path = os.path.join(upload_dir, filename)
    
    # Save the QR code image
    qr_image.save(file_path)
    
    # Return the relative path that can be stored in the database
    return os.path.join("static", "bookings_qr", filename)

def delete_qr_code(filename: str) -> bool:
    """Delete the QR code image with the given filename"""

    file_path = os.path.join(current_app.root_path, filename.lstrip('/'))
    
    # Check if the file exists
    if os.path.exists(file_path):
        os.remove(file_path)
        return True
    else:
        return False
