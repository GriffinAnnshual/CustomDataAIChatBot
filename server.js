import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import dotenv from 'dotenv'
dotenv.config()
// Initialize our Supabase client
console.log(process.env.Supabase_Project_URL)
const supabaseClient = createClient(
	process.env.Supabase_Project_URL,
	process.env.Supabase_API_Key
)

// generateEmbeddings
async function generateEmbeddings() {
	// Initialize OpenAI API
	const openai = new OpenAI({
		apiKey: process.env.openai_key,
	})
	
	// Create some custom data (Cooper Codes)
	const documents = [
		"Cooper Codes is a YouTuber with 5,300 subscribers",
		"Cooper Codes has a website called coopercodes.com",
		"Cooper Codes likes clam chowder",
		"Cooper Codes has a video covering how to create a custom chatbot with Supabase and OpenAI API",
	]

	for (const document of documents) {
		const input = document.replace(/\n/g, "")

		// Turn each string (custom data) into an embedding
		const embeddingResponse = await openai.embeddings.create({
			model: "text-embedding-ada-002", // Model that creates our embeddings
			input,
		})

		const [{ embedding }] = embeddingResponse.data.data

		// Store the embedding and the text in our supabase DB
		await supabaseClient.from("documents").insert({
			content: document,
			embedding,
		})
	}
}

generateEmbeddings();
async function askQuestion() {
	const { data, error } = await supabaseClient.functions.invoke(
		"ask-custom-data",
		{
			body: JSON.stringify({ query: "What is Cooper Codes favorite food?" }),
		}
	)
	console.log(data)
	console.log(error)
}

askQuestion()

// /ask-custom-data -> getting relevant documents, asking chatgpt, returning the response
// Supabase command line interface
