import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from 'react';
import { Route, Switch, Link, useLocation, useParams, Router as WouterRouter } from 'wouter';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen,
  BrainCircuit, Check, CheckCircle2, ChevronDown, CircleDot, Clock3, CloudUpload,
  Command, Copy, Database, Filter, Gauge, History, LayoutDashboard, Lightbulb,
  Menu, Network, Plus, Search, Server, Settings2, SlidersHorizontal,
  Sparkles, Terminal, Upload, X,
  type LucideIcon,
} from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { activity, incidents, serviceOptions, type Incident, type IncidentSeverity, type IncidentStatus } from '@/lib/mock-data';

const queryClient = new QueryClient();

const severityStyles: Record<IncidentSeverity, string> = {
  Critical: 'bg-red-400/10 text-red-300 border-red-400/20',
  High: 'bg-orange-400/10 text-orange-300 border-orange-400/20',
  Medium: 'bg-amber-300/10 text-amber-200 border-amber-300/20',
  Low: 'bg-slate-300/10 text-slate-300 border-slate-300/20',
};

const statusStyles: Record<IncidentStatus, string> = {
  Investigating: 'bg-blue-400/10 text-blue-300 border-blue-400/20',
  Resolved: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  Monitoring: 'bg-violet-400/10 text-violet-300 border-violet-400/20',
  Open: 'bg-red-400/10 text-red-300 border-red-400/20',
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function Shell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/analyze', label: 'Analyze logs', icon: Sparkles },
    { href: '/history', label: 'Incident history', icon: History },
    { href: '/memory', label: 'Hindsight memory', icon: BrainCircuit },
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  return (
    <div className="relative min-h-[100dvh] bg-[#080d1c] text-slate-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 ambient-glow" />

      {mobileOpen && <button aria-label="Close navigation" data-testid="button-close-mobile-nav" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden" />}
      <aside className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-[246px] flex-col overflow-hidden border-r border-white/[.08] bg-[#0b1125]/95 backdrop-blur-xl transition-transform duration-200 ease-out lg:translate-x-0',
        mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/60' : '-translate-x-full',
      )}>
        <div className="flex h-[72px] shrink-0 items-center border-b border-white/[.07] px-5">
          <Link href="/" data-testid="link-brand" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 shadow-lg shadow-blue-500/20">
              <Command size={18} strokeWidth={2.5} className="text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-200 ring-2 ring-[#0b1125]" />
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight text-slate-100">Recall<span className="text-blue-400">Ops</span></span>
          </Link>
          <button onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-sidebar" className="ml-auto rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-slate-200 lg:hidden"><X size={17} /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-2 pt-6">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = location === href || location.startsWith(`${href}/`);
              return (
                <Link href={href} key={href} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} aria-current={active ? 'page' : undefined} className={cx(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-150',
                  active ? 'bg-blue-500/[.14] text-blue-100' : 'text-slate-400 hover:bg-white/[.05] hover:text-slate-100',
                )}>
                  {active && <span aria-hidden className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-blue-400 to-violet-400" />}
                  <Icon size={17} className={cx('shrink-0 transition-colors', active ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  <span className="truncate">{label}</span>
                  {label === 'Analyze logs' && <span className="ml-auto rounded-md bg-violet-400/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-violet-300">AI</span>}
                </Link>
              );
            })}
          </nav>

          <p className="mt-8 px-3 pb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">System</p>
          <div className="space-y-1">
            <button data-testid="button-integrations" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-400 transition-colors duration-150 hover:bg-white/[.05] hover:text-slate-100">
              <Network size={17} className="shrink-0 text-slate-500" /> Integrations
              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 pulse-dot" />
            </button>
            <button data-testid="button-settings" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-slate-400 transition-colors duration-150 hover:bg-white/[.05] hover:text-slate-100">
              <Settings2 size={17} className="shrink-0 text-slate-500" /> Settings
            </button>
          </div>
        </div>

        <div className="shrink-0 p-3">
          <div className="rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[.10] to-violet-500/[.08] p-3.5">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-blue-200"><Database size={14} /> Hindsight memory</div>
            <div className="mb-2 flex items-end justify-between gap-2">
              <span className="font-display text-xl font-semibold text-slate-100">1,284</span>
              <span className="pb-0.5 text-[10px] text-slate-500">memories stored</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-blue-400 to-violet-400" /></div>
            <Link href="/memory" data-testid="link-view-memory" className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-blue-300 transition-colors hover:text-blue-200">View memory <ArrowUpRight size={12} /></Link>
          </div>
          <div className="mt-3 flex items-center gap-2.5 rounded-xl px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[11px] font-bold text-violet-200">MC</div>
            <div className="min-w-0"><p className="truncate text-[12px] font-semibold text-slate-200">Maya Chen</p><p className="truncate text-[10px] text-slate-500">Platform team</p></div>
            <ChevronDown size={14} className="ml-auto shrink-0 text-slate-600" />
          </div>
        </div>
      </aside>

      <main className="relative min-h-[100dvh] lg:pl-[246px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between gap-3 border-b border-white/[.07] bg-[#080d1c]/85 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => setMobileOpen(true)} aria-label="Open navigation" data-testid="button-open-mobile-nav" className="shrink-0 rounded-xl border border-white/10 p-2 text-slate-300 transition-colors hover:bg-white/5 lg:hidden"><Menu size={18} /></button>
            <div className="hidden items-center gap-2 text-[12px] text-slate-500 sm:flex"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 pulse-dot" /> All systems operational</div>
            <div className="flex min-w-0 items-center gap-2 text-[12px] text-slate-500 sm:hidden"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 pulse-dot" /> Operational</div>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <button data-testid="button-command-search" className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-xs text-slate-500 transition-colors hover:border-white/20 hover:bg-white/[.05] hover:text-slate-300 md:flex"><Search size={14} /> Search <kbd className="ml-4 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-600">⌘ K</kbd></button>
            <button aria-label="Search" data-testid="button-header-search" className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200 md:hidden"><Search size={17} /></button>
            <div aria-hidden className="hidden h-5 w-px bg-white/10 sm:block" />
            <button aria-label="Account menu" data-testid="button-header-avatar" className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-blue-500 text-[10px] font-bold text-white ring-2 ring-[#080d1c] transition-opacity hover:opacity-90">MC</button>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 sm:py-7 lg:px-10 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-7 sm:flex-row sm:items-end">
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.17em] text-blue-400"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" /> {eyebrow}</div>
      <h1 className="text-balance font-display text-2xl font-semibold tracking-tight text-slate-100 sm:text-[29px]">{title}</h1>
      <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-6 text-slate-400">{description}</p>
    </div>
    {action && <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>}
  </div>;
}

function LandingPage() {
  const features = [
    {
      icon: AlertCircle,
      title: 'AI-Powered Root Cause Analysis',
      description: 'Turn noisy logs into a clear explanation of what happened and what to do next.',
      tone: 'text-blue-300 bg-blue-400/10',
      ring: 'group-hover:border-blue-400/30 group-hover:bg-blue-400/[.16]',
    },
    {
      icon: BrainCircuit,
      title: 'Persistent Incident Memory',
      description: 'Capture the context behind every incident so your team gets smarter with every resolution.',
      tone: 'text-violet-300 bg-violet-400/10',
      ring: 'group-hover:border-violet-400/30 group-hover:bg-violet-400/[.16]',
    },
    {
      icon: Lightbulb,
      title: 'Reusable Solutions',
      description: 'Find proven fixes from similar incidents and move from alert to action with confidence.',
      tone: 'text-cyan-300 bg-cyan-400/10',
      ring: 'group-hover:border-cyan-400/30 group-hover:bg-cyan-400/[.16]',
    },
  ] as const;

  const workflow = [
    { step: '01', title: 'Capture the signal', body: 'Paste a stack trace or upload a log file. RecallOps normalises the noise before anything else happens.' },
    { step: '02', title: 'Reason with memory', body: 'The agent compares the signal against every incident your team has already resolved.' },
    { step: '03', title: 'Ship the fix', body: 'Get a ranked root cause, a proven remedy, and a confidence score you can act on immediately.' },
  ] as const;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[#080d1c] text-slate-100">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[680px] ambient-glow" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,.14),transparent_62%)]" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" data-testid="link-landing-brand" className="flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 shadow-lg shadow-blue-500/20">
            <Command size={19} strokeWidth={2.5} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-200 ring-2 ring-[#080d1c]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-slate-100">Recall<span className="text-blue-400">Ops</span></span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/analyze" className="hidden rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 transition-colors hover:text-slate-100 sm:inline-flex">Analyze logs</Link>
          <Link href="/dashboard" data-testid="link-landing-dashboard" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[.04] px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-blue-400/40 hover:bg-blue-400/10 hover:text-white">
            Open workspace <ArrowUpRight size={14} />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24 lg:px-10">
        <section className="grid items-center gap-12 pb-20 pt-12 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pb-28 lg:pt-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/[.07] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-blue-300">
              <Sparkles size={13} /> Incident intelligence for modern teams
            </div>
            <h1 className="max-w-xl text-balance font-display text-4xl font-semibold leading-[1.08] tracking-[-.04em] text-white sm:text-6xl lg:text-[68px]">
              Incident Resolution,{' '}
              <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent">Powered by Memory</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
              RecallOps is an AI-powered incident troubleshooting assistant that learns from every outage, connects the right signals, and helps your team resolve the next incident faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" data-testid="button-landing-get-started" className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-400">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link href="/analyze" data-testid="button-landing-analyze" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-white">
                Analyze an Incident <Sparkles size={15} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="shrink-0 text-emerald-400" /> Built for on-call teams</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="shrink-0 text-emerald-400" /> Faster, repeatable resolution</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div aria-hidden className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-transparent blur-2xl" />
            <div className="relative rounded-3xl border border-white/[.1] bg-[#0d1530]/90 p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-xl sm:p-5">
              <div className="flex items-center justify-between gap-3 border-b border-white/[.08] pb-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-blue-300"><Activity size={15} /></span>
                  <div className="min-w-0"><p className="truncate text-[11px] font-semibold text-slate-200">Live incident signal</p><p className="mt-0.5 truncate text-[10px] text-slate-500">checkout-api · detected just now</p></div>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 rounded-md bg-amber-400/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-amber-300"><span className="h-1.5 w-1.5 rounded-full bg-amber-300 pulse-dot" /> Investigating</span>
              </div>
              <div className="mt-4 rounded-xl border border-red-400/10 bg-[#090f21] p-4 font-mono-ui text-[10px] leading-6 text-red-200/70">
                <p>14:31:54 <span className="text-slate-600">checkout-api</span> ERROR</p>
                <p>upstream connect timeout</p>
                <p>retries exhausted · status=503</p>
              </div>
              <div className="mt-4 rounded-xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[.12] to-blue-500/[.06] p-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-violet-300"><BrainCircuit size={14} /> Hindsight match found</div>
                <p className="mt-3 text-xs leading-5 text-slate-300">Similar gateway timeouts were resolved by restoring the upstream connection pool and replaying failed requests.</p>
                <div className="mt-4 border-t border-white/[.08] pt-3">
                  <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Confidence</span><span className="font-display text-lg font-semibold text-blue-300">93%</span></div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.07]">
                    <div className="h-full w-[93%] rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500"><CheckCircle2 size={13} className="shrink-0 text-emerald-400" /> Suggested fix ready for review <ArrowUpRight size={13} className="ml-auto shrink-0 text-slate-600" /></div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-t border-white/[.07] pt-12 sm:grid-cols-3 sm:pt-16">
          {[
            { value: '3.6×', label: 'Faster time to resolution' },
            { value: '94%', label: 'Top-match accuracy' },
            { value: '1,284', label: 'Incidents remembered' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/[.08] bg-white/[.025] px-5 py-6">
              <p className="font-display text-3xl font-semibold tracking-tight text-slate-100">{stat.value}</p>
              <p className="mt-1.5 text-xs text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 sm:mt-24">
          <div className="mb-8 max-w-xl sm:mb-10">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.17em] text-blue-400">A better incident workflow</p>
            <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">From first signal to lasting knowledge.</h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {workflow.map(({ step, title, body }) => (
              <li key={step} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5 transition-colors hover:border-blue-400/20 hover:bg-white/[.04] sm:p-6">
                <span className="font-display text-xs font-semibold tracking-[.16em] text-blue-400">{step}</span>
                <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-100">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 sm:mt-24">
          <div className="mb-8 max-w-xl sm:mb-10">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.17em] text-blue-400">Why teams keep it</p>
            <h2 className="text-balance font-display text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">Built for the moment everything is on fire.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description, tone, ring }) => (
              <article key={title} className="group rounded-2xl border border-white/[.08] bg-white/[.025] p-5 transition duration-200 hover:-translate-y-1 hover:border-blue-400/25 hover:bg-white/[.04] sm:p-6">
                <span className={cx('flex h-10 w-10 items-center justify-center rounded-xl border border-transparent transition duration-200', tone, ring)}><Icon size={19} /></span>
                <h3 className="mt-5 text-sm font-semibold leading-5 text-slate-100">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[.07] px-5 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <span>RecallOps · Incident intelligence with memory</span>
          <Link href="/dashboard" className="flex items-center gap-1 text-slate-500 transition hover:text-blue-300">Open workspace <ArrowUpRight size={12} /></Link>
        </div>
      </footer>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  return <span data-testid={`status-severity-${severity.toLowerCase()}`} className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider', severityStyles[severity])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{severity}</span>;
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  return <span data-testid={`status-incident-${status.toLowerCase()}`} className={cx('inline-flex items-center whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-semibold', statusStyles[status])}>{status}</span>;
}

function StatCard({ label, value, change, icon: Icon, tone }: { label: string; value: string; change: string; icon: LucideIcon; tone: 'blue' | 'violet' | 'cyan' | 'amber' }) {
  const toneClass = { blue: 'bg-blue-400/10 text-blue-300', violet: 'bg-violet-400/10 text-violet-300', cyan: 'bg-cyan-400/10 text-cyan-300', amber: 'bg-amber-400/10 text-amber-300' }[tone];
  const trendUp = !change.startsWith('-');
  return <div className="panel panel-interactive reveal rounded-2xl p-4 sm:p-5">
    <div className="flex items-start justify-between gap-2">
      <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', toneClass)}><Icon size={16} /></span>
      <span className={cx('inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold', trendUp ? 'bg-emerald-400/10 text-emerald-300' : 'bg-blue-400/10 text-blue-300')}>
        {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{change}
      </span>
    </div>
    <p className="mt-4 text-[11px] font-medium text-slate-500">{label}</p>
    <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
  </div>;
}

function IncidentRow({ incident }: { incident: Incident }) {
  return <Link href={`/incidents/${incident.id}`} data-testid={`row-incident-${incident.id}`} className="group flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/[.06] px-4 py-3.5 transition-colors last:border-0 hover:bg-white/[.04] sm:grid sm:grid-cols-[minmax(0,1fr)_112px_100px_82px] sm:gap-3 sm:px-5">
    <div className="min-w-0 flex-1 basis-full sm:basis-0">
      <div className="flex items-center gap-2">
        <span className="truncate text-[13px] font-semibold text-slate-200 transition-colors group-hover:text-blue-300">{incident.title}</span>
        <span className="hidden shrink-0 text-[10px] text-slate-600 sm:inline">{incident.id}</span>
      </div>
      <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-500">
        <Server size={11} className="shrink-0" />
        <span className="truncate">{incident.service}</span>
        <span className="text-slate-700">·</span>
        <span className="whitespace-nowrap">{formatDate(incident.timestamp)}</span>
      </p>
    </div>
    <div className="shrink-0"><SeverityBadge severity={incident.severity} /></div>
    <div className="shrink-0"><StatusBadge status={incident.status} /></div>
    <div className="ml-auto flex shrink-0 justify-end text-slate-600 transition-colors group-hover:text-blue-400 sm:ml-0 sm:justify-self-end"><ArrowRight size={16} /></div>
  </Link>;
}

type MockAnalysis = {
  rootCause: string;
  service: string;
  tags: string[];
  suggestedFix: string;
  matchedIncident: string;
  confidence: number;
  duration: string;
};

function getMockAnalysis(logText: string): MockAnalysis {
  const normalized = logText.toLowerCase();

  if (/(kafka|consumer|rebalance|queue|lag|offset)/.test(normalized)) {
    return {
      rootCause: 'A consumer rebalance paused partition ownership while a slow downstream dependency caused the processing queue to build up.',
      service: 'dispatch-worker',
      tags: ['message queue', 'consumer lag', 'rebalance'],
      suggestedFix: 'Pause the rebalance loop, restore the consumer group to 6 workers, and replay the oldest 500 messages after lag returns below the alert threshold.',
      matchedIncident: 'INC-2241 · dispatch consumer rebalance',
      confidence: 91,
      duration: '31m',
    };
  }

  if (/(postgres|database|deadlock|transaction|lock|replica)/.test(normalized)) {
    return {
      rootCause: 'A long-running reporting transaction held a write lock against the orders table, forcing API requests to wait behind a saturated connection pool.',
      service: 'orders-db',
      tags: ['postgres', 'transaction lock', 'connection pool'],
      suggestedFix: 'Cancel the blocking reporting query, add the missing order-date index, and route the next report run to the read replica.',
      matchedIncident: 'INC-1982 · reporting transaction lock',
      confidence: 95,
      duration: '24m',
    };
  }

  if (/(auth|token|jwt|signing|401|403|credential)/.test(normalized)) {
    return {
      rootCause: 'A rotated signing key was not yet available in the identity edge cache, causing valid tokens to fail verification in one region.',
      service: 'identity-edge',
      tags: ['authentication', 'signing key', 'cache'],
      suggestedFix: 'Purge the identity-edge key cache, confirm the new signing key is present in every region, and retry the rejected requests.',
      matchedIncident: 'INC-1887 · stale signing key cache',
      confidence: 94,
      duration: '18m',
    };
  }

  if (/(search|elastic|index|write queue|shard)/.test(normalized)) {
    return {
      rootCause: 'The search write queue saturated after a shard relocation, increasing indexing latency and pushing the service above its SLO.',
      service: 'indexer-worker',
      tags: ['elasticsearch', 'write queue', 'shard'],
      suggestedFix: 'Pause the shard relocation, increase indexing worker capacity to 4, and drain the write queue before resuming the migration.',
      matchedIncident: 'INC-2312 · elasticsearch write queue saturation',
      confidence: 89,
      duration: '42m',
    };
  }

  return {
    rootCause: 'An upstream dependency exceeded its response budget, causing retries to consume the service connection pool and return elevated 5xx responses.',
    service: 'checkout-api',
    tags: ['upstream dependency', '5xx responses', 'connection pool'],
    suggestedFix: 'Roll back the latest gateway client change, increase the upstream idle pool to 64, and replay failed requests from the dead-letter queue.',
    matchedIncident: 'INC-2034 · checkout gateway timeout',
    confidence: 93,
    duration: '27m',
  };
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement('textarea');
  helper.value = value;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand('copy');
  helper.remove();
  if (!copied) throw new Error('Clipboard copy was not available');
}

function DashboardPage() {
  const [range, setRange] = useState('Last 30 days');

  const volume = [
    { day: 'Jun 01', created: 42, resolved: 30 },
    { day: 'Jun 03', created: 64, resolved: 46 },
    { day: 'Jun 05', created: 38, resolved: 34 },
    { day: 'Jun 07', created: 76, resolved: 58 },
    { day: 'Jun 09', created: 56, resolved: 52 },
    { day: 'Jun 11', created: 88, resolved: 70 },
    { day: 'Jun 13', created: 68, resolved: 64 },
    { day: 'Jun 15', created: 78, resolved: 72 },
    { day: 'Jun 16', created: 52, resolved: 50 },
    { day: 'Jun 17', created: 94, resolved: 84 },
    { day: 'Jun 18', created: 70, resolved: 68 },
    { day: 'Jun 19', created: 82, resolved: 76 },
  ];
  const gridLines = [0, 25, 50, 75, 100];

  const services = [
    { name: 'checkout-api', width: 72, note: '1 active', tone: 'hot' },
    { name: 'identity-edge', width: 44, note: '1 monitoring', tone: 'warm' },
    { name: 'indexer-worker', width: 31, note: 'healthy', tone: 'cool' },
    { name: 'orders-db', width: 18, note: 'healthy', tone: 'cool' },
  ] as const;

  return <div className="reveal">
    <PageHeading
      eyebrow="Operations overview"
      title="Good afternoon, Maya."
      description="Here’s what’s happening across your incident memory."
      action={<>
        <div className="relative">
          <select value={range} onChange={(event) => setRange(event.target.value)} data-testid="select-dashboard-range" aria-label="Reporting range" className="h-9 w-full appearance-none rounded-lg border border-white/10 bg-white/[.04] pl-3 pr-8 text-xs text-slate-300 outline-none transition-colors hover:border-white/20 focus:border-blue-400/60">
            <option>Last 7 days</option><option>Last 30 days</option><option>Last 90 days</option>
          </select>
          <ChevronDown size={13} aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
        <Link href="/analyze" data-testid="link-quick-analyze" className="flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-3.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"><Plus size={15} /> Analyze logs</Link>
      </>}
    />

    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      <StatCard label="Total incidents" value="47" change="+12.5%" icon={AlertCircle} tone="blue" />
      <StatCard label="Resolved incidents" value="38" change="+8.6%" icon={CheckCircle2} tone="violet" />
      <StatCard label="Memory matches" value="34" change="+6.4%" icon={BrainCircuit} tone="cyan" />
      <StatCard label="Avg. resolution time" value="28m" change="-18.2%" icon={Clock3} tone="amber" />
    </div>

    <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-[1.55fr_1fr]">
      <section className="panel reveal-delay-1 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="text-sm font-semibold text-slate-200">Incident volume</h2><p className="mt-1 text-[11px] text-slate-500">Incidents created vs. resolved · {range.toLowerCase()}</p></div>
          <div className="flex shrink-0 items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Created</span>
            <span className="flex items-center gap-1.5"><i className="h-1.5 w-1.5 rounded-full bg-violet-400" /> Resolved</span>
          </div>
        </div>

        <div className="mt-6 flex h-[200px] gap-3 sm:h-[220px]">
          <div aria-hidden className="flex w-7 shrink-0 flex-col justify-between pb-[22px] text-right text-[9px] text-slate-600">
            {[...gridLines].reverse().map((value) => <span key={value}>{value}</span>)}
          </div>
          <div className="relative flex min-w-0 flex-1 flex-col">
            <div aria-hidden className="relative flex-1">
              {gridLines.map((value) => (
                <div key={value} className="absolute inset-x-0 flex items-center" style={{ bottom: `${value}%` }}>
                  <div className="h-px w-full bg-white/[.06]" />
                </div>
              ))}
              <div className="relative flex h-full items-end gap-1.5 sm:gap-2.5">
                {volume.map((entry) => (
                  <div key={entry.day} className="group/bar flex h-full min-w-0 flex-1 items-end gap-1" title={`${entry.day} · ${entry.created} created · ${entry.resolved} resolved`}>
                    <div style={{ height: `${entry.created}%` }} className="w-1/2 rounded-t-[3px] bg-blue-400/70 transition-colors duration-200 group-hover/bar:bg-blue-300" />
                    <div style={{ height: `${entry.resolved}%` }} className="w-1/2 rounded-t-[3px] bg-violet-400/60 transition-colors duration-200 group-hover/bar:bg-violet-300" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2.5 flex justify-between text-[9px] text-slate-600">
              <span>Jun 01</span><span className="hidden sm:inline">Jun 07</span><span>Jun 12</span><span className="hidden sm:inline">Jun 19</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel reveal-delay-2 grid-surface rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div><h2 className="text-sm font-semibold text-slate-200">Service health</h2><p className="mt-1 text-[11px] text-slate-500">Current incident load</p></div>
          <Gauge size={17} className="shrink-0 text-slate-500" />
        </div>
        <div className="mt-5 space-y-4">
          {services.map(({ name, width, note, tone }) => (
            <div key={name}>
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px]"><span className="truncate font-medium text-slate-300">{name}</span><span className="shrink-0 text-slate-500">{note}</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/80">
                <div style={{ width: `${width}%` }} className={cx('h-full rounded-full transition-[width] duration-500', tone === 'hot' ? 'bg-gradient-to-r from-blue-500 to-violet-400' : tone === 'warm' ? 'bg-cyan-400/70' : 'bg-emerald-400/70')} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-white/[.07] pt-4 text-[10px] text-slate-500"><CircleDot size={12} className="shrink-0 text-emerald-400" /> 6 services reporting normally</div>
      </section>
    </div>

    <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 xl:grid-cols-[1.55fr_1fr]">
      <section className="panel reveal-delay-2 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-white/[.07] p-5">
          <div className="min-w-0"><h2 className="text-sm font-semibold text-slate-200">Recent incidents</h2><p className="mt-1 text-[11px] text-slate-500">Latest activity from your connected services</p></div>
          <Link href="/history" data-testid="link-all-incidents" className="shrink-0 text-[11px] font-semibold text-blue-300 transition-colors hover:text-blue-200">View all <ArrowUpRight className="ml-0.5 inline" size={12} /></Link>
        </div>
        <div className="hidden border-b border-white/[.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:grid sm:grid-cols-[minmax(0,1fr)_112px_100px_82px] sm:gap-3 sm:px-5">
          <span>Incident</span><span>Severity</span><span>Status</span><span />
        </div>
        {incidents.slice(0, 4).map((incident) => <IncidentRow incident={incident} key={incident.id} />)}
      </section>

      <section className="panel reveal-delay-3 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-sm font-semibold text-slate-200">Recent activity</h2><p className="mt-1 text-[11px] text-slate-500">Updates from your team</p></div>
          <Activity size={17} className="shrink-0 text-slate-500" />
        </div>
        <ul className="mt-5 space-y-4">
          {activity.map((item, index) => (
            <li key={item.action} className="flex gap-3">
              <div className="relative flex shrink-0 flex-col items-center">
                <span className={cx('flex h-7 w-7 items-center justify-center rounded-lg', item.tone === 'blue' ? 'bg-blue-400/10 text-blue-300' : item.tone === 'purple' ? 'bg-violet-400/10 text-violet-300' : item.tone === 'green' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-slate-400/10 text-slate-300')}>
                  {index === 0 ? <Sparkles size={13} /> : index === 1 ? <BrainCircuit size={13} /> : index === 2 ? <Check size={14} /> : <Network size={13} />}
                </span>
                {index < activity.length - 1 && <span aria-hidden className="mt-1 w-px flex-1 bg-white/[.07]" />}
              </div>
              <div className="min-w-0 pb-0.5">
                <p className="text-[12px] font-medium text-slate-300">{item.action}</p>
                <p className="mt-0.5 truncate text-[11px] text-slate-500">{item.detail}</p>
                <p className="mt-1 text-[10px] text-slate-600">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </div>;
}

function AnalyzePage() {
  const [logs, setLogs] = useState('');
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [analysis, setAnalysis] = useState<MockAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const stages = [{ label: 'Upload logs', icon: Upload }, { label: 'AI analysis', icon: Sparkles }, { label: 'Store in Hindsight', icon: Database }, { label: 'Recall similar incidents', icon: BrainCircuit }, { label: 'Suggest solution', icon: Lightbulb }];
  useEffect(() => {
    if (!running || stage >= stages.length - 1) return;
    const timer = window.setTimeout(() => setStage((current) => current + 1), 700);
    return () => window.clearTimeout(timer);
  }, [running, stage, stages.length]);
  useEffect(() => { if (running && stage === stages.length - 1) setRunning(false); }, [running, stage, stages.length]);
  const startAnalysis = () => {
    if (!logs.trim()) return;
    const nextAnalysis = getMockAnalysis(logs);
    setAnalysis(null);
    setCopied(false);
    setStage(1);
    setAnalysis(nextAnalysis);
    setRunning(true);
  };
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setLogs(`# ${file.name}\n2024-06-18T14:31:54Z ${file.name.replace(/\.[^.]+$/, '')} ERROR service signal loaded from uploaded log\nrequest_id=8fd2a1 region=us-east-1 status=503`);
  };
  const handleCopyFix = async () => {
    if (!analysis) return;
    try {
      await copyText(analysis.suggestedFix);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  const complete = stage >= stages.length - 1;
  const clearInput = () => { setLogs(''); setStage(0); setAnalysis(null); setCopied(false); };
  return <div className="reveal">
    <PageHeading eyebrow="AI incident analysis" title="Turn noisy logs into a next move." description="RecallOps compares the signal against your incident memory and returns a reasoned fix." action={<div className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[.06] px-3 py-2 text-[11px] text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" /> Mock workspace · no data leaves your browser</div>} />
    <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.02fr_.98fr]">
      <section className="panel rounded-2xl p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><h2 className="text-sm font-semibold text-slate-200">Incident input</h2><p className="mt-1 text-[11px] leading-5 text-slate-500">Paste a stack trace, log excerpt, or upload a file.</p></div><Terminal size={18} className="shrink-0 text-blue-400" /></div>
        <textarea value={logs} onChange={(event) => setLogs(event.target.value)} data-testid="textarea-incident-logs" spellCheck={false} placeholder={'Paste logs here…\n\nExample: 2024-06-18T14:31:54Z checkout-api ERROR upstream connect error'} className="mt-5 h-[280px] w-full resize-none rounded-xl border border-white/10 bg-[#090f21] p-4 font-mono-ui text-[12px] leading-6 text-slate-300 outline-none transition-colors placeholder:font-sans placeholder:text-[12px] placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><label data-testid="label-upload-logs" className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-slate-300 transition-colors hover:border-blue-400/40 hover:bg-blue-400/[.06] hover:text-white"><CloudUpload size={14} className="shrink-0 text-blue-400" /> Upload log file<input data-testid="input-upload-logs" type="file" accept=".log,.txt,.json" onChange={handleFile} className="hidden" /></label><span className="text-[10px] text-slate-600">TXT, LOG, JSON · up to 10 MB</span></div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[.07] pt-4"><button onClick={clearInput} disabled={!logs && !analysis} data-testid="button-clear-logs" className="text-[11px] text-slate-500 transition-colors hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40">Clear input</button><button onClick={startAnalysis} disabled={!logs.trim() || running} data-testid="button-analyze-incident" className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"><Sparkles size={14} /> {running ? 'Analyzing…' : 'Analyze incident'} <ArrowRight size={14} /></button></div>
      </section>
      <section className="panel rounded-2xl p-5 sm:p-6"><div><h2 className="text-sm font-semibold text-slate-200">Analysis pipeline</h2><p className="mt-1 text-[11px] leading-5 text-slate-500">A transparent path from raw signal to an operator-ready suggestion.</p></div><div className="mt-6 space-y-0">{stages.map((item, index) => { const Icon = item.icon; const done = stage > index || complete; const active = stage === index && (running || index === 0); return <div key={item.label} className="flex gap-3 last:pb-0"><div className="flex shrink-0 flex-col items-center self-stretch"><div className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs transition-colors duration-200', done ? 'border-blue-400/40 bg-blue-400/15 text-blue-300' : active ? 'border-violet-400/60 bg-violet-400/15 text-violet-300' : 'border-white/10 bg-white/[.03] text-slate-600')}>{done ? <Check size={14} /> : <Icon size={14} />}</div>{index < stages.length - 1 && <div aria-hidden className={cx('w-px flex-1 transition-colors duration-300', stage > index ? 'bg-blue-400/60' : 'bg-white/10')} />}</div><div className="min-w-0 flex-1 pb-6 pt-1 last:pb-0"><p className={cx('text-[12px] font-semibold transition-colors', done || active ? 'text-slate-200' : 'text-slate-500')}>{item.label}</p><p className="mt-1 text-[10px] leading-5 text-slate-600">{done ? index === 1 ? 'Signal classified and contextualized' : index === 2 ? 'Pattern saved for future recall' : index === 3 ? '2 high-confidence matches found' : index === 4 ? 'Actionable fix generated' : 'Log source accepted' : active ? 'Working now…' : 'Waiting for previous step'}</p></div></div>; })}</div></section>
    </div>
    {complete && analysis && <section className="panel reveal mt-5 overflow-hidden rounded-2xl border-blue-400/20">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[.07] bg-blue-400/[.05] px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300"><CheckCircle2 size={17} /></span>
          <div className="min-w-0"><h2 className="text-sm font-semibold text-slate-100">Analysis ready</h2><p className="mt-0.5 text-[10px] text-slate-500">Completed in {analysis.duration} · confidence {analysis.confidence}%</p></div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-emerald-300">{analysis.confidence >= 90 ? 'HIGH' : 'MEDIUM'} CONFIDENCE</span>
      </div><div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_1fr]"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Detected root cause</p><p data-testid="text-analysis-root-cause" className="text-[13px] leading-6 text-slate-300">{analysis.rootCause}</p><div className="mt-5 flex flex-wrap gap-2"><span className="rounded-md border border-blue-400/20 bg-blue-400/10 px-2 py-1 text-[10px] text-blue-300">{analysis.service}</span>{analysis.tags.map((tag) => <span key={tag} className="rounded-md border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-[10px] text-violet-300">{tag}</span>)}</div>
          <div className="mt-5 rounded-lg border border-white/[.08] bg-white/[.03] p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500"><BrainCircuit size={12} /> Recalled from Hindsight</p>
            <p data-testid="text-analysis-memory-match" className="mt-1.5 text-[11px] leading-5 text-slate-300">{analysis.matchedIncident}</p>
          </div></div><div className="rounded-xl border border-blue-400/15 bg-[#0b142b] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-blue-300"><Lightbulb size={13} /> Suggested solution</div>
            <span className="font-display text-sm font-semibold text-blue-300">{analysis.confidence}%</span>
          </div>
          <div aria-hidden className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400 transition-[width] duration-500" style={{ width: `${analysis.confidence}%` }} /></div>
          <p data-testid="text-analysis-suggested-fix" className="mt-4 text-[12px] leading-6 text-slate-300">{analysis.suggestedFix}</p><div className="mt-4 flex flex-wrap gap-2"><button data-testid="button-copy-solution" onClick={handleCopyFix} className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[.03] px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[.07] hover:text-white">{copied ? <Check size={12} /> : <Copy size={12} />}{copied ? 'Copied' : 'Copy fix'}</button><Link href="/history" data-testid="link-view-analysis-history" className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[.07] hover:text-white">View history <ArrowUpRight size={12} /></Link></div></div></div></section>}
  </div>;
}

function HistoryPage() {
  const [query, setQuery] = useState('');
  const [service, setService] = useState('All services');
  const [status, setStatus] = useState('All statuses');
  const filtered = useMemo(() => incidents.filter((incident) => {
    const matchesQuery = `${incident.title} ${incident.service} ${incident.id} ${incident.errorMessage}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (service === 'All services' || incident.service === service) && (status === 'All statuses' || incident.status === status);
  }), [query, service, status]);
  return <div className="reveal"><PageHeading eyebrow="Incident archive" title="Incident history" description="Search every investigation and the memory it left behind." action={<Link href="/analyze" data-testid="link-history-analyze" className="flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-3.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"><Plus size={15} /> New analysis</Link>} />
    <section className="panel overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-white/[.07] p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="relative min-w-0 flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search incidents" data-testid="input-search-incidents" placeholder="Search title, service, ID, or error…" className="h-9 w-full rounded-lg border border-white/10 bg-white/[.03] pl-9 pr-3 text-xs text-slate-200 outline-none transition-colors placeholder:text-slate-600 hover:border-white/[.16] focus:border-blue-400/50" />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <div className="relative min-w-0">
            <Filter size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <select value={service} onChange={(event) => setService(event.target.value)} aria-label="Filter by service" data-testid="select-service-filter" className="h-9 w-full min-w-0 appearance-none truncate rounded-lg border border-white/10 bg-white/[.03] pl-8 pr-7 text-[11px] text-slate-300 outline-none transition-colors hover:border-white/[.16] focus:border-blue-400/50 sm:w-auto sm:max-w-[168px]">
              <option>All services</option>{serviceOptions.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
            <ChevronDown size={12} aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
          <div className="relative min-w-0">
            <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" data-testid="select-status-filter" className="h-9 w-full min-w-0 appearance-none truncate rounded-lg border border-white/10 bg-white/[.03] pl-3 pr-7 text-[11px] text-slate-300 outline-none transition-colors hover:border-white/[.16] focus:border-blue-400/50 sm:w-auto sm:max-w-[150px]">
              <option>All statuses</option><option>Investigating</option><option>Monitoring</option><option>Resolved</option><option>Open</option>
            </select>
            <ChevronDown size={12} aria-hidden className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-b border-white/[.06] px-4 py-3 text-[10px] text-slate-500 sm:px-5">
        <span><strong className="font-semibold text-slate-300">{filtered.length}</strong> incidents found</span>
        <span className="hidden items-center gap-1.5 sm:flex"><SlidersHorizontal size={12} /> Filters update instantly</span>
      </div>
      {filtered.length > 0 ? <>
        <div className="hidden border-b border-white/[.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 sm:grid sm:grid-cols-[minmax(0,1fr)_112px_100px_82px] sm:gap-3 sm:px-5">
          <span>Incident</span><span>Severity</span><span>Status</span><span />
        </div>
        {filtered.map((incident) => <IncidentRow incident={incident} key={incident.id} />)}
      </> : <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[.08] bg-white/[.03]"><Search size={20} className="text-slate-500" /></span>
        <h3 className="mt-4 text-sm font-semibold text-slate-200">No incidents found</h3>
        <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-500">Try a different search term, or clear one of your filters to widen the results.</p>
        <button onClick={() => { setQuery(''); setService('All services'); setStatus('All statuses'); }} data-testid="button-clear-history-filters" className="mt-5 rounded-lg border border-white/10 bg-white/[.03] px-3.5 py-2 text-xs font-semibold text-blue-300 transition-colors hover:border-blue-400/30 hover:bg-blue-400/[.07]">Clear filters</button>
      </div>}</section>
  </div>;
}

function MemoryPage() {
  const [selected, setSelected] = useState('all');
  const memories = incidents.slice(0, 5);
  return <div className="reveal"><PageHeading eyebrow="Hindsight memory" title="What your incidents teach you." description="A living memory of what broke, why it broke, and what fixed it." action={<div className="flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/[.06] px-3 py-2 text-[11px] text-violet-200"><BrainCircuit size={14} /> 1,284 memories</div>} />
    <section className="mb-5 overflow-hidden rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[.12] via-[#101a38] to-violet-500/[.10] p-5 sm:p-7"><div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/15 text-blue-300"><BrainCircuit size={19} /></div><h2 className="font-display text-xl font-semibold text-slate-100">Memory that gets sharper with every incident.</h2><p className="mt-2 max-w-xl text-xs leading-6 text-slate-400">Hindsight stores the context around an incident—not just the error. It connects symptoms, root causes, fixes, and operator decisions so the next investigation starts with signal.</p><button data-testid="button-learn-memory" onClick={() => setSelected(selected === 'all' ? 'learned' : 'all')} className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 hover:text-blue-200">{selected === 'learned' ? 'Showing learned patterns' : 'See how recall works'} <ArrowRight size={13} /></button></div><div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3"><div className="rounded-xl border border-white/[.08] bg-[#0a1227]/50 p-3"><p className="font-display text-xl font-semibold text-slate-100">94%</p><p className="mt-1 text-[10px] text-slate-500">top match accuracy</p></div><div className="rounded-xl border border-white/[.08] bg-[#0a1227]/50 p-3"><p className="font-display text-xl font-semibold text-slate-100">3.6×</p><p className="mt-1 text-[10px] text-slate-500">faster resolution</p></div><div className="col-span-2 rounded-xl border border-white/[.08] bg-[#0a1227]/50 p-3 sm:col-span-1"><p className="font-display text-xl font-semibold text-slate-100">72%</p><p className="mt-1 text-[10px] text-slate-500">fixes accepted</p></div></div></div></section>
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
      <button onClick={() => setSelected('all')} data-testid="button-memory-all" className={cx('shrink-0 whitespace-nowrap rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors duration-150', selected === 'all' || selected === 'learned' ? 'border-blue-400/40 bg-blue-500/15 text-blue-200' : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[.04] hover:text-slate-200')}>All memories</button>
      <button onClick={() => setSelected('confirmed')} data-testid="button-memory-confirmed" className={cx('shrink-0 whitespace-nowrap rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors duration-150', selected === 'confirmed' ? 'border-blue-400/40 bg-blue-500/15 text-blue-200' : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[.04] hover:text-slate-200')}>Confirmed solutions</button>
      <button onClick={() => setSelected('high')} data-testid="button-memory-high-similarity" className={cx('shrink-0 whitespace-nowrap rounded-lg border px-3 py-2 text-[11px] font-semibold transition-colors duration-150', selected === 'high' ? 'border-blue-400/40 bg-blue-500/15 text-blue-200' : 'border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/[.04] hover:text-slate-200')}>High similarity</button>
    </div>
    <div className="grid gap-4 lg:grid-cols-2">{memories.filter((item) => selected === 'high' ? item.similarity >= 90 : true).map((incident) => <Link href={`/incidents/${incident.id}`} data-testid={`card-memory-${incident.id}`} key={incident.id} className="panel panel-interactive group flex flex-col rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300 transition-colors duration-200 group-hover:bg-violet-400/[.16]"><BookOpen size={15} /></span>
              <div className="min-w-0"><p className="truncate text-[13px] font-semibold text-slate-200 transition-colors group-hover:text-blue-300">{incident.memoryMatch}</p><p className="mt-0.5 truncate text-[10px] text-slate-500">{incident.service} · stored {formatDate(incident.timestamp)}</p></div>
            </div>
            <span className="shrink-0 text-right"><strong className="block font-display text-lg leading-tight text-blue-300">{incident.similarity}%</strong><span className="text-[9px] uppercase tracking-wider text-slate-600">similarity</span></span>
          </div>
          <div aria-hidden className="mt-3 h-1 overflow-hidden rounded-full bg-white/[.07]"><div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400" style={{ width: `${incident.similarity}%` }} /></div>
          <div className="mt-4 flex-1 rounded-lg border border-white/[.07] bg-white/[.03] p-3">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500"><CheckCircle2 size={12} className="text-emerald-400" /> Confirmed solution</p>
            <p className="mt-1.5 line-clamp-3 text-[11px] leading-5 text-slate-400">{incident.suggestedFix}</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[.06] pt-3.5 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="shrink-0 text-emerald-400" /> Used successfully in production</span>
            <ArrowUpRight size={13} className="shrink-0 text-slate-600 transition-colors group-hover:text-blue-300" />
          </div>
        </Link>)}</div>
  </div>;
}

function IncidentDetailPage() {
  const params = useParams();
  const incident = incidents.find((item) => item.id === params.id);
  const [copied, setCopied] = useState(false);
  if (!incident) return <NotFoundPage />;
  const copyFix = () => { setCopied(true); navigator.clipboard?.writeText(incident.suggestedFix); window.setTimeout(() => setCopied(false), 1600); };
  const related = incidents.filter((item) => incident.relatedIncidentIds.includes(item.id));
  return <div className="reveal"><Link href="/history" data-testid="link-back-history" className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500 transition-colors hover:text-blue-300"><ArrowLeft size={14} /> Back to incident history</Link><PageHeading eyebrow={`${incident.id} · ${incident.service}`} title={incident.title} description={`Detected ${formatDate(incident.timestamp)} · owned by ${incident.owner}`} action={<div className="flex flex-wrap items-center gap-2"><SeverityBadge severity={incident.severity} /><StatusBadge status={incident.status} /></div>} />
    <div className="grid gap-4 sm:gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-4 sm:space-y-5">
        <section className="panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500"><Terminal size={14} className="shrink-0 text-blue-400" /> Error signal</div>
            <button data-testid="button-copy-error" onClick={() => navigator.clipboard?.writeText(incident.errorMessage)} className="flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[.05] hover:text-slate-200"><Copy size={12} /> Copy</button>
          </div>
          <pre data-testid="text-incident-error" className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-red-400/15 bg-[#090e20] p-4 font-mono-ui text-[12px] leading-6 text-red-200/85">{incident.errorMessage}</pre>
          <div className="mt-4 flex flex-wrap gap-2">{incident.tags.map((tag) => <span key={tag} className="rounded-md border border-white/[.08] bg-white/[.04] px-2 py-1 text-[10px] text-slate-400">#{tag}</span>)}</div>
        </section>
        <section className="panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500"><AlertCircle size={14} className="shrink-0 text-amber-300" /> Root cause</div>
          <p data-testid="text-incident-root-cause" className="mt-4 text-sm leading-7 text-slate-300">{incident.rootCause}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[.06] bg-white/[.03] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-600">Duration</p><p className="mt-1 font-display text-sm font-semibold text-slate-200">{incident.duration}</p></div>
            <div className="rounded-xl border border-white/[.06] bg-white/[.03] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-600">Memory match</p><p className="mt-1 truncate font-display text-sm font-semibold text-slate-200">{incident.memoryMatch.split(' · ')[0]}</p></div>
            <div className="rounded-xl border border-blue-400/15 bg-blue-400/[.06] p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">Confidence</p><p className="mt-1 font-display text-sm font-semibold text-blue-300">{incident.similarity}%</p></div>
          </div>
        </section>
      </div>
      <div className="space-y-4 sm:space-y-5">
        <section className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[.13] to-blue-500/[.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-violet-300"><Lightbulb size={14} className="shrink-0" /> Suggested solution</div>
          <p data-testid="text-incident-suggested-fix" className="mt-4 text-sm leading-7 text-slate-200">{incident.suggestedFix}</p>
          <button onClick={copyFix} data-testid="button-copy-incident-fix" className="mt-5 flex items-center gap-2 rounded-lg border border-violet-400/25 bg-violet-400/15 px-3 py-2 text-[11px] font-semibold text-violet-100 transition-colors hover:bg-violet-400/25">{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? 'Copied to clipboard' : 'Copy suggested fix'}</button>
        </section>
        <section className="panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0"><h2 className="text-sm font-semibold text-slate-200">Related incidents</h2><p className="mt-1 text-[11px] text-slate-500">What Hindsight recalled</p></div>
            <BrainCircuit size={17} className="shrink-0 text-blue-400" />
          </div><div className="mt-4 divide-y divide-white/[.06]">{related.length ? related.map((item) => <Link href={`/incidents/${item.id}`} data-testid={`link-related-${item.id}`} key={item.id} className="group flex items-center justify-between gap-3 py-3 transition-colors first:pt-0 last:pb-0"><div className="min-w-0"><p className="truncate text-[12px] font-medium text-slate-300 transition-colors group-hover:text-blue-300">{item.title}</p><p className="mt-1 text-[10px] text-slate-600">{item.id} · {item.service}</p></div><span className="flex shrink-0 items-center gap-2"><span className="text-[11px] font-semibold text-blue-300">{item.similarity}%</span><ArrowRight size={13} className="text-slate-600 transition-colors group-hover:text-blue-300" /></span></Link>) : <p className="text-xs text-slate-500">No related memories yet.</p>}</div></section></div></div>
  </div>;
}

function NotFoundPage() {
  return <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300 shadow-lg shadow-violet-500/10"><CircleDot size={24} /></span>
    <p className="mt-6 font-mono-ui text-[10px] font-medium uppercase tracking-[0.3em] text-violet-300/70">Error 404</p>
    <h1 className="mt-2 font-display text-2xl font-semibold text-slate-100 sm:text-3xl">That page drifted off the map.</h1>
    <p className="mt-2.5 max-w-sm text-sm leading-6 text-slate-500">The route you requested does not exist in this workspace. Try the overview or search the incident archive.</p>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Link href="/" data-testid="link-not-found-home" className="flex h-9 items-center gap-2 rounded-lg bg-blue-500 px-4 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-colors hover:bg-blue-400"><ArrowLeft size={14} /> Return to overview</Link>
      <Link href="/history" className="flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[.03] px-4 text-xs font-semibold text-slate-300 transition-colors hover:border-white/20 hover:bg-white/[.07] hover:text-white">Browse incident history</Link>
    </div>
  </div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={LandingPage} /><Route path="/dashboard"><Shell><DashboardPage /></Shell></Route><Route path="/analyze"><Shell><AnalyzePage /></Shell></Route><Route path="/history"><Shell><HistoryPage /></Shell></Route><Route path="/memory"><Shell><MemoryPage /></Shell></Route><Route path="/incidents/:id"><Shell><IncidentDetailPage /></Shell></Route><Route><Shell><NotFoundPage /></Shell></Route></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;