import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import {OpenAIEmbeddings} from '@langchain/openai'
import {QdrantVectorStore} from '@langchain/qdrant'
import "dotenv/config"

async function generateVectoreEmbbadingForFile(filepath) {
    //load pdf as document
    const loader = new PDFLoader(filepath);
    const document = await loader.load();
    
    //initalize model for embedding
    const embedding = new OpenAIEmbeddings({
        model: "text-embedding-3-small",
        apiKey:""
    })
    
    //vector store
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embedding, // -> use this model
        {
            url: 'http://localhost:6333',
            collectionName: 'pritish-doc'
        }

    );

    await vectorStore.addDocuments(document);
    console.log("all document is stored in index");
}

generateVectoreEmbbadingForFile("./notes-toc.pdf");