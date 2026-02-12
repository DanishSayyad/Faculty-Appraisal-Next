"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EvaluationCardProps {
  projectId: string
  teamName: string
  projectName: string
  description: string
  technologies: string[]
  onEvaluate: (projectId: string, score: number, feedback: string) => void
}

export function EvaluationCard({
  projectId,
  teamName,
  projectName,
  description,
  technologies,
  onEvaluate,
}: EvaluationCardProps) {
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = () => {
    onEvaluate(projectId, score, feedback)
    setScore(0)
    setFeedback("")
    setIsExpanded(false)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-serif text-lg">{projectName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{teamName}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">Pending</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground text-sm">{description}</p>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span key={tech} className="px-2 py-1 rounded text-xs bg-secondary/10 text-secondary">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {isExpanded && (
            <motion.div
              className="space-y-4 pt-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Rating (1-10)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setScore(num)}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                        score === num
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary/20"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback..."
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleSubmit}
                  disabled={score === 0}
                >
                  Submit Evaluation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setIsExpanded(false)
                    setScore(0)
                    setFeedback("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {!isExpanded && (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setIsExpanded(true)}
            >
              Evaluate Project
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
