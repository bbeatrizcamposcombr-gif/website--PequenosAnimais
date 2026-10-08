import { createElement, formatAge, getSexLabel, getSmallImagePath, getStatusLabel } from "./animal-utils.js";

// Esta página fica em animais/cookie/. Os caminhos dos JSON e das imagens são
// relativos à raiz do projeto, e fromRoot() os resolve em um só ponto.
const ROOT = "../../";

// Única informação de identidade da página; todo o resto vem dos JSON
const ANIMAL_SLUG = "cookie-hamster-sirio";

const MESSAGES = {
  loadingAnimal: "Carregando informações...",
  animalError: "Não foi possível carregar as informações deste animal.",
  animalNotFound: "Não foi possível encontrar este animal.",
  loadingSpecies: "Carregando informações da espécie...",
  speciesError: "Não foi possível carregar as informações da espécie.",
  speciesNotFound: "Não foi possível encontrar a espécie deste animal.",
  speciesUnavailable: "As informações da espécie não estão disponíveis no momento.",
  noPhoto: "Fotografia indisponível",
};

const profileElement = document.querySelector("#animal-profile");
const titleElement = document.querySelector("#animal-title");
const mediaElement = document.querySelector("#animal-media");
const labelElement = document.querySelector("#animal-label");
const metaElement = document.querySelector("#animal-meta");
const statusElement = document.querySelector("#animal-status");
const messageElement = document.querySelector("#animal-message");
const detailsElement = document.querySelector("#animal-details");
const descriptionElement = document.querySelector("#animal-description");
const factsElement = document.querySelector("#animal-facts");
const speciesMessageElement = document.querySelector("#species-message");
const speciesContentElement = document.querySelector("#species-content");

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

// Devolve o texto limpo ou undefined: evita mostrar vazio, null ou objetos
function cleanText(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

// Perfil do animal (data/animals.json)

function showProfileMessage(text) {
  messageElement.textContent = text;
  messageElement.hidden = false;
}

function renderImage(animal) {
  const imagePath = cleanText(animal.image);
  if (!imagePath) {
    mediaElement.hidden = true;
    return;
  }

  const path = fromRoot(imagePath);
  const breed = cleanText(animal.breed);
  const image = createElement("img", "animal-profile__image");

  image.width = 1200;
  image.height = 900;
  image.alt = breed ? `Fotografia ilustrativa de ${breed}.` : "Fotografia ilustrativa.";
  image.sizes = "(min-width: 768px) 50vw, 100vw";
  image.srcset = `${getSmallImagePath(path)} 640w, ${path} 1200w`;
  image.src = path;
  image.fetchPriority = "high";
  image.decoding = "async";

  // Primeiro tenta só a imagem principal; se ela também falhar, mostra um espaço reservado
  image.addEventListener("error", () => {
    if (image.hasAttribute("srcset")) {
      image.removeAttribute("srcset");
      return;
    }
    image.replaceWith(createElement("span", "animal-profile__no-photo", MESSAGES.noPhoto));
  });

  mediaElement.replaceChildren(image);
  mediaElement.hidden = false;
}

function renderMeta(animal) {
  const texts = [formatAge(animal.ageMonths), getSexLabel(animal.sex)].filter(Boolean);
  if (texts.length === 0) {
    metaElement.hidden = true;
    return;
  }
  metaElement.replaceChildren(...texts.map((text) => createElement("span", "", text)));
  metaElement.hidden = false;
}

function renderStatus(animal) {
  const label = getStatusLabel(animal.status);
  if (!label) {
    statusElement.hidden = true;
    return;
  }
  statusElement.className = `animal-profile__status animal-profile__status--${animal.status}`;
  statusElement.textContent = label;
  statusElement.hidden = false;
}

function renderLabel(animal) {
  // breed é só um rótulo de exibição
  const breed = cleanText(animal.breed);
  labelElement.textContent = breed || "";
  labelElement.hidden = !breed;
}

function renderFacts(animal) {
  const rows = [
    ["Idade", formatAge(animal.ageMonths)],
    ["Sexo", getSexLabel(animal.sex)],
    ["Identificação", cleanText(animal.breed)],
    ["Status", getStatusLabel(animal.status)],
  ].filter(([, value]) => value);

  if (rows.length === 0) {
    factsElement.hidden = true;
    return;
  }

  factsElement.replaceChildren(
    ...rows.map(([label, value]) => {
      const row = createElement("div", "animal-facts__row");
      row.append(createElement("dt", "animal-facts__label", label), createElement("dd", "animal-facts__value", value));
      return row;
    }),
  );
  factsElement.hidden = false;
}

function renderDescription(animal) {
  const description = cleanText(animal.description);
  descriptionElement.textContent = description || "";
  descriptionElement.hidden = !description;
}

function renderAnimal(animal) {
  const name = cleanText(animal.name);
  if (name) {
    titleElement.textContent = name;
  }

  renderImage(animal);
  renderLabel(animal);
  renderMeta(animal);
  renderStatus(animal);
  renderDescription(animal);
  renderFacts(animal);

  // Não deixa um título sozinho: cada bloco só aparece se tiver conteúdo
  descriptionElement.parentElement.hidden = descriptionElement.hidden;
  factsElement.parentElement.hidden = factsElement.hidden;
  detailsElement.hidden = descriptionElement.hidden && factsElement.hidden;

  messageElement.hidden = true;
}

// Devolve o animal encontrado (ou null) para a carga da espécie
async function loadAnimal() {
  profileElement.setAttribute("aria-busy", "true");
  showProfileMessage(MESSAGES.loadingAnimal);
  mediaElement.hidden = false;

  try {
    const data = await fetchJson("data/animals.json");
    if (!data || !Array.isArray(data.animals)) {
      throw new Error('data/animals.json não possui um array "animals"');
    }

    // O animal é localizado pelo slug da página (sem usar id nem posição)
    const animal = data.animals.find((item) => item && item.slug === ANIMAL_SLUG);
    if (!animal) {
      console.error(`Animal "${ANIMAL_SLUG}" não encontrado em data/animals.json`);
      mediaElement.hidden = true;
      showProfileMessage(MESSAGES.animalNotFound);
      return null;
    }

    renderAnimal(animal);
    return animal;
  } catch (error) {
    console.error("Falha ao carregar o animal:", error);
    mediaElement.hidden = true;
    showProfileMessage(MESSAGES.animalError);
    return null;
  } finally {
    profileElement.removeAttribute("aria-busy");
  }
}

// Espécie do animal (data/species.json)

function showSpeciesMessage(text) {
  speciesMessageElement.textContent = text;
  speciesMessageElement.hidden = false;
  speciesContentElement.hidden = true;
}

function renderSpecies(species) {
  const name = cleanText(species.namePlural) || cleanText(species.name);
  const summary = cleanText(species.summary);
  const slug = cleanText(species.slug);
  // O endereço da página da espécie vem do slug do registro
  const hasPage = slug && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);

  const children = [
    name && createElement("h3", "animal-species__name", name),
    summary && createElement("p", "animal-species__summary", summary),
  ];

  if (hasPage) {
    const link = createElement("a", "animal-species__link", name ? `Ver página de ${name}` : "Ver página da espécie");
    link.href = fromRoot(`especies/${slug}/`);
    children.push(link);
  }

  const content = children.filter(Boolean);
  if (content.length === 0) {
    showSpeciesMessage(MESSAGES.speciesUnavailable);
    return;
  }

  speciesContentElement.replaceChildren(...content);
  speciesContentElement.hidden = false;
  speciesMessageElement.hidden = true;
}

async function loadSpecies(animal) {
  if (!animal) {
    showSpeciesMessage(MESSAGES.speciesUnavailable);
    return;
  }

  const speciesId = cleanText(animal.species);
  if (!speciesId) {
    showSpeciesMessage(MESSAGES.speciesNotFound);
    return;
  }

  speciesMessageElement.textContent = MESSAGES.loadingSpecies;
  speciesMessageElement.hidden = false;

  try {
    const data = await fetchJson("data/species.json");
    if (!data || !Array.isArray(data.species)) {
      throw new Error('data/species.json não possui um array "species"');
    }

    // A relação é só species.id === animal.species (breed não participa)
    const species = data.species.find((item) => item && item.id === speciesId);
    if (!species) {
      console.error(`Espécie "${speciesId}" não encontrada em data/species.json`);
      showSpeciesMessage(MESSAGES.speciesNotFound);
      return;
    }

    renderSpecies(species);
  } catch (error) {
    console.error("Falha ao carregar a espécie:", error);
    showSpeciesMessage(MESSAGES.speciesError);
  }
}

// A falha da espécie não apaga o perfil do animal
async function init() {
  detailsElement.hidden = true;
  const animal = await loadAnimal();
  await loadSpecies(animal);
}

if (profileElement && detailsElement && messageElement && speciesMessageElement) {
  init();
}
