import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      #dialog {
        width: 90%;
        max-height: 90%;
        background-color: #FFF;
      }

      iron-list {
        color: #000;
        height: 500px;
        width: 100%;
      }

      .pageItem {
        padding-right: 16px;
      }

      .id {
        width: 60px;
      }

      .title {
        width: 200px;
      }

      .email {
        width: 240px;
      }

      #editPageLocale {
        width: 80%;
        max-height: 80%;
        background-color: #FFF;
      }

      .locale {
        width: 30px;
        cursor: pointer;
      }

      paper-textarea {
        height: 60%;
      }

      .localeInput {
        width: 26px;
      }

      .pageItem {
        padding-top: 8px;
      }

      [hidden] {
        display: none !important;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>

    <paper-dialog id="editPageLocale" modal="" class="layout vertical">
      <h2>[[t('pages.editPageLocale')]]</h2>

      <paper-dialog-scrollable>
        <paper-input id="title" name="title" type="text" label="[[t('pages.title')]]" value="{{currentlyEditingTitle}}" maxlength="60" char-counter="" class="mainInput">
        </paper-input>

        <paper-textarea id="content" name="content" value="{{currentlyEditingContent}}" always-float-label="[[currentlyEditingContent]]" label="[[t('pages.content')]]" rows="7" max-rows="10">
        </paper-textarea>
      </paper-dialog-scrollable>


      <div class="buttons">
        <paper-button on-tap="_closePageLocale" dialog-dismiss="">[[t('close')]]</paper-button>
        <paper-button on-tap="_updatePageLocale" dialog-dismiss="">[[t('save')]]</paper-button>
      </div>
    </paper-dialog>

    <paper-dialog id="dialog">
      <h2>[[headerText]]</h2>
      <iron-list items="[[pages]]" as="page">
        <template>
          <div class="layout horizontal">
            <div class="pageItem id">
              [[page.id]]
            </div>
            <div class="pageItem title">
              [[page.title.en]]
            </div>
            <template is="dom-repeat" items="[[_toLocaleArray(page.title)]]" class="pageItem">
              <div class="layout vertical center-center">
                <a class="locale" data-args-page\$="[[page]]" data-args-locale\$="[[item.locale]]" on-tap="_editPageLocale">[[item.locale]]</a>
              </div>
            </template>
            <paper-input no-label-float="" class="localeInput" length="2" maxlength="2" value="{{newLocaleValue}}"></paper-input>
            <paper-button data-args\$="[[page.id]]" on-tap="_addLocale">[[t('pages.addLocale')]]</paper-button>
            <div hidden\$="[[page.published]]">
              <paper-button data-args\$="[[page.id]]" on-tap="_publishPage">[[t('pages.publish')]]</paper-button>
            </div>
            <div hidden\$="[[!page.published]]">
              <paper-button data-args\$="[[page.id]]" on-tap="_unPublishPage">[[t('pages.unPublish')]]</paper-button>
            </div>
            <paper-button data-args\$="[[page.id]]" on-tap="_deletePage">[[t('pages.deletePage')]]</paper-button>
          </div>
        </template>
      </iron-list>
      <div class="layout horizontal">
        <paper-button id="addPageButton" on-tap="_addPage">[[t('pages.addPage')]]</paper-button>
      </div>

      <div class="buttons">
        <paper-button dialog-dismiss="">[[t('close')]]</paper-button>
      </div>
    </paper-dialog>

    <div class="layout horizontal center-center">
      <yp-ajax id="ajax" on-response="_pagesResponse"></yp-ajax>
      <yp-ajax method="POST" id="newPageAjax" on-response="_newPageResponse"></yp-ajax>
      <yp-ajax method="DELETE" id="deletePageAjax" on-response="_deletePageResponse"></yp-ajax>
      <yp-ajax method="PUT" id="updatePageAjax" on-response="_updatePageResponse"></yp-ajax>
      <yp-ajax method="PUT" id="publishPageAjax" on-response="_publishPageResponse"></yp-ajax>
      <yp-ajax method="PUT" id="unPublishPageAjax" on-response="_unPublishPageResponse"></yp-ajax>
    </div>
`,

  is: 'yp-pages-grid',

  behaviors: [
    ypLanguageBehavior,
    WordWrap
  ],

  properties: {
    pages: {
      type: Array,
      notify: true
    },

    headerText: {
      type: String
    },

    groupId: {
      type: Number,
      observer: '_groupIdChanged'
    },

    domainId: {
      type: Number,
      observer: '_domainIdChanged'
    },

    communityId: {
      type: Number,
      observer: '_communityIdChanged'
    },

    selected: {
      type: Object
    },

    modelType: {
      type: String
    },

    newLocaleValue: {
      type: String
    },

    currentlyEditingLocale: {
      type: String
    },

    currentlyEditingPage: {
      type: Object
    },

    currentlyEditingTitle: {
      type: String
    },

    currentlyEditingContent: {
      type: String
    }
  },

  _toLocaleArray: function(obj) {
    var array = Object.keys(obj).map(function(key) {
      return {
        locale: key,
        value: obj[key]
      };
    });

    return __.sortBy(array, function(o) { return o.item; });
  },

  _editPageLocale: function (event) {
    this.set('currentlyEditingPage', JSON.parse(event.target.getAttribute('data-args-page')));
    this.set('currentlyEditingLocale', event.target.getAttribute('data-args-locale'));
    this.set('currentlyEditingContent',this.wordwrap(120)(this.currentlyEditingPage["content"][this.currentlyEditingLocale]));
    this.set('currentlyEditingTitle',this.currentlyEditingPage["title"][this.currentlyEditingLocale]);
    this.$.editPageLocale.open();
  },

  _closePageLocale: function () {
    this.set('currentlyEditingPage', null);
    this.set('currentlyEditingLocale', null);
    this.set('currentlyEditingContent', null);
    this.set('currentlyEditingTitle', null);
  },

  _dispatchAjax: function(ajax, pageId, path) {
    var pageIdPath;
    if (pageId) {
      pageIdPath = "/" + pageId + "/" + path;
    } else {
      pageIdPath = "/" + path;
    }
    if (this.modelType=="groups" && this.groupId) {
      ajax.url = "/api/" + this.modelType + "/" + this.groupId + pageIdPath;
      ajax.generateRequest();
    } else if (this.modelType=="communities" && this.communityId) {
      ajax.url = "/api/" + this.modelType + "/" + this.communityId +  pageIdPath;
      ajax.generateRequest();
    } else if (this.modelType=="domains" && this.domainId) {
      ajax.url = "/api/" + this.modelType + "/" + this.domainId + pageIdPath;
      ajax.generateRequest();
    } else {
      console.warn("Can't find model type or ids");
    }
  },

  _updatePageLocale: function () {
    this.$.updatePageAjax.body = {
      locale: this.currentlyEditingLocale,
      content: this.currentlyEditingContent,
      title: this.currentlyEditingTitle
    };
    this._dispatchAjax(this.$.updatePageAjax, this.currentlyEditingPage.id, "update_page_locale")
    this._closePageLocale();
  },

  _publishPage: function (event) {
    this.$.updatePageAjax.body = {};
    var pageId = event.target.getAttribute('data-args');
    this._dispatchAjax(this.$.updatePageAjax, pageId, "publish_page")
  },

  _publishPageResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('pages.pagePublished'));
    this.$.ajax.generateRequest();
  },

  _unPublishPage: function (event) {
    this.$.updatePageAjax.body = {};
    var pageId = event.target.getAttribute('data-args');
    this._dispatchAjax(this.$.updatePageAjax, pageId, "un_publish_page")
  },

  _unPublishPageResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('pages.pageUnPublished'));
    this.$.ajax.generateRequest();
  },

  _deletePage: function (event) {
    this.$.deletePageAjax.body = {};
    var pageId = event.target.getAttribute('data-args');
    this._dispatchAjax(this.$.deletePageAjax, pageId, "delete_page")
  },

  _deletePageResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('pages.pageDeleted'));
    this.$.ajax.generateRequest();
  },

  _addLocale: function (event) {
    if (this.newLocaleValue && this.newLocaleValue.length>1) {
      var pageId = event.target.getAttribute('data-args');
      this.$.updatePageAjax.body = {
        locale: this.newLocaleValue.toLowerCase(),
        content: '',
        title: ''
      };
      this._dispatchAjax(this.$.updatePageAjax, pageId, "update_page_locale")
      this.set('newLocaleValue', null);
    }
  },

  _addPage: function (event) {
    this.$.newPageAjax.body = {};
    this.$.addPageButton.disabled = true;
    this._dispatchAjax(this.$.newPageAjax, null, "add_page")
  },

  _newPageResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('pages.newPageCreated'));
    this.$.ajax.generateRequest();
    this.$.addPageButton.disabled = false;
  },

  _updatePageResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('posts.updated'));
    this.$.ajax.generateRequest();
  },

  _domainIdChanged: function (newGroupId) {
    if (newGroupId) {
      this.set('modelType', 'domains');
      this._generateRequest(newGroupId);
    }
  },

  _groupIdChanged: function (newGroupId) {
    if (newGroupId) {
      this.set('modelType', 'groups');
      this._generateRequest(newGroupId);
    }
  },

  _communityIdChanged: function (newCommunityId) {
    if (newCommunityId) {
      this.set('modelType', 'communities');
      this._generateRequest(newCommunityId);
    }
  },

  _generateRequest: function (id) {
    this.$.ajax.url = "/api/"+this.modelType+"/"+id+"/pages_for_admin";
    this.$.ajax.generateRequest();
  },

  _pagesResponse: function (event, detail) {
    this.set('pages', detail.response);
  },

  setup: function (groupId, communityId, domainId, adminUsers) {
    this.set('groupId', null);
    this.set('communityId', null);
    this.set('domainId', null);
    this.set('pages', null);

    if (groupId)
      this.set('groupId', groupId);

    if (communityId)
      this.set('communityId', communityId);

    if (domainId)
      this.set('domainId', domainId);

    this._setupHeaderText();
  },

  open: function () {
    this.$.dialog.open();
  },

  _setupHeaderText: function () {
    if (this.groupId) {
      this.set('headerText', this.t('group.pages'));
    } else if (this.communityId) {
      this.set('headerText', this.t('community.pages'));
    } else if (this.domainId) {
      this.set('headerText', this.t('domain.pages'));
    }
  }
});
