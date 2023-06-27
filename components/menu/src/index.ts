type MenuItem = {
  key?: symbol;
  icon?: string;
  title: string;
  desc?: string;
  children?: MenuItem;
  listener: (e: MouseEvent) => void;
};

class Menu extends HTMLElement {
  #items: MenuItem[] = [];
  #root: HTMLElement = document.body;

  constructor(menu: MenuItem[], root?: HTMLElement) {
    super();
    this.#items = menu;
    if (root) this.#root = root;
    this.#init();
  }

  #init() {
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = this.#createWrapper();

    const style = this.#createStyle();

    console.log(style.isConnected);
    shadow.append(wrapper, style);
    this.#root.appendChild(shadow);
  }

  #createWrapper() {
    const menuWrapper = document.createElement("ul");
    menuWrapper.setAttribute("class", "wrapper");

    const menuItemWrappers = this.#items.map((item) => {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(item.title));
      if (li?.children && li.children.length) {
        li.appendChild(this.#createWrapper());
      }
      return li;
    });
    menuWrapper.append(...menuItemWrappers);
    return menuWrapper;
  }

  #createStyle() {
    const style = document.createElement("style");

    console.log(style.isConnected);

    style.textContent = `
      .wrapper {
        position: fixed;
        background:#fa1;
      }
    `;

    return style;
  }
}
