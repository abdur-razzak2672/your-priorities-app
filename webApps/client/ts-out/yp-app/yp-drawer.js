var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element";
let YpDrawer = class YpDrawer extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.position = "left";
        this.transparentScrim = true;
    }
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          margin-left: -8px;
          --drawer-width: 256px;
          --drawer-background-color: var(
            --md-sys-color-surface-container-lowest
          ); /* Fallback to white if custom property is not defined */
          --scrim-background: rgba(0, 0, 0, 0.5);
          --scrim-transparent: rgba(0, 0, 0, 0);
          height: 100%;
        }
        .drawer-content {
          width: var(--drawer-width);
          height: 100vh;
          position: fixed;
          opacity: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
          background-color: var(--md-sys-color-surface-container);
          z-index: 2;
          transform: translateX(-100%);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        :host([position="right"]) .drawer-content {
          right: 0;
          left: 0; /* Ensure it does not stretch across the screen */
          transform: translateX(100%);
        }
        :host([open]) .drawer-content {
          transform: translateX(0);
          opacity: 1;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .scrim {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: transparent;
          z-index: 2;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        :host([open][transparentScrim]) .scrim {
          background-color: var(--scrim-transparent);
        }
        :host([open]) .scrim {
          opacity: 1;
          pointer-events: auto;
        }
      `,
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this._handleEscKey.bind(this));
        this.addEventListener("click", this._handleScrimClick);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener("keydown", this._handleEscKey.bind(this));
        this.removeEventListener("click", this._handleScrimClick);
    }
    _handleScrimClick(event) {
        const scrim = this.shadowRoot.querySelector(".scrim");
        const path = event.composedPath();
        if (scrim && path.includes(scrim)) {
            this.open = false;
        }
    }
    _handleEscKey(event) {
        if (event.key === "Escape" && this.open) {
            this.open = false;
        }
    }
    render() {
        return html `
      <div class="scrim"></div>
      <div class="drawer-content">
        <slot></slot>
      </div>
    `;
    }
};
__decorate([
    property({ type: Boolean, reflect: true })
], YpDrawer.prototype, "open", void 0);
__decorate([
    property({ type: String })
], YpDrawer.prototype, "position", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], YpDrawer.prototype, "transparentScrim", void 0);
YpDrawer = __decorate([
    customElement("yp-drawer")
], YpDrawer);
export { YpDrawer };
//# sourceMappingURL=yp-drawer.js.map