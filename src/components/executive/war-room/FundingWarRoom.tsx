import type { ComponentType } from 'react';
import {
  Target,
  Handshake,
  Home,
  CheckCircle2,
  Coins,
  Users,
  TrendingUp,
  AlertTriangle,
  Zap,
  Sparkles,
  Phone,
  Megaphone,
  UserPlus,
  ArrowRight,
  Snowflake,
  Flame,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  ACCESS_LADDER_STATUS,
  WAR_ROOM_SAMPLE_BADGE,
  WAR_ROOM_SNAPSHOT_AT,
  WarRoomDemoData as D,
  fmtCount,
  fmtUgx,
} from './WarRoomDemoData';

function SampleBadge({ className }: { className?: string }) {
  return (
    <Badge variant="warning" size="sm" className={cn('shrink-0', className)}>
      SAMPLE
    </Badge>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string;
  subtitle?: string;
  icon: ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="flex items-center gap-2 min-w-0">
        <div className={cn('p-2 rounded-xl shrink-0', accent || 'bg-primary/10 text-primary')}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
        </div>
      </div>
      <SampleBadge />
    </div>
  );
}

function StatTile({
  label,
  value,
  sub,
  tone = 'default',
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: 'default' | 'success' | 'danger' | 'warn' | 'hope';
}) {
  const tones = {
    default: 'border-border/60 bg-background',
    success: 'border-emerald-500/30 bg-emerald-500/5',
    danger: 'border-red-500/40 bg-red-500/10',
    warn: 'border-amber-500/30 bg-amber-500/5',
    hope: 'border-violet-500/30 bg-violet-500/5',
  };
  const valueTone = {
    default: '',
    success: 'text-emerald-700 dark:text-emerald-400',
    danger: 'text-red-700 dark:text-red-400',
    warn: 'text-amber-700 dark:text-amber-400',
    hope: 'text-violet-700 dark:text-violet-400',
  };
  return (
    <div className={cn('rounded-xl border p-3 min-w-0', tones[tone])}>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium truncate">{label}</p>
      <p className={cn('text-lg font-bold tabular-nums truncate mt-0.5', valueTone[tone])}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{sub}</p>}
    </div>
  );
}

/** A — Today's Float */
function TodaysFloat() {
  const gap = D.float.targetUgx - D.float.raisedTodayUgx;
  const pct = Math.min(100, Math.round((D.float.raisedTodayUgx / D.float.targetUgx) * 100));
  // EAT day pace: assume ~11:00 → ~46% of day; behind if raised% < day%
  const hourEAT = 11;
  const dayPacePct = Math.round((hourEAT / 24) * 100);
  const behind = pct < dayPacePct;
  const paceVariant = behind ? 'destructive' : pct >= 80 ? 'success' : 'warning';

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">Today's Float — Funding War Room</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                North star: UGX 100M raised & deployable to landlords · {WAR_ROOM_SNAPSHOT_AT}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={behind ? 'destructive' : 'success'} size="sm">
              {behind ? 'BEHIND PACE' : 'ON PACE'}
            </Badge>
            <SampleBadge />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-primary/20 bg-background/80 p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Raised today</p>
            <p className="text-2xl sm:text-3xl font-black tabular-nums text-primary tracking-tight">
              {fmtUgx(D.float.raisedTodayUgx)}
            </p>
          </div>
          <StatTile label="Target" value={fmtUgx(D.float.targetUgx)} />
          <StatTile label="Gap" value={fmtUgx(gap)} tone="danger" sub={`${100 - pct}% to go`} />
          <StatTile
            label="Pace vs day"
            value={`${pct}% raised`}
            sub={`Day elapsed ~${dayPacePct}% · need ${fmtUgx(Math.round(gap / Math.max(1, 24 - hourEAT)))}/hr`}
            tone={behind ? 'danger' : 'success'}
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="font-medium">Pace to 100M</span>
            <span className="tabular-nums text-muted-foreground">
              {fmtUgx(D.float.raisedTodayUgx)} / {fmtUgx(D.float.targetUgx)}
            </span>
          </div>
          <Progress value={pct} size="lg" variant={paceVariant} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatTile label="Wallets on hand" value={fmtUgx(D.float.walletsOnHandUgx)} sub="Placeholder" />
          <StatTile
            label="Promissory promised today"
            value={fmtUgx(D.float.promissoryPromisedTodayUgx)}
            sub="Placeholder"
            tone="warn"
          />
          <StatTile
            label="Landlords paid today"
            value={fmtCount(D.float.landlordsPaidToday)}
            sub={fmtUgx(D.float.landlordsPaidUgx)}
            tone="success"
          />
          <StatTile label="Mission" value="100M" sub="Deployable TODAY" tone="hope" />
        </div>
      </CardContent>
    </Card>
  );
}

/** B — Pipeline */
function Pipeline() {
  const stages = [
    {
      label: 'Waiting houses',
      count: D.pipeline.waitingHouses,
      ugx: D.pipeline.waitingUgx,
      icon: Home,
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    },
    {
      label: 'Available / fundable',
      count: D.pipeline.availableFundable,
      ugx: D.pipeline.availableUgx,
      icon: CheckCircle2,
      color: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    },
    {
      label: 'Funded today',
      count: D.pipeline.fundedToday,
      ugx: D.pipeline.fundedTodayUgx,
      icon: Coins,
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      label: 'Collecting',
      count: D.pipeline.collecting,
      ugx: D.pipeline.collectingUgx,
      icon: TrendingUp,
      color: 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20',
    },
  ];

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-5">
        <SectionHeader
          title="Pipeline"
          subtitle="Waiting → Available → Funded today → Collecting (Pius snapshot 2026-09-24)"
          icon={ArrowRight}
          accent="bg-sky-500/10 text-sky-600"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {stages.map((s, i) => (
            <div key={s.label} className={cn('rounded-xl border p-3 relative', s.color)}>
              {i < stages.length - 1 && (
                <span className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-muted-foreground/40">
                  →
                </span>
              )}
              <div className="flex items-center gap-1.5 mb-1">
                <s.icon className="h-3.5 w-3.5" />
                <p className="text-[10px] uppercase tracking-wider font-medium truncate">{s.label}</p>
              </div>
              <p className="text-xl font-bold tabular-nums">{fmtCount(s.count)}</p>
              <p className="text-xs font-semibold tabular-nums opacity-80">{fmtUgx(s.ugx)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/** C — Funder machine */
function FunderMachine() {
  return (
    <Card className="h-full">
      <CardContent className="pt-4 sm:pt-5">
        <SectionHeader
          title="Funder machine"
          subtitle="Capital in motion"
          icon={Handshake}
          accent="bg-purple-500/10 text-purple-600"
        />
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="Active funders (7d)" value={fmtCount(D.funderMachine.activeFunders7d)} />
          <StatTile label="New funders today" value={fmtCount(D.funderMachine.newFundersToday)} tone="success" />
          <StatTile label="Avg ticket today" value={fmtUgx(D.funderMachine.avgTicketTodayUgx)} />
          <StatTile label="Commits today" value={fmtCount(D.funderMachine.commitsToday)} />
          <StatTile
            label="Pending approvals"
            value={fmtCount(D.funderMachine.pendingApprovals)}
            tone="warn"
            sub="Clear these first"
          />
          <StatTile
            label="Funnel conversion"
            value={`${D.funderMachine.conversionPct}%`}
            sub={`${D.funderMachine.reactivatedThisWeek} reactivated this week`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/** D — Agent machine */
function AgentMachine() {
  return (
    <Card className="h-full">
      <CardContent className="pt-4 sm:pt-5">
        <SectionHeader
          title="Agent machine"
          subtitle="Originators of fundable demand"
          icon={Users}
          accent="bg-rose-500/10 text-rose-600"
        />
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="Active agents today" value={fmtCount(D.agentMachine.activeAgentsToday)} />
          <StatTile
            label="Fundable UGX originated"
            value={fmtUgx(D.agentMachine.fundableUgxOriginated)}
            tone="success"
          />
          <StatTile
            label="Producers (≥1 fundable)"
            value={fmtCount(D.agentMachine.producersCount)}
            sub="Agents with fundable tenants"
          />
          <StatTile
            label="Blocked from posting"
            value={fmtCount(D.agentMachine.blockedFromPosting)}
            tone="warn"
            sub="Eligibility failures"
          />
        </div>
      </CardContent>
    </Card>
  );
}

/** E — Risk / Collections */
function RiskCollections() {
  const behind = D.risk.collectedTodayUgx < D.risk.expectedTodayUgx * 0.5;
  const rate = D.risk.collectionRatePct;

  return (
    <Card className={cn(behind && 'border-red-500/50 bg-red-500/5')}>
      <CardContent className="pt-4 sm:pt-5">
        <SectionHeader
          title="Risk / Collections"
          subtitle="Collected vs expected · float at risk"
          icon={AlertTriangle}
          accent={behind ? 'bg-red-500/15 text-red-600' : 'bg-amber-500/10 text-amber-600'}
        />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
          <StatTile
            label="Collected today"
            value={fmtUgx(D.risk.collectedTodayUgx)}
            tone="danger"
          />
          <StatTile label="Expected today" value={fmtUgx(D.risk.expectedTodayUgx)} />
          <StatTile
            label="Collection rate"
            value={`${rate}%`}
            tone="danger"
            sub="Red = behind"
          />
          <StatTile
            label="Arrears"
            value={fmtUgx(D.risk.arrearsUgx)}
            sub={`${fmtCount(D.risk.arrearsCount)} tenants`}
            tone="warn"
          />
          <StatTile
            label="Float at risk"
            value={fmtUgx(D.risk.floatAtRiskUgx)}
            tone="danger"
            sub="Funded, past-due unpaid"
          />
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[11px] mb-1">
            <span className="font-medium text-red-700 dark:text-red-400">Collection pace</span>
            <span className="tabular-nums text-muted-foreground">
              {fmtUgx(D.risk.collectedTodayUgx)} / {fmtUgx(D.risk.expectedTodayUgx)}
            </span>
          </div>
          <Progress value={Math.min(100, rate)} size="default" variant="destructive" />
        </div>
      </CardContent>
    </Card>
  );
}

/** F — Hope & Access Ladder (SALES) */
function HopeAccessLadder() {
  return (
    <Card className="border-violet-500/40 bg-gradient-to-br from-violet-500/10 via-card to-amber-500/5 overflow-hidden">
      <CardContent className="pt-4 sm:pt-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2.5 rounded-xl bg-violet-600 text-white shadow-sm shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">{D.hopeLadder.headline}</h3>
                <Badge variant="primary" size="sm">
                  {ACCESS_LADDER_STATUS}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                SALES MIND — sell HOPE: repayment behavior raises rent ACCESS LIMIT
              </p>
            </div>
          </div>
          <SampleBadge />
        </div>

        {/* Ladder tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {D.hopeLadder.tiers.map((tier, idx) => (
            <div
              key={tier.id}
              className={cn(
                'rounded-xl border p-3 relative',
                idx === D.hopeLadder.tiers.length - 1
                  ? 'border-amber-400/60 bg-amber-500/10 sm:col-span-1'
                  : 'border-violet-500/20 bg-background/80',
              )}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-violet-700 dark:text-violet-300">
                  {tier.name}
                </span>
                {idx === D.hopeLadder.tiers.length - 1 && <Flame className="h-3.5 w-3.5 text-amber-500" />}
              </div>
              <p className="text-base font-black tabular-nums text-foreground">{fmtUgx(tier.limitUgx)}</p>
              <p className="text-[10px] text-muted-foreground mt-1 leading-snug">{tier.requirement}</p>
            </div>
          ))}
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-3 gap-2">
          <StatTile
            label="Tenants climbing today"
            value={fmtCount(D.hopeLadder.tenantsClimbingToday)}
            tone="hope"
          />
          <StatTile
            label="Unlocks ready now"
            value={fmtCount(D.hopeLadder.unlocksReadyNow)}
            tone="success"
            sub="Instant limit bump"
          />
          <StatTile
            label="Drop-offs (frozen)"
            value={fmtCount(D.hopeLadder.dropOffsFrozen)}
            tone="danger"
            sub="Missed → limit frozen"
          />
        </div>

        {/* Sales copy panel */}
        <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-4 w-4 text-violet-600" />
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
              Tenant promise script
            </p>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">"{D.hopeLadder.tenantPromiseScript}"</p>
          <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
            <Snowflake className="h-3 w-3" />
            Miss → freeze. Finish → unlock more. Ladder is UI/proposal only — no DB credit writes yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/** G — Levers next 24h */
function Levers() {
  const urgencyStyle = {
    critical: 'border-red-500/40 bg-red-500/5',
    high: 'border-amber-500/40 bg-amber-500/5',
    medium: 'border-border/60 bg-background',
  } as const;
  const urgencyBadge = {
    critical: 'destructive' as const,
    high: 'warning' as const,
    medium: 'secondary' as const,
  };

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-5">
        <SectionHeader
          title="Levers — next 24h"
          subtitle="Auto-ranked checklist · close the 100M gap"
          icon={Zap}
          accent="bg-amber-500/10 text-amber-600"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
          {D.levers.map((lever, i) => (
            <div
              key={lever.id}
              className={cn('rounded-xl border p-3 flex gap-3', urgencyStyle[lever.urgency])}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-xs font-black tabular-nums text-muted-foreground w-5 text-center">
                  {i + 1}
                </span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  {lever.id === 'approvals' && <UserPlus className="h-4 w-4" />}
                  {lever.id === 'collections-hope' && <Sparkles className="h-4 w-4" />}
                  {lever.id === 'ready-to-fund' && <Megaphone className="h-4 w-4" />}
                  {lever.id === 'dormant' && <Phone className="h-4 w-4" />}
                  {lever.id === 'ceo-tickets' && <Target className="h-4 w-4" />}
                  {lever.id === 'agents-coverage' && <Users className="h-4 w-4" />}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-semibold truncate">{lever.title}</p>
                  <Badge variant={urgencyBadge[lever.urgency]} size="sm">
                    {lever.urgency}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">{lever.detail}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                  <span className="text-muted-foreground">Owner: {lever.owner}</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    ~{fmtUgx(lever.impactUgx)} impact
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * CEO Funding War Room — above-the-fold on /ceo/dashboard overview.
 * Demo data labelled SAMPLE until live RPCs are wired.
 */
export function FundingWarRoom() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <p className="text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Funding War Room</span>
          {' · '}
          {WAR_ROOM_SAMPLE_BADGE}
        </p>
        <Badge variant="outline" size="sm">
          EAT · refresh ≤60s when live
        </Badge>
      </div>

      <TodaysFloat />
      <Pipeline />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <FunderMachine />
        <AgentMachine />
      </div>

      <RiskCollections />
      <HopeAccessLadder />
      <Levers />
    </div>
  );
}

