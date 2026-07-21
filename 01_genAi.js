import "dotenv/config";
import { OpenAI } from "openai";
import { zodResponseFormat, zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


const RecipeSchema = z.object({
    title: z.string(),
    steps: z.array(z.string()),
    ingredients: z.array(z.string())
})


const response = await client.responses.parse({
    model : "gpt-4.1-mini",
    input: "give me recipe for chicken kadai",
    text: {
        format: zodTextFormat(RecipeSchema, "recipe")
    }
})

console.log(response.output_parsed);