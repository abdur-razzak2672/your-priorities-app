import { YpBaseElement } from "../common/yp-base-element.js";
export declare abstract class YpStreamingLlmBase extends YpBaseElement {
    chatLog: YpAiChatWsMessage[];
    wsClientId: string;
    webSocketsErrorCount: number;
    wsEndpoint: string;
    ws: WebSocket;
    scrollElementSelector: string;
    userScrolled: boolean;
    currentFollowUpQuestions: string;
    programmaticScroll: boolean;
    scrollStart: number;
    serverMemoryId: string | undefined;
    defaultDevWsPort: number;
    heartbeatInterval: number | undefined;
    disableWebsockets: boolean;
    constructor();
    connectedCallback(): void;
    initWebSockets(): void;
    sendHeartbeat(): void;
    onWsOpen(): void;
    handleScroll(): void;
    disconnectedCallback(): void;
    onMessage(event: MessageEvent): Promise<void>;
    scrollDown(): void;
    addUserChatBotMessage(userMessage: string): void;
    addThinkingChatBotMessage(): void;
    abstract addChatBotElement(wsMessage: YpAiChatWsMessage): Promise<void>;
    addChatUserElement(data: YpAiChatWsMessage): void;
    get simplifiedChatLog(): YpSimpleLlmChatLog[];
    reset(): void;
}
//# sourceMappingURL=yp-streaming-llm-base.d.ts.map