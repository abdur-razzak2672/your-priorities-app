import { OpenAI } from "openai";
export class AiHelper {
    constructor(wsClientSocket = undefined) {
        this.modelName = "gpt-4-0125-preview";
        this.maxTokens = 2048;
        this.temperature = 0.7;
        this.cacheExpireTime = 60 * 60;
        this.openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this.wsClientSocket = wsClientSocket;
    }
    async streamChatCompletions(messages) {
        const stream = await this.openaiClient.chat.completions.create({
            model: this.modelName,
            messages,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
            stream: true,
        });
        await this.streamWebSocketResponses(stream);
    }
    sendToClient(sender, message, type = "stream") {
        this.wsClientSocket?.send(JSON.stringify({
            sender,
            type: type,
            message,
        }));
    }
    async streamWebSocketResponses(stream) {
        return new Promise(async (resolve, reject) => {
            this.sendToClient("bot", "", "start");
            try {
                let botMessage = "";
                for await (const part of stream) {
                    this.sendToClient("bot", part.choices[0].delta.content);
                    botMessage += part.choices[0].delta.content;
                }
                if (this.redisClient && this.cacheKeyForFullResponse) {
                    this.redisClient.set(this.cacheKeyForFullResponse, botMessage, "EX", this.cacheExpireTime);
                }
            }
            catch (error) {
                console.error(error);
                this.sendToClient("bot", "There has been an error, please retry", "error");
                reject();
            }
            finally {
                this.sendToClient("bot", "", "end");
            }
            resolve();
        });
    }
    async getAnswerIdeas(question, previousIdeas, firstMessage) {
        try {
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
                let firstMessageWithPreviousIdeasTemplate = "";
                let previewIdeasText = "";
                if (previousIdeas && previousIdeas.length > 0) {
                    previewIdeasText = `Previous answer ideas:\n${JSON.stringify(previousIdeas, null, 2)}\n\n`;
                    if (firstMessage) {
                        firstMessageWithPreviousIdeasTemplate =
                            "For your answers please follow the tone of voice, prose, style, and length of the Previous answer ideas\n";
                    }
                }
                const messages = [
                    {
                        role: "system",
                        content: `You are a highly competent AI that is able to generate short answer ideas for questions.
                      Genereate up to 10 high quality ideas.
                      Ideas should always be unnumbered.
                      Never output more than 30 words per idea.
                      \n${firstMessageWithPreviousIdeasTemplate}`,
                    },
                    {
                        role: "user",
                        content: `What are some possible answers to the question: ${question}\n\n${previewIdeasText}Answers:\n`,
                    },
                ];
                await this.streamChatCompletions(messages);
            }
        }
        catch (error) {
            console.error("Error in getAnswerIdeas:", error);
            this.sendToClient("bot", "There has been an error, please retry", "error");
            return null;
        }
    }
    async getAiAnalysis(questionId, contextPrompt, answers, cacheKeyForFullResponse, redisClient) {
        this.redisClient = redisClient;
        this.cacheKeyForFullResponse = cacheKeyForFullResponse;
        const basePrePrompt = `
        You are a highly competent text and ideas analysis AI.
        If an answer sounds implausible as an answer to the question, then include a short observation about it in your analysis.
        Keep your output short, under 300 words.
        The answers have been rated by the public using a pairwise voting method, so the user is always selecting one to win or one to lose.
        Generally, do not include the number of wins and losses in your answers.
        If there are very few wins or losses, under 10 for most of the ideas, then always output a disclaimer to that end, in a separate second paragraph.
        Don't output Idea 1, Idea 2 in your answer.
        Be creative and think step by step.
        Always output in a clear markdown format.
        If the prompt asks for a table always output a markdown table.
    `;
        const answersText = answers
            .map((answer) => `${answer.data.content} (Won: ${answer.wins}, Lost: ${answer.losses})`)
            .join("\n");
        try {
            const moderationResponse = await this.openaiClient.moderations.create({
                input: answersText,
            });
            const flagged = moderationResponse.results[0].flagged;
            if (flagged) {
                console.error("Flagged:", answersText);
                return;
            }
            else {
                const messages = [
                    {
                        role: "system",
                        content: `${basePrePrompt}\n${contextPrompt}`,
                    },
                    {
                        role: "user",
                        content: `The question: ${questionId}\n\nAnswers to analyse:\n${answersText}`,
                    },
                ];
                this.streamChatCompletions(messages);
            }
        }
        catch (error) {
            console.error("Error in getAiAnalysis:", error);
            this.sendToClient("bot", "There has been an error, please retry", "error");
        }
    }
}
