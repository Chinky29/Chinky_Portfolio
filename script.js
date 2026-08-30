/**
 * Portfolio JavaScript Engine
 * Chinky — Full-Stack Developer & CS Undergrad
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initThreeJsHeroBall(prefersReducedMotion);
  initHeroTerminal(prefersReducedMotion);
  initScrollReveals(prefersReducedMotion);
  initGitTimelineAnimation(prefersReducedMotion);
  initStatsCounter(prefersReducedMotion);
  initNavigation();
  initCopyEmail();
});

/* ==========================================================================
   1. INTERACTIVE THREE.JS 3D HERO SPHERE CANVAS
   ========================================================================== */

function initThreeJsHeroBall(reducedMotion) {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined' || reducedMotion) return;

  const heroSection = canvas.parentElement;
  let width = heroSection.clientWidth || window.innerWidth;
  let height = heroSection.clientHeight || window.innerHeight;

  // Scene & Camera setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 16;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3D Object Group
  const group = new THREE.Group();
  scene.add(group);

  // 1. Wireframe Outer Mesh (Electric Violet 0x7C6FFF)
  const geometry = new THREE.IcosahedronGeometry(3.6, 2);
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x7C6FFF,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
  group.add(wireframeMesh);

  // 2. Inner Emissive Core (Amber / Violet 0xFFB020)
  const innerGeo = new THREE.SphereGeometry(1.4, 32, 32);
  const innerMat = new THREE.MeshPhongMaterial({
    color: 0xFFB020,
    emissive: 0x7C6FFF,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85
  });
  const coreMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(coreMesh);

  // 3. Floating 3D Starfield Particles
  const particlesCount = 350;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 50;
    positions[i + 1] = (Math.random() - 0.5) * 50;
    positions[i + 2] = (Math.random() - 0.5) * 30;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x7C6FFF,
    transparent: true,
    opacity: 0.6
  });

  const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleSystem);

  // 4. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x7C6FFF, 2, 40);
  pointLight1.position.set(8, 8, 8);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xFFB020, 2, 40);
  pointLight2.position.set(-8, -8, -8);
  scene.add(pointLight2);

  // Mouse & Scroll Tracking
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) * 0.0004;
    mouseY = (e.clientY - windowHalfY) * 0.0004;
  });

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    group.position.y = scrollY * 0.002;
  }, { passive: true });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    group.rotation.x += 0.004;
    group.rotation.y += 0.005;
    particleSystem.rotation.y += 0.0006;

    targetRotationX += (mouseY - targetRotationX) * 0.05;
    targetRotationY += (mouseX - targetRotationY) * 0.05;

    group.rotation.x += targetRotationX;
    group.rotation.y += targetRotationY;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    width = heroSection.clientWidth || window.innerWidth;
    height = heroSection.clientHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
}

/* ==========================================================================
   2. HERO TERMINAL TYPING ANIMATION
   ========================================================================== */

function initHeroTerminal(reducedMotion) {
  const cmd1El = document.getElementById('cmd-1');
  const out1El = document.getElementById('out-1');
  const line2El = document.getElementById('line-2');
  const cmd2El = document.getElementById('cmd-2');
  const out2El = document.getElementById('out-2');

  const textCmd1 = 'whoami';
  const textOut1 = 'Chinky — final-year CS undergrad, full-stack developer';
  const textCmd2 = 'status';
  const textOut2 = 'Building AI-powered clinical learning tools @ MediKarya · Hosting Gemini AI workshops as a Google Student Ambassador';

  if (!cmd1El) return;

  if (reducedMotion) {
    cmd1El.textContent = textCmd1;
    out1El.textContent = textOut1;
    if (line2El) line2El.classList.remove('hidden-line');
    if (cmd2El) cmd2El.textContent = textCmd2;
    if (out2El) out2El.textContent = textOut2;
    return;
  }

  function typeString(element, text, speed, callback) {
    let index = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(index);
      index++;
      if (index >= text.length) {
        clearInterval(timer);
        if (callback) callback();
      }
    }, speed);
  }

  setTimeout(() => {
    typeString(cmd1El, textCmd1, 70, () => {
      setTimeout(() => {
        out1El.textContent = textOut1;
        setTimeout(() => {
          if (line2El) line2El.classList.remove('hidden-line');
          typeString(cmd2El, textCmd2, 70, () => {
            setTimeout(() => {
              out2El.textContent = textOut2;
            }, 250);
          });
        }, 400);
      }, 250);
    });
  }, 400);
}

/* ==========================================================================
   3. SCROLL REVEALS & INTERSECTION OBSERVER
   ========================================================================== */

function initScrollReveals(reducedMotion) {
  if (reducedMotion) return;

  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. SIGNATURE GIT LOG TIMELINE ANIMATION
   ========================================================================== */

function initGitTimelineAnimation(reducedMotion) {
  const branchLine = document.getElementById('git-branch-line');
  const gitNodes = document.querySelectorAll('.git-node');
  const timelineSection = document.getElementById('timeline');

  if (reducedMotion) {
    if (branchLine) branchLine.style.height = '100%';
    gitNodes.forEach(node => node.classList.add('node-in-view'));
    return;
  }

  if (timelineSection && branchLine) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          branchLine.style.height = '100%';
        }
      });
    }, { threshold: 0.15 });

    timelineObserver.observe(timelineSection);
  }

  const nodeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('node-in-view');
        }, idx * 120);
      }
    });
  }, { threshold: 0.2 });

  gitNodes.forEach(node => nodeObserver.observe(node));
}

/* ==========================================================================
   5. STATS STRIP COUNTER ANIMATION
   ========================================================================== */

function initStatsCounter(reducedMotion) {
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');

  if (reducedMotion || !statsSection) return;

  let animated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(numEl => {
          const target = parseInt(numEl.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1500;
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

  statsObserver.observe(statsSection);
}

/* ==========================================================================
   6. NAVIGATION & ACTIVE HIGHLIGHT
   ========================================================================== */

function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   7. COPY EMAIL TO CLIPBOARD
   ========================================================================== */

function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast-notification');

  if (!copyBtn || !toast) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.getAttribute('data-email') || 'chin9899nk@gmail.com';

    navigator.clipboard.writeText(email).then(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }).catch(err => {
      console.error('Failed to copy email: ', err);
    });
  });
}
