// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  // Header scroll effect
  const header = document.querySelector('.header');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav');
  
  burger.addEventListener('click', function() {
    nav.classList.toggle('nav--open');
    burger.classList.toggle('active');
    burger.setAttribute('aria-expanded', burger.classList.contains('active'));
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('nav--open')) {
      nav.classList.remove('nav--open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"], button[data-scroll]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href') || this.getAttribute('data-scroll');
      const target = document.querySelector(targetId);
      
      if (target) {
        // Close mobile menu if open
        if (nav.classList.contains('nav--open')) {
          nav.classList.remove('nav--open');
          burger.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
        }
        
        // Smooth scroll to target
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Accordion functionality
  const accordionItems = document.querySelectorAll('.accordion__item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    header.addEventListener('click', function() {
      // Close all other items
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });

  // Form validation and submission
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate form
      if (validateForm()) {
        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Отправка...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(function() {
          // Show success message
          document.getElementById('formSuccess').style.display = 'block';
          contactForm.reset();
          
          // Reset button
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          
          // Scroll to success message
          document.getElementById('formSuccess').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 1500);
      }
    });
  }

  // Form validation function
  function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    
    // Reset errors
    nameError.textContent = '';
    phoneError.textContent = '';
    
    // Validate name
    if (!name.value.trim()) {
      nameError.textContent = 'Пожалуйста, введите ваше имя';
      isValid = false;
      animateError(name);
    }
    
    // Validate phone
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    if (!phone.value.trim()) {
      phoneError.textContent = 'Пожалуйста, введите ваш телефон';
      isValid = false;
      animateError(phone);
    } else if (!phoneRegex.test(phone.value)) {
      phoneError.textContent = 'Пожалуйста, введите корректный номер телефона';
      isValid = false;
      animateError(phone);
    }
    
    return isValid;
  }

  // Error animation
  function animateError(element) {
    element.style.borderColor = 'var(--danger)';
    element.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
    
    setTimeout(() => {
      element.style.borderColor = '';
      element.style.boxShadow = '';
    }, 3000);
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.card, .service, .review, .gallery__item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Add loading="lazy" to images if not supported natively
  if (!('loading' in HTMLImageElement.prototype)) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.setAttribute('data-src', img.src);
      img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      img.classList.add('lazy');
    });
  }
});

// Performance optimization: Preload critical resources
const criticalResources = [
  'assets/hero.jpg',
  'assets/auto.jpg',
  'assets/decor.jpg',
  'assets/brand.jpg'
];

criticalResources.forEach(resource => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = resource;
  link.as = 'image';
  document.head.appendChild(link);
});