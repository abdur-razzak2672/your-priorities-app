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
import "../yp-app/yp-language-selector.js";
import "./allOurIdeas/aoi-earl-ideas-editor.js";
export declare class YpAdminConfigGroup extends YpAdminConfigBase {
    appHomeScreenIconImageId: number | undefined;
    hostnameExample: string | undefined;
    signupTermsPageId: number | undefined;
    welcomePageId: number | undefined;
    status: string | undefined;
    groupAccess: YpGroupAccessTypes;
    gettingImageColor: boolean;
    ypImageUrl: string | undefined;
    groupTypeIndex: number;
    group: YpGroupData;
    detectedThemeColor: string | undefined;
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
    groupTypeOptions: string[];
    constructor();
    static get styles(): (any[] | import("lit").CSSResult)[];
    imageLoaded(event: CustomEvent): Promise<void>;
    _setGroupType(event: CustomEvent): void;
    renderGroupTypeSelection(): import("lit-html").TemplateResult<1>;
    renderHeader(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderImage(): import("lit-html").TemplateResult<1>;
    getAccessTokenName(): "open_to_community" | "secret";
    renderHiddenInputs(): import("lit-html").TemplateResult<1>;
    _descriptionChanged(event: CustomEvent): void;
    _logoImageUploaded(event: CustomEvent): void;
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
    _themeChanged(event: CustomEvent): void;
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
    renderEditEarl(): import("lit-html").TemplateResult<1>;
    renderCreateEarl(): import("lit-html").TemplateResult<1>;
    _getAllOurIdeaTab(): YpConfigTabData;
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