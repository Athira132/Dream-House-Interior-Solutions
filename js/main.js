/**
 * Dream House Interior Solutions - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initScrollAnimations();
  initHeroParallax();
  initProjectsFilter();
  initProjectModal();
  initContactForm();
  initFloatingButtons();
});

/* Navigation Bar States */
function initNavigation() {
  const header = document.querySelector('.site-header');
  
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial check
  checkScroll();
  window.addEventListener('scroll', checkScroll);
}

/* Mobile Toggle and Menu Drawer */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const panel = document.querySelector('.mobile-nav-panel');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('active');
    panel.classList.toggle('active');
  });

  // Close panel on link click
  const navLinks = panel.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      panel.classList.remove('active');
    });
  });

  // Close on outer click
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      panel.classList.remove('active');
    }
  });
}

/* Scroll Triggered reveal animation using Intersection Observer */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Animates once
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* Hero Background Parallax & Cinematic Slow Zoom */
function initHeroParallax() {
  const heroImage = document.querySelector('.hero-background img');
  if (!heroImage) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    // Parallax speed modifier
    const yTranslation = scrollPosition * 0.3;
    // Apply translate and subtle scale
    heroImage.style.transform = `translateY(${yTranslation}px) scale(1.02)`;
  });
}

/* Projects Filtering Logic */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length === 0 || projectItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active button styling
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Stagger fade out and in
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95) translateY(10px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}

/* Fullscreen Project Modal Preview */
function initProjectModal() {
  const projectItems = document.querySelectorAll('.project-item');
  const modal = document.querySelector('.project-modal');
  const closeBtn = document.querySelector('.modal-close');
  
  if (!modal) return;

  const modalTitle = modal.querySelector('.modal-title');
  const modalValueCategory = modal.querySelector('.meta-value-category');
  const modalValueLocation = modal.querySelector('.meta-value-location');
  const modalValueArea = modal.querySelector('.meta-value-area');
  const modalValueYear = modal.querySelector('.meta-value-year');
  const modalPlaceholderTitle = modal.querySelector('.modal-placeholder .glass-placeholder-title');
  
  projectItems.forEach(item => {
    item.addEventListener('click', () => {
      const title = item.querySelector('.project-title').textContent;
      const category = item.querySelector('.project-category').textContent;
      const location = item.querySelector('.project-location').textContent;
      const area = item.getAttribute('data-area') || 'N/A';
      const year = item.getAttribute('data-year') || '2026';

      // Set values inside modal
      modalTitle.textContent = title;
      modalValueCategory.textContent = category;
      modalValueLocation.textContent = location;
      modalValueArea.textContent = area;
      modalValueYear.textContent = year;
      
      if (modalPlaceholderTitle) {
        modalPlaceholderTitle.textContent = `${title} Image`;
      }

      // Show Modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* Floating Actions visibility */
function initFloatingButtons() {
  const floaters = document.querySelector('.floating-ctas');
  if (!floaters) return;

  // Start hidden, display after passing 300px scroll depth
  floaters.style.opacity = '0';
  floaters.style.pointerEvents = 'none';
  floaters.style.transition = 'opacity 0.4s ease';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      floaters.style.opacity = '1';
      floaters.style.pointerEvents = 'all';
    } else {
      floaters.style.opacity = '0';
      floaters.style.pointerEvents = 'none';
    }
  });
}

/* Premium Form validation & WhatsApp Submit formulating */
function initContactForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const service = document.getElementById('formService').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !phone || !service) {
      alert('Please fill out all required fields (Name, Phone, and Service Interested In).');
      return;
    }

    // Build Premium WhatsApp Enquiry Text
    const whatsappText = `Hello Dream House Solutions, I would like to make an enquiry:
    
- *Name*: ${name}
- *Phone*: ${phone}
- *Email*: ${email || 'Not provided'}
- *Service Interested In*: ${service}
- *Message*: ${message || 'No additional details.'}`;

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappURL = `https://wa.me/917012242265?text=${encodedText}`;

    // Show nice premium confirmation overlay inside button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = 'PREPARING ENQUIRY...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = 'REDIRECTING TO WHATSAPP...';
      
      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 1000);
    }, 800);
  });
}
