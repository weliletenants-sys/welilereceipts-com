import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Beaker,
  FlaskConical,
  Lightbulb,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ExperimentStatus = 'Idea' | 'Testing' | 'Validated' | 'Killed';

interface RnDIdea {
  id: string;
  title: string;
  summary: string;
  hypothesis: string;
  targetUsers: string;
  dataSignal: string;
  financialValue: string;
  status: ExperimentStatus;
  keyMetric: string;
  isExample: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'welile_rnd_ideas_v1';

const EXAMPLE_IDEAS: RnDIdea[] = [
  {
    id: 'example-credit-score',
    title: 'Rent-payment behavior as credit score',
    summary:
      'Turn daily rent payment streaks into a portable credit signal for tenants across Africa.',
    hypothesis:
      'Consistent daily rent payments predict repayment reliability better than traditional credit bureau data for underbanked tenants.',
    targetUsers: 'Tenants seeking credit; lenders / BNPL partners',
    dataSignal: 'Daily pay cadence, streak length, missed-day recovery patterns',
    financialValue: 'Sell anonymized credit scores / underwrite partner loans with fee share',
    status: 'Testing',
    keyMetric: 'Predictive AUC vs repayment outcomes',
    isExample: true,
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'example-occupancy',
    title: 'Landlord occupancy intelligence',
    summary:
      'Aggregate vacancy, rent velocity, and collection reliability into market intelligence for landlords.',
    hypothesis:
      'Landlords will pay for neighborhood-level occupancy and payment-health dashboards that help price and fill units faster.',
    targetUsers: 'Landlords and property managers',
    dataSignal: 'Unit occupancy, time-to-fill, rent coverage %, collection delays',
    financialValue: 'SaaS subscription + premium market reports',
    status: 'Idea',
    keyMetric: 'Paid landlord seats / month',
    isExample: true,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'example-agent-marketplace',
    title: 'Agent field-data marketplace',
    summary:
      'Agents capture verified field signals (photos, GPS, KYC) that other businesses can license.',
    hypothesis:
      'High-trust field verification by Welile agents can become a B2B data product for insurers, telcos, and logistics.',
    targetUsers: 'Field agents; B2B data buyers',
    dataSignal: 'Verified visits, geo-tagged evidence, household density proxies',
    financialValue: 'Per-verification fees shared with agents + platform take rate',
    status: 'Idea',
    keyMetric: 'Revenue per verified field event',
    isExample: true,
    createdAt: '2026-02-20T00:00:00.000Z',
  },
  {
    id: 'example-microsavings',
    title: 'Micro-savings from daily pay patterns',
    summary:
      'Round-up or auto-skim tiny amounts from daily rent into a savings/investment bucket.',
    hypothesis:
      'Tenants who already pay daily will accept micro-savings if it sits next to rent and compounds into emergency float.',
    targetUsers: 'Tenants; supporters funding savings float',
    dataSignal: 'Daily pay amounts, surplus after rent, savings streak adherence',
    financialValue: 'Float yield + optional premium savings products',
    status: 'Validated',
    keyMetric: 'Avg monthly savings / active tenant',
    isExample: true,
    createdAt: '2026-03-05T00:00:00.000Z',
  },
  {
    id: 'example-funder-signals',
    title: 'Supporter yield signals from behavior cohorts',
    summary:
      'Package tenant/landlord behavior cohorts so funders can allocate to higher-confidence rent streams.',
    hypothesis:
      'Funders will accept slightly lower headline yield for transparent behavior-backed risk tiers.',
    targetUsers: 'Supporters / funders',
    dataSignal: 'Cohort default rates, coverage ratios, geographic risk clusters',
    financialValue: 'Risk-tiered portfolios with differentiated fees',
    status: 'Testing',
    keyMetric: 'AUM in behavior-tiered pools',
    isExample: true,
    createdAt: '2026-03-18T00:00:00.000Z',
  },
];

const STATUS_VARIANT: Record<ExperimentStatus, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  Idea: 'secondary',
  Testing: 'warning',
  Validated: 'success',
  Killed: 'destructive',
};

function loadIdeas(): RnDIdea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EXAMPLE_IDEAS;
    const parsed = JSON.parse(raw) as RnDIdea[];
    if (!Array.isArray(parsed)) return EXAMPLE_IDEAS;
    const userIdeas = parsed.filter((i) => !i.isExample);
    return [...EXAMPLE_IDEAS, ...userIdeas];
  } catch {
    return EXAMPLE_IDEAS;
  }
}

function persistUserIdeas(ideas: RnDIdea[]) {
  const userIdeas = ideas.filter((i) => !i.isExample);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userIdeas));
}

function dayIndex(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

export default function WelileRnD() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<RnDIdea[]>(() =>
    typeof window === 'undefined' ? EXAMPLE_IDEAS : loadIdeas(),
  );
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [targetUsers, setTargetUsers] = useState('');
  const [dataSignal, setDataSignal] = useState('');
  const [financialValue, setFinancialValue] = useState('');
  const [status, setStatus] = useState<ExperimentStatus>('Idea');
  const [keyMetric, setKeyMetric] = useState('');

  useEffect(() => {
    persistUserIdeas(ideas);
  }, [ideas]);

  const todaysIdea = useMemo(() => {
    if (ideas.length === 0) return null;
    return ideas[dayIndex() % ideas.length];
  }, [ideas]);

  const backlog = useMemo(
    () => [...ideas].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [ideas],
  );

  const resetForm = () => {
    setTitle('');
    setSummary('');
    setHypothesis('');
    setTargetUsers('');
    setDataSignal('');
    setFinancialValue('');
    setStatus('Idea');
    setKeyMetric('');
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hypothesis.trim()) {
      toast.error('Title and hypothesis are required');
      return;
    }

    const next: RnDIdea = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim() || hypothesis.trim().slice(0, 120),
      hypothesis: hypothesis.trim(),
      targetUsers: targetUsers.trim() || 'TBD',
      dataSignal: dataSignal.trim() || 'TBD',
      financialValue: financialValue.trim() || 'TBD',
      status,
      keyMetric: keyMetric.trim() || 'TBD',
      isExample: false,
      createdAt: new Date().toISOString(),
    };

    setIdeas((prev) => [next, ...prev]);
    resetForm();
    toast.success('Idea saved locally', {
      description: 'Stored in this browser only — no backend write.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate('/admin/dashboard');
            }}
            className="gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Staff Hub
          </Button>
          <Badge variant="outline" className="gap-1.5">
            <Beaker className="h-3 w-3" />
            Local mock · no DB writes
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl bg-fuchsia-500/10 text-fuchsia-700 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Welile R&amp;D</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                Turning Africa&apos;s behavior into data, and that data into financial value.
              </p>
              <p className="text-xs text-muted-foreground/80 mt-2 max-w-2xl">
                Daily lab for new business ideas and model experiments that fit Welile&apos;s rent facilitation
                mission — tenants pay daily, landlords get rent up front, funders earn returns, agents earn
                commissions.
              </p>
            </div>
          </div>
        </div>

        {/* Today's idea */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Today&apos;s idea
            </h2>
          </div>
          {todaysIdea ? (
            <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-lg">{todaysIdea.title}</CardTitle>
                  {todaysIdea.isExample && (
                    <Badge variant="muted" size="sm">
                      Example
                    </Badge>
                  )}
                  <Badge variant={STATUS_VARIANT[todaysIdea.status]} size="sm">
                    {todaysIdea.status}
                  </Badge>
                </div>
                <CardDescription>{todaysIdea.summary}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <IdeaField icon={Lightbulb} label="Hypothesis" value={todaysIdea.hypothesis} />
                <IdeaField icon={Target} label="Target users" value={todaysIdea.targetUsers} />
                <IdeaField icon={Beaker} label="Data signal" value={todaysIdea.dataSignal} />
                <IdeaField icon={TrendingUp} label="Financial value" value={todaysIdea.financialValue} />
                <div className="sm:col-span-2 rounded-xl bg-muted/50 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Key metric
                  </p>
                  <p className="text-sm font-semibold mt-0.5">{todaysIdea.keyMetric}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">Add your first idea to start the daily rotation.</p>
          )}
        </section>

        {/* Business model experiments */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Business model experiments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {backlog.map((idea) => (
              <Card key={idea.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-sm">{idea.title}</CardTitle>
                    {idea.isExample && (
                      <Badge variant="muted" size="sm">
                        Example
                      </Badge>
                    )}
                    <Badge variant={STATUS_VARIANT[idea.status]} size="sm">
                      {idea.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{idea.summary}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <ExperimentRow label="Hypothesis" value={idea.hypothesis} />
                  <ExperimentRow label="Target users" value={idea.targetUsers} />
                  <ExperimentRow label="Data signal" value={idea.dataSignal} />
                  <ExperimentRow label="Financial value" value={idea.financialValue} />
                  <ExperimentRow label="Key metric" value={idea.keyMetric} />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Idea backlog list */}
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Idea backlog
          </h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border/60">
              {backlog.map((idea) => (
                <div
                  key={`backlog-${idea.id}`}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold truncate">{idea.title}</p>
                      {idea.isExample && (
                        <Badge variant="muted" size="sm">
                          Example
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{idea.summary}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[idea.status]} size="sm" className="shrink-0">
                    {idea.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Add idea form */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Add idea
            </h2>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Capture a new experiment</CardTitle>
              <CardDescription className="text-xs">
                Saved to localStorage in this browser only. Nothing is written to Supabase.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddIdea} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="rnd-title">Title</Label>
                    <Input
                      id="rnd-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Neighborhood rent velocity feed"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="rnd-summary">Short summary</Label>
                    <Input
                      id="rnd-summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="One-line pitch"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="rnd-hypothesis">Hypothesis</Label>
                    <Textarea
                      id="rnd-hypothesis"
                      value={hypothesis}
                      onChange={(e) => setHypothesis(e.target.value)}
                      placeholder="What behavior becomes data, and why will someone pay?"
                      className="rounded-xl min-h-[88px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rnd-targets">Target users</Label>
                    <Input
                      id="rnd-targets"
                      value={targetUsers}
                      onChange={(e) => setTargetUsers(e.target.value)}
                      placeholder="Tenants, landlords, agents…"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rnd-signal">Data signal captured</Label>
                    <Input
                      id="rnd-signal"
                      value={dataSignal}
                      onChange={(e) => setDataSignal(e.target.value)}
                      placeholder="What behavioral signal?"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rnd-value">How it becomes financial value</Label>
                    <Input
                      id="rnd-value"
                      value={financialValue}
                      onChange={(e) => setFinancialValue(e.target.value)}
                      placeholder="Fees, float, SaaS, marketplace…"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rnd-metric">Key metric</Label>
                    <Input
                      id="rnd-metric"
                      value={keyMetric}
                      onChange={(e) => setKeyMetric(e.target.value)}
                      placeholder="North-star KPI"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as ExperimentStatus)}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Idea">Idea</SelectItem>
                        <SelectItem value="Testing">Testing</SelectItem>
                        <SelectItem value="Validated">Validated</SelectItem>
                        <SelectItem value="Killed">Killed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="rounded-xl gap-2">
                  <Plus className="h-4 w-4" />
                  Save idea locally
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function IdeaField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Lightbulb;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-background/60 p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <p className="text-[10px] uppercase tracking-wider font-medium">{label}</p>
      </div>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function ExperimentRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn('grid grid-cols-[7.5rem_1fr] gap-2')}>
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="text-foreground leading-relaxed">{value}</span>
    </div>
  );
}
