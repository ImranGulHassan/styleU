import os
import base64
import io
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from PIL import Image as PILImage

app = Flask(__name__)
CORS(app)

PROJECT_ID = "styleu-469219"
LOCATION = "us-central1"
MODEL_NAME = "virtual-try-on-preview-08-04"

def get_credentials():
    """Load service account credentials from JSON file"""
    try:
        credentials = service_account.Credentials.from_service_account_file(
            'styleu-469219-74a9432cd257.json',
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        return credentials
    except Exception as e:
        print(f"Error loading credentials: {e}")
        return None

def get_access_token():
    """Get access token from service account credentials"""
    try:
        credentials = get_credentials()
        if not credentials:
            raise Exception("Failed to load credentials")
        
        credentials.refresh(Request())
        return credentials.token
    except Exception as e:
        print(f"Error getting access token: {e}")
        return None

def process_image(image_file):
    """Process uploaded image and convert to appropriate format"""
    try:
        image = PILImage.open(image_file)
        
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        max_size = 2048
        if image.width > max_size or image.height > max_size:
            image.thumbnail((max_size, max_size), PILImage.Resampling.LANCZOS)
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        return img_byte_arr
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/virtual-tryon', methods=['POST'])
def virtual_tryon():
    """Handle virtual try-on request"""
    try:
        if 'person_image' not in request.files or 'clothing_image' not in request.files:
            return jsonify({'error': 'Both person and clothing images are required'}), 400
        
        person_file = request.files['person_image']
        clothing_file = request.files['clothing_image']
        
        if person_file.filename == '' or clothing_file.filename == '':
            return jsonify({'error': 'No files selected'}), 400
        
        person_image_bytes = process_image(person_file)
        clothing_image_bytes = process_image(clothing_file)
        
        if not person_image_bytes or not clothing_image_bytes:
            return jsonify({'error': 'Failed to process images'}), 400
        
        access_token = get_access_token()
        if not access_token:
            return jsonify({'error': 'Failed to get authentication token'}), 500
        
        person_image_b64 = base64.b64encode(person_image_bytes).decode('utf-8')
        clothing_image_b64 = base64.b64encode(clothing_image_bytes).decode('utf-8')
        
        url = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_NAME}:predict"
        
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "instances": [
                {
                    "personImage": {
                        "image": {
                            "bytesBase64Encoded": person_image_b64
                        }
                    },
                    "productImages": [
                        {
                            "image": {
                                "bytesBase64Encoded": clothing_image_b64
                            }
                        }
                    ]
                }
            ],
            "parameters": {
                "sampleCount": 1
            }
        }
        
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code != 200:
            error_msg = f"API request failed: {response.status_code} - {response.text}"
            print(error_msg)
            return jsonify({'error': error_msg}), 500
        
        result = response.json()
        
        if 'predictions' not in result or not result['predictions']:
            return jsonify({'error': 'No predictions in API response'}), 500
        
        prediction = result['predictions'][0]
        if 'bytesBase64Encoded' in prediction:
            result_image_base64 = prediction['bytesBase64Encoded']
        else:
            return jsonify({'error': 'No image data in API response'}), 500
        
        return jsonify({
            'success': True,
            'result_image': f"data:image/png;base64,{result_image_base64}"
        })
        
    except Exception as e:
        print(f"Error in virtual try-on: {e}")
        return jsonify({'error': f'Virtual try-on failed: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Virtual Try-On API'})

if __name__ == '__main__':
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    print("Starting Virtual Try-On server...")
    print(f"Project ID: {PROJECT_ID}")
    print(f"Location: {LOCATION}")
    print(f"Model: {MODEL_NAME}")
    
    app.run(host='0.0.0.0', port=5000, debug=True)