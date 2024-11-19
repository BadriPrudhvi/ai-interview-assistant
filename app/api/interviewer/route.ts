import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'
import type { AIResponse, ErrorResponse } from '@/types/api'

export const runtime = 'edge'

const SYSTEM_PROMPT = `You are an AI interviewer. Generate exactly 5 interview questions based on the job description and resume provided.
Your response must contain ONLY the 5 numbered questions - no introduction, no explanation, no additional text.
Include technical questions that assess the candidate's fit for the role.`

interface RequestBody {
  jobDescription: string
  resumeText: string
  temperature?: number
}

export async function POST(request: NextRequest) {
    try {
        const ctx = getRequestContext()
        if (!ctx?.env?.AI || !ctx?.env?.CLOUDFLARE_GATEWAY_ID) {
            throw new Error('Required environment variables are not set')
        }

        const { jobDescription, resumeText, temperature = 0.5 } = await request.json() as RequestBody

        const userPrompt = `
Job Description:
${jobDescription}

Resume:
${resumeText}

Generate exactly 5 relevant interview questions. Format as a numbered list. Include only the questions - no other text.`

        const response = await ctx.env.AI.run(
            "@cf/meta/llama-3.1-70b-instruct",
            { 
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userPrompt },
                ],
                temperature,
                max_tokens: 2048, 
            }, 
            {
                gateway: {
                    id: ctx.env.CLOUDFLARE_GATEWAY_ID,
                    skipCache: true,
                    cacheTtl: 3600000,
                },
            },
        )

        if (!response?.response) {
            throw new Error('No response received from AI')
        }

        return new Response(JSON.stringify({ aiResponse: response.response }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error:', error)
        return new Response(
            JSON.stringify({ 
                error: 'Failed to generate response', 
                details: error instanceof Error ? error.message : 'Unknown error'
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}
