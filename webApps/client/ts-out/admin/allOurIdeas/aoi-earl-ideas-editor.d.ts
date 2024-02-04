import { nothing } from "lit";
import { YpStreamingLlmBase } from "../../yp-llms/yp-streaming-llm-base.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import { AoiAdminServerApi } from "./AoiAdminServerApi.js";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/iconbutton/outlined-icon-button.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/chips/filter-chip.js";
import "@material/web/chips/chip-set.js";
import "@material/web/textfield/filled-text-field.js";
import { AoiGenerateAiLogos } from "./aoiGenerateAiLogos.js";
import { MdOutlinedTextField } from "@material/web/textfield/outlined-text-field.js";
export declare class AoiEarlIdeasEditor extends YpStreamingLlmBase {
    groupId: number;
    communityId: number | undefined;
    configuration: AoiConfigurationData;
    isCreatingIdeas: boolean;
    choices: AoiChoiceData[] | undefined;
    isGeneratingWithAi: boolean;
    isSubmittingIdeas: boolean;
    isTogglingIdeaActive: number | undefined;
    isFetchingChoices: boolean;
    group: YpGroupData;
    aiStyleInputElement: MdOutlinedTextField | undefined;
    currentIdeasFilter: "latest" | "highestScore" | "activeDeactive";
    answersElement: MdFilledTextField;
    scrollElementSelector: string;
    serverApi: AoiAdminServerApi;
    imageGenerator: AoiGenerateAiLogos;
    shouldContinueGenerating: boolean;
    currentGeneratingIndex: number | undefined;
    constructor();
    connectedCallback(): void;
    socketClosed(): void;
    socketError(): void;
    getChoices(): Promise<void>;
    addChatBotElement(wsMessage: PsAiChatWsMessage): Promise<void>;
    get answers(): string[];
    hasMoreThanOneIdea(): void;
    openMenuFor(answer: AoiChoiceData): void;
    generateIdeas(): void;
    submitIdeasForCreation(): Promise<void>;
    toggleIdeaActivity(answer: AoiChoiceData): () => Promise<void>;
    applyFilter(filterType: string): void;
    get sortedChoices(): AoiChoiceData[] | undefined;
    setPromptDraft(): Promise<void>;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    generateAiIcons(): Promise<void>;
    stopGenerating(): void;
    get allChoicesHaveIcons(): boolean | undefined;
    deleteImageUrl(choice: AoiChoiceData): Promise<void>;
    static get styles(): any[];
    renderCreateIdeas(): import("lit-html").TemplateResult<1>;
    renderIdeasSortingChips(): import("lit-html").TemplateResult<1>;
    renderIcon(choice: AoiChoiceData): import("lit-html").TemplateResult<1> | typeof nothing;
    renderAnswerData(answer: AoiChoiceData): import("lit-html").TemplateResult<1>;
    renderEditIdeas(): import("lit-html").TemplateResult<1>;
    render(): import("lit-html").TemplateResult<1>;
}
//# sourceMappingURL=aoi-earl-ideas-editor.d.ts.map