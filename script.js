const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    galleryItems.forEach(item => {
      const cats = item.dataset.category.split(' ');
      item.classList.toggle('hidden', filter !== 'all' && !cats.includes(filter));
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.getElementById('quote-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const service = document.getElementById('service').value;
  const name = document.getElementById('name').value.trim();
  const details = document.getElementById('details').value.trim();

  const message = [
    `Hi Dinoko Trading and Projects, my name is ${name}.`,
    `I am interested in: ${service}.`,
    details ? `Order details: ${details}` : '',
    'Please assist me with a quote.'
  ].filter(Boolean).join('\n');

  window.open(`https://wa.me/2784179099?text=${encodeURIComponent(message)}`, '_blank');
});

document.getElementById('year').textContent = new Date().getFullYear();
