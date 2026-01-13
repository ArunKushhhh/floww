import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAITask } from "../task/ExtractDataWithAI";
import { prisma } from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { GoogleGenAI } from "@google/genai";

export async function ExtractDataWithAIExecutor(
  environment: ExecutionEnvironment<typeof ExtractDataWithAITask>
): Promise<boolean> {
  try {
    const content = environment.getInput("Content");
    if (!content) {
      environment.log.error("input -> content is not defined");
      return false;
    }

    const prompt = environment.getInput("Prompt");
    if (!prompt) {
      environment.log.error("input -> prompt is not defined");
      return false;
    }

    const credentials = environment.getInput("Credentials");
    if (!credentials) {
      environment.log.error("input -> credentials is not defined");
      return false;
    }

    //get creds from db
    const credential = await prisma.credentials.findUnique({
      where: {
        id: credentials,
      },
    });
    if (!credential) {
      environment.log.error("credential not found");
      return false;
    }

    const plainCredentailValue = symmetricDecrypt(credential.value);
    if (!plainCredentailValue) {
      environment.log.error("cannot decrypt credentials");
      return false;
    }

    // console.log("Plain credential value: ", plainCredentailValue);
    // const mockExtractedData = {
    //   usernameSelector: "#username",
    //   passwordSelector: "#password",
    //   loginSelector: "body > div > form > input.btn.btn-primary",
    // };
    const ai = new GoogleGenAI({
      apiKey: plainCredentailValue,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "system",
          parts: [
            {
              text: "You are a webscrapper helper that extracts data from HTML or text. You will be given a peice of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanation. Analyse the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text.",
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: content,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        temperature: 1,
      },
    });

    environment.log.info(
      `Prompt tokens: ${response.usageMetadata?.promptTokenCount}`
    );

    environment.log.info(
      `Completion tokens: ${response.usageMetadata?.candidatesTokenCount}`
    );

    environment.log.info(
      `Total tokens: ${response.usageMetadata?.totalTokenCount}`
    );

    if (!response.candidates || response.candidates.length === 0) {
      environment.log.error("No candidates returned from AI");
      return false;
    }

    const result = response.candidates[0].content?.parts?.[0]?.text;

    if (!result) {
      environment.log.error("No result returned from AI");
      return false;
    }

    environment.setOutput("Extracted data", result);
    return true;
  } catch (error: any) {
    environment.log.error(error.message);
    return false;
  }
}
