import JobForm from "@/components/job-form"
import QuestionList from "@/components/question-list"
import { QuestionsProvider } from "@/contexts/questions-context"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'AI Interview Assistant | Generate Smart Interview Questions',
  description: 'Professional AI-powered tool for generating relevant interview questions based on job descriptions and resumes.',
}

export default function Home() {
  return (
    <QuestionsProvider>
      <main className="min-h-screen bg-gradient-to-b from-background to-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-primary mb-6 sm:text-5xl">
              AI Interview Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate tailored interview questions using advanced AI to match job requirements with candidate profiles.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <JobForm />
            </div>
            <div>
              <QuestionList />
            </div>
          </div>
        </div>
      </main>
    </QuestionsProvider>
  )
}