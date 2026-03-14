import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request) {
  const { ingredients, mealType, cuisine, calories } = await request.json();

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: `You are a recipe suggester. The user has these ingredients in their fridge: ${ingredients}.

Their preferences:
- Meal type: ${mealType || "any"}
- Cuisine: ${cuisine || "any"}
- Calories: ${calories || "any"}

Suggest 3 recipes that best match both their ingredients AND preferences. Return ONLY a JSON array, no explanation, no markdown:
[
  {
    "name": "Recipe name",
    "match": 85,
    "time": "20 min",
    "calories": 350,
    "mealType": "lunch",
    "cuisine": "Italian",
    "tags": ["quick", "high protein"],
    "usedCount": 4,
    "ingredients": ["2 eggs", "1 onion, diced"],
    "steps": ["Step one instruction", "Step two instruction"]
  }
]

match is a percentage (0-100) of how many fridge ingredients the recipe uses. Order from highest to lowest match.`,
      },
    ],
    max_tokens: 2000,
  });

  const text = response.choices[0].message.content;

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const recipes = JSON.parse(clean);
    return Response.json({ recipes });
  } catch {
    return Response.json({ error: "Could not parse recipes" }, { status: 400 });
  }
}