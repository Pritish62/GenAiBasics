import { OpenAIEmbeddings } from '@langchain/openai'
import { QdrantVectorStore } from '@langchain/qdrant'
import "dotenv/config"
import OpenAI from 'openai'

const client = new OpenAI({
   
    apiKey: ""

})

async function query(userQuery) {

    //convert userquery to vector embedding
    //initalize model for embedding
    const embedding = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey: ""
    })

    //search user query in qdrant
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embedding, // -> use this model
        {
            url: 'http://localhost:6333',
            collectionName: 'pritish-doc'
        }

    );
    //get similar vector and chunks

    const vectorRetrieve = vectorStore.asRetriever({ k: 3 });
    const result = await vectorRetrieve.invoke(userQuery);
    //feed those chunks to llm and do simple chat

    const SYSTEM_PROMT = `
    You are an expert at answering user query based on provided document context,
    dont share or answer beyond what shared in doucment
    
    answer should be in short and consice also provide page number of content in which page available
    Doucment: 
    ${
        result.map((e) => JSON.stringify({pageContent : e.pageContent, pageNumber: e.metadata.loc.pageNumber}))
    }`

   const LlmResponse= await client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {role: "system", content: SYSTEM_PROMT},
            {role: "user", content: userQuery}
        ]
    })

    console.log(`LlmResponse: ` , LlmResponse.choices[0].message.content);
}

query("what is Chomsky Normal Form");