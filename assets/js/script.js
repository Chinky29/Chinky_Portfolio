/**
 * Linear / Vercel-Style 3D Portfolio Script
 * Chinky — Full-Stack Developer & CS Undergraduate
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThreeJsAbstractHero();
  initScrollAnimations();
  initProjectFilters();
  initSkillSearch();
  initStatsCounter();
  initNavigation();
  initContactForm();
});

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
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  
  const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    alpha: true, 
    antialias: true 
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0x00f0ff, 2);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Abstract Geometry (Icosahedron for a tech-y feel)
  const geometry = new THREE.IcosahedronGeometry(2, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.8
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Floating inner core
  const innerGeo = new THREE.SphereGeometry(0.8, 32, 32);
  const innerMat = new THREE.MeshPhongMaterial({ 
    color: 0x7000ff, 
    emissive: 0x7000ff, 
    emissiveIntensity: 0.5 
  });
  const core = new THREE.Mesh(innerGeo, innerMat);
  scene.add(core);

  camera.position.z = 5;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.005;
    sphere.rotation.y += 0.005;

    core.rotation.y -= 0.01;

    // Subtle mouse follow
    sphere.position.x += (mouseX * 2 - sphere.position.x) * 0.05;
    sphere.position.y += (-mouseY * 2 - sphere.position.y) * 0.05;

    core.position.x = sphere.position.x;
    core.position.y = sphere.position.y;

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
  const statNumbers = document.querySelectorAll('.stat-number');
  const cards = document.querySelectorAll('.achievements-grid > div');

  if (!statNumbers.length) return;

  function animateSingleCounter(numEl) {
    if (numEl.getAttribute('data-animated') === 'true') return;

    // Safely extract numeric value (strips any non-digit characters)
    const rawAttr = numEl.getAttribute('data-target') || numEl.textContent;
    const target = parseInt(String(rawAttr).replace(/\D/g, ''), 10);

    if (isNaN(target) || target <= 0) return;

    // Mark as animated ONLY when count-up animation starts
    numEl.setAttribute('data-animated', 'true');

    console.log(`[StatCounter] Animating counter for ${numEl.nextElementSibling ? numEl.nextElementSibling.textContent : 'stat'}: Target = ${target}`);

    // Set counter text to 0 at start of animation
    numEl.textContent = '0';

    const duration = 1600; // 1.6s
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic ease-out curve (starts fast, decelerates near target)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * target);

      if (progress < 1) {
        numEl.textContent = `${currentCount}`;
        requestAnimationFrame(step);
      } else {
        // Append "+" suffix ONLY after animation completes
        numEl.textContent = `${target}+`;
      }
    }

    requestAnimationFrame(step);
  }

  // Trigger staggered card entrance animation
  cards.forEach((card, index) => {
    const cardObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.classList.add('achievement-card-visible');
            const numEl = card.querySelector('.stat-number');
            if (numEl) animateSingleCounter(numEl);
          }, index * 100);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cardObserver.observe(card);

    // Fallback: Immediate check if card is already visible on page load/refresh
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setTimeout(() => {
        card.classList.add('achievement-card-visible');
        const numEl = card.querySelector('.stat-number');
        if (numEl) animateSingleCounter(numEl);
      }, index * 100);
    }
  });
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
  const resetBtn = document.getElementById('reset-contact-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

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

    // Show button loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    if (btnText) btnText.textContent = 'Sending...';
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok || response.status === 200) {
        // Success
        form.classList.add('hidden');
        if (successCard) successCard.classList.remove('hidden');
      } else {
        // Fallback email trigger if AJAX fails
        throw new Error('Form service failed');
      }
    } catch (err) {
      // Fallback: Format mailto link if offline or service unavailable
      const name = nameInput ? nameInput.value.trim() : 'Visitor';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      const subject = encodeURIComponent(`Portfolio Message from ${name}`);
      const body = encodeURIComponent(`Hi Chinky,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:chin9899nk@gmail.com?subject=${subject}&body=${body}`;

      form.classList.add('hidden');
      if (successCard) {
        successCard.classList.remove('hidden');
        const desc = successCard.querySelector('.success-desc');
        if (desc) desc.textContent = "Redirecting to your email client to send message to chin9899nk@gmail.com.";
      }
    } finally {
      if (btnText) btnText.textContent = 'Send Message';
      if (btnSpinner) btnSpinner.classList.add('hidden');
      submitBtn.disabled = false;
      form.reset();
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

