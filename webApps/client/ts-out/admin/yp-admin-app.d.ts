import { nothing, PropertyValueMap } from "lit";
import "@material/web/labs/navigationtab/navigation-tab.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/list/list-item.js";
import "@material/web/list/list.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/menu/menu.js";
import "../common/yp-image.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "./yp-admin-config-domain.js";
import "./yp-admin-config-community.js";
import "./yp-admin-config-group.js";
import "./yp-admin-communities.js";
import "./yp-admin-groups.js";
import "./yp-users-grid.js";
import "./yp-content-moderation.js";
import "./yp-pages-grid.js";
import "./yp-admin-translations.js";
import "./yp-admin-reports.js";
import "./yp-organization-grid.js";
import "../yp-collection/yp-domain.js";
type AdminPageOptions = "login" | "user" | "configuration" | "translations" | "organizations" | "pages" | "reports" | "users" | "admins" | "moderation" | "aiAnalysis" | "groups" | "communities" | "back" | "posts" | "profile_images" | "badges" | "post";
type CollectionTypes = "domain" | "community" | "group";
interface RouteData {
    page: AdminPageOptions;
}
export declare class YpAdminApp extends YpBaseElement {
    page: AdminPageOptions;
    user: YpUserData | undefined;
    active: boolean;
    route: string;
    subRoute: string | undefined;
    routeData: RouteData;
    userYpCollection: YpGroupData[];
    forwardToYpId: string | undefined;
    headerTitle: string | undefined;
    collectionType: CollectionTypes | "post" | "groups" | "communities" | "profile_image";
    collectionId: number | "new";
    parentCollectionId: number | undefined;
    parentCollection: YpCollectionData | undefined;
    collection: YpCollectionData | undefined;
    adminConfirmed: boolean;
    haveCheckedAdminRights: boolean;
    anchor: HTMLElement | null;
    _scrollPositionMap: {};
    communityBackOverride: Record<string, Record<string, string>> | undefined;
    static get styles(): any[];
    constructor();
    updatePageFromPath(): void;
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    connectedCallback(): void;
    updateLocation(): void;
    disconnectedCallback(): void;
    _pageChanged(): void;
    tabChanged(event: CustomEvent): void;
    _setupEventListeners(): void;
    _refreshAdminRights(): void;
    _removeEventListeners(): void;
    _refreshGroup(): void;
    _refreshCommunity(): void;
    _refreshDomain(): void;
    _refreshByName(id: string): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _needsUpdate(): void;
    updateFromCollection(): void;
    renderGroupConfigPage(): import("lit-html").TemplateResult<1>;
    renderCommunityConfigPage(): import("lit-html").TemplateResult<1>;
    renderDomainConfigPage(): import("lit-html").TemplateResult<1>;
    _renderPage(): import("lit-html").TemplateResult<1> | typeof nothing;
    getCollection(): Promise<void>;
    _getAdminCollection(): Promise<void>;
    _setAdminFromParent(): Promise<void>;
    _setAdminConfirmedFromParent(collection: YpCollectionData): void;
    _setAdminConfirmed(): void;
    getParentCollectionType(): "" | "domain" | "community";
    exitToMainApp(): void;
    render(): import("lit-html").TemplateResult<1>;
    _isPageSelectedClass(page: AdminPageOptions): "" | "selectedContainer";
    _getListHeadline(type: AdminPageOptions): string;
    _getListSupportingText(type: AdminPageOptions): string;
    _getListIcon(type: AdminPageOptions): "" | "description" | "settings" | "translate" | "add_business" | "download" | "supervised_user_circle" | "supervisor_account" | "checklist" | "document_scanner" | "rocket_launch" | "videogroup_asset" | "category" | "workspace_premium" | "person" | "arrow_back";
    setPage(type: AdminPageOptions): void;
    renderMenuListItem(type: AdminPageOptions): import("lit-html").TemplateResult<1>;
    get isAllOurIdeasGroupType(): boolean;
    renderNavigationBar(): import("lit-html").TemplateResult<1>;
}
export {};
//# sourceMappingURL=yp-admin-app.d.ts.map