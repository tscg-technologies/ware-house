/**
 * WAREHOUSE & STORAGE SOLUTIONS
 * forms.js — B2B Warehouse Quote Form Validation & Simulation Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  const quoteForm = document.getElementById('warehouse-quote-form');
  const successModal = document.getElementById('form-success-modal');
  const successModalClose = document.getElementById('form-success-close');
  const storageTypeSelect = document.getElementById('req-storage-type');
  const conditionalNote = document.getElementById('storage-type-notice');

  // 1. Auto-select storage type from URL parameter (e.g., ?type=Pallet%20Storage)
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  if (typeParam && storageTypeSelect) {
    for (let i = 0; i < storageTypeSelect.options.length; i++) {
      if (storageTypeSelect.options[i].value.toLowerCase() === typeParam.toLowerCase() ||
          storageTypeSelect.options[i].text.toLowerCase() === typeParam.toLowerCase()) {
        storageTypeSelect.selectedIndex = i;
        break;
      }
    }
  }

  // 2. Storage Type Conditional Notice (e.g. Temperature Controlled clarification)
  function handleStorageTypeNotice() {
    if (!storageTypeSelect || !conditionalNote) return;
    const selectedVal = storageTypeSelect.value;
    if (selectedVal.includes('Temperature-Controlled')) {
      conditionalNote.style.display = 'block';
      conditionalNote.innerHTML = `
        <strong>Enquiry Notice:</strong> Temperature-controlled and cold chain enquiries are subject to verified regional facility availability, technical capabilities, and compliance licensing.
      `;
    } else {
      conditionalNote.style.display = 'none';
    }
  }

  if (storageTypeSelect) {
    storageTypeSelect.addEventListener('change', handleStorageTypeNotice);
    handleStorageTypeNotice(); // initial check
  }

  // 3. Validation Helpers
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim());
  }

  function showError(fieldId, errorMsg) {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}-error`);
    if (input) input.classList.add('is-invalid');
    if (errEl) {
      errEl.textContent = errorMsg;
      errEl.classList.add('is-visible');
    }
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById(`${fieldId}-error`);
    if (input) input.classList.remove('is-invalid');
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.remove('is-visible');
    }
  }

  // Clear errors on input
  if (quoteForm) {
    const inputs = quoteForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => clearError(input.id));
      input.addEventListener('change', () => clearError(input.id));
    });

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Required fields
      const contactName = document.getElementById('contact-name');
      const companyName = document.getElementById('company-name');
      const businessEmail = document.getElementById('business-email');
      const phoneNumber = document.getElementById('phone-number');
      const industry = document.getElementById('industry-select');
      const productDesc = document.getElementById('product-desc');
      const storageType = document.getElementById('req-storage-type');

      if (!contactName.value.trim()) {
        showError('contact-name', 'Please provide a contact person name.');
        isValid = false;
      }

      if (!companyName.value.trim()) {
        showError('company-name', 'Please provide your registered company name.');
        isValid = false;
      }

      if (!businessEmail.value.trim() || !validateEmail(businessEmail.value)) {
        showError('business-email', 'Please provide a valid corporate email address.');
        isValid = false;
      }

      if (!phoneNumber.value.trim() || !validatePhone(phoneNumber.value)) {
        showError('phone-number', 'Please provide a valid contact telephone number.');
        isValid = false;
      }

      if (!industry.value) {
        showError('industry-select', 'Please select your industry sector.');
        isValid = false;
      }

      if (!productDesc.value.trim()) {
        showError('product-desc', 'Please briefly describe the products or inventory you plan to store.');
        isValid = false;
      }

      if (!storageType.value) {
        showError('req-storage-type', 'Please select your required storage category.');
        isValid = false;
      }

      if (!isValid) {
        const firstError = quoteForm.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      // Submit Button Loading Feedback
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-block; animation: spin 1s linear infinite;">&#9696;</span>
        Generating Demo Submission...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Open Success Demo Dialog
        if (successModal) {
          successModal.classList.add('is-active');
        }
        quoteForm.reset();
        handleStorageTypeNotice();
      }, 700);
    });
  }

  // Close Success Modal
  if (successModalClose && successModal) {
    successModalClose.addEventListener('click', () => {
      successModal.classList.remove('is-active');
    });
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('is-active');
      }
    });
  }
});
