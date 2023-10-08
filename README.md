# CustomDataAIChatBot

To run this demo, you need to have:

1. An OpenAI account. If you don't have one, you can sign up for free at [openai.com](https://www.openai.com).
2. [Optional] A [Supabase account](https://app.supabase.io/register). Only needed if you want to use the hosted Supabase service.

## Setup

1. Clone this repository

```bash
git clone git@github.com:thorwebdev/langchain-chatbot-demo.git
```

2. Install dependencies

```bash
cd CustomDataAIChatBot
npm install
```

3. Start Supabase

```bash
supabase start
```

5. Create a `.env` file in the root directory of the project and add your API keys:

```
Supabase_Project_URL="YOUR SUPABASE KEY"
Supabase_API_Key="YOUR SUPABASE API KEY"
openai_key="YOUR OPENAI KEY"    
```
