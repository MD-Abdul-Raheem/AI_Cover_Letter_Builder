import { GoogleGenAI } from "@google/genai";
import { CoverLetterRequest } from "../types";

const SYSTEM_INSTRUCTION = `You are an expert HR professional and AI cover letter writer. Your task is to craft a concise, highly professional, and compelling cover letter that directly addresses the job description provided. 

CRITICAL RULES:
1. STRICTLY adhere to the facts provided in the resume. Do NOT fabricate, exaggerate, or invent experiences, skills, or qualifications that are not explicitly present in the source text. If a specific skill is required by the JD but missing in the Resume, do not claim the candidate has it.
2. The generated cover letter must be STRICTLY under 135 words.
3. Maintain a formal, confident, and professional tone.
4. Do not include placeholders for sender/recipient addresses. Start directly with the salutation (e.g., 'Dear Hiring Manager,').
5. End the letter specifically with the closing 'Regards,' followed by the Candidate Name. The Candidate Name MUST be formatted in Title Case (e.g., 'John Doe') and NOT ALL CAPS, even if the resume uses uppercase. If the name is not explicitly provided in the inputs, you MUST extract it from the Resume Content. Do not use generic placeholders like "A Job Applicant".`;

export const generateCoverLetter = async (request: CoverLetterRequest): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Logic: If candidateName is empty (auto-extract failed), specifically instruct the model to find it in the resume text.
  const nameContext = request.candidateName && request.candidateName.trim() !== ''
    ? request.candidateName
    : "NOT PROVIDED. You MUST extract the candidate's full name from the Resume Content below for the sign-off.";

  const prompt = `
Job Description (JD) content:
---
${request.jdContent}
---
Candidate Resume Content:
---
${request.resumeContent}
---
Candidate Name Context:
---
${nameContext}
---
Additional Instructions (Keep this optional instruction brief and apply it strictly):
---
${request.instructions || 'No special instructions provided.'}
---
Please generate the tailored cover letter now. Ensure the sign-off uses exactly "Regards," and the Candidate Name is in Title Case (not ALL CAPS).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-09-2025',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // Lower temperature for more factual accuracy
      }
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate cover letter. Please try again.");
  }
};