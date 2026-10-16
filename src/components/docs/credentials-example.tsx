import { EnvTable } from "@/components/jalco/env-table"

export function CredentialsExample() {
  return (
    <div className="mt-6">
      <EnvTable
        title="Required credentials · placeholders only"
        variables={[
          { key: "IMGBB_API_KEY", value: "<your-imgbb-key>", description: "Image uploads" },
          { key: "HARDCOVER_API_KEY", value: "<your-hardcover-key>", description: "Book lookup" },
          { key: "TMDB_API_KEY", value: "<your-tmdb-key>", description: "Movie and series lookup" },
          { key: "IGDB_CLIENT_ID", value: "<your-igdb-client-id>", description: "Game lookup" },
          { key: "IGDB_CLIENT_SECRET", value: "<your-igdb-client-secret>", description: "Game lookup" },
          { key: "RESEND_API_KEY", value: "<your-resend-key>", description: "Email delivery" },
          { key: "RESEND_FROM", value: "<sender-on-your-verified-domain>", description: "Verified email sender" },
        ]}
      />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Example placeholders, not working credentials. Enter your real values in the installer. Use the eye icon to
        reveal each example.
      </p>
    </div>
  )
}
