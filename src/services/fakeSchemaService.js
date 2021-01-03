/* fake generic element service */
export const elements = [
  { _id: "5b21ca3eeb7f6fbccd471818", name: "A" },
  { _id: "5b21ca3eeb7f6fbccd471814", name: "B" },
  { _id: "5b21ca3eeb7f6fbccd471820", name: "C" }
];

export function getElements() {
  return elements.filter(e => e);
}