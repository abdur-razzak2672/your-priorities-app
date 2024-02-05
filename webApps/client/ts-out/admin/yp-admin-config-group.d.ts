import { nothing } from "lit";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "../yp-survey/yp-structured-question-edit.js";
import "@trystan2k/fleshy-jsoneditor/fleshy-jsoneditor.js";
import { YpAdminConfigBase } from "./yp-admin-config-base.js";
import "../yp-file-upload/yp-file-upload.js";
import "../yp-theme/yp-theme-selector.js";
import "../yp-app/yp-language-selector.js";
import "./allOurIdeas/aoi-earl-ideas-editor.js";
export declare class YpAdminConfigGroup extends YpAdminConfigBase {
    appHomeScreenIconImageId: number | undefined;
    hostnameExample: string | undefined;
    signupTermsPageId: number | undefined;
    welcomePageId: number | undefined;
    aoiQuestionName: string | undefined;
    status: string | undefined;
    groupAccess: YpGroupAccessTypes;
    groupTypeIndex: number;
    group: YpGroupData;
    isDataVisualizationGroup: any;
    dataForVisualizationJsonError: any;
    groupMoveToOptions: any;
    moveGroupToId: any;
    pages: any;
    endorsementButtons: string | undefined;
    endorsementButtonsDisabled: boolean;
    apiEndpoint: unknown;
    isGroupFolder: any;
    structuredQuestionsJsonError: any;
    collectionStatusOptions: any;
    statusIndex: any;
    hasSamlLoginProvider: any;
    questionNameHasChanged: boolean;
    groupTypeOptions: string[];
    constructor();
    static get styles(): (any[] | import("lit").CSSResult)[];
    _setGroupType(event: CustomEvent): void;
    renderGroupTypeSelection(): import("lit-html").TemplateResult<1>;
    renderHeader(): import("lit-html").TemplateResult<1> | typeof nothing;
    getAccessTokenName(): "secret" | "open_to_community";
    renderHiddenInputs(): import("lit-html").TemplateResult<1>;
    _descriptionChanged(event: CustomEvent): void;
    connectedCallback(): void;
    _clear(): void;
    groupAccessOptions: Record<number, YpGroupAccessTypes>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _collectionIdChanged(): void;
    _setupTranslations(): void;
    _formResponse(event: CustomEvent): Promise<void>;
    _finishRedirect(group: YpGroupData): void;
    _getAccessTab(): YpConfigTabData;
    _groupAccessChanged(event: CustomEvent): void;
    _statusSelected(event: CustomEvent): void;
    _getThemeTab(): YpConfigTabData;
    _inheritThemeChanged(event: CustomEvent): void;
    _getPostSettingsTab(): YpConfigTabData | null;
    _defaultDataImageUploaded(event: CustomEvent): void;
    _defaultPostImageUploaded(event: CustomEvent): void;
    _haveUploadedDocxSurvey(event: CustomEvent): void;
    _getVoteSettingsTab(): YpConfigTabData;
    get endorsementButtonsOptions(): {
        name: string;
        translatedName: string;
    }[];
    _endorsementButtonsSelected(event: CustomEvent): void;
    get endorsementButtonsIndex(): number;
    _customRatingsTextChanged(event: CustomEvent): void;
    _getPointSettingsTab(): YpConfigTabData;
    _getAdditionalConfigTab(): YpConfigTabData;
    earlConfigChanged(event: CustomEvent): void;
    themeConfigChanged(event: CustomEvent): void;
    renderCreateEarl(communityId: number): import("lit-html").TemplateResult<1>;
    questionNameChanged(event: CustomEvent): void;
    afterSave(): void;
    _getAllOurIdeaTab(): YpConfigTabData;
    set(obj: any, path: string, value: any): void;
    _updateEarl(event: CustomEvent, earlUpdatePath: string): void;
    _getAllOurIdeaOptionsTab(): YpConfigTabData;
    _categorySelected(event: CustomEvent): void;
    _categoryImageSrc(category: any): string;
    _welcomePageSelected(event: CustomEvent): void;
    _isDataVisualizationGroupClick(event: CustomEvent): void;
    _dataForVisualizationChanged(event: CustomEvent): void;
    _moveGroupToSelected(event: CustomEvent): void;
    setupConfigTabs(): YpConfigTabData[];
    _appHomeScreenIconImageUploaded(event: CustomEvent): void;
}
//# sourceMappingURL=yp-admin-config-group.d.ts.map