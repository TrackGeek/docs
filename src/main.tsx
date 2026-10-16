import { RouterProvider } from "@tanstack/react-router"
import { ThemeProvider } from "next-themes"
import React from "react"
import ReactDOM from "react-dom/client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { router } from "@/router"
import "@/styles/globals.css"

const root = document.getElementById("root")
if (!root) throw new Error("Root element was not found")

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
