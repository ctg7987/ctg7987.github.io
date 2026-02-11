if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// FORCE HORIZONTAL NAV - Override any CSS that tries to make it vertical
function forceHorizontalNav() {
  const nav = document.querySelector('nav.main-nav.glass-nav');
  if (nav) {
    nav.style.setProperty('display', 'flex', 'important');
    nav.style.setProperty('flex-direction', 'row', 'important');
    nav.style.setProperty('flex-wrap', 'nowrap', 'important');
    nav.style.setProperty('white-space', 'nowrap', 'important');
    nav.style.setProperty('align-items', 'center', 'important');
    nav.style.setProperty('overflow-x', 'auto', 'important');
    nav.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
    nav.style.setProperty('gap', '0.5rem', 'important');
    nav.style.setProperty('padding', '8px 12px', 'important');
    nav.style.setProperty('max-width', 'calc(100vw - 32px)', 'important');
    
    // Force all nav links to be inline
    const links = nav.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.style.setProperty('display', 'inline-flex', 'important');
      link.style.setProperty('align-items', 'center', 'important');
      link.style.setProperty('flex', '0 0 auto', 'important');
      link.style.setProperty('white-space', 'nowrap', 'important');
      link.style.setProperty('font-size', '0.9rem', 'important');
      link.style.setProperty('padding', '6px 10px', 'important');
      link.style.setProperty('margin', '0 2px', 'important');
    });
  }
}

// Run immediately and on DOM ready
forceHorizontalNav();
document.addEventListener('DOMContentLoaded', forceHorizontalNav);
// Also run after a short delay in case styles load late
setTimeout(forceHorizontalNav, 100);

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
  
  // Navbar shrink on scroll
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('.glass-nav');
    if (nav) {
      if(window.scrollY > 60) nav.classList.add('shrunk');
      else nav.classList.remove('shrunk');
    }
    // Back to top button visibility
    const btt = document.getElementById('backToTopBtn');
    if (btt) {
      btt.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }
  });

  // Typewriter effect for "AI Engineer" subtitle
const typewriterEl = document.getElementById('typewriter-title');
const typewriterText = 'AI Engineer';
let twIdx = 0, twDir = 1;
function typewriterLoop() {
  if (!typewriterEl) return;
  if (twDir === 1) {
    if (twIdx < typewriterText.length) {
      twIdx++;
      typewriterEl.textContent = typewriterText.slice(0, twIdx);
      setTimeout(typewriterLoop, 80);
    } else {
      twDir = -1;
      setTimeout(typewriterLoop, 1200);
    }
  } else {
    if (twIdx > 0) {
      twIdx--;
      typewriterEl.textContent = typewriterText.slice(0, twIdx);
      setTimeout(typewriterLoop, 40);
    } else {
      twDir = 1;
      setTimeout(typewriterLoop, 600);
    }
  }
}
if(typewriterEl) typewriterLoop();

// Carousel navigation and accessibility
const carousel = document.querySelector('.carousel');
if (carousel) {
  // Enable arrow buttons if present
  const left = document.querySelector('.carousel-arrow.left');
  const right = document.querySelector('.carousel-arrow.right');
  const slide = () => {
    const card = carousel.querySelector('.carousel-slide');
    const step = card ? card.getBoundingClientRect().width + 16 : 260;
    return step;
  }
  left && left.addEventListener('click', () => carousel.scrollBy({left: -slide(), behavior: 'smooth'}));
  right && right.addEventListener('click', () => carousel.scrollBy({left: slide(), behavior: 'smooth'}));
}
const leftArrow = document.querySelector('.carousel-arrow.left');
const rightArrow = document.querySelector('.carousel-arrow.right');
const dots = document.querySelectorAll('.carousel-dots .dot');
let slideIndex = 0;

function updateDots(idx) {
  if (dots.length > 0) {
    dots.forEach((dot, i) => dot.style.opacity = i === idx ? "1" : "0.5");
  }
}

function scrollToSlide(idx) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides[idx]) {
    slides[idx].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    updateDots(idx);
  }
}

if (carousel && leftArrow && rightArrow && dots.length > 0) {
  leftArrow.addEventListener('click', () => {
    slideIndex = Math.max(0, slideIndex - 1);
    scrollToSlide(slideIndex);
  });
  rightArrow.addEventListener('click', () => {
    slideIndex = Math.min(dots.length - 1, slideIndex + 1);
    scrollToSlide(slideIndex);
  });

  // Keyboard navigation
  leftArrow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { leftArrow.click(); } });
  rightArrow.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { rightArrow.click(); } });

  // Dots navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { slideIndex = i; scrollToSlide(slideIndex); });
    dot.setAttribute('tabindex', '0');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { slideIndex = i; scrollToSlide(slideIndex); } });
  });

  // Arrow bounce animation
  [leftArrow, rightArrow].forEach(arrow => {
    arrow.addEventListener('mouseenter', () => arrow.style.transform = 'translateY(-50%) scale(1.15)');
    arrow.addEventListener('mouseleave', () => arrow.style.transform = 'translateY(-50%)');
  });

  // Initial dot highlight
  if (dots.length > 0) {
    updateDots(slideIndex);
  }
}
// Responsive: stack cards vertically on mobile
function handleResize(){
  if(!carousel) return;
  if(window.innerWidth<700){
    carousel.style.flexDirection='column';
    carousel.style.alignItems='center';
    carousel.style.gap='32px';
  }else{
    carousel.style.flexDirection='row';
    carousel.style.alignItems='unset';
    carousel.style.gap='32px';
  }
}
window.addEventListener('resize',handleResize);
handleResize();

// Tiny-screen menu toggle
const menuBtn = document.querySelector('.menu-btn');
const mainNav = document.getElementById('main-nav');
if (menuBtn && mainNav) {
  menuBtn.addEventListener('click', () => {
    const open = mainNav.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

// Modal popup for project details
window.showProjectModal = function(idx) {
  const details = [
    {
      title: 'Autonomous Task Agent',
      desc: 'An experimental multi tool AI system that executes structured research and planning workflows. I built this to better understand how autonomous agents can coordinate tools, memory, and reasoning to complete tasks.',
      github: 'https://github.com/ctg7987/autonomous-task-agent',
      demo: 'https://www.loom.com/share/91b337fb3d6146a4af81ec753047d7a6?sid=755fa0e3-0b37-447a-b750-08559c4afb75',
      img: 'img/ai-agent.webp',
      tech: ['FastAPI', 'Python', 'Next.js', 'TypeScript', 'WebSockets', 'Playwright', 'ChromaDB', 'OpenAI', 'Docker']
    },
    {
      title: 'RAG Chatbot',
      desc: 'A retrieval based chatbot built with FastAPI and LangChain. The system combines vector search with language models to generate context aware responses grounded in a custom knowledge base.',
      github: 'https://github.com/ctg7987/rag-chatbot',
      demo: '#',
      img: 'img/vectordatabase.webp',
      tech: ['FastAPI', 'Python', 'LangChain', 'Qdrant', 'Next.js', 'TypeScript', 'Docker']
    },
    {
      title: 'Multimodal Content Generator',
      desc: 'An AI powered content system that generates text and visual outputs for creative workflows. This project explores how different models can be combined into a single pipeline.',
      github: 'https://github.com/ctg7987/multimodal-content-gen',
      demo: '#',
      img: 'img/marketing.webp',
      tech: ['FastAPI', 'Python', 'Next.js', 'TypeScript', 'OpenAI', 'Docker']
    },
    {
      title: 'USSD Food Delivery Platform',
      desc: 'An offline food ordering system integrated with EcoCash APIs. The goal was to design something usable in low connectivity environments while maintaining secure payment flow.',
      github: 'https://github.com/ctg7987/food-delivery-system',
      demo: '#',
      img: 'img/food-delivery.webp',
      tech: ['C++', 'USSD', 'EcoCash API', 'SMS Gateway', 'Database Management']
    }
  ];
  const d = details[idx];
  let modal = document.getElementById('project-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(20,20,20,0.92)';
    modal.style.zIndex = '9999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    // Create modal content using safe DOM manipulation
    const modalContent = document.createElement('div');
    modalContent.id = 'modal-content';
    modalContent.className = 'modal-content';
    
    const modalImg = document.createElement('img');
    modalImg.id = 'modal-img';
    modalImg.alt = 'Project image';
    modalImg.className = 'modal-img';
    
    const modalTitle = document.createElement('h2');
    modalTitle.id = 'modal-title';
    modalTitle.className = 'modal-title';
    
    const modalDesc = document.createElement('p');
    modalDesc.id = 'modal-desc';
    modalDesc.className = 'modal-desc';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons';
    
    const githubLink = document.createElement('a');
    githubLink.id = 'modal-github';
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.className = 'modal-btn github-btn';
    githubLink.textContent = 'GitHub';
    
    const demoLink = document.createElement('a');
    demoLink.id = 'modal-demo';
    demoLink.target = '_blank';
    demoLink.rel = 'noopener noreferrer';
    demoLink.className = 'modal-btn demo-btn';
    demoLink.textContent = 'Live Demo';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = closeProjectModal;
    
    buttonContainer.appendChild(githubLink);
    buttonContainer.appendChild(demoLink);
    
    modalContent.appendChild(modalImg);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalDesc);
    modalContent.appendChild(buttonContainer);
    modalContent.appendChild(closeBtn);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
  document.getElementById('modal-img').src = d.img;
  document.getElementById('modal-title').textContent = d.title;
  document.getElementById('modal-desc').textContent = d.desc;
  document.getElementById('modal-github').href = d.github;
  document.getElementById('modal-demo').href = d.demo;
  modal.style.display = 'flex';
};
window.closeProjectModal = function() {
  const modal = document.getElementById('project-modal');
  if (modal) modal.style.display = 'none';
};

// Removed dark mode JS

// Animated profile image hover effect
const profileImg = document.querySelector('.animated-profile');
if(profileImg){
  profileImg.addEventListener('mouseenter',()=>{
    profileImg.style.boxShadow = '0 0 48px 12px #fb7185, 0 2px 24px #14b8a6';
    profileImg.style.transform = 'scale(1.07) rotate(-2deg)';
  });
  profileImg.addEventListener('mouseleave',()=>{
    profileImg.style.boxShadow = '0 0 32px 8px #14b8a6, 0 2px 24px rgba(0,0,0,0.32)';
    profileImg.style.transform = 'none';
  });
}
// Contact form - Let FormSubmit handle the submission
const contactForm = document.querySelector('form[action*="formsubmit.co"]');
if(contactForm){
  contactForm.addEventListener('submit',function(e){
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingText = document.getElementById('loadingText');
    if(submitBtn && submitText && loadingText){
      submitText.style.display = 'none';
      loadingText.style.display = 'inline';
      submitBtn.disabled = true;
    }
    // Let the form submit naturally to FormSubmit.co
  });
}

// Show/hide Back to Top button only after scrolling past the hero section
document.addEventListener('scroll', function() {
    var btn = document.getElementById('backToTopBtn');
    var hero = document.querySelector('.hero-section');
    if (!btn || !hero) return;
    var heroBottom = hero.getBoundingClientRect().bottom;
    if (heroBottom < 0) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });

// ===== AESTHETIC OVERHAUL — Scroll Animations & Effects =====

document.addEventListener('DOMContentLoaded', function() {
  // Mark body as animation-ready (scopes CSS hidden states)
  document.body.classList.add('animate-ready');

  // --- Scroll Reveal: Add classes to target elements ---
  var revealTargets = [
    { selector: '.welcome-content', cls: 'reveal' },
    { selector: '.about-content', cls: 'reveal' },
    { selector: '.projects-content', cls: 'reveal-scale' },
    { selector: '.experience-content', cls: 'reveal' },
    { selector: '.skills-content', cls: 'reveal' },
    { selector: '.contact-card', cls: 'reveal' },
    { selector: '.footer-glow', cls: 'reveal' }
  ];

  revealTargets.forEach(function(target) {
    var el = document.querySelector(target.selector);
    if (el) el.classList.add(target.cls);
  });

  // Experience items: staggered slide-in from left
  var experienceItems = document.querySelectorAll('.experience-item');
  experienceItems.forEach(function(item, index) {
    item.classList.add('reveal-left');
    item.style.transitionDelay = (index * 0.06) + 's';
  });

  // --- IntersectionObserver for scroll reveals ---
  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function(el) {
    revealObserver.observe(el);
  });

  // --- Staggered Skill Tag Animations ---
  var skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach(function(tag, i) {
          tag.style.transitionDelay = (i * 0.04) + 's';
          tag.classList.add('revealed');
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.15 });

  document.querySelectorAll('.skill-category').forEach(function(cat) {
    skillObserver.observe(cat);
  });

  // --- Mouse parallax for floating orbs (desktop only) ---
  if (window.innerWidth > 1024) {
    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', function(e) {
        var orbs = document.querySelectorAll('.hero-orb');
        var rect = heroSection.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        var y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        orbs.forEach(function(orb, i) {
          var factor = (i + 1) * 10;
          orb.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
        });
      });
    }
  }
});
