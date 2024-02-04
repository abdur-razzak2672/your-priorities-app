"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YpLlmTranslation = void 0;
const jsonrepair_1 = require("jsonrepair");
const openai_1 = require("openai");
const iso_639_1_1 = __importDefault(require("iso-639-1"));
class YpLlmTranslation {
    openaiClient;
    modelName = "gpt-4-0125-preview";
    maxTokens = 4000;
    temperature = 0.0;
    constructor() {
        this.openaiClient = new openai_1.OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    renderSystemPrompt(jsonInSchema, jsonOutSchema, lengthInfo) {
        return `You are a helpful answer translation assistant that knows all the world languages.

INPUTS:
The user will tell us the Language to translate to.

The user will let you know what the question is but you do not need to translate that one.

You will get JSON input with the string to be translated: ${jsonInSchema}

OUTPUT:
You will output JSON format with the translation. ${jsonOutSchema}

INSTRUCTIONS:
The translated text MUST NEVER be more than ${lengthInfo}, otherwise it wont fit the UI.
Please count the words and never go over the limit. Leave some things out off the translation it's going to be too long.
Translate the tone of the original language also.
Always output only JSON.`;
    }
    renderAnswersUserMessage(language, question, answer) {
        return `Language to translate to: ${language}

Question:
${question}

Answers to translate in JSON Input:
${JSON.stringify(answer, null, 2)}

Your ${language} JSON output:`;
    }
    renderQuestionUserMessage(language, question, questionData) {
        return `Language to translate to: ${language}

Question to translate in JSON format:
${JSON.stringify(questionData, null, 2)}

Your ${language} JSON output:`;
    }
    async getChoiceTranslation(question, answer, languageIsoCode, maxCharactersInTranslation = 140) {
        try {
            console.log(`getChoiceTranslation: ${answer.content}`);
            const languageName = iso_639_1_1.default.getName(languageIsoCode) || "en";
            const moderationResponse = await this.openaiClient.moderations.create({
                input: answer.content,
            });
            console.log("Moderation response:", moderationResponse);
            const flagged = moderationResponse.results[0].flagged;
            console.log("Flagged:", flagged);
            if (flagged) {
                console.error("Flagged:", answer.content);
                return null;
            }
            else {
                const inAnswer = {
                    originalAnswer: answer.content,
                    choiceId: answer.choiceId,
                };
                const jsonInSchema = `{ originalAnswer: string, choiceId: number}`;
                const jsonOutSchema = `{ translatedContent: string, choiceId: number}`;
                const lengthInfo = `26 words long or 140 characters`;
                return await this.callLlm(jsonInSchema, jsonOutSchema, lengthInfo, languageName, question, inAnswer, maxCharactersInTranslation, this.renderAnswersUserMessage);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async getQuestionTranslation(question, languageIsoCode, maxCharactersInTranslation = 300) {
        try {
            console.log(`getQuestionTranslation: ${question} ${languageIsoCode}`);
            const languageName = iso_639_1_1.default.getName(languageIsoCode) || "en";
            const moderationResponse = await this.openaiClient.moderations.create({
                input: question,
            });
            console.log("Moderation response:", moderationResponse);
            const flagged = moderationResponse.results[0].flagged;
            console.log("Flagged:", flagged);
            if (flagged) {
                console.error("Flagged:", question);
                return null;
            }
            else {
                const inQuestion = {
                    originalQuestion: question
                };
                const jsonInSchema = `{ originalAnswer: string, choiceId: number}`;
                const jsonOutSchema = `{ translatedContent: string, choiceId: number}`;
                const lengthInfo = `26 words long or 140 characters`;
                return await this.callLlm(jsonInSchema, jsonOutSchema, lengthInfo, languageName, question, inQuestion, maxCharactersInTranslation, this.renderQuestionUserMessage);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            return undefined;
        }
    }
    async callLlm(jsonInSchema, jsonOutSchema, lengthInfo, languageName, question, inObject, maxCharactersInTranslation, userRenderer) {
        const messages = [
            {
                role: "system",
                content: this.renderSystemPrompt(jsonInSchema, jsonOutSchema, lengthInfo),
            },
            {
                role: "user",
                content: userRenderer(languageName, question, inObject),
            },
        ];
        const maxRetries = 3;
        let retries = 0;
        let running = true;
        while (running) {
            try {
                console.log("Messages:", messages);
                const results = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                });
                console.log("Results:", results);
                const textJson = results.choices[0].message.content;
                console.log("Text JSON:", textJson);
                if (textJson) {
                    const translationData = JSON.parse((0, jsonrepair_1.jsonrepair)(textJson));
                    if (translationData && translationData.translatedContent) {
                        if (translationData.translatedContent.length >
                            maxCharactersInTranslation) {
                            throw new Error("Translation too long");
                        }
                        running = false;
                        return translationData.translatedContent;
                    }
                }
                else {
                    throw new Error("No content in response");
                }
            }
            catch (error) {
                console.error("Error in getChoiceTranslation:", error);
                retries++;
                if (retries > maxRetries) {
                    running = false;
                    return undefined;
                }
            }
        }
    }
}
exports.YpLlmTranslation = YpLlmTranslation;
