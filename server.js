import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config()

// Initialize our Supabase client
console.log(process.env.Supabase_Project_URL)
const supabaseClient = createClient(
	process.env.Supabase_Project_URL,
	process.env.Supabase_API_Key
)

async function generateEmbeddings() {
	// Initialize OpenAI API
	const openai = new OpenAI({
		apiKey: process.env.openai_key,
	})

	const documents = [
		"Griffin is a 18y/o teen who loves programming.",
		"Griffin's favourite food is Briyani",
		"Griffin's favourite sport is cricket.",
		"Griffin is currently pursuing his Computer Science Degree",
	]

	for (const document of documents) {
		const input = document.replace(/\n/g, "")
		console.log("This is the input given:" + input)
		console.log("This is the openai key:" + process.env.openai_key)
		const embeddingResponse = await openai.embeddings.create({
			model: "text-embedding-ada-002", // Model that creates our embeddings
			input,
		})

		console.log(typeof embeddingResponse["data"][0]["embedding"])
		const list = embeddingResponse["data"][0]["embedding"]
		const embedding = `[${list.join(",")}]`
		// Store the embedding and the text in our supabase DB
		const { data, error } = await supabaseClient.from("documents").insert({
			content: document,
			embedding,
		})
		if (error) {
			console.error("Error inserting data into Supabase:", error)
		}
	}
	return
}


async function askQuestion() {
	const { data, error } = await supabaseClient.functions.invoke(
		"ask-custom-data",
		{
			body: JSON.stringify({ query: "Tell me about Griffin." }),
		}
	)
	if (error) throw error
	else {
		console.log(data)
	}
}

askQuestion()
