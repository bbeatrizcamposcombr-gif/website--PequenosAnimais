import {
  createElement,
  formatAge,
  getAnimalPagePath,
  getSexLabel,
  getSmallImagePath,
  getStatusLabel,
} from "./animal-utils.js";

// Esta página fica em especies/hamsters/. Os caminhos dos JSON e das imagens
// são relativos à raiz do projeto, e esta constante os resolve em um só ponto.
const ROOT = "../../";
const SPECIES_ID = "hamster";

const IMAGE_SIZES = "(min-width: 1024px) 362px, (min-width: 768px) 46vw, 100vw";
const HERO_IMAGE_SIZES = "(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw";

const MESSAGES = {
  loadingSpecies: "Carregando informações...",
  speciesError: "Não foi possível carregar as informações desta espécie.",
  loadingAnimals: "Carregando animais...",
  animalsEmpty: "Nenhum hamster está sendo apresentado no momento.",
  animalsError: "Não foi possível carregar os animais desta espécie.",
  noPhoto: "Fotografia indisponível",
};

const heroElement = document.querySelector("#species-hero");
const titleElement = document.querySelector("#species-title");
const summaryElement = document.querySelector("#species-summary");
const mediaElement = document.querySelector("#species-media");
const animalsStatusElement = document.querySelector("#species-animals-status");
const animalsListElement = document.querySelector("#species-animals-list");

// Utilitários

function fromRoot(path) {
  return ROOT + path;
}

async function fetchJson(path) {
  const response = await fetch(fromRoot(path));
  if (!response.ok) {
    throw new Error(`Resposta HTTP ${response.status} ao carregar ${path}`);
  }
  return response.json();
}

// Identidade da espécie (data/species.json)

function renderSpeciesImage(species) {
  const path = fromRoot(species.image);
  const image = createElement("img", "species-hero__image");

  image.width = 1200;
  image.height = 900;
  image.alt = species.imageAlt || "";
  image.sizes = HERO_IMAGE_SIZES;
  image.srcset = `${getSmallImagePath(path)} 640w, ${path} 1200w`;
  image.src = path;
  image.fetchPriority = "high";
  image.decoding = "async";

  // Se a versão reduzida não existir, usa só a imagem principal
  image.addEventListener("error", () => image.removeAttribute("srcset"));

  mediaElement.replaceChildren(image);
}

function renderSpecies(species) {
  if (species.namePlural) {
    titleElement.textContent = species.namePlural;
  }

  if (species.summary) {
    summaryElement.textContent = species.summary;
  }

  if (species.image) {
    renderSpeciesImage(species);
  } else {
    mediaElement.hidden = true;
  }
}

async function loadSpecies() {
  heroElement.setAttribute("aria-busy", "true");
  summaryElement.textContent = MESSAGES.loadingSpecies;
  summaryElement.hidden = false;
  mediaElement.hidden = false;

  try {
    const data = await fetchJson("data/species.json");
    if (!data || !Array.isArray(data.species)) {
      throw new Error('data/species.json não possui um array "species"');
    }

    const species = data.species.find((item) => item && item.id === SPECIES_ID);
    if (!species) {
      throw new Error(`Espécie "${SPECIES_ID}" não encontrada em data/species.json`);
    }

    renderSpecies(species);
  } catch (error) {
    console.error("Falha ao carregar a espécie:", error);
    summaryElement.textContent = MESSAGES.speciesError;
    mediaElement.hidden = true;
  } finally {
    heroElement.removeAttribute("aria-busy");
  }
}

// Animais da espécie (data/animals.json)
// O card segue o mesmo desenho do da Home (featured-animals.js), mantido em cópia para cada página evoluir sozinha.

function createAnimalImage(animal) {
  const path = fromRoot(animal.image);
  const image = createElement("img", "animal-card__image");

  image.loading = "lazy";
  image.decoding = "async";
  image.width = 1200;
  image.height = 900;
  image.alt = animal.breed
    ? `Fotografia ilustrativa de ${animal.breed}.`
    : "Fotografia ilustrativa.";
  image.sizes = IMAGE_SIZES;
  image.srcset = `${getSmallImagePath(path)} 640w, ${path} 1200w`;
  image.src = path;

  // Primeiro tenta só a imagem principal; se ela também falhar, mostra um espaço reservado
  image.addEventListener("error", () => {
    if (image.hasAttribute("srcset")) {
      image.removeAttribute("srcset");
      return;
    }
    image.replaceWith(createElement("span", "species-animals__no-photo", MESSAGES.noPhoto));
  });

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
    content.href = fromRoot(pagePath);
  }

  // breed aparece só como texto de exibição: não é usado para filtrar nem agrupar
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

function showAnimalsMessage(text) {
  animalsStatusElement.textContent = text;
  animalsStatusElement.hidden = false;
  animalsListElement.hidden = true;
  animalsListElement.removeAttribute("aria-busy");
}

function renderAnimals(animals) {
  if (animals.length === 0) {
    showAnimalsMessage(MESSAGES.animalsEmpty);
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
    showAnimalsMessage(MESSAGES.animalsError);
    return;
  }

  animalsListElement.replaceChildren(...cards);
  animalsListElement.removeAttribute("aria-busy");
  animalsListElement.hidden = false;
  animalsStatusElement.textContent = "";
  animalsStatusElement.hidden = true;
}

async function loadAnimals() {
  animalsListElement.setAttribute("aria-busy", "true");
  animalsStatusElement.textContent = MESSAGES.loadingAnimals;
  animalsStatusElement.hidden = false;

  try {
    const data = await fetchJson("data/animals.json");
    if (!data || !Array.isArray(data.animals)) {
      throw new Error('data/animals.json não possui um array "animals"');
    }

    // A relação com a espécie é só species === id (sem usar breed, ids ou posição)
    const animals = data.animals.filter((animal) => animal && animal.species === SPECIES_ID);
    renderAnimals(animals);
  } catch (error) {
    console.error("Falha ao carregar os animais:", error);
    showAnimalsMessage(MESSAGES.animalsError);
  }
}

// Cada carga cuida do próprio erro: a falha de uma não derruba a outra
if (heroElement && animalsStatusElement && animalsListElement) {
  loadSpecies();
  loadAnimals();
}
