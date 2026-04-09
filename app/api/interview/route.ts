import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({
        reply: "❌ Messages format error",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", // ✅ working model
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant.",
            },
            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GROQ RAW:", JSON.stringify(data, null, 2));

    // ❌ handle error
    if (data.error) {
      return Response.json({
        reply: `❌ Groq Error: ${data.error.message}`,
      });
    }

    const reply = data?.choices?.[0]?.message?.content;

    return Response.json({
      reply: reply || "⚠️ No response from AI",
    });

  } catch (error: any) {
    console.error("SERVER ERROR:", error);

    return Response.json({
      reply: "❌ Server crashed",
    });
  }
}