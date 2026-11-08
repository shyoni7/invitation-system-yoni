import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { hasSupabaseEnv } from "@/lib/env";

export default async function HomePage() {
  const t = await getTranslations();
  const supabaseReady = hasSupabaseEnv();

  const checks = [
    { label: t("home.checks.nextjs"), ok: true },
    { label: t("home.checks.i18n"), ok: true },
    {
      label: supabaseReady ? t("home.checks.supabase") : t("home.checks.supabaseMissing"),
      ok: supabaseReady,
    },
  ];

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-8 px-4 py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t("app.name")}</h1>
          <p className="text-muted">{t("app.tagline")}</p>
        </div>
        <LocaleSwitcher />
      </header>

      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-1 text-lg font-medium">{t("home.title")}</h2>
        <p className="mb-4 text-sm text-muted">{t("home.setupDone")}</p>
        <ul className="flex flex-col gap-2">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`inline-block size-2.5 rounded-full ${c.ok ? "bg-accent" : "bg-amber-500"}`}
              />
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
