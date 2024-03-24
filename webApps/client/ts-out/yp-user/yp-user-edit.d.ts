import { nothing } from "lit";
import "@material/web/button/text-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "../ac-notifications/ac-notification-settings.js";
import "../yp-file-upload/yp-file-upload.js";
import "../common/languages/yp-language-selector.js";
import { YpEditBase } from "../common/yp-edit-base.js";
export declare class YpUserEdit extends YpEditBase {
    action: string;
    user: YpUserData | undefined;
    selected: number;
    encodedUserNotificationSettings: string | undefined;
    currentApiKey: string | undefined;
    uploadedProfileImageId: number | undefined;
    uploadedHeaderImageId: number | undefined;
    notificationSettings: AcNotificationSettingsData | undefined;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    static get styles(): any[];
    render(): typeof nothing | import("lit-html").TemplateResult<1>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _editResponse(event: CustomEvent): void;
    _checkIfValidEmail(): boolean | "" | undefined;
    _disconnectFromFacebookLogin(): void;
    _reallyDisconnectFromFacebookLogin(): Promise<void>;
    _disconnectFromSamlLogin(): void;
    _reallyDisconnectFromSamlLogin(): Promise<void>;
    _setNotificationSettings(event: CustomEvent): void;
    _notificationSettingsChanged(): void;
    _encodeNotificationsSettings(settings: AcNotificationSettingsData | undefined): string | undefined;
    _userChanged(): void;
    _profileImageUploaded(event: CustomEvent): void;
    _headerImageUploaded(event: CustomEvent): void;
    customRedirect(): void;
    clear(): void;
    _copyApiKey(): void;
    _createApiKey(): Promise<void>;
    _reCreateApiKey(): void;
    setup(user: YpUserData, newNotEdit: boolean, refreshFunction: Function | undefined, openNotificationTab?: boolean): void;
    setupTranslation(): void;
    _deleteOrAnonymizeUser(): void;
}
//# sourceMappingURL=yp-user-edit.d.ts.map