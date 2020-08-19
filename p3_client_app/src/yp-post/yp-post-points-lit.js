import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-material/paper-material.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-toast/paper-toast.js';
import '../yp-app-globals/yp-app-icons.js';
import '../yp-behaviors/yp-iron-list-behavior.js';
import '../yp-behaviors/emoji-selector.js';
import '../yp-point/yp-point.js';
import { ypTruncateBehavior } from '../yp-behaviors/yp-truncate-behavior.js';
import '../yp-file-upload/yp-file-upload.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ypLoggedInUserBehavior } from '../yp-behaviors/yp-logged-in-user-behavior.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostPointsLit extends YpBaseElement {
  static get properties() {
    return {

      host: String,

      isAdmin: {
        type: Boolean,
        value: false,
        observer: '_isAdminChanged'
      },

      disableDebate: {
        type: Boolean,
        value: false
      },

      downPoints: {
        type: Array,
        value: []
      },

      upPoints: {
        type: Array,
        value: []
      },

      textValueUp: {
        type: String,
        notify: true,
        value: ""
      },

      textValueDown: {
        type: String,
        notify: true,
        value: ""
      },

      newPointTextCombined: {
        type: String
      },

      post: {
        type: Object,
        observer: "_postChanged"
      },

      points: {
        type: Array,
        value: null,
        observer: '_pointsChanged'
      },

      largeMode: {
        type: Boolean,
        value: false,
        observer: '_updateEmojiBindings'
      },

      largeModeReady: {
        type: Boolean,
        computed: '_largeModeReady(largeMode, post)'
      },

      smallModeReady: {
        type: Boolean,
        computed: '_smallModeReady(largeMode, post)'
      },

      textValueMobileUpOrDown: String,

      labelMobileUpOrDown: String,

      labelUp: String,

      labelDown: String,

      pointUpOrDownSelected: {
        type: String,
        observer: '_pointUpOrDownSelectedChanged',
        value: 'pointFor'
      },

      latestPointCreatedAt: {
        type: Date,
        value: null
      },

      scrollToId: {
        type: String,
        value: null
      },

      ironListResizeScrollThreshold: {
        type: Number,
        computed: '_ironListResizeScrollThreshold(largeMode)'
      },

      ironListPaddingTop: {
        type: Number,
        computed: '_ironListPaddingTop(wide)'
      },

      ifLengthUpIsRight: {
        type: Boolean,
        value: false,
        computed: 'ifLengthIsRight("up",textValueUp, uploadedVideoUpId, uploadedAudioUpId)'
      },

      ifLengthDownIsRight: {
        type: Boolean,
        value: false,
        computed: 'ifLengthIsRight("down", textValueDown, uploadedVideoDownId, uploadedAudioDownId)'
      },

      ifLengthMobileRight: {
        type: Boolean,
        value: false,
        computed: 'ifLengthIsRight("mobile", textValueMobileUpOrDown, uploadedVideoMobileId, uploadedAudioMobileId)'
      },

      addPointDisabled: {
        type: Boolean,
        value: false
      },

      mobileScrollOffset: {
        type: Number,
        computed: '_mobileScrollOffset(largeMode,post)'
      },

      ajaxActive: {
        type: Boolean,
        value: false
      },

      uploadedVideoUpId: {
        type: String,
        value: null
      },

      uploadedVideoDownId: {
        type: String,
        value: null
      },

      uploadedVideoMobileId: {
        type: String,
        value: null
      },

      currentVideoId:{
        type: String,
        value: null
      },

      hideUpVideo: {
        type: Boolean,
        value: false
      },

      hideDownVideo: {
        type: Boolean,
        value: false
      },

      hideMobileVideo: {
        type: Boolean,
        value: false
      },

      uploadedAudioUpId: {
        type: String,
        value: null
      },

      uploadedAudioDownId: {
        type: String,
        value: null
      },

      uploadedAudioMobileId: {
        type: String,
        value: null
      },

      currentAudioId:{
        type: String,
        value: null
      },

      hideUpAudio: {
        type: Boolean,
        value: false
      },

      hideDownAudio: {
        type: Boolean,
        value: false
      },

      hideMobileAudio: {
        type: Boolean,
        value: false
      },

      hideUpText: {
        type: Boolean,
        value: false
      },

      hideDownText: {
        type: Boolean,
        value: false
      },

      hideMobileText: {
        type: Boolean,
        value: false
      },


      selectedPointForMobile: {
        type: Boolean,
        value: true
      },

      isAndroid: {
        type: Boolean,
        value: false
      },

      hasCurrentUpVideo: {
        type: String,
        observer: '_hasCurrentUpVideo'
      },

      hasCurrentDownVideo: {
        type: String,
        observer: '_hasCurrentDownVideo'
      },

      hasCurrentMobileVideo: {
        type: String,
        observer: '_hasCurrentMobileVideo'
      },

      hasCurrentUpAudio: {
        type: String,
        observer: '_hasCurrentUpAudio'
      },

      hasCurrentDownAudio: {
        type: String,
        observer: '_hasCurrentDownAudio'
      },

      hasCurrentMobileAudio: {
        type: String,
        observer: '_hasCurrentMobileAudio'
      },

      storedPoints: {
        type: Array,
        value: null
      },

      pointMaxLength: {
        type: Number,
        computed: '_pointMaxLength(post, largeMode)'
      }
    };
  }

  static get styles() {
    return [
      css`

      :host {
        display: block;
      }

      .item {

      }

      .main-container {
        background-color: var(--primary-background-color);
      }

      .point {
        padding-top: 32px;
        padding-bottom: 32px;
        padding-left: 24px;
        padding-right: 24px;
        width: 398px;
      }

      .pointInputMaterial {
        padding-top: 24px;
        padding-left: 16px;
        padding-right: 16px;
        padding-bottom: 16px;
        margin-bottom: 16px;
        background-color: #FFF;
      }

      paper-toast {
        z-index: 9999;
      }

      paper-material {
        background-color: #fff;
      }

      yp-point {
        padding-top: 8px;
      }

      .pointMaterial {
        padding-top: 8px;
        background-color: #FFF;
        padding-left: 0;
        padding-right: 0;
        width: 430px;
        margin-bottom: 12px;
      }

      .thumbIcon {
        height: 64px;
        width: 64px;
        padding-bottom: 16px;
        color: var(--primary-color);
      }

      .editIcon {
        height: 28px;
        width: 28px;
        padding-bottom: 16px;
        color: var(--primary-color);
      }

      .addPointFab {
        width: 100%;
        color: #FFF;
        margin-bottom: 18px;
      }

      paper-textarea {
        --paper-input-container-label: {
          font-size: 22px;
          height: 30px;
          overflow: visible;
          color: #AAAAAA;
        }
      }

      .howToWriteInfoText {
        padding-top: 4px;
        color: var(--primary-color);
      }

      .point .main-container .topContainer {
        background-color: var(--primary-background-color) !important;
      }

      .penContainer {
        margin-top: 42px;
      }

      .upOrDown {
        margin-top: 72px;
      }

      paper-radio-button {
        --paper-radio-button-checked-color: var(--accent-color) !important;
        font-size: 16px;
      }

      #pointUpOrDownMaterial {
        margin-top: 16px;
        width: 100%;
      }

      .mobileFab {
        margin-top: 8px;
      }

      mwc-button {
        color: #FFF;
        background-color: var(--accent-color);
      }

      @media (max-width: 985px) {
        .pointInputMaterial {
          width: 100%;
          max-width: 568px;
          font-size: 14px;
          padding-top: 4px;
          margin-top: 0;
        }

        .pointMaterial {
          width: 100%;
          max-width: 600px;
          padding-left: 0;
          padding-right: 0;
        }

        #pointUpOrDownMaterial {
          margin-top: 16px;
        }

        .main-container {
          width: 100%;
        }

        iron-list {
          width: 100vw;
        }

        .pointMaterial {
        }
      }

      @media (max-width: 420px) {
        .pointInputMaterial {
          width: 90%;
          max-width: 90%;
        }
      }

      .mobilePaperTextArea {
        --paper-input-container-label: {
          font-size: 19px;
        };
      }

      .pointMainHeader {
        font-size: 26px;
        margin-bottom: 16px;
        color: #555;
      }

      #pointUpMaterialNotUsed {
        border-top: solid 2px;
        border-top-color:  var(--master-point-up-color);
      }

      #pointDownMaterialNotUsed {
        border-top: solid 2px;
        border-top-color: var(--master-point-down-color);
      }

      .pointElement {
        margin-bottom: 18px;
      }

      [hidden] {
        display: none !important;
      }

      iron-list {
        height: 80vh;
      }

      iron-list {
        --iron-list-items-container: {
        };
      }

      :focus {
      }

      #ironListMobile[debate-disabled] {
        margin-top: 16px;
      }

      .mainSpinner {
        margin: 32px;
      }

      mwc-button[disabled] {
        background-color: #333;
        color: #FFF;
      }

      .uploadNotLoggedIn {
        min-width: 100px;
        background-color: #FFF;
        color: #000;
        margin-bottom: 24px;
      }

      .uploadNotLoggedIn > .icon {
        padding-right: 8px;
      }

      .pointButtons {
        margin-bottom: 4px;
      }

      .bottomDiv {
        margin-bottom: 64px;
      }

      .uploadSection {
        justify-content: space-evenly;
        width: 50%;
        margin-left: 8px;
        margin-right: 8px;
        vertical-align: top;
      }

      .videoUploadDisclamer {
        font-size: 12px;
        padding: 8px;
        margin-bottom: 4px;
      }

      .pointMaterialMobile {
      }

      div[rtl] {
        direction: rtl;
      }

      paper-radio-button {
        --paper-radio-button-label: {
          padding-right: 6px;
        }
      }
    `, YpFlexLayout];
  }

  render() {
    return html`

    <lite-signal @lite-signal-yp-update-points-for-post="${this._loadNewPointsIfNeeded}"></lite-signal>
    <lite-signal @lite-signal-logged-in="${this._userLoggedIn}"></lite-signal>

    <iron-media-query query="(min-width: 985px)" query-matches="${this.largeMode}"></iron-media-query>

    <div class="layout horizontal center-center" ?hidden="${this.ajaxActive}">
      <yp-ajax id="ajax" .large-spinner="" .active="${this.ajaxActive}" @response="${this._response}"></yp-ajax>
    </div>

    <div class="layout horizontal center-center" hidden="">
      <yp-ajax id="moreAjax" hidden="" @response="${this._morePointsResponse}"></yp-ajax>
    </div>

    ${ this.largeModeReady ? html`
      <div ?rtl="${this.rtl}" class="layout vertical topContainer">
        <div class="main-container layout-horizontal">
          <div class="point">

            ${ !this.post.Group.configuration.alternativePointForHeader ? html`
              <div class="pointMainHeader layout horizontal center-center" role="heading" aria-level="2">>
                ${this.t('pointsFor')}
              </div>
            `: html`
              <div class="pointMainHeader layout horizontal center-center">
                <yp-magic-text .contentId="${this.post.Group.id}" textOnly
                  .content="${this.post.Group.configuration.alternativePointForHeader}"
                  .contentLanguage="${this.post.Group.language}" role="heading" aria-level="2"
                  class="ratingName" textType="alternativePointForHeader">
                </yp-magic-text>
              </div>
            `}

            <paper-material id="pointUpMaterial" .elevation="1" class="pointInputMaterial layout vertical" .animated="" ?hidden="${this.post.Group.configuration.disableDebate}">

              <paper-textarea id="up_point" @tap="${this.focusUpPoint}" @focus="${this.focusTextArea}" @blur="${this.blurTextArea}" .value="${this.textValueUp}" .label="${this.labelUp}" alwaysFloatLabel="${this._floatIfValueOrIE()}" char-counter
                .rows="2" ?hidden="${this.hideUpText}" .max-rows="3"
                .maxlength="${this.pointMaxLength}">
              </paper-textarea>

              <div class="horizontal end-justified layout" ?hidden="${this.post.Group.configuration.hideEmoji}">
                <emoji-selector id="pointUpEmojiSelector" ?hidden="${this.hideUpText}"></emoji-selector>
              </div>

              <div class="layout horizontal center-justified">

                ${ this.post.Group.configuration.allowPointVideoUploads ? html`
                  <div ?hidden="${this.hideUpVideo}" class="uploadSection">
                    <div class="layout vertical center-center self-start" ?hidden="${!this.loggedInUser}">
                      <yp-file-upload id="videoFileUploadUp" noDefaultCoverImage .uploadLimitSeconds="${this.post.Group.configuration.videoPointUploadLimitSec}" .currentFile="${this.hasCurrentUpVideo}" .containerType="points" .group="${this.post.Group}" raised .video-upload .method="POST" @success="${this._videoUpUploaded}">
                        <iron-icon class="icon" icon="videocam"></iron-icon>
                        <span>${this.t('uploadVideoPointFor')}</span>
                      </yp-file-upload>
                    </div>
                    <div class="videoUploadDisclamer"  ?hidden="${!this.post.Group.configuration.showVideoUploadDisclaimer || !this.uploadedVideoUpId}">
                      [[t('videoUploadDisclaimer')]]
                    </div>
                    <div class="layout horizontal center-center">
                      <mwc-button class="uploadNotLoggedIn" icon="videocam" raised ?hidden="${this.loggedInUser}"
                                  @click="${this._openLogin}" .label="${this.t('uploadVideoPointFor')}">
                        <iron-icon class="icon" ></iron-icon>
                      </mwc-button>
                    </div>
                  </div>
                `: html``}

                ${ this.post.Group.configuration.allowPointAudioUploads ? html`
                  <div ?hidden="${this.hideUpAudio}" class="uploadSection">
                    <div class="layout vertical center-center" ?hidden="${!this.loggedInUser}">
                      <yp-file-upload id="audioFileUploadUp" current-file="${this.hasCurrentUpAudio}" .container-type="points" .uploadlimitSeconds="${this.post.Group.configuration.audioPointUploadLimitSec}" group="${this.post.Group}" .raised audio-upload="" .method="POST" @success="${this._audioUpUploaded}">
                        <iron-icon class="icon" .icon="keyboard-voice"></iron-icon>
                        <span>${this.t('uploadAudioPointFor')}</span>
                      </yp-file-upload>
                    </div>
                    <div class="layout horizontal center-center">
                      <mwc-button class="uploadNotLoggedIn" .icon="keyboard-voice" raised ?hidden="${this.loggedInUser}" @click="${this._openLogin}" .label="${this.t('uploadAudioPointFor')}">
                        <iron-icon class="icon" ></iron-icon>
                      </mwc-button>
                    </div>
                  </div>
                `: html``}
              </div>

              <div ?hidden="${!this.ifLengthUpIsRight}">
                <div class="addPointFab layout horizontal center-center">
                  <mwc-button raised class="submitButton" ?disabled="${this.addPointDisabled}" .icon="add" .mini="" .elevation="3" @tap="${this.addPointUp}" .title="${this.t('postPoint')}" .label="${this.t('postPoint')}"></mwc-button>
                </div>
              </div>
            </paper-material>

            <div id="allUpPoints">
            <iron-scroll-threshold id="ironScrollThesholdUp" scroll-target="document" on-lower-threshold="_loadMorePoints">
              <iron-list id="ironListUp" lowerThreshold="200" .items="${this.upPoints}" role="list" as="point" .scrollTarget="document" .scrollOffset="550">
                <template>
                  <div class="item layout-horizontal" tabindex="${this.tabIndex}" role="listitem" aria-level="3">>
                    <paper-material id="point${this.point.id}" .elevation="1" .animated .class="pointMaterial">
                      <yp-point point="${this.point}"></yp-point>
                    </paper-material>
                  </div>
                </template>
              </iron-list>
            </iron-scroll-threshold>
            </div>
          </div>

          <div class="point layout vertical" ?hidden="${this.post.Group.configuration.hidePointAgainst}">

            ${ !this.post.Group.configuration.alternativePointAgainstHeader ? html`
              <div class="pointMainHeader layout horizontal center-center" role="heading" aria-level="2">>
                ${this.t('pointsAgainst')}
              </div>
            `: html`
              <div class="pointMainHeader layout horizontal center-center">
                <yp-magic-text .contentId="${this.post.Group.id}" textOnly
                  .content="${this.post.Group.configuration.alternativePointAgainstHeader}" .contentLanguage="${this.post.Group.language}"
                  role="heading" aria-level="2" class="ratingName" textType="alternativePointAgainstHeader">
                </yp-magic-text>
              </div>
            `}

            ${ !this.post.Group.configuration.alternativePointForLabel ? html`
              <yp-magic-text id="alternativePointForLabelId" hidden contentId="${this.post.Group.id}" textOnly .content="${this.post.Group.configuration.alternativePointForLabel}"
                .contentLanguage="${this.post.Group.language}" @new-translation="${this._updatePointLabels}" role="heading" aria-level="2" textType="alternativePointForLabel">
              </yp-magic-text>
            ` : nothing }


            ${ !this.post.Group.configuration.alternativePointAgainstLabel ? html`
            <yp-magic-text id="alternativePointAgainstLabelId" hidden contentId="${this.post.Group.id}" textOnly .content="${this.post.Group.configuration.alternativePointAgainstLabel}"
                .contentLanguage="${this.post.Group.language}" @new-translation="${this._updatePointLabels}" role="heading" aria-level="2" textType="alternativePointAgainstLabel">
              </yp-magic-text>
            ` : nothing }

            <paper-material id="pointDownMaterial" elevation="1" class="pointInputMaterial layout vertical" animated ?hidden="${this.disableDebate}">

              <paper-textarea id="down_point" @tap="${this.focusDownPoint}" @focus="${this.focusTextArea}" @blur="${this.blurTextArea}" .value="${this.textValueDown}"
               .label="${this.labelDown}" .charCounter .rows="2" ?hidden="${this.hideDownText}" alwaysFloatLabel="${this._floatIfValueOrIE()}" max-rows="5" .maxlength="${this.pointMaxLenght}">
              </paper-textarea>

              <div class="horizontal end-justified layout" ?hidden="${this.post.Group.configuration.hideEmoji}">
                <emoji-selector id="pointDownEmojiSelector" ?hidden="${this.hideDownText}"></emoji-selector>
              </div>

              <div class="layout horizontal center-justified">

                ${ this.post.Group.configuration.allowPointVideoUploads ? html`
                  <div ?hidden="${this.hideDownVideo}" class="uploadSection">
                    <div class="layout vertical center-center self-start" ?hidden=${!this.loggedInUser}">
                      <yp-file-upload id="videoFileUploadDown" currentFile="${this.hasCurrentDownVideo}" noDefaultCoverImage .containerType="points" uploadLimitSeconds="${this.post.Group.configuration.videoPointUploadLimitSec}" .group="${this.post.Group}" .raised="true" .multi="false" .videoUpload="" .method="POST" @success="${this._videoDownUploaded}">
                        <iron-icon class="icon" .icon="videocam"></iron-icon>
                        <span>${this.t('uploadVideoPointAgainst')}</span>
                      </yp-file-upload>
                    </div>
                    <div class="videoUploadDisclamer"  ?hidden="${!this.post.Group.configuration.showVideoUploadDisclaimer || !this.uploadedVideoUpId}">
                      [[t('videoUploadDisclaimer')]]
                    </div>
                    <div class="layout horizontal center-center">
                      <mwc-button class="uploadNotLoggedIn" icon="videocam" raised ?hidden="${this.loggedInUser}" .label="${this.t('uploadVideoPointAgainst')}" @click="${this._openLogin}">
                        <iron-icon class="icon"></iron-icon>
                      </mwc-button>
                    </div>
                  </div>
                `: html``}

                ${ this.post.Group.configuration.allowPointAudioUploads ? html`
                  <div ?hidden="${this.hideDownAudio}" class="uploadSection">
                    <div class="layout vertical center-center" ?hidden="${!this.loggedInUser}">
                      <yp-file-upload id="audioFileUploadDown" .currentFile="${this.hasCurrentDownAudio}" .containerType="points" uploadLimitSeconds="${this.post.Group.configuration.audioPointUploadLimitSec}" group="${this.post.Group}" .raised="true" .multi="false" .audio-upload="" .method="POST" @success="${this._audioDownUploaded}">
                        <iron-icon class="icon" .icon="keyboard-voice"></iron-icon>
                        <span>${this.t('uploadAudioPointAgainst')}</span>
                      </yp-file-upload>
                    </div>
                    <div class="layout horizontal center-center">
                      <mwc-button class="uploadNotLoggedIn" icon="keyboard-voice" raised .label="${this.t('uploadAudioPointAgainst')}" ?hidden="${this.loggedInUser}" @click="${this._openLogin}">
                        <iron-icon class="icon" ></iron-icon>
                      </mwc-button>
                    </div>
                  </div>
                `: html``}
              </div>

              <div ?hidden="${!this.ifLengthDownIsRight}">
                <div class="addPointFab layout horizontal center-center">
                  <mwc-button raised ?disabled="${this.addPointDisabled}" .icon="add" .elevation="3" @click="${this.addPointDown}" .title="${this.t('postPoint')}" .label="${this.t('postPoint')}"></mwc-button>
                </div>
              </div>
            </paper-material>

            <div id="allDownPoints">
              <iron-scroll-threshold id="ironScrollThesholdDown" lower-threshold="200" scroll-target="document" @lower-threshold="${this._loadMorePoints}">
                <iron-list id="ironListDown" .items="${this.downPoints}" .as="point" .scroll-target="document" .scroll-offset="550">
                  <template>
                    <div class="item" .tabindex="${this.tabIndex}" role="listitem" aria-level="3">>
                      <paper-material id="point${this.point.id}" .elevation="1" .animated="" class="pointMaterial">
                        <yp-point .point="${this.point}"></yp-point>
                      </paper-material>
                    </div>
                  </template>
                </iron-list>
              </iron-scroll-threshold>
            </div>
          </div>
        </div>
      </div>
    `: nothing }

    ${ this.smallModeReady ? html`
      <div ?rtl="${this.rtl}" class="layout vertical center-center">
        <paper-material id="pointUpOrDownMaterial" .elevation="1" class="pointInputMaterial layout vertical" .animated="" ?hidden="${this.post.Group.configuration.disableDebate}">
          <paper-textarea id="mobileUpOrDownPoint" class="mobilePaperTextArea" on-tap="focusDownPoint" @focus="${this.focusTextArea}" @blur="${this.blurTextArea}"
            .value="${this.textValueMobileUpOrDown}" .label="${this.labelMobileUpOrDown}" charCounter .rows="2" ?hidden="${this.hideMobileText}" .max-rows="3" .maxlength="${this.pointMaxLength}"></paper-textarea>
          <div class="layout vertical end-justified">
            <div class="layout horizontal center-center pointButtons">
              <paper-radio-group id="upOrDown" ?hidden="${this.post.Group.configuration.hidePointAgainst}" .attributeForSelected="name" class="layout horizontal" .selected="${this.pointUpOrDownSelected}">
                <paper-radio-button .name="pointFor">${this.t('pointForShort')}</paper-radio-button>
                <paper-radio-button .name="pointAgainst">${this.t('pointAgainstShort')}</paper-radio-button>
              </paper-radio-group>
              <div class="flex"></div>
              <div ?hidden="${this.hideMobileText}">
                <emoji-selector id="pointUpDownEmojiSelector" ?hidden="${this.post.Group.configuration.hideEmoji}"></emoji-selector>
              </div>
            </div>

            <div class="layout horizontal center-justified">

              ${ this.post.Group.configuration.allowPointVideoUploads ? html`
                <div ?hidden="${this.hideMobileVideo}" class="uploadSection">
                  <div class="layout vertical center-center self-start" ?hidden="${!this.loggedInUser}">
                    <yp-file-upload id="videoFileUploadMobile" currentFile="${this.hasCurrentMobileVideo}" noDefaultCoverImage containerType="points" .uploadLimitSeconds="${this.post.Group.configuration.videoPointUploadLimitSec}" group="${this.post.Group}" raised .video-upload="" .method="POST" @success="${this._videoMobileUploaded}">
                      <iron-icon class="icon" .icon="videocam"></iron-icon>

                      <span ?hidden="${!this.selectedPointForMobile}">${this.t('uploadVideoPointFor')}</span>
                      <span ?hidden="${this.selectedPointForMobile}">${this.t('uploadVideoPointAgainst')}</span>
                    </yp-file-upload>
                  </div>
                  <div class="videoUploadDisclamer" ?hidden="${!this.post.Group.configuration.showVideoUploadDisclaimer || !this.uploadedVideoUpId}">
                      [[t('videoUploadDisclaimer')]]
                    </div>
                  <div class="layout horizontal center-center">
                    <mwc-button class="uploadNotLoggedIn" raised ?hidden="${this.loggedInUser}" @click="${this._openLogin}">
                      <iron-icon class="icon" icon="videocam"></iron-icon>
                      <span ?hidden="${!this.selectedPointForMobile}">${this.t('uploadVideoPointFor')}</span>
                      <span ?hidden="${this.selectedPointForMobile}">${this.t('uploadVideoPointAgainst')}</span>
                    </mwc-button>
                  </div>
                </div>
              `: html``}

              ${ this.post.Group.configuration.allowPointAudioUploads ? html`
                <div ?hidden="${this.hideMobileAudio}" class="uploadSection">
                  <div class="layout vertical center-center  self-start" ?hidden="${!this.loggedInUser}">
                    <yp-file-upload id="audioFileUploadMobile" .currentFile="${this.hasCurrentMobileAudio}" .containerType="points" upload-limit-seconds="${this.post.Group.configuration.audioPointUploadLimitSec}" group="${this.post.Group}" raised .audioUpload .method="POST" @success="${this._audioMobileUploaded}">
                      <iron-icon class="icon" .icon="keyboard-voice"></iron-icon>

                      <span ?hidden="${!this.selectedPointForMobile}">${this.t('uploadAudioPointFor')}</span>
                      <span ?hidden="${this.selectedPointForMobile}">${this.t('uploadAudioPointAgainst')}</span>
                    </yp-file-upload>
                  </div>
                  <div class="layout horizontal center-center">
                    <mwc-button class="uploadNotLoggedIn" raised ?hidden="${this.loggedInUser}" @click="${this._openLogin}">
                      <iron-icon class="icon" icon="keyboard-voice"></iron-icon>
                      <span ?hidden="${!this.selectedPointForMobile}">${this.t('uploadAudioPointFor')}</span>
                      <span ?hidden="${this.selectedPointForMobile}">${this.t('uploadAudioPointAgainst')}</span>
                    </mwc-button>
                  </div>
                </div>
              `: html ``}
            </div>
          </div>
          <div ?hidden="${!this.ifLengthMobileRight}">
            <div class="addPointFab layout horizontal center-center mobileFab">
              <mwc-button raised="" disabled="${this.addPointDisabled}" .icon="add" .elevation="3" @click="${this.addMobilePointUpOrDown}" .title="${this.t('postPoint')}">
                <span ?hidden="${!this.selectedPointForMobile}">${this.t('postPointFor')}</span>
                <span ?hidden="${this.selectedPointForMobile}">${this.t('postPointAgainst')}</span>
              </mwc-button>
            </div>
          </div>
        </paper-material>
      </div>
      <div ?rtl="${this.rtl}" class="layout vertical center-center">
        <iron-scroll-threshold id="ironScrollThesholdMobile" scroll-target="document" @lower-threshold="${this._loadMorePoints}">
          <iron-list id="ironListMobile" lowerThreshold="150" ?debate-disabled="${this.post.Group.configuration.disableDebate}" .items="${this.points}" as="point" scrollTarget="document" .scrollOffset="${this.mobileScrollOffset}">
            <template>
              <div class="item layout vertical center-center" tabindex="${this.tabIndex}" role="listitem" aria-level="3">>
                <paper-material id="point${this.point.id}" .elevation="1" .animated="" class="pointMaterial pointMaterialMobile">
                  <yp-point .point="${this.point}"></yp-point>
                </paper-material>
              </div>
            </template>
          </iron-list>
        </iron-scroll-threshold>
      </div>
    `: nothing }

    <div class="layout vertical center-center">
      <yp-ajax id="newPointsAjax" @response="${this._newPointsResponse}"></yp-ajax>
      <yp-ajax id="newPointAjax" @error="${this._newPointError}" method="POST" url="/api/points" @response="${this._newPointResponse}"></yp-ajax>
    </div>

    <paper-toast id="newPointToast" .text="${this.newPointTextCombined}"></paper-toast>
  `;
  }

/*
  behaviors: [
    ypTruncateBehavior,
    ypLoggedInUserBehavior
  ],
*/

  _largeModeReady(largeMode, post) {
    return largeMode && post;
  }

  _smallModeReady(largeMode, post) {
    return !largeMode && post;
  }

  _pointMaxLength(post) {
    if (post && post.Group && post.Group.configuration && post.Group.configuration.pointCharLimit) {
      return post.Group.configuration.pointCharLimit;
    } else {
      return 500;
    }
  }

  _openLogin() {
    this.fire('yp-open-login');
  }

  _videoUpUploaded(event, detail) {
    this.uploadedVideoUpId = detail.videoId;
  }

  _videoDownUploaded(event, detail) {
    this.uploadedVideoDownId = detail.videoId;
  }

  _videoMobileUploaded(event, detail) {
    this.uploadedVideoMobileId = detail.videoId;
  }

  _audioUpUploaded(event, detail) {
    this.uploadedAudioUpId = detail.audioId;
  }

  _audioDownUploaded(event, detail) {
    this.uploadedAudioDownId = detail.audioId;
  }

  _audioMobileUploaded(event, detail) {
    this.uploadedAudioMobileId = detail.audioId;
  }

  _mobileScrollOffset(large, post) {
    if (!large && post) {
      const element = this.$$("#ironListMobile");
      if (element) {
        const top = element.getBoundingClientRect().top;
        if (top<=0) {
          top = 800;
        }
        return top;
      } else {
        console.warn("Can't find mobile list element, returning 800");
        return 800;
      }
    }
  }

  _newPointError() {
    this.addPointDisabled = false;
  }

  _ironListResizeScrollThreshold(largeMode) {
    if (largeMode) {
      return 300;
    } else {
      return 300;
    }
  }

  _ironListPaddingTop(largeMode) {
    if (largeMode) {
      return 600;
    } else {
      return 500;
    }
  }

  connectedCallback() {
    super.connectedCallback()
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
      this.isAndroid = true;
    }
    window.addEventListener("resize", this._processStoredPoints.bind(this));
  }

  detached() {
    window.removeEventListener("resize", this._processStoredPoints);
  }
/*
  listeners: {
    'yp-point-deleted': '_pointDeleted',
    'yp-update-point-in-list': '_updatePointInLists',
    'yp-iron-resize': '_ypIronResize'
  },

  observers: [
    '_setupPointTextStartState(pointUpOrDownSelected, post)'
  ],

  _setupPointTextStartState(pointUpOrDownSelected, post) {
    if (post) {
      this._pointUpOrDownSelectedChanged(pointUpOrDownSelected)
    }
  }
*/

  _ypIronResize() {
    if (this.$$("#ironListUp"))
      this.$$("#ironListUp").fire("iron-resize");
    if (this.$$("#ironListDown"))
      this.$$("#ironListDown").fire("iron-resize");
    if (this.$$("#ironListMobile"))
      this.$$("#ironListMobile").fire("iron-resize");
  }

  _loadNewPointsIfNeeded(event, detail) {
    if (this.post && this.post.id == detail.postId) {
      if (this.latestPointCreatedAt) {
        this.$$("#newPointsAjax").url = '/api/posts/' + this.post.id + '/newPoints';
        this.$$("#newPointsAjax").params = { latestPointCreatedAt: this.latestPointCreatedAt };
        this.$$("#newPointsAjax").generateRequest();
      } else {
        console.error("Trying to send point without latestPointCreatedAt");
      }
    }
  }

  _loadMorePoints() {
    if (!this.loadMoreInProgress && !this.noMorePoints) {
      this.loadMoreInProgress = true;
      if (this.post && this.storedPoints && this.storedPoints.length>0) {
        if (this.host) {
          this.$.moreAjax.url = this.host+'/api/posts/' + this.post.id + '/points';
        } else {
          this.$.moreAjax.url = '/api/posts/' + this.post.id + '/points';
        }
        this.$.moreAjax.params = {
           offsetUp: this.storedUpPointsCount ? this.storedUpPointsCount : 0,
           offsetDown: this.storedDownPointsCount ? this.storedDownPointsCount : 0,
        };
        this.$.moreAjax.generateRequest();
      } else {
        console.warn("Trying to load more points early");
        this.loadMoreInProgress = false;
      }
    }
  }

  _interleaveMorePoints(points) {
    var upPoints = [];
    var downPoints = [];

    for (var i = 0; i < points.length; i++) {
      if (points[i].value>0) {
        upPoints.push(points[i]);
      } else if (points[i].value<0) {
        downPoints.push(points[i]);
      }
    }

    return this.interleaveArrays(upPoints, downPoints);
  }

  _morePointsResponse(event, detail) {
    this.loadMoreInProgress = false;
    var points = this._preProcessPoints(detail.response.points);
    if (points.length===0) {
      this.noMorePoints = true;
    }

    let haveAddedPoint = false;
    points = this._interleaveMorePoints(points);
    points.forEach(function (point) {
      if (this._addMorePoint(point)) {
        haveAddedPoint = true;
      }
    }.bind(this));
    this.async(function () {
      if (this.$$("#ironListUp"))
        this.$$("#ironListUp").fire("iron-resize");
      if (this.$$("#ironListDown"))
        this.$$("#ironListDown").fire("iron-resize");
      if (this.$$("#ironListMobile"))
        this.$$("#ironListMobile").fire("iron-resize");
    }, 5);

    if (haveAddedPoint) {
      this._clearScrollTrigger();
    }
  }

  _clearScrollTrigger() {
    if (this.$$("#ironScrollThesholdUp"))
      this.$$("#ironScrollThesholdUp").clearTriggers();
    if (this.$$("#ironScrollThesholdDown"))
      this.$$("#ironScrollThesholdDown").clearTriggers();
    if (this.$$("#ironScrollThesholdMobile"))
      this.$$("#ironScrollThesholdMobile").clearTriggers();
  }

  _newPointsResponse(event, detail) {
    const points = this._preProcessPoints(detail.response);
    points.forEach(function (point) {
      this._insertNewPoint(point);
    }.bind(this));

    this._updateCounterInfo();
  }

  _pointDeleted() {
    this.$$("#ajax").generateRequest();
  }

  _pointsChanged(points) {
    if (points) {
      this._updateEmojiBindings();
    }
  }

  _updateEmojiBindings() {
    this.async(function () {
      if (this.largeMode) {
        const upPoint = this.$$("#up_point");
        const downPoint = this.$$("#down_point");
        const upEmoji = this.$$("#pointUpEmojiSelector");
        const downEmoji = this.$$("#pointDownEmojiSelector");
        if (upPoint && downPoint && upEmoji && downEmoji) {
          upEmoji.inputTarget = upPoint;
          downEmoji.inputTarget = downPoint;
        } else {
          console.warn("Wide: Can't bind emojis :(");
        }
      } else {
        const upDownPoint = this.$$("#mobileUpOrDownPoint");
        const upDownEmoji = this.$$("#pointUpDownEmojiSelector");
        if (upDownPoint && upDownEmoji) {
          upDownEmoji.inputTarget = upDownPoint;
        } else {
          console.warn("Small: Can't bind emojis :(");
        }
      }
    }.bind(this), 500);
  }

  _pointUpOrDownSelectedChanged(newValue) {
    if (newValue=='pointFor') {
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointForLabel) {
        this.labelMobileUpOrDown = this.post.Group.configuration.alternativePointForLabel;
      } else {
        this.labelMobileUpOrDown = this.t('point.for');
      }
      this.selectedPointForMobile = true;
    } else if (newValue=='pointAgainst') {
      if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointAgainstLabel) {
        this.labelMobileUpOrDown = this.post.Group.configuration.alternativePointAgainstLabel;
      } else {
        this.labelMobileUpOrDown = this.t('point.against');
      }
      this.selectedPointForMobile = false;
    }
  }

  _clearVideo() {
    this.uploadedVideoUpId = null;
    this.uploadedVideoDownId = null;
    this.uploadedVideoMobileId = null;
    this.currentVideoId = null;
    this.hideUpVideo = false;
    this.hideDownVideo = false;
    this.hideMobileVideo = false;
    if (this.$$("#videoFileUploadUp"))
      this.$$("#videoFileUploadUp").clear();
    if (this.$$("#videoFileUploadDown"))
      this.$$("#videoFileUploadDown").clear();
    if (this.$$("#videoFileUploadMobile"))
      this.$$("#videoFileUploadMobile").clear();
  }

  _clearAudio() {
    this.uploadedAudioUpId = null;
    this.uploadedAudioDownId = null;
    this.uploadedAudioMobileId = null;
    this.currentAudioId = null;
    this.hideUpAudio = false;
    this.hideDownAudio = false;
    this.hideMobileAudio = false;
    if (this.$$("#audioFileUploadUp"))
      this.$$("#audioFileUploadUp").clear();
    if (this.$$("#audioFileUploadDown"))
      this.$$("#audioFileUploadDown").clear();
    if (this.$$("#audioFileUploadMobile"))
      this.$$("#audioFileUploadMobile").clear();
  }

  _isAdminChanged(isAdmin) {
    if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.disableDebate && !isAdmin) {
      this.disableDebate = true;
    } else {
      this.disableDebate = false;
    }
  }

  _postChanged(newPost) {
   // Remove any manually inserted points when the list is updated
   this.points = null;
   this.upPoints = null;
   this.downPoints = null;
   this.latestPointCreatedAt = null;
   this.storedPoints = null;
   this._clearVideo();
   this._clearAudio();
   this.loadedPointIds = {};

   this.storedUpPointsCount = null;
   this.storedDownPointsCount = null;


   if (newPost) {
     if (newPost.Group && newPost.Group.configuration && newPost.Group.configuration.disableDebate && !this.isAdmin) {
       this.disableDebate = true;
     } else {
       this.disableDebate = false;
     }

     if (this.host) {
       this.$.ajax.url = this.host+'/api/posts/' + newPost.id + '/points';
     } else {
       this.$.ajax.url = '/api/posts/' + newPost.id + '/points';
     }
     this.$.ajax.generateRequest();
     if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointForLabel) {
       this.labelUp = this.post.Group.configuration.alternativePointForLabel;
     } else {
       this.labelUp = this.t('point.for');
     }
     if (this.post && this.post.Group && this.post.Group.configuration && this.post.Group.configuration.alternativePointAgainstLabel) {
       this.labelDown = this.post.Group.configuration.alternativePointAgainstLabel;
     } else {
       this.labelDown = this.t('point.against');
     }
   }

   this.async(function () {
     this._updatePointLabels();
   });
  }

  removeElementsByClass(rootElement, className) {
    const elements = rootElement.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  }

  _updatePointLabels() {
    this.async(function () {
      var forLabel = this.$$("#alternativePointForLabelId");
      var againstLabel = this.$$("#alternativePointAgainstLabelId");
      if (forLabel && forLabel.finalContent) {
        this.labelUp = forLabel.finalContent;
      }
      if (againstLabel && againstLabel.finalContent) {
        this.labelDown = againstLabel.finalContent;
      }
    });
  }

  _processStoredPoints() {
    console.info("_processStoredPoints");
    if (this.upPoints===null) {
      if (this.storedPoints && this.storedPoints.length > 0) {
        const upPoints = [];
        const downPoints = [];

        for (let i = 0; i < this.storedPoints.length; i++) {
          if (this.storedPoints[i].value>0) {
            upPoints.push(this.storedPoints[i]);
          } else if (this.storedPoints[i].value<0) {
            downPoints.push(this.storedPoints[i]);
          }
        }
        this.upPoints = upPoints;
        this.downPoints = downPoints;
      } else {
        this.upPoints = [];
        this.downPoints = [];
        this.points = [];
      }
    } else {
      console.log("Landscape points already setup");
    }

    if (!this.largeMode && !this.points) {
      this.points = this.interleaveArrays(this.upPoints, this.downPoints);
    }
    this._clearScrollTrigger();
  }

  _response(event, detail) {
    this.storedPoints = this._preProcessPoints(detail.response.points);
    this.totalCount = detail.response.count;
    this.storedUpPointsCount = 0;
    this.storedDownPointsCount = 0;

    for (var i = 0; i < this.storedPoints.length; i++) {
      if (this.storedPoints[i].value>0) {
        this.storedUpPointsCount += 1;
      } else if (this.storedPoints[i].value<0) {
        this.storedDownPointsCount += 1;
      }
      this.loadedPointIds[this.storedPoints[i].id]=true;
    }
    this._processStoredPoints();
    this.removeElementsByClass(this, 'inserted-outside-list');
    this._updateCounterInfo();
    this._scrollPointIntoView();
    this._checkForMultipleLanguages();
  }

  _updatePointInLists(event, changedPoint) {
    this.upPoints.forEach(function (point, index) {
      if (point.id===changedPoint.id) {
        this.upPoints[index] = changedPoint;
      }
    }.bind(this));

    this.downPoints.forEach(function (point, index) {
      if (point.id===changedPoint.id) {
        this.downPoints[index] = changedPoint;
      }
    }.bind(this));

    if (this.points && this.points.length>0) {
      this.points.forEach(function (point, index) {
        if (point.id===changedPoint.id) {
          this.points[index] = changedPoint;
        }
      }.bind(this));
    }
  }

  _checkForMultipleLanguages() {
    if (!localStorage.getItem("dontPromptForAutoTranslation") &&
        !sessionStorage.getItem("dontPromptForAutoTranslation")) {
      let firstLanguage;
      let multipleLanguages = false;
      this.upPoints.forEach(function (point) {
        if (point.language && !multipleLanguages) {
          if (!firstLanguage && point.language!=='??') {
            firstLanguage = point.language;
          } else if (firstLanguage && firstLanguage!==point.language && point.language!=='??') {
            multipleLanguages = true;
            console.info("Multiple point languages: "+firstLanguage+" and "+point.language);
          }
        }
      });

      if (!multipleLanguages) {
        this.downPoints.forEach(function (point) {
          if (point.language && !multipleLanguages) {
            if (!firstLanguage && point.language!=='??') {
              firstLanguage = point.language;
            } else if (firstLanguage && firstLanguage!=point.language && point.language!=='??') {
              multipleLanguages = true;
              console.info("Multiple point languages: "+firstLanguage+" and "+point.language);
            }
          }
        });
      }

      if (multipleLanguages) {
        dom(document).querySelector('yp-app').getDialogAsync("autoTranslateDialog", function (dialog) {
          dialog.openLaterIfAutoTranslationEnabled();
        }.bind(this));
      }
    }
  }

  interleaveArrays(arrayA, arrayB) {
    const arrs = [arrayA, arrayB];
    const maxLength = Math.max.apply(Math, arrs.map(function (arr) {
      return arr.length
    }));

    const result = [];

    for (let i = 0; i < maxLength; ++i) {
      arrs.forEach(function (arr) {
        if (arr.length > i) {
          result.push(arr[i])
        }
      })
    }

    return result
  }

  _scrollPointIntoView() {
    if (this.scrollToId) {
      this.async(function () {
        let hasFoundIt=false;
        if (!this.largeMode) {
          this.points.forEach(function (point) {
            if (!hasFoundIt && point.id == this.scrollToId) {
              this.$$("#ironListMobile").scrollToItem(point);
              hasFoundIt = true;
            }
          }.bind(this));
        } else {
          this.upPoints.forEach(function (point) {
            if (!hasFoundIt && point.id == this.scrollToId) {
              this.$$("#ironListUp").scrollToItem(point);
              hasFoundIt = true;
            }
          }.bind(this));
          if (!hasFoundIt) {
            this.downPoints.forEach(function (point) {
              if (!hasFoundIt && point.id == this.scrollToId) {
                this.$$("#ironListDown").scrollToItem(point);
                hasFoundIt = true;
              }
            }.bind(this));
          }
        }

        if (hasFoundIt) {
          this.async(function () {
            // Change elevation
            const point = this.$$("#point"+this.scrollToId);
            if (point) {
              point.elevation = 5;
              point.elevation = 1;
              point.elevation = 5;
              this.async(function () {
                point.elevation = 1;
              }.bind(this), 7000);
            } else {
              console.warn("Can't find point to elevate");
            }
            this.scrollToId = null;
          }, 50);
        }
      }, 20);
    }
  }

  _floatIfValueOrIE(value) {
    const ie11 = /Trident.*rv[ :]*11\./.test(navigator.userAgent);
    return ie11 || value;
  }

  _preProcessPoints(points) {
    for (let i = 0; i < points.length; i++) {
      if (!this.latestPointCreatedAt || (!this.latestPointCreatedAt || points[i].created_at > this.latestPointCreatedAt)) {
        this.latestPointCreatedAt = points[i].created_at;
      }
      if (points[i].PointRevisions[points[i].PointRevisions.length-1] && points[i].PointRevisions[points[i].PointRevisions.length-1].content) {
        points[i].latestContent = points[i].PointRevisions[points[i].PointRevisions.length-1].content;
      } else {
        console.warn("No content for point in _preProcessPoints");
      }
    }
    return points;
  }

  _updateCounterInfo() {
    if (this.largeMode) {
      this.fire('yp-debate-info', {
        count: this.totalCount,
        firstPoint: this.upPoints[0]
      });
    } else {
      this.fire('yp-debate-info', {
        count: this.totalCount,
        firstPoint: this.points[0]
      });
    }
  }

  _insertNewPoint(point) {
    if (!this.loadedPointIds[point.id]) {
      this.loadedPointIds[point.id] = true;
      if (this.largeMode) {
        if (point.value > 0) {
          this.unshift('upPoints', point);
          this.async(function () {
            this.$$("#ironListUp").fire("iron-resize");
          }, 700);
        } else if (point.value < 0) {
          this.unshift('downPoints', point);
          this.async(function () {
            this.$$("#ironListDown").fire("iron-resize");
          }, 700);
        }
      } else {
        this.unshift('points', point);
        this.async(function () {
          this.$$("#ironListMobile").fire("iron-resize");
        }, 700);
      }
      this.unshift('storedPoints', point);
    }
  }

  _addMorePoint(point) {
    let haveAddedPoints = false;
    if (!this.loadedPointIds[point.id]) {
      this.loadedPointIds[point.id] = true;
      haveAddedPoints = true;
      if (this.largeMode) {
        if (point.value > 0) {
          this.push('upPoints', point);
        } else if (point.value < 0) {
          this.push('downPoints', point);
        }
      } else {
        this.push('points', point);
      }

      this.push('storedPoints', point);

      if (point.value > 0) {
        this.storedUpPointsCount += 1;
      } else if (point.value < 0) {
        this.storedDownPointsCount += 1;
      }
    }

    return haveAddedPoints;
  }


  _newPointResponse(inEvent, inDetail) {
    if (this.currentVideoId) {
      const point = this._preProcessPoints([inDetail.response])[0];
      const ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';
      ajax.url = '/api/videos/'+point.id+'/completeAndAddToPoint';
      ajax.method = 'PUT';
      ajax.body = {
        videoId: this.currentVideoId,
        appLanguage: this.language
      };
      ajax.addEventListener('response', function (event, detail) {
        this._completeNewPointResponse(event, event.detail);
        window.appGlobals.showSpeechToTextInfoIfNeeded();
      }.bind(this));
      ajax.generateRequest();
    } else if (this.currentAudioId) {
      const point = this._preProcessPoints([inDetail.response])[0];
      const ajax = document.createElement('iron-ajax');
      ajax.handleAs = 'json';
      ajax.contentType = 'application/json';
      ajax.url = '/api/audios/'+point.id+'/completeAndAddToPoint';
      ajax.method = 'PUT';
      ajax.body = {
        audioId: this.currentAudioId,
        appLanguage: this.language
      };
      ajax.addEventListener('response', function (event, detail) {
        this._completeNewPointResponse(event, event.detail);
        window.appGlobals.showSpeechToTextInfoIfNeeded();
      }.bind(this));
      ajax.generateRequest();
    } else {
      this._completeNewPointResponse(inEvent, inDetail);
    }
  }

  _completeNewPointResponse(event, detail) {
    this.addPointDisabled = false;
    const point = this._preProcessPoints([detail.response])[0];
    if (this.currentVideoId) {
      point.checkTranscriptFor = "video";
    } else if (this.currentAudioId) {
      point.checkTranscriptFor = "audio";
    }
    if (point.value > 0) {
      this.newPointTextCombined = this.t("point.forAdded") + " " + this.truncate(point.content, 21);
      this.textValueUp = "";
    } else {
      this.newPointTextCombined = this.t("point.againstAdded") + " " + this.truncate(point.content, 21);
      this.textValueDown = "";
    }
    this.textValueMobileUpOrDown = "";
    this._insertNewPoint(point);
    this.post.counter_points = this.post.counter_points + 1;
    this.$$("#newPointToast").show();
    this._updateCounterInfo();
    if (point.value > 0) {
      window.appGlobals.activity('completed', 'newPointFor');
    } else {
      window.appGlobals.activity('completed', 'newPointAgainst');
    }
    this._clearVideo();
    this._clearAudio();
  }

  addPointUp() {
    this.addPoint(this.textValueUp, 1, this.uploadedVideoUpId, this.uploadedAudioUpId);
    window.appGlobals.activity('add', 'pointUp');
  }

  addPointDown() {
    this.addPoint(this.textValueDown, -1, this.uploadedVideoDownId, this.uploadedAudioDownId);
    window.appGlobals.activity('add', 'pointDown');
  }

  addMobilePointUpOrDown() {
    if (this.pointUpOrDownSelected=='pointFor') {
      this.addPoint(this.textValueMobileUpOrDown, 1, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
      window.appGlobals.activity('add', 'pointUp');
    } else if (this.pointUpOrDownSelected=='pointAgainst') {
      this.addPoint(this.textValueMobileUpOrDown, -1, this.uploadedVideoMobileId, this.uploadedAudioMobileId);
      window.appGlobals.activity('add', 'pointDown');
    }
  }

  addPoint(content, value, videoId, audioId) {
    if (window.appUser.loggedIn() === true) {
      this.$$("#newPointAjax").url = "/api/points/" + this.post.group_id;
      this.$$("#newPointAjax").body = {
        postId: this.post.id,
        content: content,
        value: value
      };
      this.$$("#newPointAjax").generateRequest();
      this.addPointDisabled = true;
      if (videoId)
        this.currentVideoId = videoId;
      else if (audioId)
        this.currentAudioId = audioId;
    } else {
      window.appUser.loginForNewPoint(this, {content: content, value: value});
    }
  }

  focusUpPoint() {
    window.appGlobals.activity('focus', 'pointUp');
  }

  focusDownPoint() {
    window.appGlobals.activity('focus', 'pointDown');
  }

  focusTextArea(event) {
    if (window.innerWidth>500)
      event.currentTarget.parentElement.elevation = 2;
  }

  blurTextArea(event) {
    event.currentTarget.parentElement.elevation = 1;
  }

  _hasCurrentUpVideo(value) {
    if (value) {
      this.hideUpAudio = true;
      this.hideUpText = true;
    } else {
      this.hideUpAudio = false;
      this.hideUpText = false;
    }
  }

  _hasCurrentDownVideo(value) {
    if (value) {
      this.hideDownAudio = true;
      this.hideDownText = true;
    } else {
      this.hideDownAudio = false;
      this.hideDownText = false;
    }
  }

  _hasCurrentUpAudio(value) {
    if (value) {
      this.hideUpVideo = true;
      this.hideUpText = true;
    } else {
      this.hideUpVideo = false;
      this.hideUpText = false;
    }
  }

  _hasCurrentDownAudio(value) {
    if (value) {
      this.hideDownVideo = true;
      this.hideDownText = true;
    } else {
      this.hideDownVideo = false;
      this.hideDownText = false;
    }
  }

  _hasCurrentMobileVideo(value) {
    if (value) {
      this.hideMobileAudio = true;
      this.hideMobileText = true;
    } else {
      this.hideMobileAudio = false;
      this.hideMobileText = false;
    }
  }

  _hasCurrentMobileAudio(value) {
    if (value) {
      this.hideMobileVideo = true;
      this.hideMobileText = true;
    } else {
      this.hideMobileVideo = false;
      this.hideMobileText = false;
    }
  }

  ifLengthIsRight(type, textValue, hasVideoId, hasAudioId) {
    if (hasVideoId != null) {
      if (type==="up") {
        this.hideUpVideo = false;
        this.hideUpAudio = true;
        this.hideUpText = true;
      }
      if (type==="down") {
        this.hideDownVideo = false;
        this.hideDownAudio = true;
        this.hideDownText = true;
      }
      if (type==="mobile") {
        this.hideMobileVideo = false;
        this.hideMobileAudio = true;
        this.hideMobileText = true;
      }
      return true;
    } else  if (hasAudioId != null) {
      if (type==="up") {
        this.hideUpAudio = false;
        this.hideUpVideo = true;
        this.hideUpText = true;
      }
      if (type==="down") {
        this.hideDownAudio = false;
        this.hideDownVideo = true;
        this.hideDownText = true;
      }
      if (type==="mobile") {
        this.hideMobileAudio = false;
        this.hideMobileVideo = true;
        this.hideMobileText = true;
      }
      return true;
    } else if (textValue!=null && textValue.length === 0) {
      if (type==="up") {
        this.hideUpVideo = false;
        this.hideUpAudio = false;
        this.hideUpText = false;
      }
      if (type==="down") {
        this.hideDownVideo = false;
        this.hideDownAudio = false;
        this.hideDownText = false;
      }
      if (type==="mobile") {
        this.hideMobileVideo = false;
        this.hideMobileAudio = false;
        this.hideMobileText = false;
      }
      return false;
    } else if (textValue!=null && textValue.length > 0) {
      if (type==="up") {
        this.hideUpVideo = true;
        this.hideUpAudio = true;
        this.hideUpText = false;
      }
      if (type==="down") {
        this.hideDownVideo = true;
        this.hideDownAudio = true;
        this.hideDownText = false;
      }
      if (type==="mobile") {
        this.hideMobileVideo = true;
        this.hideMobileAudio = true;
        this.hideMobileText = false;
      }
      return true;
    } else if (textValue!=null && textValue.length > 1) {
      return true;
    } else {
      return false;
    }
  }
}

window.customElements.define('yp-post-points-lit', YpPostPointsLit)
