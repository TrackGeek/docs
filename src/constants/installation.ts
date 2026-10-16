import type { OperatingSystem } from "@/types/docs"

export const operatingSystems: { value: OperatingSystem; label: string }[] = [
  { value: "linux", label: "Linux" },
  { value: "macos", label: "macOS" },
  { value: "windows", label: "Windows" },
]

export const installCommands: Record<OperatingSystem, string> = {
  linux:
    "curl -fsSL https://raw.githubusercontent.com/TrackGeek/selfhost/main/install.sh -o /tmp/trackgeek-install.sh && bash /tmp/trackgeek-install.sh",
  macos:
    "curl -fsSL https://raw.githubusercontent.com/TrackGeek/selfhost/main/install.sh -o /tmp/trackgeek-install.sh && bash /tmp/trackgeek-install.sh",
  windows:
    '$script = Join-Path $env:TEMP "trackgeek-install.ps1"; Invoke-WebRequest https://raw.githubusercontent.com/TrackGeek/selfhost/main/install.ps1 -OutFile $script; & $script',
}
