"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-2xl dark:bg-gray-800">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-full">
              <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {
              "Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
            }
          </p>

          <div className="space-y-4">
            <Link href="/" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact our support team or visit our help center.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
