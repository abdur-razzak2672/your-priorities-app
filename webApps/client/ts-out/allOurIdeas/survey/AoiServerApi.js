import { YpServerApi } from "../../common/YpServerApi.js";
export class AoiServerApi extends YpServerApi {
    constructor(urlPath = "/api/allOurIdeas") {
        super();
        this.baseUrlPath = urlPath;
    }
    getEarlData(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}`);
    }
    async getPrompt(groupId, questionId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/${questionId}/prompt`);
    }
    async getSurveyResults(groupId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/results`);
    }
    getSurveyAnalysis(groupId, wsClientId, analysisIndex, analysisTypeIndex) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${groupId}/questions/${wsClientId}/${analysisIndex}/${analysisTypeIndex}/analysis`);
    }
    submitIdea(groupId, questionId, newIdea) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/questions/${questionId}/addIdea`, {
            method: "POST",
            body: JSON.stringify({ newIdea }),
        }, false);
    }
    postVote(groupId, questionId, promptId, locale, body, direction) {
        const url = new URL(`${window.location.protocol}//${window.location.host}${this.baseUrlPath}/${groupId}/questions/${questionId}/prompts/${promptId}/${direction == "skip" ? "skips" : "votes"}?locale=${locale}`);
        Object.keys(window.appGlobals.originalQueryParameters).forEach((key) => {
            if (key.startsWith("utm_")) {
                url.searchParams.append(key, window.aoiAppGlobals.originalQueryParameters[key]);
            }
        });
        const browserId = window.appUser.getBrowserId();
        const browserFingerprint = window.appUser.browserFingerprint;
        const browserFingerprintConfidence = window.appUser.browserFingerprintConfidence;
        url.searchParams.append("checksum_a", browserId);
        url.searchParams.append("checksum_b", browserFingerprint);
        url.searchParams.append("checksum_c", browserFingerprintConfidence.toString());
        return this.fetchWrapper(url.toString(), {
            method: "POST",
            body: JSON.stringify(body),
        }, false);
    }
    postVoteSkip(groupId, questionId, promptId, locale, body) {
        return this.fetchWrapper(this.baseUrlPath +
            `/${groupId}/questions/${questionId}/prompts/${promptId}/skip.js?locale=${locale}`, {
            method: "POST",
            body: JSON.stringify(body),
        }, false);
    }
    async getResults(groupId, questionId) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/choices/${questionId}/throughGroup`);
    }
    llmAnswerConverstation(groupId, wsClientId, chatLog) {
        return this.fetchWrapper(this.baseUrlPath + `/${groupId}/llmAnswerExplain`, {
            method: "PUT",
            body: JSON.stringify({
                wsClientId,
                chatLog
            }),
        }, false);
    }
}
//# sourceMappingURL=AoiServerApi.js.map