// @ts-nocheck
import { serve } from "https://deno.land/std@0.170.0/http/server.ts"
import "https://deno.land/x/xhr@0.2.1/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.5.0"
import GPT3Tokenizer from "https://esm.sh/gpt3-tokenizer@1.1.5"
import OpenAI from "https://esm.sh/openai@4.11.1"
import { stripIndent, oneLine } from "https://esm.sh/common-tags@1.8.2"

export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, x-client-info, apikey, content-type",
}

const supabaseClient = createClient(
	Deno.env.get(Supabase_Project_URL),
	Deno.env.get(Supabase_API_Key)
)

serve(async (req) => {
	// ask-custom-data logic
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders })
	}


	const { query } = await req.json()

	// OpenAI recommends replacing newlines with spaces for best results
	const input = query.replace(/\n/g, " ")
	console.log(input)
	const openai = new OpenAI({
		apiKey: Deno.env.get(openai_key),
	})

	// Generate a one-time embedding for the query itself
	const embeddingResponse = await openai.embeddings.create({
		model: "text-embedding-ada-002",
		input,
	})

    console.log(typeof embeddingResponse["data"][0]["embedding"])
    const list = embeddingResponse["data"][0]["embedding"]
    const embedding = `[${list.join(",")}]`

	// get the relevant documents to our question by using the match_documents
	// rpc: call PostgreSQL functions in supabase
	const { data: documents, error } = await supabaseClient.rpc(
		"match_documents",
		{
			query_embedding: embedding,
			match_threshold: 0.73, // Choose an appropriate threshold for your data
			match_count: 10, // Choose the number of matches
		}
	)

	if (error) throw error
	// documents is going to be all the relevant data to our specific question.

	const tokenizer = new GPT3Tokenizer({ type: "gpt3" })
	let tokenCount = 0
	let contextText = ""

	// Concat matched documents
	for (let i = 0; i < documents.length; i++) {
		const document = documents[i]
		const content = document.content
		const encoded = tokenizer.encode(content)
		tokenCount += encoded.text.length

		// Limit context to max 1500 tokens (configurable)
		if (tokenCount > 1500) {
			break
		}

		contextText += `${content.trim()}---\n`
	}

	const prompt = stripIndent`${oneLine`
    You are a representative that is very helpful when it comes to talking about Griffin Annshual! Only ever answer
    truthfully and be as helpful as you can!"`}
    Context sections:
    ${contextText}
    Question: """
    ${query}
    """
    Answer as simple text:
  `


	const completionResponse = await openai.completions.create({
		model: "text-davinci-003",
		prompt,
		max_tokens: 512,
		temperature: 0, 
	})

	const id = completionResponse["id"];
	const text = completionResponse["choices"][0]["text"];


	return new Response(JSON.stringify({ id, text }), {
		headers: { ...corsHeaders, "Content-Type": "application/json" },
	})
})
