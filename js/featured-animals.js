import {
  createElement,
  formatAge,
  getAnimalPagePath,
  getSexLabel,
  getSmallImagePath,
  getStatusLabel,
} from "./animal-utils.js";

const ANIMALS_URL = "data/animals.json";

// Todas as fotos seguem o padrão: foto.jpg (1200x900) e foto-640.jpg (640x480)
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 900;
const IMAGE_SIZES = "(min-width: 1024px) 362px, (min-width: 768px) 46vw, 100vw";

const MESSAGES = {
  loading: "Carregando animais...",
  empty: "Nenhum animal em destaque no momento.",
  error: "Não foi possível carregar os animais em destaque.",
};

const statusElement = document.querySelector("#featured-animals-status");
const listElement = document.querySelector("#featured-animals-list");

// DOM

function createAnimalImage(animal) {
  const image = createElement("img", "animal-card__image");

  image.loading = "lazy";
  image.decoding = "async";
  image.width = IMAGE_WIDTH;
  image.height = IMAGE_HEIGHT;
  image.alt = animal.breed
    ? `Fotografia ilustrativa de ${animal.breed}.`
    : "Fotografia ilustrativa.";
  image.sizes = IMAGE_SIZES;
  image.srcset = `${getSmallImagePath(animal.image)} 640w, ${animal.image} ${IMAGE_WIDTH}w`;
  image.src = animal.image;

  // Se a versão reduzida não existir, usa só a imagem principal
  image.addEventListener("error", () => image.removeAttribute("srcset"));

  return image;
}

function createAnimalMeta(animal) {
  const age = formatAge(animal.ageMonths);
  const sex = getSexLabel(animal.sex);

  const meta = createElement("p", "animal-card__meta");
  for (const text of [age, sex]) {
    if (text) {
      meta.append(createElement("span", "", text));
    }
  }
  return meta;
}

function createAnimalStatus(animal) {
  const label = getStatusLabel(animal.status);
  if (!label) {
    return null;
  }
  return createElement("p", `animal-card__status animal-card__status--${animal.status}`, label);
}

function createAnimalCard(animal) {
  if (!animal.name) {
    throw new Error(`Registro incompleto (id: ${animal.id})`);
  }

  // Só quem tem página publicada vira link (um único <a>, que cobre o card todo via CSS)
  const pagePath = getAnimalPagePath(animal.slug);
  const content = pagePath
    ? createElement("a", "animal-card__content animal-card__link")
    : createElement("div", "animal-card__content");
  if (pagePath) {
    content.href = pagePath;
  }
  content.append(
    ...[
      animal.breed && createElement("p", "animal-card__species", animal.breed),
      createElement("h3", "animal-card__name", animal.name),
      createAnimalMeta(animal),
      animal.description && createElement("p", "animal-card__description", animal.description),
      createAnimalStatus(animal),
    ].filter(Boolean),
  );

  // A fotografia é opcional: sem image, o card mostra só o conteúdo
  const card = createElement("article", pagePath ? "animal-card animal-card--linked" : "animal-card");
  if (animal.image) {
    const media = createElement("div", "animal-card__media");
    media.append(createAnimalImage(animal));
    card.append(media);
  }
  card.append(content);

  const item = document.createElement("li");
  item.append(card);
  return item;
}

// Estados e renderização

function showMessage(text) {
  statusElement.textContent = text;
  statusElement.hidden = false;
  listElement.hidden = true;
  listElement.removeAttribute("aria-busy");
}

function renderFeaturedAnimals(animals) {
  if (animals.length === 0) {
    showMessage(MESSAGES.empty);
    return;
  }

  const cards = [];
  for (const animal of animals) {
    try {
      cards.push(createAnimalCard(animal));
    } catch (error) {
      console.error("Animal ignorado:", error);
    }
  }

  if (cards.length === 0) {
    showMessage(MESSAGES.error);
    return;
  }

  listElement.replaceChildren(...cards);
  listElement.removeAttribute("aria-busy");
  listElement.hidden = false;
  statusElement.textContent = "";
  statusElement.hidden = true;
}

// Carregamento

async function loadFeaturedAnimals() {
  statusElement.textContent = MESSAGES.loading;
  statusElement.hidden = false;

  try {
    const response = await fetch(ANIMALS_URL);
    if (!response.ok) {
      throw new Error(`Resposta HTTP ${response.status} ao carregar ${ANIMALS_URL}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.animals)) {
      throw new Error(`${ANIMALS_URL} não possui um array "animals"`);
    }

    const featured = data.animals.filter((animal) => animal && animal.featured === true);
    renderFeaturedAnimals(featured);
  } catch (error) {
    console.error("Falha ao carregar os animais em destaque:", error);
    showMessage(MESSAGES.error);
  }
}

if (statusElement && listElement) {
  loadFeaturedAnimals();
}
