/**
 * Dream House Interior Solutions - Polished Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  initMobileAccordion();
  initScrollAnimations();
  initHeroParallax();
  initProjectsFilter();
  initProjectModal();
  initContactForm();
  initFloatingButtons();
  initFAQAccordion();
  initCursorGlow();
});

/* Navigation Bar scrolled state */
function initNavigation() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  checkScroll();
  window.addEventListener('scroll', checkScroll);
}

/* Mobile Toggle and drawer */
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
  const navLinks = panel.querySelectorAll('.nav-link:not(.mobile-dropdown-header)');
  const submenuLinks = panel.querySelectorAll('.mobile-submenu-link');
  
  [...navLinks, ...submenuLinks].forEach(link => {
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

/* Mobile submenu accordion toggling */
function initMobileAccordion() {
  const subheader = document.querySelector('.mobile-dropdown-header');
  const submenu = document.querySelector('.mobile-submenu');

  if (!subheader || !submenu) return;

  subheader.addEventListener('click', (e) => {
    e.preventDefault();
    subheader.classList.toggle('active');
    submenu.classList.toggle('active');
  });
}

/* Scroll reveals */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* Slow parallax background scroll */
function initHeroParallax() {
  const heroImage = document.querySelector('.hero-background img');
  if (!heroImage) return;

  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    // Parallax speed modifier
    const yTranslation = scrollPosition * 0.25;
    heroImage.style.transform = `translateY(${yTranslation}px)`;
  });
}

/* Projects page categories selector */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length === 0 || projectItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        item.style.opacity = '0';
        item.style.transform = 'scale(0.96) translateY(8px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

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
        }, 350);
      });
    });
  });
}

/* Projects details preview overlay */
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

      modalTitle.textContent = title;
      modalValueCategory.textContent = category;
      modalValueLocation.textContent = location;
      modalValueArea.textContent = area;
      modalValueYear.textContent = year;

      if (modalPlaceholderTitle) {
        modalPlaceholderTitle.textContent = `${title} Work`;
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* Floating Action buttons visibility threshold */
function initFloatingButtons() {
  const floaters = document.querySelector('.floating-ctas');
  if (!floaters) return;

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

/* FAQ Collapsible Accordions */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* WhatsApp Enquiry Redirect formulation */
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
      alert('Please complete all required fields (Name, Phone, and Service selection).');
      return;
    }

    const whatsappText = `Hello Dream House Solutions, I've prepared a project inquiry:
    
- *Name*: ${name}
- *Phone*: ${phone}
- *Email*: ${email || 'Not provided'}
- *Service*: ${service}
- *Details*: ${message || 'No additional specifications.'}`;

    const encodedText = encodeURIComponent(whatsappText);
    const whatsappURL = `https://wa.me/917012242265?text=${encodedText}`;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = 'PREPARING ENQUIRY...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = 'OPENING WHATSAPP...';
      setTimeout(() => {
        window.open(whatsappURL, '_blank');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 1000);
    }, 800);
  });
}

/* luxury cursor glow interaction tracking */
function initCursorGlow() {
  if (window.innerWidth < 992) return;

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}
