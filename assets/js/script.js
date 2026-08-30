/**
 * Linear / Vercel-Style 3D Portfolio Script
 * Chinky — Full-Stack Developer & CS Undergraduate
 */

document.addEventListener('DOMContentLoaded', () => {
  safeInit('StatsCounter', initStatsCounter);
  safeInit('Preloader', initPreloader);
  safeInit('ThreeJsAbstractHero', initThreeJsAbstractHero);
  safeInit('ScrollAnimations', initScrollAnimations);
  safeInit('ProjectFilters', initProjectFilters);
  safeInit('SkillSearch', initSkillSearch);
  safeInit('Navigation', initNavigation);
  safeInit('ContactForm', initContactForm);
});

function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`Error initializing ${name}:`, err);
  }
}

/* ==========================================================================
   0. PRELOADER SPLASH SCREEN FADE-OUT
   ========================================================================== */

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 400);
  }, 1200);
}

/* ==========================================================================
   1. ABSTRACT THREE.JS 3D HERO CANVAS (MINIMAL & PURPOSEFUL)
   ========================================================================== */

function initThreeJsAbstractHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Lighting setup for glossy light reflection highlight
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Directional Key Light (Upper-Left highlight on purple sphere)
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
  dirLight.position.set(-4, 5, 6);
  scene.add(dirLight);

  // Soft Teal Accent Point Light
  const pointLight = new THREE.PointLight(0x2DD4BF, 2, 20);
  pointLight.position.set(2, 2, 4);
  scene.add(pointLight);

  // Main Group for parallax
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. WIREFRAME ICOSAHEDRON (Teal/Cyan #2DD4BF, thin 1px stroke, ~45% opacity)
  const wireGeo = new THREE.IcosahedronGeometry(2.4, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x2DD4BF,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const wireframe = new THREE.Mesh(wireGeo, wireMat);
  wireframe.position.set(0.5, 0, 0); // Positioned between text and photo
  mainGroup.add(wireframe);

  // 2. GLOWING SOLID SPHERE (Purple/Violet gradient #7C3AED with glossy highlight)
  const sphereGeo = new THREE.SphereGeometry(1.15, 64, 64);
  const sphereMat = new THREE.MeshPhongMaterial({
    color: 0x7C3AED,
    emissive: 0x4C1D95,
    emissiveIntensity: 0.4,
    specular: 0xffffff,
    shininess: 90,
    transparent: true,
    opacity: 0.95
  });
  const solidSphere = new THREE.Mesh(sphereGeo, sphereMat);
  // Slightly lower-right of wireframe center, overlapping it
  solidSphere.position.set(1.1, -0.6, 0.4);
  mainGroup.add(solidSphere);

  // Mouse interaction for subtle parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // 1. Very slow ambient rotation for wireframe (full rotation over ~50s)
    wireframe.rotation.y = elapsedTime * 0.12;
    wireframe.rotation.x = elapsedTime * 0.06;

    // 2. Gentle up-down floating motion for solid sphere (3-4s loop)
    solidSphere.position.y = -0.6 + Math.sin(elapsedTime * 1.6) * 0.18;
    solidSphere.position.x = 1.1 + Math.cos(elapsedTime * 1.2) * 0.08;

    // 3. Mouse parallax shift toward cursor position
    targetX = mouseX * 0.6;
    targetY = -mouseY * 0.6;

    mainGroup.position.x += (targetX - mainGroup.position.x) * 0.04;
    mainGroup.position.y += (targetY - mainGroup.position.y) * 0.04;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
}

/* ==========================================================================
   2. GLOBAL SCROLL ENTRANCE ANIMATION (INTERSECTION OBSERVER)
   ========================================================================== */

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (!animatedElements.length) return;

  document.documentElement.classList.add('js-observer');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  animatedElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. FEATURED PROJECTS FILTERING & CARD DELEGATION
   ========================================================================== */

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Make entire project card clickable without double-triggering links
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't override click if user directly clicked an internal link icon
      if (e.target.closest('.project-link')) return;

      const href = card.getAttribute('data-href');
      if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

/* ==========================================================================
   4. SKILLS LIVE SEARCH FILTER
   ========================================================================== */

function initSkillSearch() {
  const searchInput = document.getElementById('skill-search');
  const skillTags = document.querySelectorAll('.skill-tag');

  if (!searchInput || !skillTags.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    skillTags.forEach(tag => {
      const text = tag.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        tag.classList.remove('hidden');
      } else {
        tag.classList.add('hidden');
      }
    });
  });
}

/* ==========================================================================
   5. STATS COUNT-UP OBSERVER
   ========================================================================== */

function initStatsCounter() {
  const elements = document.querySelectorAll('[data-target]');
  if (!elements.length) return;

  function animateCounter(el) {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + '+';
      }
    }, stepTime);
  }

  function checkAndAnimate(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animateCounter(el);
    }
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      observer.observe(el);
      checkAndAnimate(el);
    });
  } else {
    elements.forEach(el => checkAndAnimate(el));
  }

  window.addEventListener('scroll', () => {
    elements.forEach(el => checkAndAnimate(el));
  }, { passive: true });
}

/* ==========================================================================
   6. NAVIGATION TOGGLE
   ========================================================================== */

function initNavigation() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', !isOpen);
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM INLINE VALIDATION & AJAX SUBMIT WITH SUCCESS UI
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const successCard = document.getElementById('contact-success-card');
  const formErrorBanner = document.getElementById('contact-form-error');
  const resetBtn = document.getElementById('reset-contact-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !submitBtn) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors() {
    [nameError, emailError, messageError].forEach(err => {
      if (err) {
        err.textContent = '';
        err.classList.remove('show');
      }
    });
    [nameInput, emailInput, messageInput].forEach(inp => {
      if (inp) inp.classList.remove('error-border');
    });
    if (formErrorBanner) {
      formErrorBanner.textContent = '';
      formErrorBanner.classList.add('hidden');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    if (!nameInput || !nameInput.value.trim()) {
      if (nameError) {
        nameError.textContent = 'Please enter your name.';
        nameError.classList.add('show');
      }
      if (nameInput) nameInput.classList.add('error-border');
      isValid = false;
    }

    if (!emailInput || !emailInput.value.trim()) {
      if (emailError) {
        emailError.textContent = 'Please enter your email address.';
        emailError.classList.add('show');
      }
      if (emailInput) emailInput.classList.add('error-border');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      if (emailError) {
        emailError.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
        emailError.classList.add('show');
      }
      if (emailInput) emailInput.classList.add('error-border');
      isValid = false;
    }

    if (!messageInput || !messageInput.value.trim()) {
      if (messageError) {
        messageError.textContent = 'Please enter a message.';
        messageError.classList.add('show');
      }
      if (messageInput) messageInput.classList.add('error-border');
      isValid = false;
    }

    if (!isValid) return;

    // UI state: Disable button & show spinner + "Sending..." text
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    if (btnText) btnText.textContent = 'Sending...';
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);

      // Support AJAX form endpoints (e.g., FormSubmit / Formspree / Web3Forms)
      let endpoint = form.action;
      if (endpoint.includes('formsubmit.co') && !endpoint.includes('/ajax/')) {
        endpoint = endpoint.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      }

      // Send request with timeout protection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      let isSuccess = false;

      if (response.ok) {
        try {
          const data = await response.json();
          // Evaluate endpoint success indicator
          if (data && (data.success === 'true' || data.success === true || data.ok === true || !('success' in data))) {
            isSuccess = true;
          }
        } catch (_) {
          // If response status is OK but parsing JSON failed, treat as HTTP success
          isSuccess = true;
        }
      }

      if (isSuccess) {
        // ON SUCCESS:
        // Clear form fields, show success message card
        form.reset();
        form.classList.add('hidden');
        if (successCard) {
          const desc = successCard.querySelector('.success-desc');
          if (desc) desc.textContent = "Message sent! I'll get back to you soon.";
          successCard.classList.remove('hidden');
        }
      } else {
        throw new Error('Form service error');
      }
    } catch (err) {
      console.error('Form submission failed:', err);

      // ON FAILURE:
      // Show error message and re-enable button so user can retry
      if (formErrorBanner) {
        formErrorBanner.textContent = "Something went wrong — please email me directly at chin9899nk@gmail.com";
        formErrorBanner.classList.remove('hidden');
      } else {
        alert("Something went wrong — please email me directly at chin9899nk@gmail.com");
      }
    } finally {
      // CRITICAL: Spinner ALWAYS stops regardless of success or failure
      if (btnText) btnText.textContent = 'Send Message';
      if (btnSpinner) btnSpinner.classList.add('hidden');
      submitBtn.disabled = false;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successCard) successCard.classList.add('hidden');
      form.classList.remove('hidden');
      clearErrors();
    });
  }
}

