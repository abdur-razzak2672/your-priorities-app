var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/navigationbar/navigation-bar.js";
import "@material/web/navigationtab/navigation-tab.js";
//import '@material/web/navigationdrawer/lib/navigation-drawer-styles.css.js';
import "@material/web/navigationdrawer/navigation-drawer.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/standard-icon-button.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/mwc-snackbar/mwc-snackbar.js";
import "@material/web/menu/menu.js";
import { cache } from "lit/directives/cache.js";
import "../common/yp-image.js";
//import './chat/yp-chat-assistant.js';
import "./survey/aoi-survey-intro.js";
import "./survey/aoi-survey-voting.js";
import "./survey/aoi-survey-results.js";
import "./survey/aoi-survey-analysis.js";
import { AoiServerApi } from "./survey/AoiServerApi.js";
import { AoiAppGlobals } from "./AoiAppGlobals.js";
import { YpGroup } from "../yp-collection/yp-group.js";
const PagesTypes = {
    Introduction: 1,
    Voting: 2,
    Results: 3,
    Analysis: 4,
    Share: 5,
};
//TODO: Label the pages for aria https://github.com/material-components/material-web/blob/main/docs/components/tabs.md
let AoiSurvey = class AoiSurvey extends YpGroup {
    constructor() {
        super();
        this.pageIndex = 1;
        this.totalNumberOfVotes = 0;
        this.themePrimaryColor = "#000000";
        this.themeSecondaryColor = "#000000";
        this.themeTertiaryColor = "#000000";
        this.themeNeutralColor = "#000000";
        this.themeScheme = "tonal";
        this.themeHighContrast = false;
        this.isAdmin = false;
        this.surveyClosed = false;
        window.aoiServerApi = new AoiServerApi();
        window.aoiAppGlobals = new AoiAppGlobals(window.aoiServerApi);
        if (window.location.href.indexOf("localhost") > -1) {
            window.aoiAppGlobals.setupTranslationSystem();
        }
        else {
            window.aoiAppGlobals.setupTranslationSystem("/apps/aoi_survey/dist");
        }
        window.aoiAppGlobals.activity("pageview");
    }
    connectedCallback() {
        super.connectedCallback();
        this._setupEventListeners();
        const savedColor = localStorage.getItem("md3-yrpri-promotion-color");
        if (savedColor) {
            this.fireGlobal("yp-theme-color", savedColor);
        }
        this.getEarl();
    }
    async getEarl() {
        window.aoiAppGlobals.activity("Survey - fetch start");
        this.earl = this.collection.configuration.allOurIdeas.earl;
        this.question = this.collection.configuration.allOurIdeas.earl.question;
        this.prompt = await window.aoiServerApi.getPrompt(this.collectionId, this.question.id);
        this.appearanceLookup = this.question.appearance_id;
        this.currentLeftAnswer = this.prompt.left_choice_text;
        this.currentRightAnswer = this.prompt.right_choice_text;
        this.currentPromptId = this.prompt.id;
        document.title = this.question.name;
        if (this.earl.active) {
            this.surveyClosed = false;
        }
        else {
            this.surveyClosed = true;
        }
        this.fireGlobal("set-ids", {
            questionId: this.question.id,
            promptId: this.prompt.id,
        });
        window.aoiAppGlobals.activity("Survey - fetch end");
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._removeEventListeners();
    }
    getHexColor(color) {
        if (color) {
            // Replace all # with nothing
            color = color.replace(/#/g, "");
            if (color.length === 6) {
                return `#${color}`;
            }
            else {
                return undefined;
            }
        }
        else {
            return undefined;
        }
    }
    snackbarclosed() {
        this.lastSnackbarText = undefined;
    }
    tabChanged(event) {
        if (event.detail.activeIndex == 0) {
            this.pageIndex = 1;
        }
        else if (event.detail.activeIndex == 1) {
            this.pageIndex = 2;
        }
        else if (event.detail.activeIndex == 2) {
            this.pageIndex = 3;
        }
        else if (event.detail.activeIndex == 3) {
            this.pageIndex = 4;
        }
    }
    exitToMainApp() {
        //TODO
    }
    async _displaySnackbar(event) {
        this.lastSnackbarText = event.detail;
        await this.updateComplete;
        this.$$("#snackbar").show();
    }
    _setupEventListeners() {
        this.addListener("display-snackbar", this._displaySnackbar);
    }
    _removeEventListeners() {
        this.removeListener("display-snackbar", this._displaySnackbar);
    }
    externalGoalTrigger() {
        try {
            let triggerUrl = new URL(window.aoiAppGlobals.externalGoalTriggerUrl);
            let whiteList = window.aoiAppGlobals
                .exernalGoalParamsWhiteList;
            if (whiteList) {
                whiteList = whiteList
                    .toLowerCase()
                    .split(",")
                    .map((param) => param.trim());
            }
            for (const key in window.aoiAppGlobals.originalQueryParameters) {
                if (!whiteList || whiteList.includes(key.toLowerCase())) {
                    triggerUrl.searchParams.append(key, window.aoiAppGlobals.originalQueryParameters[key]);
                }
            }
            window.location.href = triggerUrl.toString();
        }
        catch (error) {
            console.error("Invalid URL:", window.aoiAppGlobals.externalGoalTriggerUrl, error);
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
    }
    _appError(event) {
        console.error(event.detail.message);
        this.currentError = event.detail.message;
        //(this.$$('#errorDialog') as Dialog).open = true;
    }
    get adminConfirmed() {
        return true;
    }
    _settingsColorChanged(event) {
        this.fireGlobal("yp-theme-color", event.detail.value);
    }
    static get styles() {
        return [
            ...super.styles,
            css `
        :host {
          background-color: var(--md-sys-color-background, #fefefe);
        }

        :host {
        }

        body {
          background-color: var(--md-sys-color-background, #fefefe);
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
        }

        .drawer {
          margin-left: 16px;
          padding-left: 8px;
          margin-right: 16px;
          padding-bottom: 560px;
        }

        md-list-item {
          --md-list-list-item-container-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          --md-list-list-item-label-text-color: var(--md-sys-color-on-surface);
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-background);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-background
          );
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        md-navigation-bar {
          --md-navigation-bar-container-color: var(--md-sys-color-surface);
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
        }

        .lightDarkContainer {
          padding-left: 8px;
          padding-right: 8px;
          color: var(--md-sys-color-on-background);
          font-size: 14px;
        }

        .darkModeButton {
          margin: 16px;
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .collectionLogoImage {
          width: 60px;
          height: 60px;
          margin-left: 64px;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        [hidden] {
          display: none !important;
        }

        md-text-button {
          --md-text-button-label-text-color: #fefefe;
        }

        md-standard-icon-button {
          --md-icon-button-unselected-icon-color: #f0f0f0;
        }

        #goalTriggerSnackbar {
          padding: 24px;
        }

        @media (max-width: 960px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
          }

          prompt-promotion-dashboard {
            max-width: 100%;
          }
        }
      `,
        ];
    }
    changeTabTo(tabId) {
        this.tabChanged({ detail: { activeIndex: tabId } });
    }
    updateThemeColor(event) {
        this.themeColor = event.detail;
    }
    sendVoteAnalytics() {
        if (this.totalNumberOfVotes % 10 === 0) {
            window.aoiAppGlobals.activity(`User voted ${this.totalNumberOfVotes} times`);
        }
    }
    updateappearanceLookup(event) {
        this.appearanceLookup = event.detail.appearanceLookup;
        this.currentPromptId = event.detail.promptId;
        this.currentLeftAnswer = event.detail.leftAnswer;
        this.currentRightAnswer = event.detail.rightAnswer;
        this.totalNumberOfVotes++;
        this.question.votes_count++;
        this.sendVoteAnalytics();
    }
    renderIntroduction() {
        return html ` <div class="layout vertical center-center"></div> `;
    }
    renderShare() {
        return html ` <div class="layout vertical center-center"></div> `;
    }
    startVoting() {
        this.pageIndex = 2;
        if (this.$$("#navBar")) {
            this.$$("#navBar").activeIndex = 1;
        }
    }
    openResults() {
        this.pageIndex = 3;
        if (this.$$("#navBar")) {
            this.$$("#navBar").activeIndex = 2;
        }
    }
    triggerExternalGoalUrl() {
        window.location.href = window.aoiAppGlobals.externalGoalTriggerUrl;
    }
    _renderPage() {
        if (this.earl) {
            switch (this.pageIndex) {
                case PagesTypes.Introduction:
                    return html `<aoi-survey-intro
            .earl="${this.earl}"
            .group="${this.collection}"
            .question="${this.question}"
            .themeHighContrast="${this.themeHighContrast}"
            @startVoting="${this.startVoting}"
            @openResults="${this.openResults}"
            .themeDarkMode="${this.themeDarkMode}"
          ></aoi-survey-intro>`;
                case PagesTypes.Voting:
                    return cache(html `<aoi-survey-voting
            .earl="${this.earl}"
            .groupId="${this.collectionId}"
            .question="${this.question}"
            .leftAnswer="${this.currentLeftAnswer}"
            .rightAnswer="${this.currentRightAnswer}"
            .promptId="${this.currentPromptId}"
            .appearanceLookup="${this.appearanceLookup}"
            @update-appearance-lookup="${this.updateappearanceLookup}"
          ></aoi-survey-voting>`);
                case PagesTypes.Results:
                    return html `<aoi-survey-results
            .groupId="${this.collectionId}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-results>`;
                case PagesTypes.Analysis:
                    return html `<aoi-survey-analysis
            .groupId="${this.collectionId}"
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-analysis>`;
                case PagesTypes.Share:
                    return html ` ${this.renderShare()} `;
                default:
                    return html `
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
            }
        }
        else {
            return html ` <div class="loading">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>`;
        }
    }
    renderScore() {
        return html ` <div class="layout vertical center-center"></div> `;
    }
    renderNavigationBar() {
        if (this.wide) {
            return html `
        <div class="drawer">
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <yp-image
                class="collectionLogoImage"
                sizing="contain"
                src="https://raw.githubusercontent.com/allourideas/allourideas.org/master/public/images/favicon.png"
              ></yp-image>
            </div>
          </div>

          <md-tabs aria-label="Navigation Tabs">
            <md-primary-tab
              ?hidden="${this.surveyClosed}"
              class="${this.pageIndex == PagesTypes.Voting && "selectedContainer"}"
              @click="${() => this.changeTabTo(1)}"
              aria-label="${this.t("Participate Now!")}"
            >
              <md-icon slot="icon">thumb_up</md-icon>
              ${this.t("Select answers")}
            </md-primary-tab>

            <md-primary-tab
              class="${this.pageIndex == PagesTypes.Introduction && "selectedContainer"}"
              @click="${() => this.changeTabTo(0)}"
              aria-label="${this.t("Why Participate")}"
            >
              <md-icon slot="icon">info</md-icon>
              ${this.t("About this project")}
            </md-primary-tab>

            <md-primary-tab
              ?hidden="${this.earl.configuration.hide_results == "1"}"
              class="${this.pageIndex == PagesTypes.Results && "selectedContainer"}"
              @click="${() => this.changeTabTo(2)}"
              aria-label="${this.t("Results")}"
            >
              <md-icon slot="icon">grading</md-icon>
              ${this.t("Rank-ordered list")}
            </md-primary-tab>

            <md-primary-tab
              ?hidden="${this.earl.configuration.hide_results == "1"}"
              class="${this.pageIndex == PagesTypes.Analysis && "selectedContainer"}"
              @click="${() => this.changeTabTo(3)}"
              aria-label="${this.t("Analysis of Results")}"
            >
              <md-icon slot="icon">insights</md-icon>
              ${this.t("AI-generated analysis")}
            </md-primary-tab>

            ${this.renderScore()}
          </md-tabs>
        </div>
      `;
        }
        else {
            return html `
        <div class="navContainer">
          <md-navigation-bar
            id="navBar"
            @navigation-bar-activated="${this.tabChanged}"
          >
            <md-navigation-tab .label="${this.t("Intro")}"
              ><md-icon slot="activeIcon">info</md-icon>
              <md-icon slot="inactiveIcon">info</md-icon></md-navigation-tab
            >
            <md-navigation-tab
              ?hidden="${this.surveyClosed}"
              id="votingTab"
              .label="${this.t("Voting")}"
            >
              <md-icon slot="activeIcon">thumb_up</md-icon>
              <md-icon slot="inactiveIcon">thumb_up</md-icon>
            </md-navigation-tab>
            <md-navigation-tab
              .label="${this.t("Results")}"
              ?hidden="${this.earl?.configuration.hide_results == "1"}"
            >
              <md-icon slot="activeIcon">grading</md-icon>
              <md-icon slot="inactiveIcon">grading</md-icon>
            </md-navigation-tab>
            <md-navigation-tab
              .label="${this.t("Analysis")}"
              ?hidden="${this.earl?.configuration.hide_results == "1"}"
            >
              <md-icon slot="activeIcon">insights</md-icon>
              <md-icon slot="inactiveIcon">insights</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
        }
    }
    render() {
        return html `<div class="layout horizontal">
      ${this.renderNavigationBar()}
      <div class="rightPanel">
        <main>
          <div class="mainPageContainer">${this._renderPage()}</div>
        </main>
      </div>
    </div>

    </div>
      ${this.lastSnackbarText
            ? html `
              <mwc-snackbar
                id="snackbar"
                @MDCSnackbar:closed="${this.snackbarclosed}"
                style="text-align: center;"
                .labelText="${this.lastSnackbarText}"
              ></mwc-snackbar>
            `
            : nothing}

      ${window.aoiAppGlobals.externalGoalTriggerUrl
            ? html `
              <mwc-snackbar
                id="goalTriggerSnackbar"
                style="text-align: center;"
                timeoutMs="-1"
                .labelText="${this.t("Target votes reached!")}"
              >
                <md-standard-icon-button slot="dismiss">
                  <md-icon>close</md-icon>
                </md-standard-icon-button>
                <md-text-button
                  slot="action"
                  @click="${this.triggerExternalGoalUrl}"
                  >${this.t("Finish and return")}</md-text-button
                >
              </mwc-snackbar>
            `
            : nothing}
      `;
    }
};
__decorate([
    property({ type: Number })
], AoiSurvey.prototype, "pageIndex", void 0);
__decorate([
    property({ type: Number })
], AoiSurvey.prototype, "totalNumberOfVotes", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "lastSnackbarText", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "currentError", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "themePrimaryColor", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "themeSecondaryColor", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "themeTertiaryColor", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "themeNeutralColor", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "themeScheme", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurvey.prototype, "themeHighContrast", void 0);
__decorate([
    property({ type: Object })
], AoiSurvey.prototype, "earl", void 0);
__decorate([
    property({ type: Object })
], AoiSurvey.prototype, "question", void 0);
__decorate([
    property({ type: Object })
], AoiSurvey.prototype, "prompt", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurvey.prototype, "isAdmin", void 0);
__decorate([
    property({ type: Boolean })
], AoiSurvey.prototype, "surveyClosed", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "appearanceLookup", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "currentLeftAnswer", void 0);
__decorate([
    property({ type: String })
], AoiSurvey.prototype, "currentRightAnswer", void 0);
__decorate([
    property({ type: Number })
], AoiSurvey.prototype, "currentPromptId", void 0);
AoiSurvey = __decorate([
    customElement("aoi-survey")
], AoiSurvey);
export { AoiSurvey };
//# sourceMappingURL=aoi-survey.js.map