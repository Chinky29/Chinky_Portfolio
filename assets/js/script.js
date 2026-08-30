/**
 * Linear / Vercel-Style 3D Portfolio Script
 * Chinky — Full-Stack Developer & CS Undergraduate
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThreeJsAbstractHero();
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
    }, 800);
  }, 2600);
}

/* ==========================================================================
   1. ABSTRACT THREE.JS 3D HERO CANVAS (MINIMAL & PURPOSEFUL)
   ========================================================================== */function initThreeJsAbstractHero() {
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
   2. STATS COUNT-UP OBSERVER
   ========================================================================== */

function initStatsCounter() {
  const statsSection = document.getElementById('achievements');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (!statsSection || !statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1400;
          const stepTime = 30;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            numEl.textContent = `${current}+`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ==========================================================================
   3. NAVIGATION TOGGLE
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
   4. CONTACT FORM & TOAST
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!form || !toast) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const name = nameInput ? nameInput.value : 'there';

    if (toastMsg) {
      toastMsg.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
    }

    toast.classList.add('show');
    form.reset();

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  });
}
