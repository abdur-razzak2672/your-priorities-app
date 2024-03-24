import { PropertyValueMap } from "lit";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/progress/linear-progress.js";
import "@material/web/tabs/tabs.js";
import "@material/web/tabs/secondary-tab.js";
import { YpAdminPage } from "./yp-admin-page.js";
export declare class YpAdminReports extends YpAdminPage {
    action: string;
    type: "fraudAuditReport" | "docx" | "xls" | "usersxls" | undefined;
    progress: number | undefined;
    selectedTab: number;
    error: string | undefined;
    jobId: number | undefined;
    reportUrl: string | undefined;
    reportGenerationUrl: string | undefined;
    downloadDisabled: boolean;
    allOurIdeasQuestionId: number | undefined;
    toastText: string | undefined;
    autoTranslateActive: boolean;
    selectedFraudAuditId: number | undefined;
    fraudAuditSelectionActive: boolean;
    fraudAuditsAvailable: YpFraudAuditData[] | undefined;
    waitingOnFraudAudits: boolean;
    reportCreationProgressUrl: string | undefined;
    connectedCallback(): void;
    fraudItemSelection(event: CustomEvent): void;
    startReportCreation(): void;
    startReportCreationResponse(data: YpReportData): void;
    pollLaterForProgress(): void;
    reportCreationProgress(): void;
    formatAuditReportDates(data: YpFraudAuditData[]): YpFraudAuditData[];
    fraudAuditsAjaxResponse(event: CustomEvent): void;
    reportCreationProgressResponse(response: YpReportData): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    startGeneration(): void;
    startReportCreationAjax(url: string): void;
    getFraudAuditsAjax(url: string): void;
    static get styles(): any[];
    protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    _tabChanged(): void;
    renderStart(): import("lit-html").TemplateResult<1>;
    renderDownload(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=yp-admin-reports.d.ts.map