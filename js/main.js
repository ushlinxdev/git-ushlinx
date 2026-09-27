/**
 * USHLINX Corporate Website JavaScript Main Module
 * Includes Theme Management, Mobile Navigation, Interactive Calculator,
 * Form Validation, FAQ Accordion, and Intersection Observers.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Saved preference or system default
  const savedTheme = localStorage.getItem('ushlinx-theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    htmlElement.setAttribute('data-theme', 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ushlinx-theme', newTheme);
    showToast(`Tema cambiado a modo ${newTheme === 'light' ? 'claro' : 'oscuro'}`);
  });

  // ------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menu-toggle');
  const menuCloseBtn = document.getElementById('menu-close');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileNav.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
    menuToggleBtn.classList.add('is-active');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
    menuToggleBtn.classList.remove('is-active');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openMobileMenu);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // ------------------------------------------------------------------
  // 3. INTERACTIVE PROJECT CALCULATOR
  // ------------------------------------------------------------------
  const calcForm = document.getElementById('quote-calculator-form');
  const priceDisplay = document.getElementById('calculated-price');
  const btnRequestQuote = document.getElementById('btn-request-quote');

  function calculateProjectQuote() {
    if (!calcForm || !priceDisplay) return;

    // Base solution price
    const selectedType = calcForm.querySelector('input[name="projectType"]:checked');
    const basePrice = selectedType ? parseFloat(selectedType.getAttribute('data-price')) : 2500;

    // Scale multiplier
    const scaleSelect = document.getElementById('projectScale');
    const scaleMultiplier = scaleSelect ? parseFloat(scaleSelect.options[scaleSelect.selectedIndex].getAttribute('data-multiplier')) : 1;

    // Addons sum
    const selectedAddons = calcForm.querySelectorAll('input[name="addons"]:checked');
    let addonsTotal = 0;
    selectedAddons.forEach(addon => {
      addonsTotal += parseFloat(addon.getAttribute('data-price') || 0);
    });

    // Final total calculation
    const total = Math.round((basePrice * scaleMultiplier) + addonsTotal);
    priceDisplay.textContent = total.toLocaleString('en-US');
  }

  if (calcForm) {
    calcForm.addEventListener('change', calculateProjectQuote);
    calculateProjectQuote(); // Initial calculation
  }

  if (btnRequestQuote) {
    btnRequestQuote.addEventListener('click', () => {
      const estimatedPrice = priceDisplay.textContent;
      const selectedTypeTitle = calcForm.querySelector('input[name="projectType"]:checked + .calc-box .calc-box-title').textContent;
      const messageField = document.getElementById('contact-message');
      const serviceSelect = document.getElementById('contact-service');

      if (messageField) {
        messageField.value = `Hola USHLINX, realicé una estimación en su sitio web para un proyecto de tipo "${selectedTypeTitle}" con un presupuesto estimado de $${estimatedPrice} USD. Quisiera recibir una propuesta oficial detallada.`;
      }

      showToast('Estimación copiada a la sección de contacto.');

      // Smooth scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ------------------------------------------------------------------
  // 4. ANIMATED METRICS COUNTER (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------
  const metricNumbers = document.querySelectorAll('.metric-number');
  let metricsAnimated = false;

  function animateMetrics() {
    metricNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          counter.textContent = `${prefix}${target}${suffix}`;
          clearInterval(timer);
        } else {
          counter.textContent = `${prefix}${Math.floor(current)}${suffix}`;
        }
      }, stepTime);
    });
  }

  const metricsSection = document.querySelector('.metrics-wrapper');
  if (metricsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          metricsAnimated = true;
          animateMetrics();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(metricsSection);
  } else {
    // Fallback if observer not supported
    animateMetrics();
  }

  // ------------------------------------------------------------------
  // 5. FAQ ACCORDION LOGIC
  // ------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const isOpen = faqItem.classList.contains('is-open');

      // Close all active items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('is-open');
        const qBtn = item.querySelector('.faq-question');
        if (qBtn) qBtn.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isOpen) {
        faqItem.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ------------------------------------------------------------------
  // 6. CONTACT FORM VALIDATION & HANDLING
  // ------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Input fields
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      // Reset errors
      document.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('btn-submit-contact');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';

        setTimeout(() => {
          showToast('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 1200);
      } else {
        showToast('Por favor corrige los campos indicados.', true);
      }
    });
  }

  // ------------------------------------------------------------------
  // 7. NEWSLETTER SUBSCRIPTION FORM
  // ------------------------------------------------------------------
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        showToast('Te has suscrito exitosamente al boletín de USHLINX.');
        newsletterForm.reset();
      }
    });
  }

  // ------------------------------------------------------------------
  // 8. SCROLL TO TOP BUTTON & HEADER SCROLL EFFECT
  // ------------------------------------------------------------------
  const scrollTopBtn = document.getElementById('scroll-top');
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Scroll to top button visibility
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }

    // Active nav link spy
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-list a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------
  // 9. TOAST NOTIFICATION HELPER
  // ------------------------------------------------------------------
  function showToast(message, isError = false) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (isError) {
      toast.style.borderColor = '#ef4444';
    }

    toast.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isError ? '#ef4444' : 'var(--primary)'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${isError ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>' : '<polyline points="20 6 9 17 4 12"></polyline>'}
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
});
