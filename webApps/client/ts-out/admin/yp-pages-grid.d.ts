import { nothing } from "lit";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/button/text-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/dialog/dialog.js";
export declare class YpPagesGrid extends YpBaseElement {
    pages: Array<YpHelpPageData> | undefined;
    headerText: string | undefined;
    domainId: number | undefined;
    communityId: number | undefined;
    groupId: number | undefined;
    currentlyEditingPage: YpHelpPageData | undefined;
    modelType: string | undefined;
    newLocaleInput: HTMLInputElement;
    currentlyEditingLocale: string | undefined;
    currentlyEditingTitle: string | undefined;
    currentlyEditingContent: string | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    titleChanged(): void;
    contentChanged(): void;
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    _toLocaleArray(obj: Record<string, string>): Array<YpHelpPageData>;
    _editPageLocale(event: Event): Promise<void>;
    _closePageLocale(): void;
    _dispatchAdminServerApiRequest(pageId: number | undefined, path: string, method: string, body?: any): Promise<any>;
    _updatePageLocale(): Promise<void>;
    _publishPage(event: Event): Promise<void>;
    _publishPageResponse(): Promise<void>;
    _unPublishPage(event: Event): Promise<void>;
    _unPublishPageResponse(): Promise<void>;
    _refreshPages(): Promise<void>;
    _deletePage(event: Event): Promise<void>;
    _deletePageResponse(): Promise<void>;
    _addLocale(event: Event): Promise<void>;
    _addPage(): Promise<void>;
    _newPageResponse(): Promise<void>;
    _updatePageResponse(): Promise<void>;
    _updateCollection(): void;
    _generateRequest(id?: number | undefined): Promise<void>;
    _pagesResponse(event: CustomEvent): void;
    setup(groupId: number, communityId: number, domainId: number, adminUsers: boolean): void;
    open(): void;
    _setupHeaderText(): void;
}
//# sourceMappingURL=yp-pages-grid.d.ts.map