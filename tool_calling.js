import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

//javascript function
function get_weather(city){
    return `the temprature in ${city} is 31 degree C`
}

 //define of tool
const tools = [
{
    type: "function",
    name: "get_weather",
    description: "get the current weather of a city",
    parameters: {
        type: "object",
        properties: {
            city: {
                type: "string",
                description: "the name of city"
            }
        },
        required: ["city"],
        additionalProperties: false
    }
}
]






//first api call
const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: "what is the weather of bhopal.",
    tools
});

//extract tool call

const toolCall = response.output.find(
    (item) => item.type === "function_call"
)

//parse arguments
const args = JSON.parse(toolCall.arguments);
const weatherResult = get_weather(args.city);


//final api call
const finalResponse = await client.responses.create({
    model: "gpt-4.1-mini",
     previous_response_id: response.id,
    input: [
        {
            type: "function_call_output",
            call_id: toolCall.call_id,
            output: weatherResult
        }
    ]
})
console.log(finalResponse.output_text);