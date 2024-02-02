import { css, html, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import { YpBaseElement } from "../../common/yp-base-element.js";
import { YpMediaHelpers } from "../../common/YpMediaHelpers.js";

import "../../common/yp-image.js";

import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";

import "./aoi-new-idea-dialog.js";

import { SharedStyles } from "./SharedStyles.js";
import { Dialog } from "@material/web/dialog/internal/dialog.js";
import { AoiNewIdeaDialog } from "./aoi-new-idea-dialog.js";
import { YpFormattingHelpers } from "../../common/YpFormattingHelpers.js";

@customElement("aoi-survey-voting")
export class AoiSurveyVoting extends YpBaseElement {
  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  firstPrompt!: AoiPromptData;

  @property({ type: Number })
  promptId!: number;

  @property({ type: Number })
  voteCount = 0;

  @property({ type: String })
  leftAnswer: string | undefined;

  @property({ type: Boolean })
  spinnersActive = false;

  @property({ type: String })
  rightAnswer: string | undefined;

  @property({ type: String })
  appearanceLookup!: string;

  @property({ type: Boolean })
  breakForVertical = false;

  @property({ type: Number })
  levelTwoTargetVotes: number | undefined;

  timer: number | undefined;

  constructor() {
    super();
    this.resetAnimation = this.resetAnimation.bind(this);
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.spinnersActive = false;
    this.fire("needs-new-earl");
    window.appGlobals.activity("Voting - open");
    this.resetTimer();
    this.installMediaQueryWatcher(
      `(max-width: 1200px) and (min-width: 960px)`,
      (matches) => {
        this.breakForVertical = matches;
      }
    );
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.appGlobals.activity("Voting - close");
    this.fireGlobal("set-ids", {
      questionId: this.question.id,
      promptId: undefined,
    });
  }

  resetTimer() {
    this.timer = new Date().getTime();
  }

  animateButtons(direction: "left" | "right" | "skip"): Promise<void> {
    return new Promise((resolve) => {
      const leftButton = this.shadowRoot?.querySelector("#leftAnswerButton");
      const rightButton = this.shadowRoot?.querySelector("#rightAnswerButton");

      leftButton?.addEventListener("animationend", this.resetAnimation);
      rightButton?.addEventListener("animationend", this.resetAnimation);

      if (direction === "left") {
        leftButton?.classList.add("animate-up", "fade-slow");
        rightButton?.classList.add("animate-down", "fade-fast");
      } else if (direction === "right") {
        rightButton?.classList.add("animate-up", "fade-slow");
        leftButton?.classList.add("animate-down", "fade-fast");
      } else {
        leftButton?.classList.add("fade-slow");
        rightButton?.classList.add("fade-slow");
      }

      resolve();
    });
  }

  resetAnimation(event: any) {
    event.target.classList.remove(
      "animate-up",
      "animate-down",
      "animate-from-left",
      "animate-from-right",
      "fade-fast",
      "fade-slow"
    );
  }

  async voteForAnswer(direction: "left" | "right" | "skip") {
    window.appGlobals.activity(`Voting - ${direction}`);

    const voteData: AoiVoteData = {
      time_viewed: new Date().getTime() - (this.timer || 0),
      prompt_id: this.promptId,
      direction,
      appearance_lookup: this.appearanceLookup,
    };

    const postVotePromise = window.aoiServerApi.postVote(
      this.groupId,
      this.question.id,
      this.promptId,
      this.language,
      voteData,
      direction
    );

    let animationPromise = this.animateButtons(direction);

    const spinnerTimeout = setTimeout(() => {
      this.spinnersActive = true;
    }, 1000);

    const [postVoteResponse] = await Promise.all([
      postVotePromise,
      animationPromise,
    ]);

    clearTimeout(spinnerTimeout);

    this.spinnersActive = false;

    if (!postVoteResponse) {
      this.fire("display-snackbar", this.t("Network error, please try again."));
      this.removeAndInsertFromLeft();
      return;
    } else {
      this.leftAnswer = postVoteResponse.newleft
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
      this.rightAnswer = postVoteResponse.newright
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');

      this.promptId = postVoteResponse.prompt_id;
      this.appearanceLookup = postVoteResponse.appearance_lookup;

      this.fire("update-appearance-lookup", {
        appearanceLookup: this.appearanceLookup,
        promptId: this.promptId,
        leftAnswer: this.leftAnswer,
        rightAnswer: this.rightAnswer,
      });

      this.fireGlobal("set-ids", {
        questionId: this.question.id,
        promptId: this.promptId,
      });

      this.removeAndInsertFromLeft();

      const buttons = this.shadowRoot?.querySelectorAll("md-elevated-button");
      buttons?.forEach((button) => {
        //TODO: IMPORTANT GET THIS WORKING ON MOBILES
        this.blur();
      });

      if (direction !== "skip") {
        this.question.visitor_votes += 1;
      }
      this.requestUpdate();

      this.resetTimer();
    }
  }

  removeAndInsertFromLeft() {
    const leftButton = this.shadowRoot?.querySelector("#leftAnswerButton");
    const rightButton = this.shadowRoot?.querySelector("#rightAnswerButton");

    leftButton?.classList.remove(
      "animate-up",
      "animate-down",
      "fade-fast",
      "fade-slow"
    );
    rightButton?.classList.remove(
      "animate-up",
      "animate-down",
      "fade-fast",
      "fade-slow"
    );

    leftButton?.classList.add("animate-from-left");
    rightButton?.classList.add("animate-from-right");
  }

  openNewIdeaDialog() {
    (this.$$("#newIdeaDialog") as AoiNewIdeaDialog).open();
  }

  static override get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        :host {
          --md-elevated-button-container-color: var(
            --md-sys-color-primary-container
          );
          --md-elevated-button-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        .buttonContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: collapse balance;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        .spinnerContainer {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 120px;
          margin: 8px;
          width: 400px;
        }

        .progressBarContainer {
          width: 450px;
          height: 10px;
          background-color: var(--md-sys-color-on-primary);
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          margin-top: 32px;
        }

        .progressBar {
          height: 100%;
          background-color: var(--md-sys-color-primary);
          transition: width 0.4s ease-in-out;
        }

        .progressBarText {
          font-size: 12px;
          text-align: right;
          padding-top: 4px;
          color: var(--md-sys-color-secondary);
          width: 450px;
        }

        .or {
          font-size: 22px;
          padding: 8px;
          color: var(--md-sys-color-secondary);
        }

        .questionTitle {
          margin-bottom: 0px;
          margin-top: 32px;
          margin-left: 32px;
          margin-right: 32px;
        }

        .newIdeaButton, .skipButton {
          margin-top: 24px;
        }

        .skipButton {
          margin-left: 8px;
        }

        .buttonContainer {
          margin-top: 32px;
        }

        .md-elevated-button {
          transition: transform 0.3s ease-out;
        }

        .fade-fast {
          transition: opacity 0.5s ease-out;
          opacity: 0.2;
        }

        .fade-slow {
          transition: opacity 1s ease-out;
          opacity: 0.9;
        }

        .animate-up,
        .animate-down {
          transition: transform 1s ease-out;
        }

        .animate-up {
          transform: translateY(-450px);
        }

        .animate-down {
          transform: translateY(450px);
        }

        .animate-from-left,
        .animate-from-right {
          opacity: 1;
        }

        .animate-from-left {
          animation: slideInFromLeft 0.7s forwards;
        }

        .animate-from-right {
          animation: slideInFromRight 0.7s forwards;
        }

        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-120%);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInFromRight {
          0% {
            transform: translateX(120%);
            opacity: 0.25;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 960px) {
          .animate-up {
            transform: translateY(-550px);
          }

          .animate-down {
            transform: translateY(550px);
          }

          .buttonContainer md-elevated-button {
            margin: 8px;
            width: 100%;
            margin-right: 32px;
            margin-left: 32px;
            --md-elevated-button-container-height: 100px;
          }

          .spinnerContainer {
            width: 100%;
            height: 100px;
          }

          .topContainer {
            overflow-x: clip;
          }

          .progressBarContainer {
            width: 80%;
          }

          .progressBarText {
            width: 80%;
          }

          .or {
            font-size: 18px;
            padding: 4px;
            color: var(--md-sys-color-secondary);
          }
        }
      `,
    ];
  }

  renderProgressBar() {
    if (this.earl.configuration) {
      let targetVotes =
        this.levelTwoTargetVotes ||
        (window.appGlobals.originalQueryParameters.goalThreshold as number) ||
        this.earl.configuration.target_votes ||
        30;

      if (
        !this.levelTwoTargetVotes &&
        this.question.visitor_votes >= targetVotes
      ) {
        //this.levelTwoTargetVotes = Math.max(Math.round((this.question.choices_count * this.question.choices_count)/4), targetVotes);
        this.levelTwoTargetVotes = targetVotes * 2;
        targetVotes = this.levelTwoTargetVotes;
      }

      const progressPercentage = Math.min(
        (this.question.visitor_votes / targetVotes) * 100,
        100
      );

      return html`
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${progressPercentage}%;"></div>
        </div>
        <div class="progressBarText">
          ${this.question.visitor_votes} ${this.t("votes of")} ${targetVotes}
          ${this.t("target")}
          ${this.levelTwoTargetVotes ? html`(${this.t("Level 2")})` : nothing}
        </div>
      `;
    } else {
      return nothing;
    }
  }

  override render() {
    return html`
      <div
        class="topContainer layout vertical wrap center-center"
        tabindex="-1"
      >
        <div class="questionTitle">${this.question.name}</div>
        <div
          class="buttonContainer layout ${this.breakForVertical
            ? "vertical"
            : "horizontal"} wrap center-center"
        >
          ${this.spinnersActive
            ? html`
                <div class="spinnerContainer">
                  <md-circular-progress
                    class="leftSpinner"
                    indeterminate
                  ></md-circular-progress>
                </div>
              `
            : nothing}
          <md-elevated-button
            id="leftAnswerButton"
            class="leftAnswer"
            ?hidden="${this.spinnersActive}"
            @click=${() => this.voteForAnswer("left")}
          >
            ${YpFormattingHelpers.truncate(this.leftAnswer!, 140)}
          </md-elevated-button>
          <span class="or"> ${this.t("or")} </span>
          ${this.spinnersActive
            ? html`
                <div class="spinnerContainer">
                  <md-circular-progress
                    class="leftSpinner"
                    indeterminate
                  ></md-circular-progress>
                </div>
              `
            : nothing}
          <md-elevated-button
            id="rightAnswerButton"
            class="rightAnswer"
            ?hidden="${this.spinnersActive}"
            @click=${() => this.voteForAnswer("right")}
          >
            ${YpFormattingHelpers.truncate(this.rightAnswer!, 140)}
          </md-elevated-button>
        </div>
        <div class="layout horizontal">
          <md-outlined-button
            class="newIdeaButton"
            @click="${this.openNewIdeaDialog}"
          >
            ${this.t("Add your own idea")}
          </md-outlined-button>
          <md-text-button
            class="skipButton"
            @click=${() => this.voteForAnswer("skip")}
          >
            ${this.t("Skip")}
          </md-text-button>
        </div>
        ${this.renderProgressBar()}
        <div class="layout horizontal wrap center-center"></div>
      </div>
      ${!this.wide
        ? html`
            <input
              type="text"
              id="dummyInput"
              style="position:absolute;opacity:0;"
            />
          `
        : nothing}
      <aoi-new-idea-dialog
        id="newIdeaDialog"
        .question=${this.question}
        .earl=${this.earl}
      ></aoi-new-idea-dialog>
    `;
  }
}
