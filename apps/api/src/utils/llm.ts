import { ChatOpenAI } from "@langchain/openai";

export class LLMUtils {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      model: "openai/gpt-4o-mini",
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
      },
      temperature: 0.7,
    });
  }

  async invoke(prompt: string): Promise<string> {
    const res = await this.llm.invoke(prompt);
    return res.content.toString();
  }

  async invokeJSON(prompt: string) {
    const text = await this.invoke(prompt);

    const match = text.match(/```json([\s\S]*?)```/);

    if (match) return JSON.parse(match[1]);

    return JSON.parse(text);
  }
}