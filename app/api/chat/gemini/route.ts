import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: message,
  });
  console.log("res", res);
  return NextResponse.json(res);
}
