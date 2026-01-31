import Anthropic from '@anthropic-ai/sdk';
import { ParsedFood } from '../types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function parseFoodInput(input: string): Promise<ParsedFood> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Parse the following food description and return nutritional information.

Input: "${input}"

Return a JSON object with this exact structure (no markdown, just raw JSON):
{
  "name": "food name",
  "servings": 1,
  "serving_unit": "description of one serving (e.g., '1 large egg', '1 cup', '100g')",
  "calories_per_serving": number,
  "protein_per_serving": number in grams,
  "carbs_per_serving": number in grams,
  "fat_per_serving": number in grams
}

Examples:
- "2 eggs" -> name: "Egg", servings: 2, serving_unit: "1 large egg", calories_per_serving: 78, protein_per_serving: 6, carbs_per_serving: 0.6, fat_per_serving: 5
- "bowl of oatmeal" -> name: "Oatmeal", servings: 1, serving_unit: "1 cup cooked", calories_per_serving: 150, protein_per_serving: 5, carbs_per_serving: 27, fat_per_serving: 3
- "grilled chicken breast" -> name: "Chicken Breast", servings: 1, serving_unit: "6 oz grilled", calories_per_serving: 280, protein_per_serving: 53, carbs_per_serving: 0, fat_per_serving: 6

Use your knowledge of nutrition to provide accurate estimates. If quantities are mentioned (like "2 eggs"), set servings accordingly. Return only the JSON object.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  try {
    const parsed = JSON.parse(content.text);
    return {
      name: parsed.name || input,
      servings: parsed.servings || 1,
      serving_unit: parsed.serving_unit || '1 serving',
      calories_per_serving: parsed.calories_per_serving || 0,
      protein_per_serving: parsed.protein_per_serving || 0,
      carbs_per_serving: parsed.carbs_per_serving || 0,
      fat_per_serving: parsed.fat_per_serving || 0,
    };
  } catch (err) {
    // If JSON parsing fails, try to extract data from the text
    console.error('Failed to parse AI response:', content.text);
    throw new Error('Failed to parse food information');
  }
}
