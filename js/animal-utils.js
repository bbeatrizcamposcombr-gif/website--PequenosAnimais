// Utilitários de apresentação de dados de Animal, compartilhados pelas páginas
// que exibem animais. Só regras pequenas de formatação (e um auxiliar de DOM).

const SEX_LABELS = Object.freeze({
  female: "Fêmea",
  male: "Macho",
});

const STATUS_LABELS = Object.freeze({
  available: "Disponível",
  reserved: "Reservado",
});

// Animais que possuem página publicada: slug do registro → caminho a partir da raiz do projeto.
// Ter slug no JSON não significa ter página: só entra aqui o que realmente existe.
const ANIMAL_PAGES = Object.freeze({
  "cookie-hamster-sirio": "animais/cookie/",
});

// Valores desconhecidos ou que não são texto viram undefined (quem chama omite a informação)
function translate(labels, value) {
  return typeof value === "string" && Object.hasOwn(labels, value) ? labels[value] : undefined;
}

// Idade em meses → texto. Só aceita número inteiro positivo; qualquer outro valor devolve undefined.
export function formatAge(months) {
  if (!Number.isInteger(months) || months <= 0) {
    return undefined;
  }
  return months === 1 ? "1 mês" : `${months} meses`;
}

export function getSexLabel(value) {
  return translate(SEX_LABELS, value);
}

export function getStatusLabel(value) {
  return translate(STATUS_LABELS, value);
}

// Caminho da página publicada do animal (relativo à raiz do projeto) ou undefined se não houver.
// Quem chama decide como chegar até lá (cada página sabe a própria profundidade).
export function getAnimalPagePath(slug) {
  return translate(ANIMAL_PAGES, slug);
}

// foto.jpg → foto-640.jpg
export function getSmallImagePath(path) {
  return path.replace(/(\.\w+)$/, "-640$1");
}

export function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}
