"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, KeyRound } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to send OTP")
        return
      }

      setSuccess("OTP has been sent to your email address")
      setTimeout(() => {
        setStep("otp")
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError("Failed to connect to the server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to reset password")
        return
      }

      setSuccess("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err) {
      setError("Failed to connect to the server. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="w-40 h-40 flex items-center justify-center">
              <img src="/image.png" alt="Logo" className="w-40 h-40 object-contain" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Faculty Portal</h1>
          <p className="text-muted-foreground mt-2">Password Recovery</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm"
          >
            {success}
          </motion.div>
        )}

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-border">
            <CardHeader className="flex flex-col items-center justify-center">
              <CardTitle className="text-2xl font-serif font-bold">
                {step === "email" ? "Forgot Password" : "Reset Password"}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-center">
                {step === "email"
                  ? "Please enter the email address you used while registering your account. We'll send a one-time password (OTP) to reset your password on the same email."
                  : "Enter the OTP sent to your email and your new password"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "email" ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-lg flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>

                  <div className="text-center">
                    <Link href="/">
                      <Button
                        type="button"
                        variant="link"
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors flex items-center gap-2 mx-auto"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="font-bold text-lg flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      OTP
                    </Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="font-bold text-lg">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="font-bold text-lg">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>

                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-bold transition-colors"
                      onClick={() => {
                        setStep("email")
                        setOtp("")
                        setNewPassword("")
                        setConfirmPassword("")
                        setError("")
                      }}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </form>
              )}

              <div className="text-center mt-4 text-xs text-gray-500 font-semibold">
                © 2025 PCCOE. All rights reserved by team AANSH
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
