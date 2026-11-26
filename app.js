import { catalog, categories, store } from "./catalog.js";

const byId = id => document.getElementById(id);
const money = cents => (cents / 100).toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
const key = "moda-infantil-sacola-v1";
const variants = new Map(catalog.flatMap(product => product.variants.map(variant => [variant.id, {product, variant}])));
const dialog = byId("dialog");
let category = "";
let cart = readCart();

const icons = {
  shirt: "M7 4 2 7l2 5 3-1v9h10v-9l3 1 2-5-5-3-2 2H9L7 4Z",
  dress: "M9 3 6 5l2 6-5 9h18l-5-9 2-6-3-2c0 4-6 4-6 0ZM8 11h8",
  shorts: "M5 5h14l2 14h-7l-2-7-2 7H3L5 5Zm0 3h14",
  baby: "M8 4 3 7l2 5 2-1v6l5 4 5-4v-6l2 1 2-5-5-3c0 3-8 3-8 0ZM7 16l5 2 5-2",
  set: "M6 3 2 6l2 4 2-1v4h10V9l2 1 2-4-4-3-2 2H8L6 3Zm1 13h10l1 5h-5l-1-3-1 3H6l1-5Z",
  hoodie: "M9 8C5 2 19 2 15 8l5 3 1 8h-4v-4 6H7v-6 4H3l1-8 5-3Zm0 0 3 3 3-3"
};

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Object.fromEntries(Object.entries(saved ?? {}).filter(([id, quantity]) =>
      variants.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= 99));
  } catch {
    return {};
  }
}

function saveCart() {
  try { localStorage.setItem(key, JSON.stringify(cart)); } catch {}
  byId("count").textContent = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function positionCloud() {
  const list = byId("category-list");
  const target = list.querySelector('[aria-pressed="true"]') ?? list.querySelector("[data-category]");
  const cloud = list.querySelector(".category-cloud");
  cloud.style.setProperty("--cloud-x", `${target.offsetLeft + target.offsetWidth / 2}px`);
  cloud.style.setProperty("--cloud-y", `${target.offsetTop}px`);
}

function render() {
  const buttons = byId("category-list").querySelectorAll("[data-category]");
  for (const button of buttons) {
    button.setAttribute("aria-pressed", String(button.dataset.category === category));
  }
  positionCloud();
  const products = catalog.filter(item => !category || item.category === category);
  byId("result").textContent = `${products.length} ${products.length === 1 ? "peça" : "peças"} · Catálogo de demonstração`;
  byId("products").innerHTML = products.map(({id, name, image, price, colorHex, variants}) => `
    <article class="product">
    <button type="button" class="product-image" data-product="${id}" aria-label="Ver ${name}"><img src="${image}" width="430" height="430" alt="" loading="lazy"></button>
    <div class="product-body"><p class="color"><i style="--swatch:${colorHex}"></i>${variants[0].color}</p>
    <h3>${name}</h3><div class="price-row"><strong>${money(price)}</strong><button class="plus" type="button" data-product="${id}" aria-label="Escolher ${name}">+</button></div></div></article>`).join("");
}

function openDialog(content) {
  dialog.innerHTML = `<form method="dialog" class="close"><button class="plus" aria-label="Fechar">×</button></form>${content}`;
  if (!dialog.open) dialog.showModal();
}

function showProduct(product) {
  const colors = [...new Set(product.variants.map(variant => variant.color))];
  openDialog(`<div class="detail"><img src="${product.image}" alt="${product.name}"><div>
  <h2 id="dialog-title">${product.name}</h2><p><strong>${money(product.price)}</strong></p>
  <form id="variant-form">
  <label>Cor<select name="color">${colors.map(color => `<option>${color}</option>`).join("")}</select></label>
  <label>Tamanho<select name="variant" required></select></label>
  <label>Quantidade<input type="number" name="quantity" min="1" max="99" step="1" value="1" required></label>
  <button class="button">Adicionar à sacola</button>
  </form></div></div>`);
  const form = byId("variant-form");
  function sizes() {
    form.elements.variant.innerHTML = '<option value="">Selecione um tamanho</option>' + product.variants
      .filter(variant => variant.color === form.elements.color.value)
      .map(variant => `<option value="${variant.id}">${variant.size}</option>`).join("");
  }
  sizes();
  form.elements.color.addEventListener("change", sizes);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const id = form.elements.variant.value;
    cart[id] = Math.min(99, (cart[id] ?? 0) + Number(form.elements.quantity.value));
    saveCart();
    byId("announcement").textContent = `${product.name} adicionada à sacola.`;
    showCart();
  });
}

function showCart(focusKey) {
  const items = Object.entries(cart).map(([id, quantity]) => ({...variants.get(id), id, quantity}));
  const total = items.reduce((sum, {product, quantity}) => sum + product.price * quantity, 0);
  const message = ["Olá! Gostaria de consultar estas peças da vitrine:", ...items.map(({product, variant, quantity}) =>
    `• ${quantity}× ${product.name} | ${variant.color} | Tamanho ${variant.size} | ${money(product.price * quantity)}`), `Total da seleção: ${money(total)}`].join("\n");
  const phone = store.whatsapp.replace(/\D/g, "");
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  openDialog(`<h2 id="dialog-title">Sua sacola</h2>${items.length ? `
    <ul class="cart-items">${items.map(({product, variant, id, quantity}) => `<li>
    <img src="${product.image}" alt="" width="64" height="64"><div><strong>${product.name}</strong><small>${variant.color} · Tam. ${variant.size} · ${money(product.price)}</small>
    <div class="quantity"><button type="button" data-item="${id}" data-delta="-1" aria-label="Diminuir quantidade de ${product.name}">−</button><span>${quantity}</span><button type="button" data-item="${id}" data-delta="1" aria-label="Aumentar quantidade de ${product.name}" ${quantity === 99 ? "disabled" : ""}>+</button></div></div></li>`).join("")}</ul>
    <p class="total">Total <strong>${money(total)}</strong></p>
    ${phone ? "" : "<p class='demo'>WhatsApp de teste. O link abre a seleção de contato até o número da loja ser configurado.</p>"}
    <a class="button" href="${url}" target="_blank" rel="noopener">Continuar no WhatsApp ↗</a>
    ` : '<p>Sua sacola está vazia. Escolha uma peça na vitrine para começar.</p><form method="dialog"><button class="button">Voltar à vitrine</button></form>'}`);
  if (focusKey) (dialog.querySelector(focusKey) ?? dialog.querySelector(".close button")).focus();
}

byId("category-list").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  category = button.dataset.category;
  render();
});

byId("show-all").addEventListener("click", () => { category = ""; render(); });
byId("products").addEventListener("click", event => {
  const button = event.target.closest("[data-product]");
  if (button) showProduct(catalog.find(item => item.id === button.dataset.product));
});
byId("bag").addEventListener("click", () => showCart());
byId("footer-bag").addEventListener("click", () => showCart());
dialog.addEventListener("click", event => {
  const button = event.target.closest("[data-item]");
  if (!button) return;
  const {item, delta} = button.dataset;
  cart[item] += Number(delta);
  if (!cart[item]) delete cart[item];
  saveCart();
  showCart(`[data-item="${item}"][data-delta="${delta}"]`);
});

byId("category-list").insertAdjacentHTML("beforeend", categories.map(([id, label, icon]) =>
  `<button type="button" data-category="${id}" aria-pressed="false">
    <span class="category-name">${label}</span>
    <span class="category-rain" aria-hidden="true"><i></i><i></i><i></i></span>
    <svg class="category-icon" viewBox="0 0 24 24" aria-hidden="true">
      <defs><clipPath id="shape-${id}"><path d="${icons[icon]}"/></clipPath></defs>
      <path class="category-outline" d="${icons[icon]}"/>
      <g clip-path="url(#shape-${id})">
        <path class="category-water" d="M0 4Q4 1 8 4T16 4T24 4V26H0Z"/>
      </g>
      <path d="${icons[icon]}"/>
    </svg>
  </button>`).join(""));
saveCart();
render();
new ResizeObserver(positionCloud).observe(byId("category-list"));
