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


//generate Embeddings

async function generateEmbeddings(){
    const Configuration = new Configuration({
			apikey: process.env.Openai_ApiKey,
		})
}


