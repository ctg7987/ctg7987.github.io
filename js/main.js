if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
  
  // Navbar shrink on scroll
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('.glass-nav');
    if(window.scrollY > 60) nav.classList.add('shrunk');
    else nav.classList.remove('shrunk');
  });

  // Typewriter effect for "Software Developer" subtitle
const typewriterEl = document.getElementById('typewriter-title');
const typewriterText = 'Software Developer';
let twIdx = 0, twDir = 1;
function typewriterLoop() {
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
  updateDots(slideIndex);
}
// Responsive: stack cards vertically on mobile
function handleResize(){
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

// Modal popup for project details
window.showProjectModal = function(idx) {
  const details = [
    {
      title: 'Neighborhood Helper App',
      desc: 'A mobile tool for sharing local tips, events, and resources. Designed for simplicity and real-world usefulness.',
      github: 'https://github.com/ctg7987/neighborhood-helper',
      demo: '#',
      img: 'img/ai-hand.jpg'
    },
    {
      title: 'Travel Journal Platform',
      desc: 'A web app for capturing travel stories, photos, and music playlists. Built to spark curiosity and connect people.',
      github: 'https://github.com/ctg7987/travel-journal',
      demo: '#',
      img: 'img/museum-of-the-future.jpg'
    },
    {
      title: 'Smart Reminder System',
      desc: 'A cross-device reminder tool that adapts to your habits. Focused on design thinking and making daily life smoother.',
      github: 'https://github.com/ctg7987/smart-reminder',
      demo: '#',
      img: 'img/futuristic-lights.jpg'
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
    modal.innerHTML = '<div id="modal-content" style="background:#fff; color:#222; border-radius:24px; max-width:400px; width:90vw; padding:32px 24px; box-shadow:0 8px 32px #14b8a6cc; position:relative; display:flex; flex-direction:column; align-items:center;">'+
      '<img id="modal-img" src="" alt="Project image" style="width:100%; border-radius:16px; margin-bottom:18px;" />'+
      '<h2 id="modal-title" style="color:#14b8a6; font-size:2rem; margin-bottom:12px; text-align:center;"></h2>'+
      '<p id="modal-desc" style="font-size:1.1rem; margin-bottom:18px; text-align:center;"></p>'+
      '<div style="display:flex; gap:12px; justify-content:center; margin-bottom:18px;">'+
        '<a id="modal-github" href="#" target="_blank" style="background:#14b8a6; color:#fff; border-radius:8px; padding:6px 14px; font-size:1rem; text-decoration:none;">GitHub</a>'+
        '<a id="modal-demo" href="#" target="_blank" style="background:#fb7185; color:#fff; border-radius:8px; padding:6px 14px; font-size:1rem; text-decoration:none;">Live Demo</a>'+
      '</div>'+
      '<button onclick="closeProjectModal()" style="position:absolute; top:12px; right:12px; background:#fb7185; color:#fff; border:none; border-radius:50%; width:36px; height:36px; font-size:1.3rem; cursor:pointer;">&times;</button>'+
    '</div>';
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
// Animate section fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-in');
function revealOnScroll(){
  fadeEls.forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top<window.innerHeight-80){el.classList.add('visible');}
  });
}
window.addEventListener('scroll',revealOnScroll);
window.addEventListener('DOMContentLoaded',revealOnScroll);

// Contact form custom success message
const contactForm = document.querySelector('form[action*="formsubmit.co"]');
if(contactForm){
  contactForm.addEventListener('submit',function(e){
    e.preventDefault();
    document.getElementById('contact-success').style.display = 'block';
    setTimeout(()=>{document.getElementById('contact-success').style.display='none';},4000);
    contactForm.reset();
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
