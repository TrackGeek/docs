import { useNavigate, useSearch } from "@tanstack/react-router"
import { CircleCheck, Info, Terminal } from "lucide-react"
import { CodeBlock } from "@/components/jalco/code-block"
import { Stepper, StepperItem } from "@/components/jalco/stepper"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { installCommands, operatingSystems } from "@/constants/installation"
import { docsSearchSchema } from "@/utils/docs-schemas"

export function InstallationSteps() {
  const { os } = useSearch({ from: "__root__" })
  const navigate = useNavigate()

  return (
    <div className="mt-6">
      <Tabs
        value={os}
        onValueChange={(value) => {
          const next = docsSearchSchema.shape.os.parse(value)
          void navigate({ to: ".", search: (previous) => ({ ...previous, os: next }), resetScroll: false })
        }}
      >
        <TabsList aria-label="Operating system" className="mb-6">
          {operatingSystems.map((system) => (
            <TabsTrigger key={system.value} value={system.value} className="min-w-20">
              {system.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {operatingSystems.map((system) => (
          <TabsContent key={system.value} value={system.value}>
            <Stepper>
              <StepperItem
                title={system.value === "windows" ? "Open PowerShell" : "Open your terminal"}
                description="Use an interactive terminal so you can answer the setup questions."
                status="active"
              >
                {system.value === "windows" && (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Use native PowerShell. The Linux shell script is not intended for native Windows.
                  </p>
                )}
              </StepperItem>
              <StepperItem
                title="Run the installer"
                description="Copy this command, paste it into your terminal, and press Enter."
              >
                <CodeBlock
                  code={installCommands[system.value]}
                  language={system.value === "windows" ? "powershell" : "bash"}
                  title={system.value === "windows" ? "PowerShell" : "Terminal"}
                  icon={<Terminal className="size-4" aria-hidden="true" />}
                  className="shadow-none [&_pre]:whitespace-pre-wrap [&_code]:break-all"
                />
              </StepperItem>
              <StepperItem
                title="Let the installer prepare your instance"
                description="Docker, the applications, and the database are set up for you."
                icon={<CircleCheck className="size-4" aria-hidden="true" />}
              >
                <p className="text-sm leading-6 text-muted-foreground">
                  Follow any administrator prompts or Docker Desktop dialogs. The first build can take a while.
                </p>
              </StepperItem>
            </Stepper>
          </TabsContent>
        ))}
      </Tabs>
      <Alert className="mt-6 border-primary/25 bg-accent/35">
        <Info className="text-accent-foreground" aria-hidden="true" />
        <AlertDescription>
          {os === "windows"
            ? "If setup requests a restart for WSL or virtualization, restart your computer and run the same command again."
            : "Already installed? Rerunning setup keeps your existing secrets and data volumes."}
        </AlertDescription>
      </Alert>
    </div>
  )
}
