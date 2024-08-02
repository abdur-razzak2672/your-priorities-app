import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "./yp-posts-filter.js";
import "./yp-post-list-item.js";
import { TemplateResult } from "lit";
export declare class YpPostsList extends YpBaseElement {
    searchingFor: string | undefined;
    subTitle: string | undefined;
    filter: string;
    statusFilter: string;
    posts: Array<YpPostData> | undefined;
    userId: number | undefined;
    group: YpGroupData;
    categoryId: number | undefined;
    postsCount: number | undefined;
    selectedCategoryName: string | undefined;
    selectedGroupTab: number | undefined;
    noPosts: boolean;
    showSearchIcon: boolean;
    grid: boolean;
    randomSeed: number | undefined;
    moreToLoad: boolean;
    moreFromScrollTriggerActive: boolean;
    resetListSize: Function | undefined;
    skipIronListWidth: boolean;
    static get styles(): any[];
    _searchKey(event: KeyboardEvent): void;
    render(): TemplateResult<1>;
    renderPostItem(post: YpPostData, index?: number | undefined): TemplateResult;
    get desktopListFormat(): boolean;
    get wideNotListFormat(): boolean;
    _isLastItem(index: number): boolean | undefined;
    _keypress(event: KeyboardEvent): void;
    _categoryChanged(event: CustomEvent): void;
    _filterChanged(event: CustomEvent): void;
    firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void;
    _clearSearch(): void;
    scrollEvent(event: {
        last: number;
    }): void;
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    _selectedItemChanged(event: CustomEvent): void;
    _refreshPost(event: CustomEvent): Promise<void>;
    _getPostLink(post: YpPostData): string | undefined;
    get scrollOffset(): number | null;
    _tapOnFilter(): void;
    _search(): void;
    buildPostsUrlPath(): string;
    scrollToPost(post: YpPostData): Promise<void>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    refreshGroupFromFilter(): void;
    _loadMoreData(): Promise<void>;
    _checkForMultipleLanguages(posts: Array<YpPostData>): void;
    _processCategories(): void;
}
//# sourceMappingURL=yp-posts-list.d.ts.map