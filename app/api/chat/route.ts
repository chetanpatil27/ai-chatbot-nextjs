import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
