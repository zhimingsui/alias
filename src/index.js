import { ShadowRootMode } from "./constant";
import "./styles/index.css";

export default class CustomMenu extends HTMLElement {
  #data = [];
  #style = "";
  #root = null;
  #shadowRoot = null;
  #wrapper = null;

  static get observedAttributes() {
    return ["data"];
  }

  static #instance = null;

  static getInstance() {
    if (!this.#instance) {
      this.#instance = new CustomMenu();
    }
    return this.#instance;
  }

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: ShadowRootMode.OPEN });

    this.#wrapper = this.#createWrapper();
    this.createStyle();
  }

  mount() {
    this.#shadowRoot.append(this.#style, this.#wrapper);
  }

  #createWrapper(data = this.#data) {
    const menuWrapper = document.createElement("ul");
    menuWrapper.setAttribute("class", "wrapper");
    if (data?.length) {
      const lis = data.map((item) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(item.title));
        console.log(item);
        if (item?.children && item.children?.length) {
          debugger;
          li.appendChild(this.#createWrapper(item.children));
        }
        return li;
      });
      menuWrapper.append(...lis);
    }

    return menuWrapper;
  }

  createStyle() {
    const style = document.createElement("style");

    style.textContent = `
        .wrapper {
          position: fixed;
          background:#fa1;
          display:none;
          z-index: 999;
        }
        .wrapper .wrapper {
            display:block;
            position: absolute;
            right:0;
            transform:translateX(100%);
        }
      `;

    return (this.#style = style);
  }

  connectedCallback() {
    this.#root = this.parentElement;
    this.#addListener();
  }
  disconnectedCallback() {
    this.#removeListener();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "data":
        this.#data = JSON.parse(newValue);
        this.#wrapper = this.#createWrapper();
        this.mount();
        break;

      default:
        break;
    }
  }

  #contextMenuListener(e /* :MouseEvent */) {
    e.preventDefault();
    e.stopPropagation();
    // e.stopImmediatePropagation();
    // console.log(e);
    const style = {
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      display: "block",
    };

    this.#wrapper.style.left = style.left;
    this.#wrapper.style.top = style.top;
    this.#wrapper.style.display = style.display;
  }

  #clickListener(e) {
    console.log(e);
    if (this.#wrapper.style.display !== "none") {
      this.#wrapper.style.display = "none";
    }
  }

  #removeListener() {
    this.parentElement.removeListener(this.#contextMenuListener);
    this.parentElement.removeListener(this.#clickListener);
  }

  #addListener() {
    this.#root.addEventListener(
      "contextmenu",
      this.#contextMenuListener.bind(this),
      true
    );
    this.#root.addEventListener("click", this.#clickListener.bind(this), true);
  }
}
customElements.define("custom-menu", CustomMenu);

const menuData = [{ title: "1", children: [{ title: "1.1" }] }, { title: "2" }];

const instance = CustomMenu.getInstance();
instance.setAttribute("data", JSON.stringify(menuData));
console.log(instance);
document.body.append(instance);
