import { NextResponse } from "next/server";
import OpenAI from "openai";
import { saveProjectEstimate } from "@/firebase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const POST = async (req) => {
  const body = await req.json();
  const { prompt, currentFields, correction } = body;

  try {
    // If there's a correction, use a different system prompt
    const systemPrompt = correction
      ? `You are a project estimation expert. Review and modify the existing estimate based on the correction request.
         Current estimate: ${JSON.stringify(currentFields)}
         Correction request: ${correction}
         Modify the estimate while maintaining this JSON schema:
         {
           "title": "string",
           "description": "string",
           "modules": [
             {
               "name": "string",
               "category": "string (e.g., 'authentication', 'data-management', 'ui-components', 'integration', 'infrastructure')",
               "complexity": "string (low|medium|high)",
               "reusability": "number (0-100 percentage)",
               "submodules": [
                 {
                   "name": "string",
                   "category": "string",
                   "time": "number (hours)",
                   "description": "string",
                   "similar_references": [
                     {
                       "project_name": "string",
                       "module_name": "string",
                       "time_taken": "number (hours)"
                     }
                   ]
                 }
               ]
             }
           ]
         }`
      : `You are a project estimation expert. Convert project descriptions into structured estimates with modules, timelines, and budgets. Always respond with valid JSON matching this schema:
         {
           "title": "string",
           "description": "string",
           "duration": "number (days)",
           "team": {
             "frontend": "number",
             "backend": "number"
           },
           "budget": {
             "total": "number",
             "breakdown": {
               "development": "number",
               "testing": "number",
               "deployment": "number"
             }
           },
           "modules": [
             {
               "name": "string",
               "category": "string (e.g., 'authentication', 'data-management', 'ui-components', 'integration', 'infrastructure')",
               "complexity": "string (low|medium|high)",
               "reusability": "number (0-100 percentage)",
               "submodules": [
                 {
                   "name": "string",
                   "category": "string",
                   "time": "number (hours)",
                   "description": "string",
                   "similar_references": [
                     {
                       "project_name": "string",
                       "module_name": "string",
                       "time_taken": "number (hours)"
                     }
                   ]
                 }
               ]
             }
           ]
         }`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: correction
            ? "Please update the estimate based on the correction request."
            : `Convert this project pitch into a detailed project estimate: ${prompt}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const projectEstimate = JSON.parse(response.choices[0].message.content);

    // Save to Firebase
    const projectId = await saveProjectEstimate(projectEstimate);

    // Add the projectId to the response
    const responseWithId = {
      ...projectEstimate,
      id: projectId,
    };

    return new NextResponse(JSON.stringify(responseWithId), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to process request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
