'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useQuestions } from "@/contexts/questions-context"
import { AIResponse, ErrorResponse } from '@/types/api'

export default function JobForm() {
  const { setQuestions, setJobDescription: setGlobalJobDescription, setResumeText } = useQuestions()
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeTextLocal] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!jobDescription.trim() || !resumeText.trim()) {
        throw new Error('Please provide both job description and resume text')
      }

      setResumeText(resumeText)
      setGlobalJobDescription(jobDescription)

      const response = await fetch('/api/interviewer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          resumeText,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json() as ErrorResponse
        throw new Error(errorData.details || 'Failed to generate questions')
      }

      const data = await response.json() as AIResponse
      const questions = data.aiResponse
        .split('\n')
        .filter((q: string) => q.trim().length > 0)
        .slice(0, 5)

      setQuestions(questions)
      
      toast({
        title: "Questions Generated",
        description: "Interview questions have been generated successfully.",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong'
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Job Details</CardTitle>
        <CardDescription className="text-base">
          Enter the job description and candidate's resume details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description" className="text-base">
                Job Description
              </Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isLoading}
                className="min-h-[200px] resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-base">
                Candidate's Resume
              </Label>
              <Textarea
                id="resume"
                placeholder="Paste the resume content here..."
                value={resumeText}
                onChange={(e) => setResumeTextLocal(e.target.value)}
                disabled={isLoading}
                className="min-h-[200px] resize-none"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full text-base py-6"
          size="lg"
        >
          {isLoading ? "Generating..." : "Generate Questions"}
        </Button>
      </CardFooter>
    </Card>
  )
}