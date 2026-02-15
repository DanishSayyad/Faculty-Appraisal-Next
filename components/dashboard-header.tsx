"use client"

import { useState } from "react"
import { Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ChangePasswordDialogContent } from "./change-password-dialog"

interface DashboardHeaderProps {
  title: string
  description?: string
  onMenuClick?: () => void
}

export function DashboardHeader({ title, description, onMenuClick }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 mb-8">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings size={20} />
            </Button>
          </DialogTrigger>
          <ChangePasswordDialogContent onClose={() => setIsOpen(false)} />
        </Dialog>
      </div>
    </div>
  )
}
