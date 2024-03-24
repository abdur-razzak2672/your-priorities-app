import { YpCollection } from "./yp-collection.js";
import { TemplateResult, nothing } from "lit";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "./yp-group-header.js";
import "../yp-post/yp-posts-list.js";
import "../yp-post/yp-post-card-add.js";
import "../allOurIdeas/aoi-survey.js";
export declare const GroupTabTypes: Record<string, number>;
export declare class YpGroup extends YpCollection {
    collection: YpGroupData | undefined;
    searchingFor: string | undefined;
    hasNonOpenPosts: boolean;
    disableNewPosts: boolean;
    selectedGroupTab: number;
    configCheckTimer: ReturnType<typeof setTimeout> | undefined;
    newGroupRefresh: boolean;
    tabCounters: Record<string, number>;
    configCheckTTL: number;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    _cancelConfigCheckTimer(): void;
    _startConfigCheckTimer(): void;
    _getGroupConfig(): Promise<void>;
    _doesGroupRequireRefresh(groupConfigA: YpGroupConfiguration, groupConfigB: YpGroupConfiguration): boolean;
    _updateTabPostCount(event: CustomEvent): void;
    _setupOpenTab(): void;
    tabLabelWithCount(type: string): string;
    getCurrentTabElement(): HTMLElement | undefined;
    getCollection(): Promise<void>;
    renderGroupTabs(): TemplateResult<1> | typeof nothing;
    renderPostList(statusFilter: string): TemplateResult;
    renderCurrentGroupTabPage(): TemplateResult | undefined;
    renderHeader(): TemplateResult<1> | typeof nothing;
    render(): TemplateResult<1>;
    renderYpGroup(): TemplateResult<1>;
    _selectGroupTab(event: CustomEvent): void;
    _openHelpPageIfNeededOnce(): void;
    _refreshAjax(): void;
    _newPost(): void;
    _clearScrollThreshold(): void;
    _setSelectedTabFromRoute(routeTabName: string): void;
    get _isCurrentPostsTab(): boolean;
    _loadMoreData(): void;
    goToPostOrNewsItem(): void;
    refresh(fromMainApp?: boolean): Promise<void>;
    _setupGroupSaml(group: YpGroupData): void;
    scrollToCollectionItemSubClass(): void;
}
//# sourceMappingURL=yp-group.d.ts.map