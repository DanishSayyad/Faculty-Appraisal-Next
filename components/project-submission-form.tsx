"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"

interface ProjectSubmissionFormProps {
  teamId: string
  eventId: string
  onSuccess?: () => void
}

export function ProjectSubmissionForm({ teamId, eventId, onSuccess }: ProjectSubmissionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    technologies: "",
    githubUrl: "",
    demoUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await apiClient.post("/projects", {
        teamId,
        eventId,
        name: formData.name,
        description: formData.description,
        technologies: formData.technologies.split(",").map((t) => t.trim()),
        githubUrl: formData.githubUrl,
        demoUrl: formData.demoUrl,
      })

      setFormData({ name: "", description: "", technologies: "", githubUrl: "", demoUrl: "" })
      onSuccess?.()
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-serif">Submit Your Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Project Name</label>
              <Input
                name="name"
                placeholder="Enter project name..."
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
              <textarea
                name="description"
                placeholder="Describe your project..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Technologies (comma-separated)</label>
              <Input
                name="technologies"
                placeholder="e.g., Python, React, Node.js"
                value={formData.technologies}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">GitHub Repository URL</label>
              <Input
                name="githubUrl"
                type="url"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Demo Link (Optional)</label>
              <Input
                name="demoUrl"
                type="url"
                placeholder="https://demo.example.com"
                value={formData.demoUrl}
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
