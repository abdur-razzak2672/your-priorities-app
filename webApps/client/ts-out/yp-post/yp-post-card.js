var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { ShadowStyles } from "../common/ShadowStyles.js";
import { YpNavHelpers } from "../common/YpNavHelpers.js";
import "../yp-magic-text/yp-magic-text.js";
import "./yp-post-cover-media.js";
import "./yp-post-actions.js";
import "./yp-post-tags.js";
import "@material/web/iconbutton/outlined-icon-button.js";
let YpPostCard = class YpPostCard extends YpBaseElement {
    constructor() {
        super(...arguments);
        this.mini = false;
        this.isAudioCover = false;
    }
    static get propersties() {
        return {
            post: {
                type: Object,
                observer: "_postChanged",
            },
        };
    }
    //TODO: Make corners on posts card different
    static get styles() {
        return [
            super.styles,
            ShadowStyles,
            css `
        .post-name {
          margin: 0;
          padding: 16px;
          padding-top: 20px;
          padding-bottom: 14px;
          cursor: pointer;
          vertical-align: middle !important;
          font-size: 20px;
          background-color: var(--md-sys-color-primary);
          color: var(--md-sys-color-on-primary);
          font-weight: 500;
          height: 50px;
        }

        .post-name[largefont] {
          font-size: 19px;
        }

        .postCardCursor {
          cursor: pointer;
        }

        .postCard {
          width: 420px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
        }

        :host {
          display: block;
        }

        .postCard {
          width: 416px;
          border-radius: 4px;
          height: 100%;
        }

        .postCard[hide-post-cover] {
          height: 190px;
        }

        .postCard[hide-post-cover][hide-actions] {
          height: 165px;
        }

        .postCard[hide-post-cover][hide-description] {
          height: 140px;
        }

        .postCard[hide-description] {
          height: 372px;
        }

        .postCard[hide-description][hide-actions] {
          height: 331px;
        }

        .postCard[hide-description][hide-post-cover][hide-actions] {
          height: 110px;
        }

        .postCard[hide-actions] {
          height: 402px;
        }

        .postCard[mini] {
          width: 210px;
          height: 100%;
          margin: 0;
          padding-top: 0;
          padding-bottom: 0;
        }

        yp-post-cover-media {
          width: 416px;
          height: 234px;
        }

        yp-post-cover-media[mini] {
          width: 210px;
          height: 118px;
          min-height: 118px;
        }

        .post-name[mini] {
          padding: 16px;
        }

        .description {
          font-size: 17px;
          padding: 16px;
          padding-top: 16px;
          cursor: pointer;
          height: 84px;
          margin-bottom: 8px;
          background-color: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
        }

        .description[widetext] {
          font-size: 16px;
          line-height: 1.3;
        }

        .description[largefont] {
          font-size: 15px;
        }

        .postActions {

        }

        .shareIcon {
          position: absolute;
          left: 8px;
          bottom: 2px;
          text-align: right;
          width: 48px;
          height: 48px;
        }

        .customRatings {
          position: absolute;
          bottom: 10px;
          right: 6px;
        }

        :host {
          width: 100%;
        }

        @media (max-width: 960px) {
          .customRatings {
            bottom: 12px;
          }

          :host {
            width: 100%;
            max-width: 423px;
          }

          .description[has-custom-ratings] {
            padding-bottom: 28px;
          }

          .postCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .postCard[mini] {
            width: 210px;
            height: 100%;
          }

          .card {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
          }

          .card[mini] {
            width: 210px;
            height: 100%;
          }

          yp-post-cover-media {
            width: 100%;
            height: 230px;
          }

          yp-post-cover-media[mini] {
            width: 210px;
            height: 118px;
            min-height: 118px;
          }

          .card {
            height: 100%;
            padding-bottom: 48px;
          }

          .postCard {
            height: 100% !important;
          }

          yp-post-cover-media[audio-cover] {
            width: 100%;
            height: 100px;
          }
        }

        @media (max-width: 420px) {
          yp-post-cover-media {
            height: 225px;
          }
          yp-post-cover-media[audio-cover] {
            height: 100px;
          }
        }

        @media (max-width: 375px) {
          yp-post-cover-media {
            height: 207px;
          }
          yp-post-cover-media[audio-cover] {
            height: 100px;
          }
        }

        @media (max-width: 360px) {
          yp-post-cover-media {
            height: 200px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        @media (max-width: 320px) {
          yp-post-cover-media {
            height: 180px;
          }
          yp-post-cover-media[audio-cover] {
            height: 90px;
          }
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }

        .share[mini] {
          display: none;
        }
      `,
        ];
    }
    renderDescription() {
        return html `
      ${!this.post.public_data?.structuredAnswersJson
            ? html `
            <yp-magic-text
              class="description layout horizontal"
              ?hasCustomRatings="${this.post.Group.configuration.customRatings}"
              ?hidden="${this.hideDescription}"
              textType="postContent"
              .contentLanguage="${this.post.language}"
              textOnly
              .content="${this.post.description}"
              .contentId="${this.post.id}"
              truncate="220"
            >
            </yp-magic-text>
          `
            : html `
            <yp-magic-text
              id="description"
              textType="postContent"
              .contentLanguage="${this.post.language}"
              ?hidden="${this.hideDescription}"
              .content="${this.structuredAnswersFormatted}"
              .contentId="${this.post.id}"
              class="description"
              truncate="120"
            >
            </yp-magic-text>
          `}
    `;
    }
    renderTags() {
        return html ` <yp-post-tags .post="${this.post}"></yp-post-tags> `;
    }
    //TODO: Write a server side script to make sure Group.configuration is always there
    render() {
        return this.post
            ? html `
          <div class="layout vertical center-center">
            <div
              ?mini="${this.mini}"
              .hide-post-cover="${this.post.Group.configuration.hidePostCover}"
              .hide-description="${this.post.Group.configuration
                .hidePostDescription}"
              ?hide-actions="${this.post.Group.configuration
                .hidePostActionsInGrid}"
              audio-cover="${this.isAudioCover}"
              class="card postCard layout vertical shadow-elevation-2dp shadow-transition"
              animated
            >
              <div class="layout vertical">
                <a
                  href="${ifDefined(this._getPostLink(this.post))}"
                  @click="${this.goToPostIfNotHeader}"
                  id="mainArea"
                >
                  <yp-post-cover-media
                    ?mini="${this.mini}"
                    top-radius
                    ?audioCover="${this.isAudioCover}"
                    .altTag="${this.post.name}"
                    .post="${this.post}"
                    ?hidden="${this.post.Group.configuration.hidePostCover}"
                  ></yp-post-cover-media>
                  <div class="postNameContainer">
                    <div
                      class="post-name"
                      ?mini="${this.mini}"
                      id="postName"
                      ?largeFont="${this.largeFont}"
                    >
                      <yp-magic-text
                        id="postNameMagicText"
                        textType="postName"
                        ?largeFont="${this.largeFont}"
                        .contentLanguage="${this.post.language}"
                        textOnly
                        .content="${this.post.name}"
                        .contentId="${this.post.id}"
                      >
                      </yp-magic-text>
                    </div>
                  </div>
                  ${this.post.Group.configuration?.usePostTagsForPostCards
                ? this.renderTags()
                : this.renderDescription()}
                </a>
                <div
                  ?hidden="${this.post.Group.configuration
                .hidePostActionsInGrid}"
                  @click="${this._onBottomClick}"
                >
                  ${!this.mini
                ? html `
                        <div class="layout horizontal">
                          ${this.post.Group.configuration?.hideSharing
                    ? nothing
                    : html `
                                <div class="share">
                                  <md-icon-button
                                    .label="${this.t("post.shareInfo")}"
                                    @click="${this._shareTap}"
                                    ><md-icon
                                      >share</md-icon
                                    ></md-icon-button
                                  >
                                </div>
                              `}
                              <div class="flex"></div>
                          ${this.post.Group.configuration.customRatings
                    ? html `
                                <yp-post-ratings-info
                                  class="customRatings"
                                  .post="${this.post}"
                                ></yp-post-ratings-info>
                              `
                    : html `
                                <yp-post-actions
                                  class="postActions"
                                  .post="${this.post}"
                                  .forceShowDebate="${this.post.Group
                        .configuration.forceShowDebateCountOnPost}"
                                  ?hidden="${this.mini}"
                                >
                                </yp-post-actions>
                              `}
                        </div>
                      `
                : nothing}
                </div>
              </div>
            </div>
          </div>
        `
            : nothing;
    }
    _sharedContent(event) {
        const shareData = event.detail;
        window.appGlobals.activity("postShared", shareData.social, this.post ? this.post.id : -1);
    }
    get _fullPostUrl() {
        return encodeURIComponent("https://" + window.location.host + "/post/" + this.post.id);
    }
    get structuredAnswersFormatted() {
        if (this.post &&
            this.post.public_data &&
            this.post.public_data.structuredAnswersJson &&
            this.post.Group.configuration &&
            this.post.Group.configuration.structuredQuestionsJson) {
            const questionHash = {};
            let outText = "";
            this.post.Group.configuration.structuredQuestionsJson.forEach((question) => {
                if (question.uniqueId) {
                    questionHash[question.uniqueId] = question;
                }
            });
            for (let i = 0; i < this.post.public_data.structuredAnswersJson.length; i++) {
                const answer = this.post.public_data.structuredAnswersJson[i];
                if (answer && answer.value) {
                    const question = questionHash[answer.uniqueId];
                    if (question) {
                        outText += question.text + ": ";
                        outText += answer.value + " ";
                    }
                    if (outText.length > 120) {
                        break;
                    }
                }
            }
            return outText;
        }
        else {
            return "";
        }
    }
    _onBottomClick(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
    }
    clickOnA() {
        this.$$("#mainArea")?.click();
    }
    _getPostLink(post) {
        if (post) {
            if (post.Group.configuration &&
                post.Group.configuration.disablePostPageLink) {
                return "#";
            }
            else if (post.Group.configuration &&
                post.Group.configuration.resourceLibraryLinkMode) {
                return post.description.trim();
            }
            else {
                return "/post/" + post.id;
            }
        }
        else {
            console.warn("Trying to get empty post link");
            return "#";
        }
    }
    _shareTap(event) {
        window.appGlobals.activity("postShareCardOpen", event.detail.brand, this.post ? this.post.id : -1);
        window.appDialogs.getDialogAsync("shareDialog", (dialog) => {
            dialog.open(this._fullPostUrl, this.t("post.shareInfo"), this._sharedContent);
        });
    }
    get hideDescription() {
        return (this.mini ||
            (this.post &&
                this.post.Group.configuration &&
                this.post.Group.configuration.hidePostDescription));
    }
    goToPostIfNotHeader(event) {
        event.preventDefault();
        if (this.post.Group.configuration &&
            this.post.Group.configuration.disablePostPageLink) {
            console.log("goToPostDisabled");
        }
        else if (this.post.Group.configuration &&
            this.post.Group.configuration.resourceLibraryLinkMode) {
            // Do nothing
        }
        else {
            YpNavHelpers.goToPost(this.post.id);
        }
        if (this.post && !this.mini) {
            window.appGlobals.cache.cachedPostItem = this.post;
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("post") && this.post) {
            if (this.post.cover_media_type === "audio") {
                this.isAudioCover = true;
            }
            else {
                this.isAudioCover = false;
            }
        }
    }
    updateDescriptionIfEmpty(description) {
        if (!this.post.description || this.post.description == "") {
            this.post.description = description;
        }
    }
    _refresh() {
        //TODO: Fix ts type
        window.appDialogs.getDialogAsync("postEdit", (dialog) => {
            dialog.selected = 0;
            this.fire("refresh");
        });
    }
    _openReport() {
        window.appGlobals.activity("open", "post.report");
        //TODO: Fix ts type
        window.appDialogs.getDialogAsync("apiActionDialog", (dialog) => {
            dialog.setup("/api/posts/" + this.post.id + "/report", this.t("reportConfirmation"), this._onReport.bind(this), this.t("post.report"), "PUT");
            dialog.open();
        });
    }
    _onReport() {
        window.appGlobals.notifyUserViaToast(this.t("post.report") + ": " + this.post.name);
    }
};
__decorate([
    property({ type: String })
], YpPostCard.prototype, "selectedMenuItem", void 0);
__decorate([
    property({ type: Boolean })
], YpPostCard.prototype, "mini", void 0);
__decorate([
    property({ type: Boolean })
], YpPostCard.prototype, "isAudioCover", void 0);
__decorate([
    property({ type: Object })
], YpPostCard.prototype, "post", void 0);
YpPostCard = __decorate([
    customElement("yp-post-card")
], YpPostCard);
export { YpPostCard };
//# sourceMappingURL=yp-post-card.js.map