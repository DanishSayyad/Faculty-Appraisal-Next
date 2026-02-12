"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { RubricCriteria } from "@/lib/types"

interface RubricEvaluatorProps {
  criteria: RubricCriteria[]
  onSubmit: (scores: Record<string, number>, totalScore: number) => void
}

export function RubricEvaluator({ criteria, onSubmit }: RubricEvaluatorProps) {
  const [scores, setScores] = useState<Record<string, number>>({})

  const handleScoreChange = (criteriaId: string, score: number) => {
    setScores((prev) => ({ ...prev, [criteriaId]: score }))
  }

  const calculateTotal = () => {
    return criteria.reduce((total, c) => {
      const score = scores[c.id] || 0
      return total + score * c.weight
    }, 0)
  }

  const totalScore = calculateTotal()
  const maxScore = criteria.reduce((total, c) => total + c.maxScore * c.weight, 0)

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-serif">Evaluation Rubric</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {criteria.map((criterion) => (
          <motion.div key={criterion.id} className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold text-foreground">{criterion.name}</label>
                <span className="text-sm text-muted-foreground">Weight: {criterion.weight}x</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{criterion.description}</p>
            </div>

            <div className="flex gap-2">
              {Array.from({ length: criterion.maxScore }).map((_, idx) => {
                const score = idx + 1
                const isSelected = scores[criterion.id] === score
                return (
                  <button
                    key={score}
                    onClick={() => handleScoreChange(criterion.id, score)}
                    className={`flex-1 py-2 rounded font-semibold transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-primary/20"
                    }`}
                  >
                    {score}
                  </button>
                )
              })}
            </div>
          </motion.div>
        ))}

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-foreground">Total Score</span>
            <span className="text-2xl font-serif font-bold text-primary">
              {totalScore.toFixed(1)}/{maxScore.toFixed(1)}
            </span>
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onSubmit(scores, totalScore)}
          >
            Submit Evaluation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
