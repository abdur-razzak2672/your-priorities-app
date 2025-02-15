var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { property, customElement } from "lit/decorators.js";
import "@material/web/button/text-button.js";
import "../yp-user/yp-user-info.js";
import "../common/languages/yp-language-selector.js";
import "./ac-notification-list-post.js";
import "./ac-notification-list-point.js";
import "./ac-notification-list-general-item.js";
import { YpFormattingHelpers } from "../common/YpFormattingHelpers.js";
import { YpBaseElementWithLogin } from "../common/yp-base-element-with-login.js";
let AcNotificationList = class AcNotificationList extends YpBaseElementWithLogin {
    constructor() {
        super(...arguments);
        this.notificationGetTTL = 5000;
        this.url = "/api/notifications";
        this.firstReponse = false;
        this.unViewedCount = 0;
        this.moreToLoad = false;
        this.opened = false;
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has("user")) {
            this._userChanged();
        }
        if (changedProperties.has("open")) {
            this._openedChanged();
        }
        if (changedProperties.has("loggedInUser")) {
            this._loggedInUserChanged();
        }
    }
    static get styles() {
        return [
            super.styles,
            css `
        lit-virtualizer {
          flex: 1 1 auto;
        }

        p {
          text-align: left;
        }

        .notificationItem {
          margin-bottom: 8px;
          padding-bottom: 8px;
        }

        .unViewedCount {
          padding-top: 8px;
          font-size: 14px;
        }

        [hidden] {
          display: none !important;
        }

        #material {
          z-index: 300;
          margin: 0 !important;
          padding: 8px;
          height: 100vh;
          overflow-x: scroll;
          background-color: var(--md-sys-color-surface-container-high);
          color: var(--md-sys-color-on-surface);
        }

        .notificationHeader {
          font-size: 18px;
          padding-top: 8px;
        }

        #notificationsList {
          width: 100% !important;
          overflow: hidden;
        }

        :focus {
        }

        .overflowSettings {
          overflow-x: hidden;
          max-width: 255px !important;
        }

        .notificationHeader {
          margin-bottom: 2px;
        }

        yp-language-selector {
          margin: 16px;
        }

        .themeSelection {
          margin-top: 16px;
        }
      `,
        ];
    }
    renderNotification(notification) {
        switch (notification.type) {
            case "postNotification":
            case "notification.post.new":
            case "notification.post.endorsement":
                return html `
          <ac-notification-list-post
            class="notificationItem"
            .notification="${notification}"
          ></ac-notification-list-post>
        `;
            case "pointNotification":
            case "notification.point.new":
            case "notification.point.quality":
                return html `
          <ac-notification-list-point
            class="notificationItem"
            .notification="${notification}"
          ></ac-notification-list-point>
        `;
            case "notification.post.status.change":
                return html `
          <ac-notification-list-post
            class="notificationItem"
            .notification="${notification}"
          ></ac-notification-list-post>
        `;
            case "notification.point.newsStory":
                return html `
          <ac-notification-list-general-item
            icon="face"
            .notification="${notification}"
            .shortText="${notification.AcActivities[0].Point.content}"
          >
          </ac-notification-list-general-item>
        `;
            case "notification.point.comment":
                return html `
          <ac-notification-list-general-item
            icon="chat_bubble_outline"
            .notification="${notification}"
            .shortText="${notification.AcActivities[0].Point.content}"
          ></ac-notification-list-general-item>
        `;
            case "notification.generalUserNotification":
                return html `
          <ac-notification-list-general-item
            icon="language"
            .notification="${notification}"
            .shortText="${this._getNotificationTypeAndName(notification.AcActivities[0].object?.type, notification.AcActivities[0].object?.name)}"
          ></ac-notification-list-general-item>
        `;
            default:
                return nothing;
        }
    }
    render() {
        return html `
      <div id="material" class="oversflowSettings">
        ${this.loggedInUser
            ? html `
              <yp-user-info
                @open-user-edit="${this._openEdit}"
                .user="${this.loggedInUser}"
              ></yp-user-info>
              <div class="layout horizontal center-center themeSelection">
                ${this.renderThemeToggle()}
              </div>
              <div class="languageSelector layout vertical self-start">
                <yp-language-selector
                  class="languageSelector"
                ></yp-language-selector>
              </div>
              <div
                class="notificationHeader layout horizontal center-center"
                ?hidden="${!this.notificationsLength}"
              >
                ${this.t("notifications")}
              </div>
              <div
                ?hidden="${!this.unViewedCount}"
                class="unViewedCount layout vertical center-center"
              >
                <div>${this.unViewedCount} ${this.t("unviewed")}</div>
                <md-text-button
                  @click="${this._markAllAsViewed}"
                  .label="${this.t("notificationMarkAllViewed")}"
                ></md-text-button>
              </div>

              ${this.notifications
                ? html `
                    <lit-virtualizer
                      .items=${this.notifications}
                      .scrollTarget="${window}"
                      id="activitiesList"
                      scrollOffset="300"
                      .renderItem=${this.renderNotification}
                      @rangeChanged=${this.scrollEvent}
                    ></lit-virtualizer>
                  `
                : nothing}
            `
            : html ``}
      </div>
    `;
    }
    scrollEvent(event) {
        //TODO: Check this logic
        if (this.notifications &&
            !this.moreToLoad &&
            event.last != -1 &&
            event.last < this.notifications.length &&
            event.last + 5 >= this.notifications.length) {
            this.moreToLoad = true;
            this._loadMoreData();
        }
    }
    get notificationsLength() {
        if (this.notifications) {
            return this.notifications.length;
        }
        else {
            return 0;
        }
    }
    _openedChanged() {
        if (this.opened) {
            setTimeout(() => {
                this.markCurrentAsViewed();
            }, 25);
        }
    }
    _getNotificationTypeAndName(theType, name) {
        return theType ? this.t(theType) + " " + (name ? name : "") : "";
    }
    _openEdit() {
        window.appDialogs.getDialogAsync("userEdit", (dialog) => {
            dialog.setup(this.loggedInUser, false, undefined);
            dialog.open(false, { userId: this.loggedInUser.id });
        });
    }
    _clearScrollThreshold() {
        //TODO: See if this is needed
        //this.$$('#threshold').clearTriggers();
    }
    _markAllAsViewed() {
        window.appDialogs.getDialogAsync("confirmationDialog", (dialog) => {
            dialog.open(this.t("notificationConfirmMarkAllViewed"), this._reallyMarkAllAsViewed.bind(this));
        });
    }
    async _reallyMarkAllAsViewed() {
        await window.serverApi.setNotificationsAllAsViewed();
        this._handleUnViewedCount(0);
        this._setAllLocalCurrentAsViewed();
    }
    _handleUnViewedCount(unViewedCount) {
        this.unViewedCount = unViewedCount;
        this.fire("yp-set-number-of-un-viewed-notifications", {
            count: unViewedCount,
        });
    }
    markCurrentAsViewed() {
        this._markAsViewed(this.notifications);
    }
    _markAsViewed(notifications) {
        const marked = [];
        if (notifications) {
            notifications.forEach(function (notification) {
                if (!notification.viewed) {
                    marked.push(notification.id);
                }
            });
        }
        if (marked.length > 0) {
            this._setAsViewed({ viewedIds: marked });
        }
    }
    async _setAsViewed(body) {
        const setAsViewResponse = (await window.serverApi.setNotificationsAsViewed(body));
        this._handleUnViewedCount(setAsViewResponse.unViewedCount);
        const viewedIds = setAsViewResponse.viewedIds;
        if (this.notifications) {
            this.notifications.forEach((notification, index, theArray) => {
                if (viewedIds.indexOf(notification.id) > -1) {
                    theArray[index].viewed = true;
                }
            });
        }
    }
    _setAllLocalCurrentAsViewed() {
        if (this.notifications) {
            this.notifications.forEach(function (notification, index, theArray) {
                theArray[index].viewed = true;
            });
        }
    }
    //TODO: Add a way to detect an error through the Fetch API so we can implement this
    _newNotificationsError(event) {
        console.error("Error in getting new notifications");
        if (navigator.onLine) {
            this.cancelTimer();
        }
        else {
            this._startTimer();
        }
        if (event.detail && event.detail.status && event.detail.status == 401) {
            window.appUser.checkLogin();
        }
    }
    async _getNotifications(options = undefined) {
        let url = this.url;
        if (options && options.oldestProcessedNotificationAt) {
            url += "?beforeDate=" + options.oldestProcessedNotificationAt;
        }
        else if (options && options.latestProcessedNotificationAt) {
            url += "?afterDate=" + options.latestProcessedNotificationAt;
        }
        return (await window.serverApi.getAcNotifications(url));
    }
    _processNotifications(notificationsResponse) {
        if (notificationsResponse.oldestProcessedNotificationAt) {
            this.oldestProcessedNotificationAt =
                notificationsResponse.oldestProcessedNotificationAt;
        }
        if (!this.notifications) {
            this.notifications = notificationsResponse.notifications;
        }
        else {
            notificationsResponse.notifications.forEach((notification) => {
                this.notifications?.push(notification);
            });
        }
        this._finalizeAfterResponse(notificationsResponse.notifications);
        if (this.firstReponse) {
            this.firstReponse = false;
            this.loadNewData();
        }
        else {
            if (this.opened) {
                this._markAsViewed(notificationsResponse.notifications);
            }
        }
        this._handleUnViewedCount(notificationsResponse.unViewedCount);
    }
    async _userChanged() {
        if (this.loggedInUser) {
            this._processNotifications(await this._getNotifications());
        }
        else {
            this.cancelTimer();
        }
    }
    _loggedInUserChanged() {
        if (!this.loggedInUser) {
            this.cancelTimer();
        }
    }
    cancelTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = undefined;
        }
    }
    _notificationType(notification, type) {
        if (notification.type == type) {
            return true;
        }
        else if (type == "postNotification") {
            return (["notification.post.new", "notification.post.endorsement"].indexOf(notification.type) > -1);
        }
        else if (type == "pointNotification") {
            return (["notification.point.new", "notification.point.quality"].indexOf(notification.type) > -1);
        }
        else if (type == "system") {
            return false;
        }
        else {
            return false;
        }
    }
    _startTimer() {
        this.cancelTimer();
        if (this.loggedInUser) {
            this.timer = setTimeout(() => {
                this.loadNewData();
                this.lastFetchStartedAt = Date.now();
            }, this.notificationGetTTL);
        }
    }
    _sendReloadPointsEvents(notifications) {
        notifications.forEach((notification) => {
            if (notification.type == "notification.point.new") {
                const activityUser = notification.AcActivities[0].User;
                if (window.appUser.user &&
                    activityUser &&
                    window.appUser.user.id != activityUser.id) {
                    this.fireGlobal("yp-update-points-for-post", {
                        postId: notification.AcActivities[0].Post.id,
                    });
                }
            }
        });
    }
    _loadNewNotificationsResponse(notificationsResponse) {
        const notifications = notificationsResponse.notifications;
        notifications.forEach((notification) => {
            this._removeOldIfExists(notification);
            if (notification.type == "notification.point.new") {
                // ...
            }
        });
        notifications.forEach((notification) => {
            this.notifications?.unshift(notification);
        });
        this._finalizeAfterResponse(notifications);
        this._startTimer();
        this._displayToast(notifications);
        this._sendReloadPointsEvents(notifications);
        if (this.opened) {
            this._markAsViewed(notifications);
        }
        this._handleUnViewedCount(notificationsResponse.unViewedCount);
        //TODO: See if we need to do this
        //this.$$("#list").fire("iron-resize");
        if (this.lastFetchStartedAt) {
            const duration = Date.now() - this.lastFetchStartedAt;
            if (duration > 1000) {
                console.warn("Setting notificationGetTTL = 60000");
                this.notificationGetTTL = 60000;
            }
            else if (duration > 10000) {
                console.warn("Setting notificationGetTTL = 60000*5");
                this.notificationGetTTL = 60000 * 5;
            }
        }
    }
    _removeOldIfExists(notification) {
        this.notifications.forEach((oldNotification, index) => {
            if (oldNotification.id == notification.id) {
                this.notifications?.splice(index, 1);
            }
        });
    }
    _getNotificationText(notification) {
        let ideaName, object;
        if (notification.AcActivities[0].Post) {
            ideaName =
                YpFormattingHelpers.truncate(notification.AcActivities[0].Post.name, 30) + ": ";
        }
        if (notification.AcActivities[0].object) {
            object = notification.AcActivities[0].object;
        }
        if (notification.type === "notification.post.new") {
            return ideaName + this.t("post.new");
        }
        else if (notification.type === "notification.post.endorsement") {
            if (notification.AcActivities[0].type === "activity.post.endorsement.new") {
                return ideaName + this.t("endorsedYourPost");
            }
            else {
                return ideaName + this.t("opposedYourPost");
            }
        }
        else if (notification.type === "notification.point.new") {
            if (notification.AcActivities[0].Point.value > 0) {
                return ideaName + this.t("point.forAdded");
            }
            else {
                return ideaName + this.t("point.againstAdded");
            }
        }
        else if (notification.type === "notification.point.quality") {
            if (notification.AcActivities[0].type === "activity.point.helpful.new") {
                return ideaName + this.t("upVotedPoint");
            }
            else {
                return ideaName + this.t("downVotedPoint");
            }
        }
        else if (notification.type == "notification.generalUserNotification" &&
            object) {
            return this.t(object.type) + " " + object.name;
        }
        else {
            return "";
        }
    }
    _displayToast(notifications) {
        const notMyNotifications = notifications.filter((notification) => {
            const activityUser = notification.AcActivities[0].User;
            return (window.appUser.user &&
                activityUser &&
                window.appUser.user.id != activityUser.id &&
                notification.type !== "notification.generalUserNotification");
        });
        if (notMyNotifications && notMyNotifications.length > 0) {
            const activityUser = notMyNotifications[0].AcActivities[0].User;
            window.appDialogs.getDialogAsync("notificationToast", (dialog) => {
                dialog.openDialog(activityUser, this._getNotificationText(notMyNotifications[0]) || "", notMyNotifications[0].type ===
                    "notification.generalUserNotification");
            });
        }
    }
    _finalizeAfterResponse(notifications) {
        if (notifications.length > 0) {
            if (!this.latestProcessedNotificationAt ||
                this.latestProcessedNotificationAt < notifications[0].updated_at) {
                this.latestProcessedNotificationAt = notifications[0].updated_at;
            }
            this.moreToLoad = true;
        }
        setTimeout(() => {
            //TODO: See if needed
            if (this.$$("#list")) {
                //this.$$("#list").fire('iron-resize');
            }
        }, 100);
    }
    async _loadMoreData() {
        this._clearScrollThreshold();
        if (this.oldestProcessedNotificationAt) {
            this.moreToLoad = false;
            this._processNotifications(await this._getNotifications({
                oldestProcessedNotificationAt: this.oldestProcessedNotificationAt,
            }));
        }
    }
    async loadNewData() {
        if (this.latestProcessedNotificationAt) {
            this._loadNewNotificationsResponse(await this._getNotifications({
                latestProcessedNotificationAt: this.latestProcessedNotificationAt,
            }));
        }
        else if (!this.latestProcessedNotificationAt) {
            this._loadNewNotificationsResponse(await this._getNotifications());
        }
    }
};
__decorate([
    property({ type: Array })
], AcNotificationList.prototype, "notifications", void 0);
__decorate([
    property({ type: Number })
], AcNotificationList.prototype, "notificationGetTTL", void 0);
__decorate([
    property({ type: Object })
], AcNotificationList.prototype, "oldestProcessedNotificationAt", void 0);
__decorate([
    property({ type: Object })
], AcNotificationList.prototype, "latestProcessedNotificationAt", void 0);
__decorate([
    property({ type: String })
], AcNotificationList.prototype, "url", void 0);
__decorate([
    property({ type: Object })
], AcNotificationList.prototype, "user", void 0);
__decorate([
    property({ type: Boolean })
], AcNotificationList.prototype, "firstReponse", void 0);
__decorate([
    property({ type: Number })
], AcNotificationList.prototype, "timer", void 0);
__decorate([
    property({ type: Number })
], AcNotificationList.prototype, "unViewedCount", void 0);
__decorate([
    property({ type: Boolean })
], AcNotificationList.prototype, "moreToLoad", void 0);
__decorate([
    property({ type: Boolean })
], AcNotificationList.prototype, "opened", void 0);
__decorate([
    property({ type: String })
], AcNotificationList.prototype, "route", void 0);
AcNotificationList = __decorate([
    customElement("ac-notification-list")
], AcNotificationList);
export { AcNotificationList };
//# sourceMappingURL=ac-notification-list.js.map