/* =========================================================
   PREMIUM PIZZA – JavaScript
   ========================================================= */

const WHATSAPP_NUMBER = "38348310004";

/* ---------- MENU (ndrysho këtu sipas menusë sate) ---------- */
const MENU = [
  { id: 1, name: "Margarita", cat: "pica", price: 7, img: "images/margarita.jpg", tag: "Klasike",
    desc: "Salcë domate e gatuar në shtëpi, mocarelë e freskët, borzilok." },
  { id: 2, name: "Pepperoni", cat: "pica", price: 9, img: "images/pepperoni.jpg", tag: "Më e kërkuara", hot: true,
    desc: "Pepperoni i pjekur, djathë i dyfishtë, mjaltë djegëse." },
  { id: 3, name: "Premium Special", cat: "pica", price: 11, img: "images/special.jpg", tag: "Specialiteti", hot: true,
    desc: "Të gjitha përbërësit tanë të zgjedhur, në një pica." },
  { id: 4, name: "Capricciosa", cat: "pica", price: 10, img: "images/capricciosa.jpg", tag: "",
    desc: "Kërpudha, shpinaq, proshut i pjekur dhe ullinj." },
  { id: 5, name: "Quattro Formaggi", cat: "pica", price: 10, img: "images/formaggi.jpg", tag: "",
    desc: "Katër djathra të shkrirë në perfeksion." },
  { id: 6, name: "Pasta Carbonara", cat: "makarona", price: 8, img: "images/carbonara.jpg", tag: "Makarona",
    desc: "Kremë, proshut i tharë dhe parmixhano i rrahur." },
  { id: 7, name: "Pasta Bolognese", cat: "makarona", price: 8, img: "images/bolognese.jpg", tag: "Makarona",
    desc: "Mish i ngadalësuar me salcë domate të pasur." },
  { id: 8, name: "Sallatë Cezar", cat: "pije", price: 5, img: "images/cezar.jpg", tag: "E lehtë",
    desc: "Marule romaine, pulë e pjekur, kruton dhe salcë cezar." },
  { id: 9, name: "Coca-Cola 0.5L", cat: "pije", price: 2, img: "images/cola.jpg", tag: "",
    desc: "E ftohtë dhe e freskët." }
];

const cart = JSON.parse(localStorage.getItem("premiumCart") || "[]");

/* ---------- HELPERS ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const money = (n) => `${n.toFixed(2)} €`;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 2300);
}

/* ---------- PRELOADER + YEAR ---------- */
window.addEventListener("load", () => {
  setTimeout(() => $("#preloader").classList.add("hide"), 1200);
});
$("#year").textContent = new Date().getFullYear();

/* ---------- CUSTOM CURSOR ---------- */
(function cursor() {
  const dot = $("#cursor");
  const ring = $("#cursorRing");
  if (!dot || getComputedStyle(dot).display === "none") return;
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + "px"; dot.style.top = my + "px";
  });
  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
    requestAnimationFrame(loop);
  })();

  $$("a, button, .g-item, .menu-row").forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
})();

/* ---------- HEADER + SCROLL ---------- */
const header = $("#header");
const toTop = $("#toTop");
const navAnchors = $$(".nav-links a");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 60);
  toTop.classList.toggle("show", y > 600);

  const pos = y + window.innerHeight * 0.35;
  $$("main section[id]").forEach((sec) => {
    const inView = pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight;
    navAnchors.forEach((a) => {
      if (a.getAttribute("href") === "#" + sec.id) a.classList.toggle("active", inView);
    });
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* smooth anchor scroll with header offset */
$$('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    closeMobileMenu();
    window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
  });
});

/* ---------- MOBILE MENU ---------- */
const hamburger = $("#hamburger");
const navLinks = $("#navLinks");
function closeMobileMenu() {
  hamburger.classList.remove("open");
  navLinks.classList.remove("open");
}
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

/* ---------- HERO SLIDER ---------- */
(function hero() {
  const slides = $$(".slide");
  const dotsWrap = $("#dots");
  const INTERVAL = 7000;
  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = $$(".dot", dotsWrap);

  function go(i) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (i + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
    reset();
  }

  function reset() {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), INTERVAL);
  }

  $("#nextSlide").addEventListener("click", () => go(current + 1));
  $("#prevSlide").addEventListener("click", () => go(current - 1));

  document.addEventListener("keydown", (e) => {
    if ($("#lightbox").classList.contains("show")) return;
    if (e.key === "ArrowRight") go(current + 1);
    if (e.key === "ArrowLeft") go(current - 1);
  });

  let startX = 0;
  const slider = $("#slider");
  slider.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? current + 1 : current - 1);
  });

  slider.addEventListener("mouseenter", () => clearInterval(timer));
  slider.addEventListener("mouseleave", reset);
  reset();
})();

/* ---------- PIZZA ROTATION (JavaScript, rrotullohet vazhdimisht) ---------- */
(function spinPizza() {
  let angle = 0;
  const SPEED = 0.6; // gradë për frame (~10 sekonda një rreth)

  (function tick() {
    angle = (angle + SPEED) % 360;
    $$(".pizza-svg").forEach((p) => { p.style.transform = `rotate(${angle}deg)`; });
    requestAnimationFrame(tick);
  })();
})();

/* ---------- COUNTERS ---------- */
function countUp(el) {
  const target = +el.dataset.target;
  const dur = 1800;
  const t0 = performance.now();
  (function frame(now) {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.round(eased * target).toLocaleString("sq-AL");
    if (p < 1) requestAnimationFrame(frame);
  })(t0);
}

/* ---------- REVEAL ON SCROLL ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("visible");
    $$(".counter", en.target).forEach((c) => {
      if (!c.dataset.done) { c.dataset.done = 1; countUp(c); }
    });
    if (en.target.classList.contains("stat") || en.target.classList.contains("stats")) {
      // handled above
    }
    io.unobserve(en.target);
  });
}, { threshold: 0.18 });

$$(".reveal, .stats").forEach((el) => io.observe(el));

/* ---------- OPEN / CLOSED STATUS ---------- */
// 0 = e diel (mbyllur); 1..6 = e hënë..e shtunë
const HOURS = { 0: null, 1: [9, 0, 23, 30], 2: [9, 0, 23, 30], 3: [9, 0, 23, 30], 4: [9, 0, 23, 30], 5: [9, 0, 23, 30], 6: [9, 0, 23, 30] };
const DAYS = ["e diel", "e hënë", "e martë", "e mërkurë", "e enjte", "e premte", "e shtunë"];

function updateStatus() {
  const now = new Date();
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const el = $("#openStatus");

  $$(".hours-list li").forEach((li) => li.classList.toggle("today", +li.dataset.day === day));

  const h = HOURS[day];
  const open = h && mins >= h[0] * 60 + h[1] && mins < h[2] * 60 + h[3];
  if (open) {
    el.className = "status open";
    el.textContent = "Hapur tani · mbyllet në 23:30";
    return;
  }

  let next = "";
  for (let i = 0; i <= 7 && !next; i++) {
    const d = (day + i) % 7;
    if (!HOURS[d]) continue;
    if (i === 0 && mins < HOURS[d][0] * 60) next = "hapet sot në 09:00";
    else if (i === 1) next = "hapet nesër në 09:00";
    else if (i > 1) next = `hapet ${DAYS[d]} në 09:00`;
  }
  el.className = "status closed";
  el.textContent = "Mbyllur · " + next;
}
updateStatus();
setInterval(updateStatus, 60000);

/* ---------- MENU RENDER ---------- */
const menuList = $("#menuList");
const peek = $("#peek");

function renderMenu(filter = "all") {
  const items = MENU.filter((m) => filter === "all" || m.cat === filter);
  menuList.innerHTML = items.map((m, i) => `
    <li class="menu-row" data-id="${m.id}" data-img="${m.img}" style="transition-delay:${i * 60}ms">
      <div class="menu-thumb"><svg class="pizza-svg" viewBox="0 0 200 200"><use href="#pizza"/></svg><img class="thumb-img" src="${m.img}" alt="${m.name}" onerror="this.remove()"></div>
      <div class="menu-main">
        <h3>${m.name}${m.tag ? ` <span class="badge${m.hot ? " hot" : ""}">${m.tag}</span>` : ""}</h3>
        <p>${m.desc}</p>
      </div>
      <div class="menu-price">${m.price}<small>€</small></div>
      <button class="add" data-id="${m.id}" aria-label="Shto ${m.name}">+</button>
    </li>`).join("");

  // animate rows in
  requestAnimationFrame(() => {
    $$(".menu-row", menuList).forEach((row) => requestAnimationFrame(() => row.classList.add("in")));
  });
}

$$(".filter-btn").forEach((b) => b.addEventListener("click", () => {
  $$(".filter-btn").forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  renderMenu(b.dataset.filter);
}));

/* hover preview image that follows the cursor */
menuList.addEventListener("mouseover", (e) => {
  const row = e.target.closest(".menu-row");
  if (!row) return;
  const peekImg = $("#peekImg");
  peekImg.onerror = () => { peekImg.style.display = "none"; };
  peekImg.style.display = "";
  peekImg.src = row.dataset.img;
  peek.classList.add("show");
});
menuList.addEventListener("mouseleave", () => peek.classList.remove("show"));
menuList.addEventListener("mousemove", (e) => {
  peek.style.left = e.clientX + 110 + "px";
  peek.style.top = e.clientY + "px";
});

menuList.addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) {
    const row = e.target.closest(".menu-row");
    if (row) openDish(+row.dataset.id);
    return;
  }
  addToCart(+btn.dataset.id);
  btn.classList.add("done");
  btn.textContent = "✓";
  setTimeout(() => { btn.classList.remove("done"); btn.textContent = "+"; }, 700);
});

renderMenu();

/* ---------- DISH DETAIL (modal me foto, + / -, shto në shportë) ---------- */
const dishModal = $("#dishModal");
let dishItem = null;
let dishQty = 1;

function openDish(id) {
  const m = MENU.find((x) => x.id === id);
  if (!m) return;
  dishItem = m;
  dishQty = 1;

  const img = $("#dishImg");
  img.style.display = "";
  img.onerror = () => { img.style.display = "none"; };
  img.src = m.img;

  $("#dishName").textContent = m.name;
  $("#dishDesc").textContent = m.desc;
  $("#dishTag").textContent = m.tag || "Menu";
  renderDish();

  dishModal.classList.add("show");
  dishModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDish() {
  dishModal.classList.remove("show");
  dishModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderDish() {
  const total = dishItem.price * dishQty;
  $("#dishQty").textContent = dishQty;
  $("#dishPrice").textContent = money(total);
  $("#dishAdd").textContent = `Shto në shportë · ${money(total)}`;
}

$("#dishPlus").addEventListener("click", () => { dishQty = Math.min(dishQty + 1, 99); renderDish(); });
$("#dishMinus").addEventListener("click", () => { dishQty = Math.max(dishQty - 1, 1); renderDish(); });
$("#dishAdd").addEventListener("click", () => {
  addToCart(dishItem.id, dishQty);
  closeDish();
});
$("#dishClose").addEventListener("click", closeDish);
dishModal.addEventListener("click", (e) => { if (e.target === dishModal) closeDish(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && dishModal.classList.contains("show")) closeDish();
});

/* ---------- CART ---------- */
const cartEl = $("#cart");
const overlay = $("#overlay");
const cartItemsEl = $("#cartItems");
const cartCount = $("#cartCount");
const cartTotal = $("#cartTotal");
const cartBtn = $("#cartBtn");
const orderLink = $("#orderWhatsapp");

function save() { localStorage.setItem("premiumCart", JSON.stringify(cart)); }

function addToCart(id, n = 1) {
  const item = cart.find((c) => c.id === id);
  if (item) item.qty += n;
  else {
    const p = MENU.find((m) => m.id === id);
    cart.push({ id, name: p.name, price: p.price, qty: n });
  }
  save();
  renderCart();
  toast("✓ U shtua në porosi");
  cartBtn.classList.remove("bump");
  void cartBtn.offsetWidth;
  cartBtn.classList.add("bump");
}

function changeQty(id, d) {
  const item = cart.find((c) => c.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  save(); renderCart();
}

function removeItem(id) {
  const i = cart.findIndex((c) => c.id === id);
  if (i > -1) cart.splice(i, 1);
  save(); renderCart();
}

function renderCart() {
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  cartCount.textContent = count;
  cartCount.classList.toggle("show", count > 0);
  cartTotal.textContent = money(total);

  cartItemsEl.innerHTML = cart.length
    ? cart.map((c) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${c.name}</h4>
          <small>${money(c.price)} × ${c.qty}</small>
        </div>
        <div class="qty">
          <button data-act="dec" data-id="${c.id}" aria-label="Ulo">−</button>
          <span>${c.qty}</span>
          <button data-act="inc" data-id="${c.id}" aria-label="Rrit">+</button>
        </div>
        <button class="remove" data-act="rm" data-id="${c.id}" aria-label="Hiq">&times;</button>
      </div>`).join("")
    : `<p class="cart-empty">Porosia juaj është bosh.<br>Zgjidh një pica nga menuja.</p>`;

  const lines = cart.map((c) => `• ${c.name} x${c.qty} = ${money(c.price * c.qty)}`).join("\n");
  const text = `Përshëndetje! Dua të porosis:\n${lines}\n\nTotali: ${money(total)}`;
  orderLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

cartItemsEl.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-act]");
  if (!b) return;
  const id = +b.dataset.id;
  if (b.dataset.act === "inc") changeQty(id, 1);
  if (b.dataset.act === "dec") changeQty(id, -1);
  if (b.dataset.act === "rm") removeItem(id);
});

$("#clearCart").addEventListener("click", () => {
  cart.length = 0; save(); renderCart(); toast("Porosia u pastrua");
});

orderLink.addEventListener("click", (e) => {
  if (!cart.length) { e.preventDefault(); toast("Shto të paktën një produkt"); }
});

function openCart() {
  cartEl.classList.add("open");
  overlay.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartEl.classList.remove("open");
  overlay.classList.remove("show");
  document.body.style.overflow = "";
}
cartBtn.addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
renderCart();

/* ---------- GALLERY LIGHTBOX ---------- */
(function lightbox() {
  const box = $("#lightbox");
  const img = $("#lbImg");
  const items = $$(".g-item");
  let idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    img.style.backgroundImage = `url('${items[idx].dataset.img}')`;
  }
  function open(i) {
    show(i);
    box.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function close() {
    box.classList.remove("show");
    document.body.style.overflow = "";
  }

  items.forEach((el, i) => el.addEventListener("click", () => open(i)));
  $("#lbClose").addEventListener("click", close);
  $("#lbNext").addEventListener("click", () => show(idx + 1));
  $("#lbPrev").addEventListener("click", () => show(idx - 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
  document.addEventListener("keydown", (e) => {
    if (!box.classList.contains("show")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });
})();

/* ---------- CONTACT FORM ---------- */
const form = $("#contactForm");
if (form) {

function setState(input, ok, msg = "") {
  const f = input.closest(".field");
  f.classList.toggle("invalid", !ok);
  f.classList.toggle("valid", ok);
  f.querySelector(".error").textContent = msg;
  return ok;
}

function validate(input) {
  const v = input.value.trim();
  switch (input.id) {
    case "name":
      return setState(input, v.length >= 2, "Shkruani emrin tuaj");
    case "phone":
      return setState(input, /^[+0-9\s]{6,20}$/.test(v), "Numër telefoni i pavlefshëm");
    case "message":
      return setState(input, v.length >= 5, "Mesazhi është shumë i shkurtër");
  }
  return true;
}

$$("input, textarea", form).forEach((el) => {
  el.addEventListener("blur", () => validate(el));
  el.addEventListener("input", () => {
    if (el.closest(".field").classList.contains("invalid")) validate(el);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = $$("input, textarea", form).map(validate).every(Boolean);
  if (!ok) { toast("Ju lutem plotësoni fushat"); return; }

  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = "Duke dërguar…";
  setTimeout(() => {
    toast("Faleminderit! Do t'ju kontaktojmë së shpejti.");
    form.reset();
    $$(".field", form).forEach((f) => f.classList.remove("valid", "invalid"));
    btn.disabled = false;
    btn.textContent = "Dërgo mesazhin";
  }, 1200);
});
}