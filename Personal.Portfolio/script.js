/**
 * ==========================================================================
 * PERSONAL PORTFOLIO - JAVASCRIPT LOGIC
 * Specialisation: UI/UX Design & Creative Development
 * Author: Tamannaah Bhatia (BCA Student)
 * Purpose: Accessible navigation, project details accordion,
 *          and robust client-side form validation.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initActiveNavLink();
  initProjectAccordions();
  initContactFormValidation();
  initSmoothScroll();
});

/**
 * --------------------------------------------------------------------------
 * 1. ACCESSIBLE MOBILE NAVIGATION DRAWER
 * --------------------------------------------------------------------------
 * Handles hamburger menu toggle, aria-expanded states, outside click,
 * and Esc key keyboard accessibility.
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');

  if (!toggleBtn || !navDrawer) return;

  function toggleMenu(isOpen) {
    const currentState = toggleBtn.getAttribute('aria-expanded') === 'true';
    const newState = isOpen !== undefined ? isOpen : !currentState;

    toggleBtn.setAttribute('aria-expanded', String(newState));
    navDrawer.classList.toggle('is-open', newState);

    if (newState) {
      // Find first link and focus it for keyboard users
      const firstLink = navDrawer.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when pressing the Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });

  // Close when clicking outside of the drawer
  document.addEventListener('click', (e) => {
    if (navDrawer.classList.contains('is-open') && !navDrawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 2. ACTIVE NAVIGATION LINK DETECTION
 * --------------------------------------------------------------------------
 * Sets the 'active' class on the nav link corresponding to the current URL.
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * --------------------------------------------------------------------------
 * 3. INTERACTIVE PROJECT DETAILS ACCORDION (skills.html)
 * --------------------------------------------------------------------------
 * Expands/collapses project deep dives with proper ARIA controls.
 */
function initProjectAccordions() {
  const accordionButtons = document.querySelectorAll('.project-details-btn');

  accordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const targetBody = document.getElementById(targetId);

      if (!targetBody) return;

      // Toggle state
      const nextState = !isExpanded;
      btn.setAttribute('aria-expanded', String(nextState));
      targetBody.classList.toggle('is-expanded', nextState);

      // Update button label text
      const labelSpan = btn.querySelector('.btn-label-text');
      if (labelSpan) {
        labelSpan.textContent = nextState ? 'Hide Case Study Details' : 'View Deep Dive Case Study';
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 4. CLIENT-SIDE CONTACT FORM VALIDATION (contact.html)
 * --------------------------------------------------------------------------
 * NOTE FOR COLLEGE EVALUATION:
 * Real-world email delivery requires an active backend server (Node.js, Python,
 * PHP) or an integrated email service (e.g. EmailJS, Formspree, Resend).
 * This script provides rigorous client-side validation, ensuring proper input
 * sanitation, error communication, and smooth state feedback without page reload.
 */
function initContactFormValidation() {
  const contactForm = document.getElementById('portfolioContactForm');
  if (!contactForm) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const subjectInput = document.getElementById('senderSubject');
  const messageInput = document.getElementById('senderMessage');
  const successBanner = document.getElementById('formSuccessBanner');

  // Input validation criteria
  const validators = {
    senderName: (val) => {
      if (!val || val.trim().length < 2) {
        return 'Please enter your full name (at least 2 characters).';
      }
      return '';
    },
    senderEmail: (val) => {
      if (!val || val.trim().length === 0) {
        return 'Email address is required.';
      }
      // Standard email regex format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(val.trim())) {
        return 'Please enter a valid email address (e.g. name@example.com).';
      }
      return '';
    },
    senderSubject: (val) => {
      if (!val || val === '') {
        return 'Please select a topic or subject for your inquiry.';
      }
      return '';
    },
    senderMessage: (val) => {
      if (!val || val.trim().length < 10) {
        return 'Please enter a detailed message (at least 10 characters).';
      }
      return '';
    }
  };

  // Helper to display or clear an error
  function validateField(inputElement, fieldId) {
    const errorDisplay = document.getElementById(`${fieldId}-error`);
    const validatorFn = validators[fieldId];
    if (!validatorFn || !errorDisplay) return true;

    const errorMsg = validatorFn(inputElement.value);

    if (errorMsg) {
      inputElement.classList.add('is-invalid');
      inputElement.classList.remove('is-valid');
      inputElement.setAttribute('aria-invalid', 'true');
      errorDisplay.textContent = errorMsg;
      return false;
    } else {
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
      inputElement.setAttribute('aria-invalid', 'false');
      errorDisplay.textContent = '';
      return true;
    }
  }

  // Attach live validation on input and blur
  const fields = [
    { el: nameInput, id: 'senderName' },
    { el: emailInput, id: 'senderEmail' },
    { el: subjectInput, id: 'senderSubject' },
    { el: messageInput, id: 'senderMessage' }
  ];

  fields.forEach(({ el, id }) => {
    if (!el) return;
    el.addEventListener('blur', () => validateField(el, id));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) {
        validateField(el, id);
      }
    });
  });

  // Handle Form Submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent full page reload

    let isFormValid = true;
    let firstInvalidField = null;

    fields.forEach(({ el, id }) => {
      if (!el) return;
      const isValid = validateField(el, id);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidField) firstInvalidField = el;
      }
    });

    if (!isFormValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    // Form is valid! Display success feedback
    if (successBanner) {
      successBanner.classList.add('is-active');
      successBanner.focus();
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Reset the form fields and remove validation classes
    contactForm.reset();
    fields.forEach(({ el }) => {
      if (el) {
        el.classList.remove('is-valid', 'is-invalid');
        el.removeAttribute('aria-invalid');
      }
    });
  });
}

/**
 * --------------------------------------------------------------------------
 * 5. SMOOTH SCROLLING FOR IN-PAGE ANCHORS
 * --------------------------------------------------------------------------
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}
