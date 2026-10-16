import { FileTree } from "@/components/jalco/file-tree"

export function ProjectFileTree() {
  return (
    <FileTree
      className="my-6 rounded-lg border bg-muted/20 p-4"
      tree={[
        {
          name: "selfhost",
          children: [
            {
              name: "src",
              children: [
                { name: "installer.ts" },
                { name: "cli.ts" },
                { name: "config", children: [{ name: "env.ts" }] },
                { name: "docker", children: [{ name: "setup.ts" }, { name: "runtime.ts" }] },
                {
                  name: "management",
                  children: [{ name: "autostartup.ts" }, { name: "commands.ts" }, { name: "install.ts" }],
                },
                { name: "system", children: [{ name: "filesystem.ts" }, { name: "git.ts" }, { name: "process.ts" }] },
              ],
            },
            { name: "tests", children: [] },
            { name: "templates", children: [] },
            { name: "install.sh" },
            { name: "install.ps1" },
          ],
        },
      ]}
      defaultExpanded={["selfhost", "selfhost/src"]}
    />
  )
}
