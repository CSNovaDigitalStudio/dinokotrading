const bagKey = 'dinokoSelectedDesigns';
let selectedFilter = 'all';
let bag = JSON.parse(localStorage.getItem(bagKey) || '[]');
const products = Array.from(document.querySelectorAll('.product-card'));

const searchInput = document.getElementById('searchInput');
const noResults = document.getElementById('noResults');
const bagCount = document.getElementById('bagCount');
const bagDrawer = document.getElementById('bagDrawer');
const bagItems = document.getElementById('bagItems');
const overlay = document.getElementById('overlay');
const mainNav = document.getElementById('mainNav');
const menuButton = document.getElementById('menuButton');

function normalize(text){
  return (text || '').toLowerCase().trim();
}

function applyFilters(){
  const query = normalize(searchInput.value);
  let visible = 0;

  products.forEach(card => {
    const cats = card.dataset.category.split(' ');
    const inFilter = selectedFilter === 'all' || cats.includes(selectedFilter);
    const inSearch = !query || normalize(card.dataset.name + ' ' + card.dataset.category).includes(query);
    const show = inFilter && inSearch;
    card.classList.toggle('hide', !show);
    if(show) visible++;
  });

  noResults.hidden = visible !== 0;
}

function setActiveFilter(filter){
  selectedFilter = filter;
  document.querySelectorAll('.nav-filter, .mini-filter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  applyFilters();
}

searchInput.addEventListener('input', applyFilters);

document.querySelectorAll('.nav-filter, .mini-filter').forEach(button => {
  button.addEventListener('click', () => setActiveFilter(button.dataset.filter));
});

document.querySelectorAll('[data-footer-filter]').forEach(link => {
  link.addEventListener('click', () => setActiveFilter(link.dataset.footerFilter));
});

document.getElementById('filterToggle').addEventListener('click', () => {
  const panel = document.getElementById('filterPanel');
  panel.hidden = !panel.hidden;
});

document.getElementById('sortSelect').addEventListener('change', event => {
  const grid = document.getElementById('productGrid');
  const cards = Array.from(grid.children);
  if(event.target.value === 'name'){
    cards.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
  } else {
    cards.sort((a, b) => Number(a.dataset.order || 0) - Number(b.dataset.order || 0));
  }
  cards.forEach(card => grid.appendChild(card));
});

const productButtons = document.querySelectorAll('[data-product]');
productButtons.forEach(button => {
  button.addEventListener('click', () => addToBag(button.dataset.product));
});

document.querySelectorAll('.product-heart').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
    button.textContent = button.classList.contains('active') ? '♥' : '♡';
  });
});

document.getElementById('wishlistToggle').addEventListener('click', event => {
  event.currentTarget.classList.toggle('active');
});

function renderBag(){
  bagCount.textContent = bag.length;

  if(!bag.length){
    bagItems.innerHTML = '<p>No designs selected yet.</p>';
    return;
  }

  bagItems.innerHTML = bag.map((item, index) => `
    <div class="bag-item">
      <span>${item}</span>
      <button type="button" data-remove="${index}" aria-label="Remove ${item}">Remove</button>
    </div>
  `).join('');

  bagItems.querySelectorAll('[data-remove]').forEach(button => {
    button.addEventListener('click', () => {
      bag.splice(Number(button.dataset.remove), 1);
      saveBag();
    });
  });
}

function saveBag(){
  localStorage.setItem(bagKey, JSON.stringify(bag));
  renderBag();
}

function addToBag(name){
  if(!bag.includes(name)) bag.push(name);
  saveBag();
  openBag();
}

function openBag(){
  bagDrawer.classList.add('open');
  overlay.classList.add('show');
  bagDrawer.setAttribute('aria-hidden', 'false');
}

function closeBag(){
  bagDrawer.classList.remove('open');
  overlay.classList.remove('show');
  bagDrawer.setAttribute('aria-hidden', 'true');
}

document.getElementById('bagButton').addEventListener('click', openBag);
document.getElementById('closeBag').addEventListener('click', closeBag);
overlay.addEventListener('click', closeBag);

document.getElementById('sendEnquiry').addEventListener('click', () => {
  const lines = bag.length ? bag.map(item => `• ${item}`).join('\n') : '• I would like help choosing a design';
  const message = `Hi Dinoko, I am interested in these designs:%0A${encodeURIComponent(lines)}%0APlease assist me with price, sizing and availability.`;
  window.open(`https://wa.me/27784179099?text=${message}`, '_blank');
});

menuButton.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

products.forEach((card, index) => card.dataset.order = String(index));
renderBag();
applyFilters();
