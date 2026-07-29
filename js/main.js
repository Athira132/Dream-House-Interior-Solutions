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
  initProjectsMasonry();
  initCustomDropdowns();
  initProjectModal();
  initContactForm();
  initFloatingButtons();
  initFAQAccordion();
  initCursorGlow();
  initBookingPopup();
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

  // Smooth scroll for nav "Contact Us" buttons targeting contact anchor
  const contactLinks = document.querySelectorAll('a[href*="#contact-section"], a[href*="#contact"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const contactSection = document.getElementById('contact-section') || document.getElementById('contact');
      // Verify if on Home page by checking if the target anchor element exists in the DOM
      if (contactSection) {
        e.preventDefault();
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Hide mobile drawer panel if open
        const toggle = document.querySelector('.mobile-toggle');
        const panel = document.querySelector('.mobile-nav-panel');
        if (toggle && panel) {
          toggle.classList.remove('active');
          panel.classList.remove('active');
        }
      }
    });
  });
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
/* Projects page dynamic masonry layout positioning calculations */
function initProjectsMasonry() {
  const container = document.querySelector('.projects-masonry');
  if (!container) return;

  // Add class for javascript-enabled layout rules
  container.classList.add('js-masonry');

  const applyMasonry = () => {
    const items = Array.from(container.querySelectorAll('.project-item')).filter(
      item => item.style.display !== 'none'
    );

    const containerWidth = container.offsetWidth;
    const gap = 12; // 12px gap

    let colCount = 3;
    if (window.innerWidth <= 575) {
      colCount = 1;
    } else if (window.innerWidth <= 991) {
      colCount = 2;
    }

    const colWidth = (containerWidth - (colCount - 1) * gap) / colCount;
    const colHeights = Array(colCount).fill(0);

    items.forEach(item => {
      // Find column with minimum height
      let minCol = 0;
      for (let i = 1; i < colCount; i++) {
        if (colHeights[i] < colHeights[minCol]) {
          minCol = i;
        }
      }

      const left = minCol * (colWidth + gap);
      const top = colHeights[minCol];

      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      item.style.width = `${colWidth}px`;

      colHeights[minCol] += item.offsetHeight + gap;
    });

    container.style.height = `${Math.max(...colHeights)}px`;
  };

  // Bind to window global for easy trigger during filters
  window.applyProjectsMasonry = applyMasonry;

  // Trigger when images finish downloading asynchronously
  const imgs = container.querySelectorAll('img');
  imgs.forEach(img => {
    if (img.complete) {
      applyMasonry();
    } else {
      img.addEventListener('load', applyMasonry);
    }
  });

  // Re-calculate on resize and load
  window.addEventListener('resize', applyMasonry);
  window.addEventListener('load', applyMasonry);

  // Apply immediately
  setTimeout(applyMasonry, 50);
}

/* Projects page categories selector with masonry callback integration */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (filterBtns.length === 0 || projectItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      let updatedCount = 0;

      projectItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        item.style.opacity = '0';
        item.style.transform = 'scale(0.96) translateY(8px)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

        setTimeout(() => {
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'inline-block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
              
              updatedCount++;
              if (updatedCount === projectItems.length && window.applyProjectsMasonry) {
                window.applyProjectsMasonry();
              }
            }, 50);
          } else {
            item.style.display = 'none';
            
            updatedCount++;
            if (updatedCount === projectItems.length && window.applyProjectsMasonry) {
              window.applyProjectsMasonry();
            }
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
  const closeBtn = document.querySelector('.modal-close') || document.querySelector('.project-modal-close');

  if (!modal) return;

  const modalImg = modal.querySelector('#modalProjectImg');
  const modalBadge = modal.querySelector('#modalProjectBadge');

  projectItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const badge = item.querySelector('.photo-badge');

      if (modalImg && img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt || 'Project Visual';
      }
      if (modalBadge && badge) {
        modalBadge.textContent = badge.textContent;
        modalBadge.style.display = 'block';
      } else if (modalBadge) {
        modalBadge.style.display = 'none';
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

  form.addEventListener('reset', () => {
    const trigger = form.querySelector('.custom-select-trigger');
    if (trigger) trigger.textContent = 'Select a Service';
    const hiddenInput = form.querySelector('input[type="hidden"]');
    if (hiddenInput) hiddenInput.value = '';
    const options = form.querySelectorAll('.custom-option');
    options.forEach(o => o.classList.remove('selected'));
  });

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

/* Scroll Triggered Booking Popup Form */
function initBookingPopup() {
  const modal = document.querySelector('.booking-modal');
  const closeBtn = document.querySelector('.booking-modal-close');
  const cancelBtn = document.querySelector('.btn-close-modal');
  const bookingForm = document.getElementById('bookingForm');
  const waBookingBtn = document.getElementById('btnWaBooking');

  if (!modal) return;

  if (bookingForm) {
    bookingForm.addEventListener('reset', () => {
      const trigger = bookingForm.querySelector('.custom-select-trigger');
      if (trigger) trigger.textContent = 'Select service';
      const hiddenInput = bookingForm.querySelector('input[type="hidden"]');
      if (hiddenInput) hiddenInput.value = '';
      const options = bookingForm.querySelectorAll('.custom-option');
      options.forEach(o => o.classList.remove('selected'));
    });
  }

  let popupTriggered = false;

  const showPopup = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('bookingPopupShown', 'true');
  };

  // Scroll depth detection
  window.addEventListener('scroll', () => {
    if (popupTriggered) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollPercent >= 60) {
      popupTriggered = true;
      if (!sessionStorage.getItem('bookingPopupShown')) {
        showPopup();
      }
    }
  });

  // Closures
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (cancelBtn) cancelBtn.addEventListener('click', closePopup);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closePopup();
    }
  });

  // Standard Form Submit (Redirecting values to WhatsApp)
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const email = document.getElementById('bookEmail').value.trim();
      const service = document.getElementById('bookService').value;
      const message = document.getElementById('bookMessage').value.trim();

      if (!name || !phone || !service) {
        alert('Please complete all required fields (Name, Phone, and Service).');
        return;
      }

      const waText = `Hello Dream House Solutions, I would like to book a Free Interior Design Consultation:
      
- *Name*: ${name}
- *Phone*: ${phone}
- *Email*: ${email || 'Not provided'}
- *Service*: ${service}
- *Message*: ${message || 'No additional notes.'}`;

      const encoded = encodeURIComponent(waText);
      const url = `https://wa.me/917012242265?text=${encoded}`;
      
      window.open(url, '_blank');
      closePopup();
      bookingForm.reset();
    });
  }

  // Direct WhatsApp Booking button
  if (waBookingBtn) {
    waBookingBtn.addEventListener('click', () => {
      // Fetch current values or send a default booking text
      const name = document.getElementById('bookName').value.trim();
      const phone = document.getElementById('bookPhone').value.trim();
      const service = document.getElementById('bookService').value;

      let waText = "Hello Dream House Solutions, I'd like to book a Free Interior Design Consultation on WhatsApp.";
      if (name && phone && service) {
        waText = `Hello Dream House Solutions, I would like to book a Free Interior Design Consultation:
        
- *Name*: ${name}
- *Phone*: ${phone}
- *Service*: ${service}`;
      }

      const url = `https://wa.me/917012242265?text=${encodeURIComponent(waText)}`;
      window.open(url, '_blank');
      closePopup();
      if (bookingForm) bookingForm.reset();
    });
  }
}

/* Custom premium select dropdown implementation */
function initCustomDropdowns() {
  const wrappers = document.querySelectorAll('.custom-select-wrapper');
  
  wrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.custom-select-trigger');
    const options = wrapper.querySelectorAll('.custom-option');
    const hiddenInput = wrapper.querySelector('input[type="hidden"]');
    
    if (!trigger || !hiddenInput) return;
    
    // Toggle dropdown open/closed
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.custom-select-wrapper').forEach(w => {
        if (w !== wrapper) w.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });
    
    // Select option
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-value');
        const text = opt.textContent;
        
        trigger.textContent = text;
        hiddenInput.value = val;
        
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        
        wrapper.classList.remove('open');
        
        // Dispatch custom change event to trigger form state updates
        hiddenInput.dispatchEvent(new Event('change'));
      });
    });
  });
  
  // Close dropdown on outside click
  document.addEventListener('click', () => {
    wrappers.forEach(w => w.classList.remove('open'));
  });
}
