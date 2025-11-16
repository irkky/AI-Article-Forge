import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  type GenerateContentResult,
  type GenerativeModel,
} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY must be set");
}

const modelId = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

const genAI = new GoogleGenerativeAI(apiKey);

const baseModel = genAI.getGenerativeModel({
  model: modelId,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 2048,
  },
});

async function generateText(model: GenerativeModel, prompt: string): Promise<string> {
  let result: GenerateContentResult;

  try {
    result = await model.generateContent(prompt);
  } catch (error) {
    console.error("Gemini API request failed:", error);
    throw new Error("Gemini API request failed");
  }

  const response = result.response;
  const candidate = response.candidates?.[0];

  if (!candidate) {
    console.error("Gemini returned no candidates", { promptPreview: prompt.slice(0, 120) });
    throw new Error("Gemini returned no candidates");
  }

  if (candidate.finishReason && candidate.finishReason !== "STOP") {
    console.error("Gemini generation stopped early", {
      finishReason: candidate.finishReason,
      promptPreview: prompt.slice(0, 120),
      citationMetadata: candidate.citationMetadata,
    });
    throw new Error(`Gemini generation stopped early (reason: ${candidate.finishReason})`);
  }

  const text = response.text().trim();

  if (!text) {
    console.error("Gemini returned empty text", {
      promptPreview: prompt.slice(0, 120),
      response,
    });
    throw new Error("Gemini returned empty text");
  }

  return text;
}

function trimForExcerpt(content: string, maxLength = 2000): string {
  if (content.length <= maxLength) {
    return content;
  }

  const truncated = content.slice(0, maxLength);
  const lastSentenceEnd = truncated.lastIndexOf(".");
  if (lastSentenceEnd > maxLength * 0.6) {
    return truncated.slice(0, lastSentenceEnd + 1);
  }

  return truncated;
}

export async function generateArticleContent(
  title: string
): Promise<{ content: string; excerpt: string }> {
  const articlePrompt = `You are an expert technical writer. Write a comprehensive, well-researched blog article about: "${title}"

Requirements:
1. Write in markdown format
2. Include proper headings (## for main sections, ### for subsections)
3. Add code examples where relevant (use proper markdown code blocks with language specification)
4. Include lists, blockquotes, and other markdown formatting where appropriate
5. Make it informative, engaging, and at least 1000 words
6. Use professional but accessible language
7. Structure the article with: Introduction, Main Content Sections, Conclusion
8. Do NOT include the main title (# ${title}) as it will be added separately
9. Start directly with the introduction paragraph

Write the complete article now:`.

  const content = await generateText(baseModel, articlePrompt);

  const excerptPrompt = `Write a compelling, self-contained summary (2-3 sentences) for the article titled "${title}". It must:
- stay under 200 characters
- avoid markdown formatting
- entice the reader with the key value of the article

Article body:
${trimForExcerpt(content)}

Respond with the summary only:`.

  const excerpt = await generateText(baseModel, excerptPrompt);

  return { content, excerpt };
}
