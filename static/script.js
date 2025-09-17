class VirtualTryOnApp {
    constructor() {
        this.personImage = null;
        this.clothingImage = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // File input event listeners
        document.getElementById('person-image').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'person');
        });

        document.getElementById('clothing-image').addEventListener('change', (e) => {
            this.handleImageUpload(e, 'clothing');
        });

        // Try-on button
        document.getElementById('try-on-btn').addEventListener('click', () => {
            this.performVirtualTryOn();
        });

        // Result actions
        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadResult();
        });

        document.getElementById('try-again-btn').addEventListener('click', () => {
            this.resetForm();
        });
    }

    handleImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/') && !isValidImageType(file)) {
            this.showError('Please select a valid image file (JPEG, PNG, GIF, WebP, HEIC, HEIF).');
            return;
        }

        // Validate file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
            this.showError('Image size should be less than 20MB.');
            return;
        }

        // Store the file
        if (type === 'person') {
            this.personImage = file;
        } else {
            this.clothingImage = file;
        }

        // Preview the image
        this.previewImage(file, type);

        // Update button state
        this.updateTryOnButton();

        // Hide any existing errors
        this.hideError();
    }


    previewImage(file, type) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgElement = document.getElementById(`${type}-img`);
            const placeholder = document.getElementById(`${type}-placeholder`);

            imgElement.src = e.target.result;
            imgElement.style.display = 'block';
            placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }


    updateTryOnButton() {
        const tryOnBtn = document.getElementById('try-on-btn');
        const hasAllImages = this.personImage && this.clothingImage;

        tryOnBtn.disabled = !hasAllImages;

        if (hasAllImages) {
            tryOnBtn.classList.remove('disabled');
        } else {
            tryOnBtn.classList.add('disabled');
        }
    }

    async performVirtualTryOn() {
        if (!this.personImage || !this.clothingImage) {
            this.showError('Please upload both person and clothing images.');
            return;
        }

        const tryOnBtn = document.getElementById('try-on-btn');
        const buttonText = tryOnBtn.querySelector('.button-text');
        const loadingSpinner = tryOnBtn.querySelector('.loading-spinner');

        try {
            // Show loading state
            tryOnBtn.disabled = true;
            buttonText.style.display = 'none';
            loadingSpinner.style.display = 'inline-block';
            this.hideError();
            this.hideResult();

            // Prepare form data
            const formData = new FormData();
            formData.append('person_image', this.personImage);
            formData.append('clothing_image', this.clothingImage);

            // Make API request
            const response = await fetch('/virtual-tryon', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Virtual try-on failed');
            }

            if (result.success && result.result_image) {
                this.showResult(result.result_image);
            } else {
                throw new Error('Invalid response from server');
            }

        } catch (error) {
            console.error('Virtual try-on error:', error);
            this.showError(`Failed to process virtual try-on: ${error.message}`);
        } finally {
            // Reset button state
            tryOnBtn.disabled = false;
            buttonText.style.display = 'inline-block';
            loadingSpinner.style.display = 'none';
            this.updateTryOnButton();
        }
    }

    showResult(imageDataUrl) {
        const resultSection = document.getElementById('result-section');
        const resultImage = document.getElementById('result-image');
        
        resultImage.src = imageDataUrl;
        resultSection.style.display = 'block';
        
        // Scroll to result
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    hideResult() {
        const resultSection = document.getElementById('result-section');
        resultSection.style.display = 'none';
    }

    downloadResult() {
        const resultImage = document.getElementById('result-image');
        const imageDataUrl = resultImage.src;
        
        if (!imageDataUrl || imageDataUrl === '') {
            this.showError('No result image to download.');
            return;
        }

        try {
            // Create download link
            const link = document.createElement('a');
            link.href = imageDataUrl;
            link.download = `virtual-tryon-result-${Date.now()}.png`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Failed to download image. Please try right-clicking and saving the image.');
        }
    }

    resetForm() {
        // Clear file inputs
        document.getElementById('person-image').value = '';
        document.getElementById('clothing-image').value = '';

        // Clear stored images
        this.personImage = null;
        this.clothingImage = null;

        // Reset previews
        this.resetPreview('person');
        this.resetPreview('clothing');

        // Hide result
        this.hideResult();

        // Hide error
        this.hideError();

        // Update button state
        this.updateTryOnButton();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    resetPreview(type) {
        const imgElement = document.getElementById(`${type}-img`);
        const placeholder = document.getElementById(`${type}-placeholder`);
        
        imgElement.src = '';
        imgElement.style.display = 'none';
        placeholder.style.display = 'block';
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        const errorText = errorElement.querySelector('.error-text');
        
        errorText.textContent = message;
        errorElement.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hideError();
        }, 10000);
    }

    hideError() {
        const errorElement = document.getElementById('error-message');
        errorElement.style.display = 'none';
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function isValidImageType(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    return validTypes.includes(file.type);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VirtualTryOnApp();
    
    // Add some visual feedback for file drag and drop
    const uploadCards = document.querySelectorAll('.upload-card');
    uploadCards.forEach(card => {
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            card.style.borderColor = '#667eea';
            card.style.background = '#f0f2ff';
        });
        
        card.addEventListener('dragleave', () => {
            card.style.borderColor = '#e9ecef';
            card.style.background = '#f8f9fa';
        });
        
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.style.borderColor = '#e9ecef';
            card.style.background = '#f8f9fa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = card.querySelector('input[type="file"]');
                const event = new Event('change', { bubbles: true });
                fileInput.files = files;
                fileInput.dispatchEvent(event);
            }
        });
    });
});