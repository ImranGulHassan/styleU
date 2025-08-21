# StyleU - Virtual Try-On Application

A web-based virtual try-on application. Upload your photo and clothing items to see how they look together using advanced AI image generation.

## Features

- **Virtual Try-On**: Upload a person's photo and clothing item to generate realistic try-on images
- **Modern UI**: Clean, responsive web interface with drag-and-drop file uploads
- **Real-time Processing**: Instant image processing and results display
- **Download Results**: Save your virtual try-on results as PNG images
- **Mobile Friendly**: Responsive design that works on all devices

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Image Processing**: Pillow (PIL)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd styleU
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. **Start the application**:
   ```bash
   python3 tryon.py
   ```

2. **Access the web interface**:
   - Open your browser and navigate to `http://localhost:5000`
   - The application will be available on all network interfaces

3. **Using the Virtual Try-On**:
   - Upload a full-body photo of a person
   - Upload an image of the clothing item
   - Click "Try On Outfit" to generate the result
   - Download or try another combination

## API Endpoints

- `GET /` - Main web interface
- `POST /virtual-tryon` - Virtual try-on processing
- `GET /health` - Health check endpoint

### Virtual Try-On API

**Endpoint**: `POST /virtual-tryon`

**Request**: Multipart form data with:
- `person_image`: Image file of the person
- `clothing_image`: Image file of the clothing item

**Response**:
```json
{
  "success": true,
  "result_image": "data:image/png;base64,..."
}
```

## Image Requirements

- **Person Image**: 
  - Full-body photo for best results
  - Clear, well-lit image
  - Maximum size: 10MB
  - Supported formats: JPG, PNG, GIF, WebP

- **Clothing Image**:
  - Clear product image
  - Preferably on white/transparent background
  - Maximum size: 10MB
  - Supported formats: JPG, PNG, GIF, WebP

## Configuration



### Production Deployment

For production deployment, use a WSGI server like Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:8000 tryon:app
```



## Sample Images

The project includes sample images for testing:
- `man.png`: Sample person image
- `shirt.jpeg`: Sample clothing item

## Troubleshooting

### Debug Mode

Run the application in debug mode for detailed error information:

```bash
FLASK_ENV=development python3 tryon.py
```

## API Limits and Quotas

- Maximum image size: 10MB per image
- Supported image formats: JPEG, PNG, GIF, WebP

## Security Considerations

- Keep your service account key secure
- Don't commit credentials to version control
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Implement proper input validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.




---