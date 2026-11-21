import { ArrowLeft, Download, Printer } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { LinkButton, Button } from '@/components/primitives/Button'
import { achievements, coursework, education, projects, responsibilities, site, skillGroups, socials, summary, timeline } from '@/data/profile'

const work = timeline.filter(t => t.kind === 'Work')

function Heading({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 border-b border-ink/70 pb-0.5 font-display text-[13px] print:mb-1 print:text-[10pt] font-semibold uppercase tracking-[0.08em] text-ink">{children}</h2>
}

/**
 * One-page résumé generated from src/data/profile.ts. On screen it's an A4
 * sheet on paper; in print the toolbar disappears and the sheet fills the page.
 * Visiting resume.html?print opens the print dialog straight away.
 */
export function ResumePage() {
  useEffect(() => {
    if (!new URLSearchParams(location.search).has('print')) return
    void document.fonts.ready.then(() => window.print())
  }, [])

  return (
    <div className="min-h-dvh bg-paper print:bg-white">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/85 backdrop-blur-md print:hidden">
        <nav aria-label="Résumé actions" className="mx-auto flex max-w-[210mm] flex-wrap items-center gap-2 px-4 py-3">
          <LinkButton href="./" variant="ghost" size="sm" icon={<ArrowLeft />}>
            Back to site
          </LinkButton>
          <div className="ml-auto flex gap-2">
            {__HAS_RESUME__ ? (
              <LinkButton href={site.resumePdf} download variant="outline" size="sm" icon={<Download />}>
                Download PDF
              </LinkButton>
            ) : null}
            <Button variant="primary" size="sm" icon={<Printer />} onClick={() => window.print()}>
              Print / Save as PDF
            </Button>
          </div>
        </nav>
      </header>

      <main className="mx-auto my-8 w-full max-w-[210mm] bg-white px-[14mm] py-[12mm] text-[12px] leading-[1.45] print:text-[8.6pt] print:leading-[1.32] text-ink shadow-3 print:my-0 print:max-w-none print:px-0 print:py-0 print:shadow-none max-sm:my-0 max-sm:px-5 max-sm:py-6">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-3">
          <div>
            <h1 className="font-display text-[28px] font-semibold leading-none tracking-tight print:text-[20pt]">{site.name}</h1>
            <p className="mt-1.5">{site.degree}</p>
            <p>{site.institute}</p>
          </div>
          <div className="text-right">
            <p>
              <a href={`mailto:${site.email}`} className="inline-block py-1">
                {site.email}
              </a>
            </p>
            <p className="space-x-2">
              {socials.map(s => (
                <a key={s.id} href={s.href} className="inline-block py-1 underline decoration-ink/30 underline-offset-2">
                  {s.label}
                </a>
              ))}
            </p>
          </div>
        </header>

        <section className="mt-4 print:mt-2.5">
          <Heading>Summary</Heading>
          <p>{summary.full.join(' ')}</p>
        </section>

        <section className="mt-4 print:mt-2.5">
          <Heading>Education</Heading>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line-strong text-ink-2">
                <th className="py-1 font-medium">Degree</th>
                <th className="py-1 font-medium">Institute / Board</th>
                <th className="py-1 text-right font-medium">CGPA / %</th>
                <th className="py-1 text-right font-medium">Year</th>
              </tr>
            </thead>
            <tbody>
              {education.map(e => (
                <tr key={e.degree} className="border-b border-line">
                  <td className="py-1 pr-2">{e.degree}</td>
                  <td className="py-1 pr-2">{e.school}</td>
                  <td className="py-1 text-right">{e.score}</td>
                  <td className="py-1 text-right">{e.years}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-4 print:mt-2.5">
          <Heading>Experience</Heading>
          {work.map(w => (
            <article key={w.id} className="break-inside-avoid">
              <div className="flex justify-between gap-4">
                <p>
                  <strong>{w.org}</strong> · <em>{w.title}</em>
                </p>
                <p className="num shrink-0 italic">{w.period}</p>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {w.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="mt-4 print:mt-2.5">
          <Heading>Projects</Heading>
          <div className="space-y-2.5 print:space-y-1.5">
            {projects.map(p => (
              <article key={p.slug} className="break-inside-avoid">
                <div className="flex justify-between gap-4">
                  <p>
                    <strong>{p.title}</strong> · <em>{p.role}</em> ·{' '}
                    <a href={p.repo} className="underline decoration-ink/30 underline-offset-2">
                      GitHub
                    </a>
                  </p>
                  <p className="num shrink-0 italic">{p.year}</p>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4">
                  {p.points.map(point => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 print:mt-2.5 print:grid-cols-2">
          <section>
            <Heading>Achievements</Heading>
            <ul className="space-y-1">
              {achievements.map(a => (
                <li key={a.title}>
                  <strong>{a.title}</strong>
                  {a.year ? <span className="num"> ({a.year})</span> : null}: {a.detail}
                </li>
              ))}
            </ul>
            <div className="mt-4 print:mt-2.5">
              <Heading>Position of responsibility</Heading>
              {responsibilities.map(r => (
                <p key={r.title}>
                  <strong>{r.title}</strong>, {r.org} · <em>{r.period}</em>
                </p>
              ))}
            </div>
          </section>
          <section>
            <Heading>Technical skills</Heading>
            <ul className="space-y-0.5">
              {skillGroups.map(g => (
                <li key={g.id}>
                  <strong>{g.title}:</strong> {g.items.join(', ')}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-4 print:mt-2.5">
          <Heading>Key courses</Heading>
          <ul className="space-y-0.5">
            {coursework.map(c => (
              <li key={c.area}>
                <strong>{c.area}:</strong> {c.courses.join(', ')}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
