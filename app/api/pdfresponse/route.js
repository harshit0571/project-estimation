import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

export const POST = async (req, res) => {
  if (req.method === "POST") {
    const body = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_OPENAIKEY;
    const apiUrl = "https://api.openai.com/v1/completions"; // Adjust the endpoint as needed

    try {
      console.log(body.number);
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `look at ${body.prompt} and use it to create key features for his application, create phases budgets and timelines for each feature`,
          },
        ],
      });

      const data = response.choices[0].message;
      console.log(data);
      return new NextResponse(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new NextResponse(
        JSON.stringify({
          error: "An error occurred while making the request to GPT-3.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({
        error: "An error occurred while making the request to GPT-3.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
