import { createClient } from "@supabase/supabase-js"
import {Configuration, OpenAIApi} from "openai"
import dotenv from "dotenv"
dotenv.config();

// Initializing the supabase client ==> project_url and api key

const supabase = createClient(
	process.env.Supabase_Project_URL,
	process.env.Supabase_API_Key
)


//generate Embeddings

async function generateEmbeddings(){
    const Configuration = new Configuration({
			apikey: process.env.Openai_ApiKey,
		})
}


