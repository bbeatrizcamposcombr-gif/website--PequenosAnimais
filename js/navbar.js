const navbar = document.querySelector(".navbar");
const menuButton = document.querySelector(".navbar__menu-button");
const menu = document.querySelector("#navbar-menu");
const desktopQuery = window.matchMedia("(min-width: 768px)");

function isMenuOpen() {
  return menuButton.getAttribute("aria-expanded") === "true";
}

function setMenuOpen(isOpen) {
  menu.classList.toggle("navbar__nav--open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

if (navbar && menuButton && menu) {
  // O botão só aparece quando o script está ativo
  menuButton.hidden = false;

  menuButton.addEventListener("click", () => setMenuOpen(!isMenuOpen()));

  // Ao escolher um link da barra, a navegação segue normalmente e o menu fecha
  navbar.addEventListener("click", (event) => {
    if (event.target.closest("a") && isMenuOpen()) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  // Ao chegar no layout desktop, volta ao estado fechado
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) {
      setMenuOpen(false);
    }
  });
}
