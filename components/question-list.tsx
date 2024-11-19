'use client'

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuestions } from "@/contexts/questions-context"
import { toast } from "@/hooks/use-toast"
import { RefreshCw } from "lucide-react"
import type { AIResponse } from '@/types/api'

export default function QuestionList() {
  const { questions, jobDescription, resumeText, setQuestions } = useQuestions()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (!jobDescription || !resumeText) {
      toast({
        title: "Error",
        description: "Job description and resume are required to generate new questions",
        variant: "destructive",
      })
      return
    }

    setIsRefreshing(true)
    try {
      const temperature = Math.random()
      const response = await fetch('/api/interviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeText,
          temperature,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate new questions')
      }

      const { aiResponse } = await response.json() as AIResponse
      const newQuestions = aiResponse
        .split('\n')
        .filter(q => q.trim().length > 0)

      setQuestions(newQuestions)
      toast({
        title: "Success",
        description: `Generated new questions with temperature: ${temperature.toFixed(2)}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate new questions",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  if (!questions.length) return null

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Generated Questions</CardTitle>
            <CardDescription className="text-base">
              AI-generated interview questions based on the job description and resume
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-10 w-10"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-6">
          {questions.map((question, index) => (
            <li 
              key={index} 
              className="bg-muted p-6 rounded-lg text-base leading-relaxed"
            >
              {question}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}