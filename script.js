// ======== ANIMAÇÃO DE FUNDO (pontos conectados) ========
const canvas = document.getElementById("bg-animation");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor(x, y, size, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speedX = speedX;
    this.speedY = speedY;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particlesArray = [];
  for (let i = 0; i < 100; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const speedX = (Math.random() - 0.5) * 0.8;
    const speedY = (Math.random() - 0.5) * 0.8;
    particlesArray.push(new Particle(x, y, size, speedX, speedY));
  }
}

function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.strokeStyle = "rgba(56,189,248,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function navBar() {
  const menuToggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");
  const menuLinks = document.querySelectorAll("#menu a");

  // Abrir / fechar menu pelo hamburguer
  menuToggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  // Fechar menu ao clicar em qualquer link (mobile)
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
    });
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach((p) => {
    p.update();
    p.draw();
  });
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

let indexProjeto = 0;
let autoplayProjetos;
const autoplayIntervalo = 4000;

/* ===== MOVER PROJETOS ===== */
function moverProjetos(direcao) {
  const slider = document.getElementById("projetosSlider");
  const card = slider.querySelector(".projeto-card");
  const gap = 30;
  const largura = card.offsetWidth + gap;

  indexProjeto += direcao;

  if (indexProjeto < 0) indexProjeto = slider.children.length - 1;
  if (indexProjeto >= slider.children.length) indexProjeto = 0;

  slider.scrollTo({
    left: indexProjeto * largura,
    behavior: "smooth",
  });

  atualizarDots();
}

/* ===== DOTS ===== */
function criarDots() {
  const slider = document.getElementById("projetosSlider");
  const dotsContainer = document.getElementById("projetosDots");

  dotsContainer.innerHTML = "";

  [...slider.children].forEach((_, i) => {
    const dot = document.createElement("button");

    dot.addEventListener("click", () => {
      indexProjeto = i;
      moverProjetos(0);
      reiniciarAutoplay();
    });

    dotsContainer.appendChild(dot);
  });

  atualizarDots();
}

function atualizarDots() {
  const dots = document.querySelectorAll("#projetosDots button");
  dots.forEach((dot, i) => {
    dot.classList.toggle("ativo", i === indexProjeto);
  });
}

/* ===== SINCRONIZA COM SCROLL MANUAL ===== */
function sincronizarScroll() {
  const slider = document.getElementById("projetosSlider");
  const card = slider.querySelector(".projeto-card");
  const gap = 30;
  const largura = card.offsetWidth + gap;

  indexProjeto = Math.round(slider.scrollLeft / largura);
  atualizarDots();
}

/* ===== AUTOPLAY ===== */
function iniciarAutoplay() {
  autoplayProjetos = setInterval(() => {
    moverProjetos(1);
  }, autoplayIntervalo);
}

function pararAutoplay() {
  clearInterval(autoplayProjetos);
}

function reiniciarAutoplay() {
  pararAutoplay();
  iniciarAutoplay();
}

async function carregarProjetos() {
  const slider = document.getElementById("projetosSlider");

  try {
    const response = await fetch("projetos.json");
    const projetos = await response.json();

    slider.innerHTML = "";

    projetos.forEach((projeto) => {
      const card = document.createElement("div");
      card.className = "projeto-card";

      card.innerHTML = `
        <div class="projeto-imagem">
          <img src="${projeto.imagem}" alt="${projeto.titulo}">
        </div>

        <div class="projeto-info">
          <h3>${projeto.titulo}</h3>
          <p>${projeto.descricao}</p>

          <div class="techs">
            ${projeto.tecnologias.map((t) => `<span>${t}</span>`).join("")}
          </div>

          <a href="${
            projeto.link
          }" target="_blank" class="btn-codigo">Ver projeto</a>
        </div>
      `;

      slider.appendChild(card);
    });

    // IMPORTANTE
    criarDots();
    iniciarAutoplay();
  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
  }
}

/* ===== INIT GERAL ===== */
document.addEventListener("DOMContentLoaded", () => {
  init();
  animate();
  navBar();

  const slider = document.getElementById("projetosSlider");

  carregarProjetos();

  slider.addEventListener("scroll", sincronizarScroll);
  slider.addEventListener("mouseenter", pararAutoplay);
  slider.addEventListener("mouseleave", iniciarAutoplay);
  slider.addEventListener("touchstart", pararAutoplay);
  slider.addEventListener("touchend", iniciarAutoplay);
});

const texto = "Olá, sou Kaiky da Silva Barbosa,";
const typingElement = document.getElementById("typing");
let index = 0;

function escrever() {
  if (index < texto.length) {
    typingElement.textContent += texto.charAt(index);
    index++;
    setTimeout(escrever, 100); // 100ms entre cada letra
  }
}

document.addEventListener("DOMContentLoaded", () => {
  escrever();
});
