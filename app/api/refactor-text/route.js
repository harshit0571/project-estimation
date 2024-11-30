import { collection, getDocs, query, where } from "firebase/firestore";

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/firebase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkdb(title) {
  console.log("inside checkdb", title);
  try {
    if (!title) {
      console.log("Name is missing");
      return {
        exists: false,
        matches: [],
        error: "Name is required"
      };
    }

    // Step 1: Exact match check
    console.log("Checking for exact matches...");
    const exactQuery = query(
      collection(db, "submodules"),
      where("name", "==", title)
    );
    const exactQuerySnapshot = await getDocs(exactQuery);
    console.log("Exact matches found:", exactQuerySnapshot.size);
    const exactMatches = [];

    exactQuerySnapshot.forEach((doc) => {
      exactMatches.push({
        id: doc.id,
        priority: 1,
        ...doc.data(),
      });
    });

    // If no exact matches, generate suggestions using OpenAI
    if (exactMatches.length === 0) {
      const suggestionsCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates similar names. Return exactly 25 names, separated by commas.",
          },
          {
            role: "user",
            content: `Generate exactly 25 commonly used synonyms or closely related meaningful names in English for '${title}', separated by commas.`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const suggestedNames = suggestionsCompletion.choices[0].message.content
        .split(",")
        .map((n) => n.trim().toLowerCase().replace(/\s+/g, ""));

      const similarQuery = query(
        collection(db, "submodules"),
        where("name", "in", suggestedNames)
      );
      const similarQuerySnapshot = await getDocs(similarQuery);
      
      const similarMatches = [];
      similarQuerySnapshot.forEach((doc) => {
        similarMatches.push({
          id: doc.id,
          priority: 1,
          ...doc.data(),
        });
      });

      return {
        exists: true,
        matches: [...exactMatches, ...similarMatches]
      };
    }

    return {
      exists: true,
      matches: exactMatches
    };

  } catch (error) {
    console.error("Error checking database:", error);
    return {
      exists: false,
      matches: [],
      error: error.message
    };
  }
}

export const POST = async (req) => {
  const body = await req.json();
  const { input } = body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a text analyzer. Your task is to:" +
            "1. Extract a single module and its submodules from the input text" +
            "2. Return a clean JSON object without any escape characters" +
            "3. The response should match this exact structure:" +
            JSON.stringify(
              {
                result: {
                  module: {
                    name: "string",
                    submodule: [
                      {
                        title: "string",
                        description: "string",
                      },
                    ],
                  },
                },
              },
              null,
              2
            ) +
            "4. Do not wrap the response in additional quotes or add escape characters" +
            "5. Return only the first module if multiple are present",
        },
        {
          role: "user",
          content: `${input}`,
        },
      ],
      temperature: 0.1,
    });

    const parsedContent = JSON.parse(response.choices[0].message.content);
    const cleanedResponse = parsedContent.result || parsedContent;

    // Extract titles from submodules into an array
    const titles = cleanedResponse.module.submodule.map((sub) => sub.title);
    const processedTitles = await Promise.all(
      titles.map(async (title) => {
        console.log(title);
        const processedTitle = title.toLowerCase().replace(/\s+/g, "");
        const dbResponse = await checkdb(processedTitle);

        return {
          originalTitle: title,
          processedTitle: processedTitle,
          exists: dbResponse.exists,
          matches: dbResponse.matches,
        };
      })
    );

    console.log(titles, processedTitles);
    return new NextResponse(JSON.stringify(processedTitles, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
