# StyleU - Virtual Try-On Application

A web-based virtual try-on application powered by Google Cloud's Vertex AI Virtual Try-On API. Upload your photo and clothing items to see how they look together using advanced AI image generation.

## Features

- **Virtual Try-On**: Upload a person's photo and clothing item to generate realistic try-on images
- **Modern UI**: Clean, responsive web interface with drag-and-drop file uploads
- **Real-time Processing**: Instant image processing and results display
- **Download Results**: Save your virtual try-on results as PNG images
- **Mobile Friendly**: Responsive design that works on all devices

## Technology Stack

- **Backend**: Flask (Python)
- **AI Engine**: Google Cloud Vertex AI Virtual Try-On API
- **Frontend**: HTML5, CSS3, JavaScript
- **Image Processing**: Pillow (PIL)
- **Authentication**: Google Cloud Service Account

## Prerequisites

- Python 3.8 or higher
- Google Cloud Project with Vertex AI enabled
- Service Account with proper permissions
- Virtual Try-On API access

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

3. **Set up Google Cloud credentials**:
   - Ensure your service account JSON file (`styleu-469219-74a9432cd257.json`) is in the project directory
   - The service account should have the following permissions:
     - Vertex AI User
     - Service Account Token Creator

4. **Configure the application**:
   - Update `PROJECT_ID` in `tryon.py` if using a different project
   - Modify `LOCATION` if using a different region (default: us-central1)

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

### Environment Variables

You can set these environment variables instead of modifying the code:

```bash
export GOOGLE_CLOUD_PROJECT=styleu-469219
export GOOGLE_CLOUD_LOCATION=us-central1
export FLASK_ENV=development
```

### Production Deployment

For production deployment, use a WSGI server like Gunicorn:

```bash
gunicorn -w 4 -b 0.0.0.0:8000 tryon:app
```

## Project Structure

```
styleU/
├── tryon.py                           # Flask backend application
├── requirements.txt                   # Python dependencies
├── styleu-469219-74a9432cd257.json   # Google Cloud service account key
├── templates/
│   └── index.html                     # Main web interface
├── static/
│   ├── style.css                      # Application styling
│   └── script.js                      # Frontend JavaScript
├── man.png                            # Sample person image
├── shirt.jpeg                         # Sample clothing image
└── README.md                          # This file
```

## Sample Images

The project includes sample images for testing:
- `man.png`: Sample person image
- `shirt.jpeg`: Sample clothing item

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Verify service account key file is present and valid
   - Check that the service account has proper permissions
   - Ensure the project ID is correct

2. **API Errors**:
   - Confirm Virtual Try-On API is enabled in your Google Cloud project
   - Check if your region supports the Virtual Try-On API
   - Verify quota limits haven't been exceeded

3. **Image Processing Errors**:
   - Ensure images meet size and format requirements
   - Check that images are not corrupted
   - Verify internet connection for API calls

### Debug Mode

Run the application in debug mode for detailed error information:

```bash
FLASK_ENV=development python3 tryon.py
```

### Logs

Check the console output for detailed error messages and API responses.

## API Limits and Quotas

- Maximum image size: 10MB per image
- Supported image formats: JPEG, PNG, GIF, WebP
- API rate limits apply (check Google Cloud console)

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

## Support

For issues and questions:
- Check the troubleshooting section
- Review Google Cloud Vertex AI documentation
- Create an issue in the repository

## Acknowledgments

- Google Cloud Vertex AI team for the Virtual Try-On API
- Flask community for the web framework
- Contributors and testers

---

**Note**: This application uses Google Cloud's Virtual Try-On API which may have usage costs. Monitor your Google Cloud billing to track usage.