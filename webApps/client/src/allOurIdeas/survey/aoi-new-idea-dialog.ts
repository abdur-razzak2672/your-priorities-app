import { css, html, nothing } from "lit";
import { property, customElement, query, queryAll } from "lit/decorators.js";
import { YpBaseElement } from "../../common/yp-base-element.js";

import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";

import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";

import "@material/web/textfield/filled-text-field.js";
import { SharedStyles } from "./SharedStyles";
import { YpGenerateAiImage } from "../../common/yp-generate-ai-image.js";
import { AoiAdminServerApi } from "../../admin/allOurIdeas/AoiAdminServerApi.js";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field.js";
import { AoiGenerateAiLogos } from "../../admin/allOurIdeas/aoiGenerateAiLogos.js";

import "../../yp-magic-text/yp-magic-text.js";

@customElement("aoi-new-idea-dialog")
export class AoiNewIdeaDialog extends YpGenerateAiImage {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Number })
  groupId!: number;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  choice: AoiChoiceData | undefined;

  @property({ type: Object })
  group!: YpGroupData;

  @property({ type: Boolean })
  haveAddedIdea = false;

  @query("#ideaText")
  ideaText!: HTMLInputElement;

  @query("#dialog")
  override dialog!: MdDialog;

  serverApi: AoiAdminServerApi;
  imageGenerator!: AoiGenerateAiLogos;

  constructor() {
    super();
    this.serverApi = new AoiAdminServerApi();
  }

  override async connectedCallback() {
    super.connectedCallback();
    this.imageGenerator = new AoiGenerateAiLogos(this.themeColor);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  async submitIdea() {
    window.appGlobals.activity(`New Idea - submit`);
    this.currentError = undefined;
    this.submitting = true;
    let addIdeaResponse;
    try {
      addIdeaResponse = await window.aoiServerApi.submitIdea(
        this.groupId,
        this.question.id,
        this.ideaText.value
      );
    } catch (error: any) {
      console.error(error);
    }
    this.submitting = false;
    if (!addIdeaResponse || addIdeaResponse.error) {
      this.currentError = this.t("An error occurred. Please try again.");
      window.appGlobals.activity(`New Idea - general error`);
    } else if (addIdeaResponse.flagged) {
      this.currentError = this.t(
        "Your idea has been flagged as inappropriate. Please try again."
      );
      window.appGlobals.activity(`New Idea - moderation flag`);
    } else {
      this.ideaText.value = "";
      if (addIdeaResponse.active) {
        this.choice = addIdeaResponse.choice;
        this.haveAddedIdea = true;
        this.fire("display-snackbar", this.t("yourIdeaHasBeenAdded"));
        this.generateAiIcon();
      } else {
        if (this.earl.configuration?.allowNewIdeasForVoting) {
          this.fire(
            "display-snackbar",
            this.t("Your idea is in a moderation queue.")
          );
        } else {
          this.fire(
            "display-snackbar",
            this.t("newIdeasNotAllowedForVotingThankYou")
          );
        }
        this.fire("new-idea-added");
        this.dialog.close();
      }
      window.appGlobals.activity(`New Idea - added`);
    }

  }

  override scrollUp() {
    //await this.updateComplete;
    setTimeout(() => {
      //@ts-ignore
      (this.$$("#dialog") as MdDialog).contentElement.scrollTop = 0;
    }, 100);
  }

  override async open() {
    this.reset();
    window.appGlobals.activity(`New Idea - open`);
    this.dialog.show();
    await this.updateComplete;
    if (this.ideaText)
      this.ideaText.value = ""
  }

  override cancel() {
    this.dialog.close();
    window.appGlobals.activity(`New Idea - cancel`);
  }

  reset() {
    this.currentError = undefined;
    this.haveAddedIdea = false;
    this.choice = undefined;
    this.imageGenerator = new AoiGenerateAiLogos(this.themeColor);
  }

  close() {
    this.dialog.close();
    window.appGlobals.activity(`New Idea - close`);
  }

  textAreaKeyDownIdea(e: any) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  static override get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        :host {
          --md-dialog-container-color: var(--md-sys-color-surface);
        }
        md-dialog[showing-fullscreen] {
          /* hack: private! */
          --_container-max-block-size: 100dvh;
          --md-dialog-container-inset-block-start: 0px;
        }

        md-circular-progress {
          margin-right: 16px;
          --md-circular-progress-size: 40px;
        }

        .indexNumber {
          margin-top: 12px;
          font-size: 20px;
          margin-left: 8px;
          margin-right: 8px;
          color: var(--md-sys-color-on-surface);
        }

        .newIdeasNotAllowedForVotingInfo {
          margin-top: 8px;
          margin-bottom: 8px;
          font-size: 12px;
          font-style: italic;
          color: var(--md-sys-color-on-surface);
        }

        .cancelButton {
        }

        .header {
          text-align: center;
        }

        #dialog {
          width: 100%;
        }

        #ideaText {
          margin-top: 8px;
          width: 500px;
        }

        .questionTitle {
          margin-top: 0;
          margin-bottom: 16px;
          padding: 16px;
          font-size: 16px;
          line-height: 1.4;
        }

        md-filled-field {
          padding: 8px;
          margin-bottom: 8px;
          border-radius: 12px;
        }

        .submitButton {
          margin-left: 8px;
        }

        .aiIconInfo {
          font-size: 12px;
          padding: 8px;
          font-style: italic;
          max-width: 350px;
          text-align: center;
        }

        .error {
          color: var(--md-sys-color-error);
          font-size: 16px;
          margin: 8px;
        }

        .genIconSpinner {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
        }

        yp-magic-text {
        }

        .iconImage,
        .iconImageRight {
          width: 100px;
          height: 100px;
          margin-left: 0;
          margin-right: -8px;
          border-radius: 70px;
        }

        .iconImageRight {
        }

        .closeIcon {
        }

        .deleteIcon {
          position: absolute;
          right: 6px;
          bottom: 16px;
          height: 32px;
          width: 32px;
        }

        .iconContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          max-width: 400px;
          max-height: 120px;
          height: 120px;
          white-space: collapse balance;
          font-size: 16px;
          --md-elevated-button-container-height: 120px !important;
          --md-elevated-button-hover-label-text-color: var(
            --md-sys-color-on-primary-container
          );
        }

        .iconContainer {
          position: relative;
        }

        #aiStyleInput {
          margin-bottom: 16px;
        }

        .generateIconButton {
          max-width: 250px;
        }

        .iconGenerationBottomSpinner {
          margin-top: 16px;
          width: 200px;
        }

        @media (max-width: 960px) {
          #dialog {
            --_fullscreen-header-block-size: 74px;
          }

          .footer {
            margin-bottom: 8px;
          }

          .aiIconInfo {
            max-width: 100%;
          }

          .genIconSpinner {
            width: 75px;
            height: 75px;
            margin-left: 0;
            margin-right: -8px;
          }

          .iconContainer md-elevated-button {
            width: 90vh;
            max-width: 90vh;
            font-size: 15px;
          }

          .generateIconButton {
            max-width: 220px;
          }

          .iconImage,
          .iconImageRight {
            width: 75px;
            height: 75px;
            border-radius: 45px;
          }

          .questionTitle {
            margin-top: 16px;
            margin-bottom: 12px;
          }

          .cancelButton {
            margin-right: 32px;
          }

          .header {
            padding: 8px;
            font-size: 22px;
          }

          #ideaText {
            width: 95%;
          }
        }
      `,
    ];
  }
  async generateAiIcon() {
    this.imageGenerator.collectionType = "group";
    this.imageGenerator.collectionId = this.groupId!;

    if (this.choice) {
      try {
        if (!this.choice.data) {
          this.choice.data = {} as any;
        }
        this.choice.data.isGeneratingImage = true;
        const { imageUrl, error } = (await this.imageGenerator.generateIcon(
          this.choice.data.content,
          this.group.configuration.theme?.iconPrompt || this.finalPrompt
        )) as unknown as { imageUrl: string; error: string };

        this.choice.data.isGeneratingImage = undefined;

        if (error) {
          console.error(error);
        } else {
          await this.serverApi.updateGroupChoice(
            this.groupId!,
            this.question.id!,
            this.choice.id,
            {
              content: this.choice.data.content,
              imageUrl,
              choiceId: this.choice.id,
            }
          );

          this.choice.data.imageUrl = imageUrl;

          this.requestUpdate();
        }
      } catch (e) {
        this.choice.data.isGeneratingImage = false;
        console.error(e);
      }
    } else {
      console.error("no choice");
      return;
    }
  }

  get tempPrompt() {
    return `
      Name: ${this.name}
      Description: ${this.description}
      Image style: ${this.styleText.value}

      Do not include text or labels in the image except if the user asks for it in the image style.
    `;
  }

  regenerateIcon() {
    this.choice!.data!.imageUrl = undefined;
    this.requestUpdate();
    this.generateAiIcon();
  }

  renderAnswer() {
    if (this.choice) {
      return html`
        <div class="iconContainer">
          <md-elevated-button
            id="leftAnswerButton"
            class="leftAnswer"
            trailing-icon
          >
            ${this.renderIcon()}
            <yp-magic-text
              id="answerText"
              .contentId="${this.groupId}"
              .extraId="${this.choice.data.choiceId}"
              textOnly
              truncate="140"
              .content="${this.choice.data.content}"
              .contentLanguage="${this.group.language}"
              textType="aoiChoiceContent"
            ></yp-magic-text>
          </md-elevated-button>
          <md-filled-tonal-icon-button
            ?hidden="${!this.choice.data.imageUrl}"
            @click="${this.regenerateIcon}"
            class="deleteIcon"
            ><md-icon class="closeIcon"
              >cycle</md-icon
            ></md-filled-tonal-icon-button
          >
        </div>
      `;
    } else {
      return nothing;
    }
  }

  renderIcon() {
    if (this.choice!.data.isGeneratingImage) {
      return html`
        <md-circular-progress
          class="genIconSpinner"
          slot="icon"
          indeterminate
        ></md-circular-progress>
      `;
    } else if (this.choice!.data.imageUrl) {
      return html` <img
        class="iconImage"
        src="${this.choice!.data.imageUrl}"
        alt="icon"
        slot="icon"
        ?hidden="${!this.choice!.data.imageUrl}"
      />`;
    } else {
      return nothing;
    }
  }

  override renderContent() {
    return html`
      <div class="questionTitle">
        <yp-magic-text
          id="answerText"
          .contentId="${this.group.id}"
          .extraId="${this.question.id}"
          textOnly
          truncate="400"
          .content="${this.question.name}"
          .contentLanguage="${this.group.language}"
          textType="aoiQuestionName"
        ></yp-magic-text>
      </div>
      ${!this.earl.configuration!.allowNewIdeasForVoting
        ? html`
            <div class="newIdeasNotAllowedForVotingInfo layout horizontal center-center">
              ${this.t("newIdeasNotAllowedForVotingInfo")}
            </div>
          `
        : nothing}
      ${this.haveAddedIdea && this.choice
        ? html`
            <div class="layout vertical center-center">
              ${this.renderAnswer()}
              <div class="aiIconInfo">${this.t("aiIconInfo")}</div>
            </div>
          `
        : html`
            <div class="layout vertical center-center">
              <md-filled-text-field
                id="ideaText"
                type="textarea"
                @keydown="${this.textAreaKeyDownIdea}"
                maxLength="140"
                .rows="${this.wide ? 3 : 5}"
                label="${this.t("Your own answer")}"
              >
              </md-filled-text-field>
              <div class="error" ?hidden="${!this.currentError}">
                ${this.currentError}
              </div>
            </div>
          `}
    `;
  }

  override renderFooter() {
    if (this.haveAddedIdea && this.choice) {
      return html`<div class="layout horizontal footer">
        <div class="flex"></div>
        <md-text-button class="closeButton" @click="${this.close}">
          ${this.t("close")}
        </md-text-button>
      </div> `;
    } else {
      return html` <div class="layout horizontal footer">
        <md-circular-progress
          ?hidden="${!this.submitting}"
          indeterminate
        ></md-circular-progress>
        <md-text-button
          class="cancelButton"
          @click="${this.cancel}"
          ?disabled="${this.submitting}"
        >
          ${this.t("Cancel")}
        </md-text-button>
        <md-outlined-button
          class="submitButton"
          @click="${this.submitIdea}"
          ?disabled="${this.submitting}"
        >
          ${this.t("Submit Idea")}
        </md-outlined-button>
      </div>`;
    }
  }

  override render() {
    return html`<md-dialog ?fullscreen="${!this.wide}" id="dialog">
      <div slot="content">${this.renderContent()}</div>
      <div slot="actions">${this.renderFooter()}</div>
    </md-dialog> `;
  }
}
