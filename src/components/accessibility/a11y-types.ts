export type A11yContrast = "default" | "high" | "invert" | "grayscale";

export type A11ySettings = {
  fontStep: 0 | 1 | 2 | 3;
  contrast: A11yContrast;
  highlightLinks: boolean;
  readableFont: boolean;
  stopAnimations: boolean;
  bigCursor: boolean;
  largeSpacing: boolean;
  underlineLinks: boolean;
};

export const A11Y_STORAGE_KEY = "doda-yona-a11y-v1";

export const DEFAULT_A11Y: A11ySettings = {
  fontStep: 0,
  contrast: "default",
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
  bigCursor: false,
  largeSpacing: false,
  underlineLinks: false,
};

export function applyA11yToDocument(settings: A11ySettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  root.dataset.a11yFont = String(settings.fontStep);
  root.dataset.a11yContrast = settings.contrast;

  root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
  root.classList.toggle("a11y-readable-font", settings.readableFont);
  root.classList.toggle("a11y-stop-animations", settings.stopAnimations);
  root.classList.toggle("a11y-big-cursor", settings.bigCursor);
  root.classList.toggle("a11y-large-spacing", settings.largeSpacing);
  root.classList.toggle("a11y-underline-links", settings.underlineLinks);
}
