import "../ac-notifications/ac-notification-list.js";
import { nothing } from "lit";
import "./yp-snackbar.js";
import "./yp-drawer.js";
import "@material/web/button/text-button.js";
import "@material/web/labs/badge/badge.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/menu/menu.js";
import "@material/web/menu/menu-item.js";
import "@material/web/button/text-button.js";
import "./yp-top-app-bar.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import { YpAppGlobals } from "./YpAppGlobals.js";
import { YpAppUser } from "./YpAppUser.js";
import { YpServerApi } from "../common/YpServerApi.js";
import { YpAppDialogs } from "../yp-dialog-container/yp-app-dialogs.js";
import "../yp-dialog-container/yp-app-dialogs.js";
import "../yp-collection/yp-domain.js";
import "../yp-collection/yp-community.js";
import "../yp-collection/yp-group.js";
import "./yp-app-nav-drawer.js";
import "../yp-post/yp-post.js";
import { YpServerApiAdmin } from "../common/YpServerApiAdmin.js";
declare global {
    interface Window {
        appGlobals: YpAppGlobals;
        appUser: YpAppUser;
        appDialogs: YpAppDialogs;
        serverApi: YpServerApi;
        adminServerApi: YpServerApiAdmin;
        app: YpApp;
        locale: string;
        autoTranslate: boolean;
        MSStream: any;
        PasswordCredential?: any;
        FederatedCredential?: any;
    }
}
type YpAppModes = "main" | "admin" | "promotion" | "analytics";
export declare class YpApp extends YpBaseElement {
    homeLink: YpHomeLinkData | undefined;
    page: string | undefined;
    appMode: YpAppModes;
    user: YpUserData | undefined;
    backPath: string | undefined;
    showSearch: boolean;
    showBack: boolean;
    loadingAppSpinner: boolean;
    forwardToPostId: string | undefined;
    headerTitle: string | undefined;
    numberOfUnViewedNotifications: string | undefined;
    hideHelpIcon: boolean;
    autoTranslate: boolean;
    languageName: string | undefined;
    goForwardToPostId: number | undefined;
    showBackToPost: boolean;
    goForwardPostName: string | undefined;
    pages: Array<YpHelpPageData>;
    headerDescription: string | undefined;
    notifyDialogHeading: string | undefined;
    notifyDialogText: string | undefined;
    route: string;
    subRoute: string | undefined;
    routeData: Record<string, string>;
    userDrawerOpened: boolean;
    navDrawerOpened: boolean;
    languageLoaded: boolean;
    anchor: HTMLElement | null;
    previousSearches: Array<string>;
    storedBackPath: string | undefined;
    storedLastDocumentTitle: string | undefined;
    keepOpenForPost: string | undefined;
    useHardBack: boolean;
    _scrollPositionMap: {};
    goBackToPostId: number | undefined;
    currentPostId: number | undefined;
    goForwardCount: number;
    firstLoad: boolean;
    communityBackOverride: Record<string, Record<string, string>> | undefined;
    touchXDown: number | undefined;
    touchYDown: number | undefined;
    touchXUp: number | undefined;
    touchYUp: number | undefined;
    userDrawerOpenedDelayed: boolean;
    navDrawOpenedDelayed: boolean;
    haveLoadedAdminApp: boolean;
    haveLoadedPromotionApp: boolean;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): Promise<void>;
    _navDrawOpened(event: CustomEvent): void;
    _languageLoaded(): void;
    _netWorkError(event: CustomEvent): void;
    _setupEventListeners(): void;
    _themeUpdated(event: CustomEvent): void;
    _removeEventListeners(): void;
    static get styles(): any[];
    _haveCopiedNotification(): void;
    _appDialogsReady(event: CustomEvent): void;
    updateLocation(): void;
    renderNavigationIcon(): import("lit-html").TemplateResult<1>;
    _openHelpMenu(): void;
    renderActionItems(): import("lit-html").TemplateResult<1>;
    renderMainApp(): import("lit-html").TemplateResult<1>;
    renderGroupPage(): import("lit-html").TemplateResult<1>;
    renderPage(): import("lit-html/directive.js").DirectiveResult<typeof import("lit-html/directives/cache.js").CacheDirective>;
    renderTopBar(): import("lit-html").TemplateResult<1>;
    renderFooter(): import("lit-html").TemplateResult<1>;
    renderAdminApp(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderPromotionApp(): import("lit-html").TemplateResult<1> | typeof nothing;
    render(): import("lit-html").TemplateResult<1>;
    _openNotifyDialog(event: CustomEvent): void;
    _openToast(event: CustomEvent): void;
    _resetNotifyDialogText(): void;
    translatedPages(pages: Array<YpHelpPageData>): Array<YpHelpPageData>;
    openPageFromId(pageId: number): void;
    _openPageFromMenu(event: Event): void;
    _openPage(page: YpHelpPageData): void;
    _getPageLocale(page: YpHelpPageData): string;
    _getLocalizePageTitle(page: YpHelpPageData): string;
    _setPages(event: CustomEvent): void;
    _addBackCommunityOverride(event: CustomEvent): void;
    _goToNextPost(): void;
    _goToPreviousPost(): void;
    _setNextPost(event: CustomEvent): void;
    _clearNextPost(): void;
    _setupSamlCallback(): void;
    _openPageFromEvent(event: CustomEvent): void;
    openUserInfoPage(pageId: number): void;
    _setLanguageName(event: CustomEvent): void;
    _autoTranslateEvent(event: CustomEvent): void;
    _refreshGroup(): void;
    _refreshCommunity(): void;
    _refreshDomain(): void;
    _refreshByName(id: string): Promise<void>;
    _closeRightDrawer(): void;
    _setNumberOfUnViewedNotifications(event: CustomEvent): void;
    _redirectTo(event: CustomEvent): void;
    _routeChanged(): Promise<void>;
    _routePageChanged(oldRouteData: Record<string, string>): void;
    loadDataViz(): void;
    _pageChanged(): void;
    openResetPasswordDialog(resetPasswordToken: string): void;
    openUserNotificationsDialog(): void;
    openAcceptInvitationDialog(inviteToken: string): void;
    _showPage404(): void;
    _setHomeLink(event: CustomEvent): void;
    setKeepOpenForPostsOn(goBackToPage: string): void;
    _resetKeepOpenForPage(): void;
    _closePost(): void;
    get closePostHeader(): boolean;
    _isGroupOpen(params: {
        groupId?: number;
        postId?: number;
    }, keepOpenForPost?: boolean): boolean;
    _isCommunityOpen(params: {
        communityId?: number;
        postId?: number;
    }, keepOpenForPost?: boolean): boolean;
    _isDomainOpen(params: {
        domainId?: number;
        postId?: number;
    }, keepOpenForPost?: boolean): boolean;
    _openNavDrawer(): Promise<void>;
    _closeNavDrawer(): Promise<void>;
    getDialogAsync(idName: string, callback: Function): void;
    closeDialog(idName: string): void;
    _dialogClosed(event: CustomEvent): void;
    scrollPageToTop(): void;
    _openUserDrawer(): Promise<void>;
    _closeUserDrawer(): Promise<void>;
    _login(): void;
    _onChangeHeader(event: CustomEvent): void;
    goBack(): void;
    _onSearch(e: CustomEvent): void;
    _onUserChanged(event: CustomEvent): void;
    toggleSearch(): void;
    _setupTouchEvents(): void;
    _removeTouchEvents(): void;
    _handleTouchStart(event: any): void;
    _handleTouchMove(event: any): void;
    _handleTouchEnd(): void;
}
export {};
//# sourceMappingURL=yp-app.d.ts.map