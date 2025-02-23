document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const convertBtn = document.getElementById('convert-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const loading = document.getElementById('loading');
    const fileInput = document.getElementById('word-upload');
  
    let autoConvertTimer;
  
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        deleteBtn.classList.remove('hidden');
  
        // Auto-convert after 5 seconds
        clearTimeout(autoConvertTimer);
        autoConvertTimer = setTimeout(() => {
          uploadForm.dispatchEvent(new Event('submit'));
        }, 5000);
      }
    });
  
    uploadForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!fileInput.files.length) {
        alert('Please upload a Word file first.');
        return;
      }
  
      loading.style.display = 'block';
      convertBtn.disabled = true;
      deleteBtn.disabled = true;
  
      try {
        const formData = new FormData();
        formData.append('wordFile', fileInput.files[0]);
  
        const response = await fetch('http://localhost:3000/convert', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
  
        // Convert response to blob and create a download link
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_${fileInput.files[0].name.replace(/\.[^/.]+$/, '')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error:', error);
        alert('Error: ' + error.message);
      } finally {
        loading.style.display = 'none';
        convertBtn.disabled = false;
        deleteBtn.disabled = false;
      }
    });
  
    deleteBtn.addEventListener('click', () => {
      fileInput.value = '';
      deleteBtn.classList.add('hidden');
      clearTimeout(autoConvertTimer);
    });
  });
  