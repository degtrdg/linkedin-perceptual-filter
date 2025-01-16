import type { PlasmoMessaging } from "@plasmohq/messaging"

const API_KEY = process.env.PLASMO_PUBLIC_GPT4_API_KEY

export type PostCategory =
  | "INFORMATIONAL"
  | "BRAGGING"
  | "PROMOTIONAL"
  | "OTHER"

interface CategoryResponse {
  category: PostCategory
  confidence: number
  explanation: string
}

const categorizeWithGPT4 = async (text: string): Promise<CategoryResponse> => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a LinkedIn post classifier. Categorize posts into: INFORMATIONAL (useful knowledge sharing), BRAGGING (self-promotion or humble bragging), PROMOTIONAL (advertising products/services), or OTHER. Respond with JSON only."
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      })
    })

    if (!response.ok) {
      console.error(response)
      throw new Error(`API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    console.log(data)
    return JSON.parse(data.choices[0].message.content) as CategoryResponse
  } catch (error) {
    console.error("Error categorizing post:", error)
    return {
      category: "OTHER",
      confidence: 0,
      explanation: "Error processing post"
    }
  }
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { text } = req.body

  console.log("Categorizing post:", text)

  if (!text) {
    return res.send({
      category: "OTHER",
      confidence: 0,
      explanation: "No text provided"
    })
  }

  const result = await categorizeWithGPT4(text)
  res.send(result)
}

export default handler
