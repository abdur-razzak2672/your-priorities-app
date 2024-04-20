import { nothing, TemplateResult, PropertyValueMap } from "lit";
import "@material/web/button/filled-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/primary-tab.js";
import "@material/web/tabs/secondary-tab.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/textfield/outlined-text-field.js";
import { YpAdminPage } from "./yp-admin-page.js";
import "../yp-survey/yp-structured-question-edit.js";
import "../yp-file-upload/yp-file-upload.js";
import "../common/yp-generate-ai-image.js";
import "../common/yp-form.js";
export declare const defaultLtpPromptsConfiguration: () => {
    [k: string]: string;
};
export declare const defaultLtpConfiguration: {
    crt: {
        prompts: {
            [k: string]: string;
        };
        promptsTests: {
            [k: string]: string;
        };
    };
};
export declare abstract class YpAdminConfigBase extends YpAdminPage {
    configTabs: Array<YpConfigTabData> | undefined;
    selectedTab: number;
    configChanged: boolean;
    method: string;
    currentLogoImages: YpImageData[] | undefined;
    collectionVideoId: number | undefined;
    generatingAiImageInBackground: boolean;
    action: string | undefined;
    subRoute: string | undefined;
    hasVideoUpload: boolean;
    status: string | undefined;
    hasAudioUpload: boolean;
    uploadedLogoImageId: number | undefined;
    uploadedHeaderImageId: number | undefined;
    uploadedVideoId: number | undefined;
    connectedVideoToCollection: boolean;
    editHeaderText: string | undefined;
    toastText: string | undefined;
    saveText: string | undefined;
    imagePreviewUrl: string | undefined;
    videoPreviewUrl: string | undefined;
    themeId: number | undefined;
    translatedPages: Array<YpHelpPageData> | undefined;
    descriptionMaxLength: number;
    tabsHidden: boolean;
    parentCollectionId: number | undefined;
    parentCollection: YpCollectionData | undefined;
    nameInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    gettingImageColor: boolean;
    imageIdsUploadedByUser: number[];
    videoIdsUploadedByUser: number[];
    detectedThemeColor: string | undefined;
    constructor();
    abstract setupConfigTabs(): Array<YpConfigTabData>;
    abstract renderHeader(): TemplateResult | {};
    abstract renderHiddenInputs(): TemplateResult | {};
    _formResponse(event: CustomEvent): Promise<void>;
    _selectTab(event: CustomEvent): void;
    getColorFromLogo(): Promise<void>;
    _updateCollection(event: CustomEvent): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _logoImageUploaded(event: CustomEvent): void;
    _headerImageUploaded(event: CustomEvent): void;
    _statusSelected(event: CustomEvent): void;
    get statusIndex(): number;
    get collectionStatusOptions(): {
        name: string;
        translatedName: string;
    }[];
    _ltpConfigChanged(event: CustomEvent): void;
    tabsPostSetup(tabs: Array<YpConfigTabData>): void;
    get disableSaveButtonForCollection(): boolean;
    _themeChanged(event: CustomEvent): void;
    renderSaveButton(): TemplateResult;
    renderTabs(): TemplateResult | typeof nothing;
    renderTabPages(): TemplateResult<1> | typeof nothing;
    _generateLogo(event: CustomEvent): void;
    renderTabPage(configItems: Array<YpStructuredConfigData>, itemIndex: number): TemplateResult<1>;
    get collectionVideoURL(): string | undefined;
    get collectionVideoPosterURL(): string | undefined;
    get collectionVideos(): Array<YpVideoData> | undefined;
    clearVideos(): void;
    clearImages(): void;
    renderCoverMediaContent(): TemplateResult<1>;
    reallyDeleteCurrentLogoImage(): Promise<void>;
    reallyDeleteCurrentVideo(): Promise<void>;
    deleteCurrentLogoImage(event: CustomEvent): void;
    deleteCurrentVideo(event: CustomEvent): void;
    renderLogoMedia(): TemplateResult<1>;
    renderHeaderImageUploads(): TemplateResult<1>;
    static get styles(): any[];
    _setVideoCover(event: CustomEvent): void;
    renderNameAndDescription(hideDescription?: boolean): TemplateResult;
    _descriptionChanged(event: CustomEvent): void;
    render(): TemplateResult<1> | typeof nothing;
    _logoGeneratingInBackground(event: CustomEvent): void;
    _gotAiImage(event: CustomEvent): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    _getHelpPages(collectionTypeOverride?: string | undefined, collectionIdOverride?: number | undefined): Promise<void>;
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    _getLocalizePageTitle(page: YpHelpPageData): string;
    beforeSave(): void;
    afterSave(): void;
    sendUpdateCollectionEvents(): void;
    _save(event: CustomEvent): Promise<void>;
    _showErrorDialog(errorText: string): void;
    _configChanged(): void;
    _videoUploaded(event: CustomEvent): void;
    _getSaveCollectionPath(path: string): any;
    _clear(): void;
    _updateEmojiBindings(): void;
    _getCurrentValue(question: YpStructuredQuestionData): any;
}
//# sourceMappingURL=yp-admin-config-base.d.ts.map