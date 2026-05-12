import { Browser } from 'happy-dom';

const browser = new Browser();
const window = browser.defaultContext.newPage().mainFrame.window;

Object.assign(globalThis, {
  window,
  document: window.document,
  navigator: window.navigator,
  HTMLElement: window.HTMLElement,
  Node: window.Node,
  customElements: window.customElements,
});
