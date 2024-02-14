import { nothing } from "lit";
import "@material/web/dialog/dialog.js";
import { MdDialog } from "@material/web/dialog/dialog.js";
import "@material/web/button/elevated-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/progress/circular-progress.js";
import "@material/web/textfield/filled-text-field.js";
import { YpGenerateAiImage } from "../../common/yp-generate-ai-image.js";
import { AoiAdminServerApi } from "../../admin/allOurIdeas/AoiAdminServerApi.js";
import { AoiGenerateAiLogos } from "../../admin/allOurIdeas/aoiGenerateAiLogos.js";
import "../../yp-magic-text/yp-magic-text.js";
export declare class AoiNewIdeaDialog extends YpGenerateAiImage {
    earl: AoiEarlData;
    groupId: number;
    question: AoiQuestionData;
    choice: AoiChoiceData | undefined;
    group: YpGroupData;
    haveAddedIdea: boolean;
    ideaText: HTMLInputElement;
    dialog: MdDialog;
    serverApi: AoiAdminServerApi;
    imageGenerator: AoiGenerateAiLogos;
    constructor();
    connectedCallback(): Promise<void>;
    disconnectedCallback(): void;
    submitIdea(): Promise<void>;
    scrollUp(): void;
    open(): void;
    cancel(): void;
    reset(): void;
    close(): void;
    textAreaKeyDownIdea(e: any): boolean;
    static get styles(): (any[] | import("lit").CSSResult)[];
    generateAiIcon(): Promise<void>;
    get tempPrompt(): string;
    regenerateIcon(): void;
    renderAnswer(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderIcon(): import("lit-html").TemplateResult<1> | typeof nothing;
    renderContent(): import("lit-html").TemplateResult<1>;
    renderFooter(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-new-idea-dialog.d.ts.map