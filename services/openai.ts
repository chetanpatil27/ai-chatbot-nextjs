// import OpenAI from "openai";
// export const client = new OpenAI({
//   apiKey: import.meta.env.NEXT_PUBLIC_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// export const getChatResponse = async (message: string) => {
//   console.log("at getchatres");
//   try {
//     const res = await client.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: message }],
//     });
//     return res.choices[0].message.content;
//   } catch (error) {
//     return error;
//   }
// };

export const getChatResponse = async (message: string) => {
  const res = await fetch("http://localhost:3000/api/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await res.json();
  return data;
};
