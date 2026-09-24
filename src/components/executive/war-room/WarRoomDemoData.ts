/**
 * Demo / sample snapshot for the CEO Funding War Room.
 * Wire to live RPCs (e.g. ceo_funding_war_room) next — never treat as live.
 * Snapshot seed: 2026-09-24 EAT (Pius live-ish placeholders).
 */

export const WAR_ROOM_SAMPLE_BADGE = 'Demo / sample — wire to live RPCs next';
export const WAR_ROOM_SNAPSHOT_AT = '2026-09-24 · EAT (sample)';

export const ACCESS_LADDER_STATUS = 'Proposal' as const;

/** Compact UGX for war-room tiles (always UGX — mission currency). */
export function fmtUgx(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `UGX ${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `UGX ${(n / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `UGX ${(n / 1e3).toFixed(0)}K`;
  return `UGX ${n.toLocaleString('en-UG')}`;
}

export function fmtCount(n: number): string {
  return n.toLocaleString('en-UG');
}

export const WarRoomDemoData = {
  float: {
    raisedTodayUgx: 12_450_000,
    targetUgx: 100_000_000,
    walletsOnHandUgx: 8_200_000,
    promissoryPromisedTodayUgx: 4_100_000,
    landlordsPaidToday: 38,
    landlordsPaidUgx: 9_800_000,
  },
  pipeline: {
    waitingHouses: 6208,
    waitingUgx: 5_800_000_000,
    availableFundable: 3846,
    availableUgx: 1_920_000_000,
    fundedToday: 61,
    fundedTodayUgx: 12_450_000,
    collecting: 1842,
    collectingUgx: 412_000_000,
  },
  funderMachine: {
    activeFunders7d: 47,
    newFundersToday: 3,
    avgTicketTodayUgx: 204_098,
    commitsToday: 61,
    pendingApprovals: 12,
    conversionPct: 18,
    reactivatedThisWeek: 4,
  },
  agentMachine: {
    activeAgentsToday: 29,
    fundableUgxOriginated: 86_400_000,
    producersCount: 18,
    blockedFromPosting: 7,
  },
  risk: {
    collectedTodayUgx: 764_000,
    expectedTodayUgx: 14_900_000,
    arrearsUgx: 48_200_000,
    arrearsCount: 312,
    collectionRatePct: 5.1,
    floatAtRiskUgx: 22_600_000,
  },
  hopeLadder: {
    headline: 'Finish rent. Unlock more. Up to UGX 30M.',
    tenantsClimbingToday: 84,
    unlocksReadyNow: 11,
    dropOffsFrozen: 23,
    tiers: [
      {
        id: 'starter',
        name: 'Starter',
        limitUgx: 500_000,
        requirement: 'First approved rent request',
      },
      {
        id: 'steady',
        name: 'Steady',
        limitUgx: 2_000_000,
        requirement: '7 consecutive on-time repayment days',
      },
      {
        id: 'strong',
        name: 'Strong',
        limitUgx: 8_000_000,
        requirement: 'Full month clear (0 arrears) after Steady',
      },
      {
        id: 'power',
        name: 'Power',
        limitUgx: 18_000_000,
        requirement: '60-day on-time streak',
      },
      {
        id: 'max',
        name: 'Max',
        limitUgx: 30_000_000,
        requirement: '90-day streak + 3 full months clear',
      },
    ],
    tenantPromiseScript:
      "Finish today's rent and your ACCESS LIMIT goes up — instantly. Keep clearing and you climb the ladder to UGX 30,000,000. Miss a day and the limit freezes until you're current again. Hope isn't a speech — it's more rent access when you repay.",
  },
  levers: [
    {
      id: 'approvals',
      title: 'Clear funder approvals',
      detail: '12 pending self-registered funders waiting staff review',
      owner: 'Partner Ops / COO',
      urgency: 'critical' as const,
      impactUgx: 18_000_000,
    },
    {
      id: 'collections-hope',
      title: 'Chase critical collections with hope script',
      detail: 'Collected 764K of 14.9M expected — lead with Access Ladder unlock',
      owner: 'Agent Ops / Collections',
      urgency: 'critical' as const,
      impactUgx: 14_136_000,
    },
    {
      id: 'ready-to-fund',
      title: 'Blast ready-to-fund list',
      detail: '3,846 available houses — push to top funders before noon',
      owner: 'CMO / Partner Ops',
      urgency: 'high' as const,
      impactUgx: 40_000_000,
    },
    {
      id: 'dormant',
      title: 'Reactivate dormant funders',
      detail: 'Top-20 dormant >30d — WhatsApp + CEO call list',
      owner: 'CMO',
      urgency: 'high' as const,
      impactUgx: 25_000_000,
    },
    {
      id: 'ceo-tickets',
      title: 'CEO call list: close the gap',
      detail: '5 tickets that would close ~UGX 35M of the 100M gap',
      owner: 'CEO',
      urgency: 'medium' as const,
      impactUgx: 35_000_000,
    },
    {
      id: 'agents-coverage',
      title: 'Reassign coverage holes',
      detail: 'Districts with waiting houses & 0 active agents today',
      owner: 'Agent Ops',
      urgency: 'medium' as const,
      impactUgx: 8_000_000,
    },
  ],
} as const;

export type WarRoomDemo = typeof WarRoomDemoData;
