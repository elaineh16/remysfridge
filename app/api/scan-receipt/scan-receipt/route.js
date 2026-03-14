import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request) {
  const { imageBase64, mediaType } = await request.json();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${mediaType};base64,${imageBase64}`,
            },
          },
          {
            type: "text",
            text: `You are a grocery receipt parser. Look at this receipt and extract only the food/grocery items.

Return ONLY a JSON array, no explanation, no markdown. Example format:
[
  { "name": "Bananas", "price": 1.49, "emoji": "🍌", "quantity": 1 },
  { "name": "Carrots", "price": 2.29, "emoji": "🥕", "quantity": 2 }
]

Only include actual food ingredients and groceries. Skip taxes, totals, store info, and non-food items.`,
          },
        ],
      },
    ],
    max_tokens: 1024,
  });

  const text = response.choices[0].message.content;

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const items = JSON.parse(clean);
    return Response.json({ items });
  } catch {
    return Response.json({ error: "Could not parse receipt" }, { status: 400 });
  }
}