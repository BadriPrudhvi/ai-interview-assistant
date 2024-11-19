'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface QuestionsContextType {
  questions: string[]
  jobDescription: string
  resumeText: string
  setQuestions: (questions: string[]) => void
  setJobDescription: (description: string) => void
  setResumeText: (text: string) => void
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined)

export function QuestionsProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<string[]>([])
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        jobDescription,
        resumeText,
        setQuestions,
        setJobDescription,
        setResumeText,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  )
}

export function useQuestions() {
  const context = useContext(QuestionsContext)
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider')
  }
  return context
}