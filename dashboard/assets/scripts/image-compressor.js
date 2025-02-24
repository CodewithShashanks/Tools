// DOM Elements
const imageUpload = document.getElementById('image-upload');
const previewImage = document.getElementById('preview-image');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('quality-value');
const downloadBtn = document.getElementById('download-btn');
const originalSize = document.getElementById('original-size');
const compressedSize = document.getElementById('compressed-size');
const compressionRatio = document.getElementById('compression-ratio');

let originalFile = null;
let compressedFile = null;

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
qualityInput.addEventListener('input', updateQuality);
downloadBtn.addEventListener('click', downloadCompressedImage);

// Handle Image Upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    originalFile = file;
    originalSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      compressImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// Update Quality Value
function updateQuality() {
  qualityValue.textContent = qualityInput.value;
  if (previewImage.src) {
    compressImage(previewImage.src);
  }
}

// Compress Image
function compressImage(imageSrc) {
  const img = new Image();
  img.src = imageSrc;

  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    const maxWidth = 800; // Max width for compressed image
    const scale = Math.min(maxWidth / img.width, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    // Draw image on canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert canvas to Blob
    canvas.toBlob(
      (blob) => {
        compressedFile = blob;
        compressedSize.textContent = `${(blob.size / 1024).toFixed(2)} KB`;
        compressionRatio.textContent = `${((1 - blob.size / originalFile.size) * 100).toFixed(2)}%`;
        downloadBtn.disabled = false;
      },
      'image/jpeg',
      qualityInput.value / 100
    );
  };
}

// Download Compressed Image
function downloadCompressedImage() {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(compressedFile);
  link.download = `compressed_${originalFile.name}`;
  link.click();
}