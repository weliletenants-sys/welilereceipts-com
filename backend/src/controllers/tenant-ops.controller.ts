import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to get from/to dates from query
const getDateRange = (req: Request, defaultDays: number, forward = false) => {
  let from = req.query.from ? new Date(req.query.from as string) : null;
  let to = req.query.to ? new Date(req.query.to as string) : null;
  
  if (from && to && from.getTime() > to.getTime()) {
    const t = from; from = to; to = t;
  }
  
  if (!from && !to) {
    if (forward) {
      from = new Date();
      to = new Date(Date.now() + defaultDays * 86400_000);
    } else {
      to = new Date();
      from = new Date(Date.now() - defaultDays * 86400_000);
    }
  } else if (from && !to) {
    to = new Date();
  } else if (!from && to) {
    from = new Date(to.getTime() - defaultDays * 86400_000);
  }
  
  if (from) from.setHours(0, 0, 0, 0);
  if (to) to.setHours(23, 59, 59, 999);
  
  return { from: from!, to: to! };
};

// Helper to get profiles mapped by ID
const enrichProfiles = async (ids: string[]) => {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (!uniqueIds.length) return new Map<string, any>();
  const profiles = await prisma.profiles.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true, full_name: true, phone: true }
  });
  const profileMap = new Map();
  profiles.forEach(p => profileMap.set(p.id, p));
  return profileMap;
};

export const getAppliedExtract = async (req: Request, res: Response) => {
  try {
    const { from, to } = getDateRange(req, 30);
    
    // Prisma uses strings for created_at, so we filter by ISO string
    const requests = await prisma.rentRequests.findMany({
      where: {
        created_at: {
          gte: from.toISOString(),
          lte: to.toISOString()
        }
      },
      select: {
        id: true, tenant_id: true, landlord_id: true, rent_amount: true, 
        daily_repayment: true, duration_days: true, status: true, created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    const profileIds = requests.flatMap(r => [r.tenant_id, r.landlord_id]) as string[];
    const profiles = await enrichProfiles(profileIds);

    const rows = requests.map(r => {
      const t = r.tenant_id ? profiles.get(r.tenant_id) : null;
      const l = r.landlord_id ? profiles.get(r.landlord_id) : null;
      return {
        id: r.id,
        tenant_name: t?.full_name || '—',
        tenant_phone: t?.phone || '—',
        landlord_name: l?.full_name || '—',
        rent_amount: Number(r.rent_amount || 0),
        daily_repayment: Number(r.daily_repayment || 0),
        duration_days: r.duration_days,
        status: r.status,
        created_at: r.created_at
      };
    });

    res.json({ data: rows, range: { from, to } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getApprovedExtract = async (req: Request, res: Response) => {
  try {
    const { from, to } = getDateRange(req, 30);
    const POST_APPROVAL_STATUSES = [
      'agent_verified', 'tenant_ops_approved', 'landlord_ops_approved',
      'coo_approved', 'approved', 'funded', 'disbursed', 'active',
      'repaying', 'completed'
    ];

    const requests = await prisma.rentRequests.findMany({
      where: {
        status: { in: POST_APPROVAL_STATUSES },
        OR: [
          { approved_at: { gte: from.toISOString(), lte: to.toISOString() } },
          { approved_at: null, created_at: { gte: from.toISOString(), lte: to.toISOString() } }
        ]
      },
      select: {
        id: true, tenant_id: true, approved_by: true, rent_amount: true,
        total_repayment: true, daily_repayment: true, approved_at: true, 
        created_at: true, status: true
      },
      orderBy: { created_at: 'desc' }
    });

    const profileIds = requests.flatMap(r => [r.tenant_id, r.approved_by]) as string[];
    const profiles = await enrichProfiles(profileIds);

    let stamped = 0;
    let inferred = 0;

    const rows = requests.map(r => {
      const t = r.tenant_id ? profiles.get(r.tenant_id) : null;
      const a = r.approved_by ? profiles.get(r.approved_by) : null;
      const effectiveTs = r.approved_at || r.created_at;
      const isInferred = !r.approved_at;
      if (isInferred) inferred++; else stamped++;
      
      return {
        id: r.id,
        tenant_name: t?.full_name || '—',
        tenant_phone: t?.phone || '—',
        rent_amount: Number(r.rent_amount || 0),
        total_repayment: Number(r.total_repayment || 0),
        daily_repayment: Number(r.daily_repayment || 0),
        effective_ts: effectiveTs,
        approved_by_name: a?.full_name || '—',
        status: isInferred ? `${r.status || ''} (inferred)` : (r.status || ''),
        isInferred
      };
    });

    res.json({ data: rows, stats: { stamped, inferred }, range: { from, to } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFundedExtract = async (req: Request, res: Response) => {
  try {
    const { from, to } = getDateRange(req, 30);
    const POST_FUNDING_STATUSES = ['funded', 'disbursed', 'active', 'repaying', 'completed'];

    const requests = await prisma.rentRequests.findMany({
      where: {
        status: { in: POST_FUNDING_STATUSES },
        OR: [
          { funded_at: { gte: from.toISOString(), lte: to.toISOString() } },
          { funded_at: null, approved_at: { gte: from.toISOString(), lte: to.toISOString() } },
          { funded_at: null, approved_at: null, created_at: { gte: from.toISOString(), lte: to.toISOString() } }
        ]
      },
      select: {
        id: true, tenant_id: true, approved_by: true, rent_amount: true,
        total_repayment: true, daily_repayment: true, amount_repaid: true,
        funded_at: true, approved_at: true, created_at: true, status: true
      },
      orderBy: { created_at: 'desc' }
    });

    const profileIds = requests.flatMap(r => [r.tenant_id, r.approved_by]) as string[];
    const profiles = await enrichProfiles(profileIds);

    let stamped = 0;
    let inferred = 0;

    const rows = requests.map(r => {
      const t = r.tenant_id ? profiles.get(r.tenant_id) : null;
      const a = r.approved_by ? profiles.get(r.approved_by) : null;
      const effectiveTs = r.funded_at || r.approved_at || r.created_at;
      const isInferred = !r.funded_at;
      if (isInferred) inferred++; else stamped++;
      
      return {
        id: r.id,
        tenant_name: t?.full_name || '—',
        tenant_phone: t?.phone || '—',
        rent_amount: Number(r.rent_amount || 0),
        total_repayment: Number(r.total_repayment || 0),
        daily_repayment: Number(r.daily_repayment || 0),
        amount_repaid: Number(r.amount_repaid || 0),
        effective_ts: effectiveTs,
        funded_by_name: a?.full_name || '—',
        status: isInferred ? `${r.status || ''} (inferred)` : (r.status || ''),
        isInferred
      };
    });

    res.json({ data: rows, stats: { stamped, inferred }, range: { from, to } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollectedExtract = async (req: Request, res: Response) => {
  try {
    const { from, to } = getDateRange(req, 30);
    
    const payments = await prisma.generalLedger.findMany({
      where: {
        category: { in: ['tenant_repayment', 'rent_repayment'] },
        direction: 'cash_in',
        transaction_date: { gte: from.toISOString(), lte: to.toISOString() }
      },
      select: {
        user_id: true, amount: true, source_id: true, source_table: true,
        transaction_date: true, transaction_group_id: true
      },
      orderBy: { transaction_date: 'desc' }
    });

    const sourceIds = [...new Set(payments.map(p => p.source_id).filter(Boolean))] as string[];
    const groupIds = [...new Set(payments.map(p => p.transaction_group_id).filter(Boolean))] as string[];

    const [rrLookup, acLookup, groupLegs] = await Promise.all([
      prisma.rentRequests.findMany({ where: { id: { in: sourceIds } }, select: { id: true, tenant_id: true } }),
      prisma.agentCollections.findMany({ where: { id: { in: sourceIds } }, select: { id: true, tenant_id: true, agent_id: true } }),
      prisma.generalLedger.findMany({
        where: {
          transaction_group_id: { in: groupIds },
          category: { in: ['agent_float_used_for_rent', 'agent_commission_earned'] }
        },
        select: { user_id: true, category: true, direction: true, transaction_group_id: true }
      })
    ]);

    const tenantBySource = new Map<string, string>();
    const agentBySource = new Map<string, string>();
    
    for (const r of rrLookup) if (r.tenant_id) tenantBySource.set(r.id, r.tenant_id);
    for (const c of acLookup) {
      if (c.tenant_id && !tenantBySource.has(c.id)) tenantBySource.set(c.id, c.tenant_id);
      if (c.agent_id) agentBySource.set(c.id, c.agent_id);
    }

    const agentByGroup = new Map<string, string>();
    for (const leg of groupLegs) {
      if (leg.transaction_group_id) {
        if (leg.category === 'agent_float_used_for_rent' && leg.direction === 'cash_out' && leg.user_id) {
          agentByGroup.set(leg.transaction_group_id, leg.user_id);
        } else if (leg.category === 'agent_commission_earned' && leg.direction === 'cash_in' && leg.user_id && !agentByGroup.has(leg.transaction_group_id)) {
          agentByGroup.set(leg.transaction_group_id, leg.user_id);
        }
      }
    }

    const resolveTenant = (p: any) => (p.source_id && tenantBySource.get(p.source_id)) || p.user_id || null;
    const tenantIds = payments.map(resolveTenant).filter(Boolean) as string[];
    const agentIds = [...agentByGroup.values(), ...agentBySource.values()];
    
    const profiles = await enrichProfiles([...tenantIds, ...agentIds]);

    const rows = payments.map(p => {
      const tid = resolveTenant(p);
      const aid = (p.transaction_group_id && agentByGroup.get(p.transaction_group_id)) || (p.source_id && agentBySource.get(p.source_id)) || null;
      const t = tid ? profiles.get(tid) : null;
      const a = aid ? profiles.get(aid) : null;
      
      return {
        transaction_date: p.transaction_date,
        tenant_name: t?.full_name || '—',
        tenant_phone: t?.phone || '—',
        agent_name: a?.full_name || (aid ? 'Agent' : 'Direct (no agent)'),
        amount: Number(p.amount || 0),
        source_table: p.source_table || ''
      };
    });

    res.json({ data: rows, range: { from, to } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpectedExtract = async (req: Request, res: Response) => {
  try {
    const { from, to } = getDateRange(req, 90, true);
    
    const activePlans = await prisma.rentRequests.findMany({
      where: {
        status: { in: ['funded', 'disbursed', 'repaying'] },
        // Prisma schema tenancy_status is missing, omitting the tenancy_status filter as it causes errors or needs updating
      },
      select: {
        id: true, tenant_id: true, daily_repayment: true, total_repayment: true,
        amount_repaid: true, duration_days: true, disbursed_at: true, funded_at: true, status: true
      }
    });

    const active = activePlans.filter((p: any) => !['ended', 'terminated'].includes((p.tenancy_status || '').toLowerCase()));
    
    const profileIds = active.map(p => p.tenant_id).filter(Boolean) as string[];
    const profiles = await enrichProfiles(profileIds);

    const winStart = from.getTime();
    const winEnd = to.getTime();
    
    const rows = active.map(r => {
      const start = r.disbursed_at || r.funded_at;
      const startMs = start ? new Date(start).getTime() : winStart;
      const planEndMs = startMs + (Number(r.duration_days || 0) * 86400_000);
      const overlapStart = Math.max(startMs, winStart);
      const overlapEnd = Math.min(planEndMs, winEnd);
      const days = Math.max(0, Math.ceil((overlapEnd - overlapStart) / 86400_000));
      const daily = Number(r.daily_repayment || 0);
      const expected = days * daily;
      const outstanding = Math.max(0, Number(r.total_repayment || 0) - Number(r.amount_repaid || 0));
      
      const t = r.tenant_id ? profiles.get(r.tenant_id) : null;
      
      return {
        id: r.id,
        tenant_name: t?.full_name || '—',
        tenant_phone: t?.phone || '—',
        daily_repayment: daily,
        days_in_window: days,
        expected_amount: expected,
        total_repayment: Number(r.total_repayment || 0),
        amount_repaid: Number(r.amount_repaid || 0),
        outstanding_amount: outstanding
      };
    });

    res.json({ data: rows, range: { from, to } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReportData = async (req: Request, res: Response) => {
  try {
    const { from, to } = getDateRange(req, 30);
    const fromIso = req.query.from ? from.toISOString() : undefined;
    const toIso = req.query.to ? to.toISOString() : undefined;

    // Build the query
    const ledgerQuery: any = {
      category: { in: ['tenant_repayment', 'rent_repayment'] },
      direction: 'cash_in'
    };
    if (fromIso || toIso) {
      ledgerQuery.transaction_date = {};
      if (fromIso) ledgerQuery.transaction_date.gte = fromIso;
      if (toIso) ledgerQuery.transaction_date.lte = toIso;
    }

    const payments = await prisma.generalLedger.findMany({
      where: ledgerQuery,
      select: { user_id: true, amount: true, source_id: true, source_table: true, transaction_date: true, transaction_group_id: true }
    });

    const sourceIds = [...new Set(payments.map(p => p.source_id).filter(Boolean))] as string[];
    const [rrLookupRes, acLookupRes] = await Promise.all([
      prisma.rentRequests.findMany({ where: { id: { in: sourceIds } }, select: { id: true, tenant_id: true } }),
      prisma.agentCollections.findMany({ where: { id: { in: sourceIds } }, select: { id: true, tenant_id: true } })
    ]);

    const tenantBySourceId = new Map<string, string>();
    for (const r of rrLookupRes) if (r.tenant_id) tenantBySourceId.set(r.id, r.tenant_id);
    for (const c of acLookupRes) {
      if (c.tenant_id && !tenantBySourceId.has(c.id)) tenantBySourceId.set(c.id, c.tenant_id);
    }

    const collectionIds = [...new Set(payments.filter(p => p.source_table === 'agent_collections' && p.source_id).map(p => p.source_id as string))];
    const collections = await prisma.agentCollections.findMany({ where: { id: { in: collectionIds } }, select: { id: true, agent_id: true, tenant_id: true } });
    const collectionMap = new Map(collections.map(c => [c.id, c]));

    const groupIds = [...new Set(payments.map(p => p.transaction_group_id).filter(Boolean))] as string[];
    const groupLegs = await prisma.generalLedger.findMany({
      where: { transaction_group_id: { in: groupIds }, category: { in: ['agent_float_used_for_rent', 'agent_commission_earned'] } },
      select: { user_id: true, category: true, direction: true, transaction_group_id: true }
    });
    
    const agentByGroup = new Map<string, string>();
    for (const leg of groupLegs) {
      if (leg.transaction_group_id && leg.category === 'agent_float_used_for_rent' && leg.direction === 'cash_out' && leg.user_id) {
        agentByGroup.set(leg.transaction_group_id, leg.user_id);
      }
    }
    for (const leg of groupLegs) {
      if (leg.transaction_group_id && leg.category === 'agent_commission_earned' && leg.direction === 'cash_in' && leg.user_id && !agentByGroup.has(leg.transaction_group_id)) {
        agentByGroup.set(leg.transaction_group_id, leg.user_id);
      }
    }

    const resolveTenantId = (p: any): string | null => {
      const fromSource = p.source_id ? tenantBySourceId.get(p.source_id) : undefined;
      return (fromSource || p.user_id || null) as string | null;
    };
    const tenantIds = [...new Set(payments.map(resolveTenantId).filter(Boolean))] as string[];

    const [tenantRes, rentReqRes, ledgerLifetimeRes] = await Promise.all([
      prisma.profiles.findMany({ where: { id: { in: tenantIds } }, select: { id: true, full_name: true, phone: true, referrer_id: true } }),
      prisma.rentRequests.findMany({
        where: { tenant_id: { in: tenantIds }, status: { in: ['funded', 'disbursed', 'repaying', 'fully_repaid', 'defaulted'] } },
        select: { tenant_id: true, agent_id: true, total_repayment: true, amount_repaid: true, status: true }
      }),
      prisma.generalLedger.findMany({
        where: { user_id: { in: tenantIds }, category: { in: ['rent_obligation', 'tenant_repayment', 'rent_repayment'] } },
        select: { user_id: true, category: true, direction: true, amount: true }
      })
    ]);

    const tenantMap = new Map(tenantRes.map(p => [p.id, p]));
    const assignedAgentByTenant = new Map<string, string>();
    for (const r of rentReqRes) {
      if (r.agent_id && r.tenant_id && !assignedAgentByTenant.has(r.tenant_id)) assignedAgentByTenant.set(r.tenant_id, r.agent_id);
    }

    const outstandingByTenant = new Map<string, number>();
    for (const tid of tenantIds) outstandingByTenant.set(tid, 0);
    for (const r of ledgerLifetimeRes) {
      if (!r.user_id) continue;
      const amt = Number(r.amount || 0);
      const cur = outstandingByTenant.get(r.user_id) || 0;
      if (r.category === 'rent_obligation' && r.direction === 'cash_out') outstandingByTenant.set(r.user_id, cur + amt);
      else if (r.direction === 'cash_in') outstandingByTenant.set(r.user_id, cur - amt);
    }
    for (const [k, v] of outstandingByTenant) if (v < 0) outstandingByTenant.set(k, 0);

    const referrerIds = [...new Set(tenantRes.map(p => p.referrer_id).filter(Boolean))] as string[];
    const agentRoleRows = await prisma.userRoles.findMany({ where: { user_id: { in: referrerIds }, role: 'agent' }, select: { user_id: true } });
    const agentReferrerSet = new Set(agentRoleRows.map(r => r.user_id));
    const referrerAgentByTenant = new Map<string, string>();
    for (const p of tenantRes) {
      if (p.referrer_id && agentReferrerSet.has(p.referrer_id)) referrerAgentByTenant.set(p.id, p.referrer_id);
    }

    const allAgentIds = [...new Set([
      ...collections.map(c => c.agent_id).filter(Boolean) as string[],
      ...Array.from(agentByGroup.values()),
      ...Array.from(assignedAgentByTenant.values()),
      ...Array.from(referrerAgentByTenant.values())
    ])];
    const agentProfiles = await prisma.profiles.findMany({ where: { id: { in: allAgentIds } }, select: { id: true, full_name: true } });
    const agentMap = new Map(agentProfiles.map(p => [p.id, p]));

    const byTenant = new Map<string, any>();
    for (const p of payments) {
      const tenantId = resolveTenantId(p);
      if (!tenantId) continue;

      const groupAgentId = p.transaction_group_id ? agentByGroup.get(p.transaction_group_id) : undefined;
      const collection = p.source_id ? collectionMap.get(p.source_id) : null;
      const legUserAgentId = (p.user_id && p.user_id !== tenantId) ? p.user_id : null;
      const collectingAgentId = collection?.agent_id || legUserAgentId;
      const isAgentCollection = !!groupAgentId || !!collectingAgentId;
      const attributedAgentId = groupAgentId || collectingAgentId || assignedAgentByTenant.get(tenantId) || referrerAgentByTenant.get(tenantId);
      
      let agentName = '—';
      if (attributedAgentId) {
        const profileName = agentMap.get(attributedAgentId)?.full_name;
        if (profileName) {
          agentName = profileName;
          if (attributedAgentId === tenantId) agentName = `${profileName} (self)`;
        } else if (isAgentCollection) {
          agentName = 'Agent (deleted)';
        }
      }

      const amt = Number(p.amount || 0);
      let row = byTenant.get(tenantId);
      if (!row) {
        row = {
          tenant_name: tenantMap.get(tenantId)?.full_name || '—',
          tenant_phone: tenantMap.get(tenantId)?.phone || '—',
          amount_paid: 0, outstanding: outstandingByTenant.get(tenantId) || 0,
          paid_direct: 0, paid_via_agent: 0,
          agent_names: new Set<string>(), payment_count: 0
        };
        byTenant.set(tenantId, row);
      }
      row.amount_paid += amt;
      if (isAgentCollection) row.paid_via_agent += amt; else row.paid_direct += amt;
      row.payment_count += 1;
      if (agentName && agentName !== '—') row.agent_names.add(agentName);
    }

    const rows = Array.from(byTenant.values()).map(t => ({
      tenant_name: t.tenant_name,
      tenant_phone: t.tenant_phone,
      rent_plans: t.payment_count,
      rent_given: 0,
      amount_paid: t.amount_paid,
      paid_direct: t.paid_direct,
      paid_via_agent: t.paid_via_agent,
      outstanding: t.outstanding,
      agent_name: t.agent_names.size === 0 ? 'Direct (no agent)' : Array.from(t.agent_names).join(', ')
    })).sort((a, b) => b.amount_paid - a.amount_paid);

    res.json({ data: rows, range: { from, to } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRentRequests = async (req: Request, res: Response) => {
  try {
    const items = await prisma.rentRequests.findMany({
      select: {
        id: true, status: true, rent_amount: true, total_repayment: true,
        amount_repaid: true, registration_type: true, created_at: true,
        tenant_id: true, landlord_id: true, agent_id: true
      },
      orderBy: { created_at: 'desc' }
    });

    const tenantIds = [...new Set(items.map(r => r.tenant_id).filter(Boolean))] as string[];
    const landlordIds = [...new Set(items.map(r => r.landlord_id).filter(Boolean))] as string[];
    const agentIds = [...new Set(items.map(r => r.agent_id).filter(Boolean))] as string[];

    const [tenantProfiles, landlords, agents] = await Promise.all([
      prisma.profiles.findMany({ where: { id: { in: tenantIds } }, select: { id: true, full_name: true, phone: true, tenant_status: true } }),
      prisma.landlords.findMany({ where: { id: { in: landlordIds } }, select: { id: true, name: true, phone: true } }),
      prisma.profiles.findMany({ where: { id: { in: agentIds } }, select: { id: true, full_name: true } })
    ]);

    const profileMap = new Map(tenantProfiles.map(p => [p.id, p]));
    const landlordMap = new Map(landlords.map(l => [l.id, l]));
    const agentMap = new Map(agents.map(a => [a.id, a]));

    const mapped = items
      .filter(r => r.tenant_id && profileMap.get(r.tenant_id)?.tenant_status !== 'inactive')
      .map(r => ({
        ...r,
        tenant_name: r.tenant_id ? profileMap.get(r.tenant_id)?.full_name || '—' : '—',
        tenant_phone: r.tenant_id ? profileMap.get(r.tenant_id)?.phone || '—' : '—',
        landlord_name: r.landlord_id ? landlordMap.get(r.landlord_id)?.name || '—' : '—',
        landlord_phone: r.landlord_id ? landlordMap.get(r.landlord_id)?.phone || '—' : '—',
        agent_name: r.agent_id ? agentMap.get(r.agent_id)?.full_name || '—' : 'Unassigned'
      }));

    res.json({ data: mapped });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTenant = async (req: Request, res: Response) => {
  try {
    const { tenantId, preserveHistory } = req.body;
    if (!tenantId) {
      return res.status(400).json({ message: 'Missing tenantId' });
    }
    
    await prisma.profiles.update({
      where: { id: tenantId },
      data: { tenant_status: 'inactive' }
    });
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailyTrackerData = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // 1. Fetch active rent requests
    const activeRequests = await prisma.rentRequests.findMany({
      where: {
        status: { in: ['disbursed', 'repaying', 'funded'] },
        disbursed_at: { not: null }
      },
      select: {
        id: true, tenant_id: true, agent_id: true, daily_repayment: true,
        rent_amount: true, amount_repaid: true, total_repayment: true,
        disbursed_at: true, status: true, tenant_no_smartphone: true
      }
    });

    const tenantIds = [...new Set(activeRequests.map(r => r.tenant_id))];
    const agentIds = [...new Set(activeRequests.map(r => r.agent_id).filter(Boolean))] as string[];
    const allUserIds = [...new Set([...tenantIds, ...agentIds])];

    // 2. Fetch profiles
    const profiles = await prisma.profiles.findMany({
      where: { id: { in: allUserIds } },
      select: { id: true, full_name: true, phone: true }
    });
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    // 3. Fetch wallets
    const wallets = await prisma.wallets.findMany({
      where: { user_id: { in: allUserIds } },
      select: { user_id: true, balance: true }
    });
    const walletMap = new Map();
    wallets.forEach(w => walletMap.set(w.user_id, Number(w.balance || 0)));

    // 4. Fetch today's collections
    const collections = await prisma.agent_collections.findMany({
      where: {
        created_at: { gte: today, lte: endOfDay }
      },
      select: { tenant_id: true, amount: true }
    });
    const collectionMap = new Map<string, number>();
    collections.forEach(c => {
      collectionMap.set(c.tenant_id, (collectionMap.get(c.tenant_id) || 0) + Number(c.amount));
    });

    // 5. Build tenant list
    const tenantMap = new Map();
    activeRequests.forEach(r => {
      const existing = tenantMap.get(r.tenant_id);
      const profile = profileMap.get(r.tenant_id);
      const agentProfile = r.agent_id ? profileMap.get(r.agent_id) : undefined;
      
      const entry = {
        tenant_id: r.tenant_id,
        tenant_name: profile?.full_name || r.tenant_id.slice(0, 8),
        phone: profile?.phone || '',
        daily_repayment: Number(r.daily_repayment || 0),
        rent_amount: Number(r.rent_amount || 0),
        amount_repaid: Number(r.amount_repaid || 0),
        total_repayment: Number(r.total_repayment || 0),
        disbursed_at: r.disbursed_at || '',
        rent_request_id: r.id,
        agent_id: r.agent_id || '',
        agent_name: agentProfile?.full_name || '—',
        agent_phone: agentProfile?.phone || '',
        tenant_wallet: walletMap.get(r.tenant_id) || 0,
        agent_wallet: r.agent_id ? (walletMap.get(r.agent_id) || 0) : 0,
        tenant_no_smartphone: r.tenant_no_smartphone ?? false,
      };

      if (!existing || entry.daily_repayment > existing.daily_repayment) {
        tenantMap.set(r.tenant_id, entry);
      }
    });

    let tenantList = Array.from(tenantMap.values()).map(t => {
      const paidToday = collectionMap.get(t.tenant_id) || 0;
      const hasPaid = paidToday >= t.daily_repayment * 0.5;
      return { ...t, paidToday, hasPaid };
    });

    // Sort: unpaid first, then by daily amount desc
    tenantList.sort((a, b) => {
      if (a.hasPaid !== b.hasPaid) return a.hasPaid ? 1 : -1;
      return b.daily_repayment - a.daily_repayment;
    });

    const paidCount = tenantList.filter(t => t.hasPaid).length;
    const unpaidCount = tenantList.filter(t => !t.hasPaid).length;
    const totalCollectedToday = tenantList.reduce((s, t) => s + t.paidToday, 0);
    const totalExpectedToday = tenantList.reduce((s, t) => s + t.daily_repayment, 0);
    const collectionRate = totalExpectedToday > 0 ? Math.round((totalCollectedToday / totalExpectedToday) * 100) : 0;

    res.json({
      tenantList,
      paidCount,
      unpaidCount,
      totalCollectedToday,
      totalExpectedToday,
      collectionRate
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const manualCollectRent = async (req: Request, res: Response) => {
  try {
    const { rent_request_id, reason } = req.body;
    if (!rent_request_id || !reason) {
      return res.status(400).json({ error: 'Missing rent_request_id or reason' });
    }

    const request = await prisma.rentRequests.findUnique({
      where: { id: rent_request_id }
    });
    
    if (!request) return res.status(404).json({ error: 'Request not found' });
    
    const amount = Number(request.daily_repayment);
    const tenantId = request.tenant_id;
    const agentId = request.agent_id;

    if (!agentId) return res.status(400).json({ error: 'No agent assigned' });

    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallets.findUnique({ where: { user_id: agentId } });
      if (!wallet || Number(wallet.balance) < amount) {
        throw new Error('Insufficient agent wallet balance');
      }

      await tx.wallets.update({
        where: { user_id: agentId },
        data: { balance: Number(wallet.balance) - amount }
      });

      await tx.rent_requests.update({
        where: { id: rent_request_id },
        data: { amount_repaid: Number(request.amount_repaid) + amount }
      });

      await tx.agent_collections.create({
        data: {
          tenant_id: tenantId,
          agent_id: agentId,
          amount: amount,
          payment_method: 'manual',
          status: 'completed',
          metadata: { reason }
        }
      });
      
      await tx.general_ledger.create({
        data: {
          user_id: tenantId,
          transaction_type: 'rent_repayment',
          amount: amount,
          currency: 'UGX',
          status: 'completed',
          reference_id: rent_request_id,
          description: `Manual collection: ${reason}`
        }
      });
    });

    res.json({
      success: true,
      total_collected: amount,
      tenant_deducted: amount,
      agent_deducted: amount
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSmartphoneStatus = async (req: Request, res: Response) => {
  try {
    const { rentRequestId, hasSmartphone } = req.body;
    await prisma.rentRequests.update({
      where: { id: rentRequestId },
      data: { tenant_no_smartphone: !hasSmartphone }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMissedDaysTrackerData = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    
    const activeRequests = await prisma.rentRequests.findMany({
      where: {
        status: { in: ['disbursed', 'repaying', 'funded'] },
        disbursed_at: { not: null }
      },
      select: {
        id: true, tenant_id: true, agent_id: true, daily_repayment: true,
        rent_amount: true, amount_repaid: true, total_repayment: true,
        disbursed_at: true, status: true
      }
    });

    const tenantIds = [...new Set(activeRequests.map(r => r.tenant_id))];
    const agentIds = [...new Set(activeRequests.map(r => r.agent_id).filter(Boolean))] as string[];
    const allUserIds = [...new Set([...tenantIds, ...agentIds])];

    const profiles = await prisma.profiles.findMany({
      where: { id: { in: allUserIds } },
      select: { id: true, full_name: true, phone: true }
    });
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    const wallets = await prisma.wallets.findMany({
      where: { user_id: { in: allUserIds } },
      select: { user_id: true, balance: true }
    });
    const walletMap = new Map();
    wallets.forEach(w => walletMap.set(w.user_id, Number(w.balance || 0)));

    const tenantMap = new Map();
    activeRequests.forEach(r => {
      const profile = profileMap.get(r.tenant_id);
      const agentProfile = r.agent_id ? profileMap.get(r.agent_id) : undefined;
      const dailyRepayment = Number(r.daily_repayment || 0);
      const totalRepayment = Number(r.total_repayment || 0);
      const amountRepaid = Number(r.amount_repaid || 0);
      const outstandingBalance = totalRepayment - amountRepaid;
      
      const disbursedAt = r.disbursed_at ? new Date(r.disbursed_at) : today;
      const diffTime = today.getTime() - disbursedAt.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysSinceDisbursed = Math.max(1, diffDays);
      const expectedRepaid = Math.min(dailyRepayment * daysSinceDisbursed, totalRepayment);
      const missedDays = dailyRepayment > 0
        ? Math.max(0, Math.round((expectedRepaid - amountRepaid) / dailyRepayment))
        : 0;
      const repaymentPct = totalRepayment > 0 ? Math.round((amountRepaid / totalRepayment) * 100) : 0;

      const existing = tenantMap.get(r.tenant_id);
      if (!existing || outstandingBalance > existing.outstanding_balance) {
        tenantMap.set(r.tenant_id, {
          tenant_id: r.tenant_id,
          tenant_name: profile?.full_name || r.tenant_id.slice(0, 8),
          phone: profile?.phone || '',
          daily_repayment: dailyRepayment,
          rent_amount: Number(r.rent_amount || 0),
          amount_repaid: amountRepaid,
          total_repayment: totalRepayment,
          outstanding_balance: outstandingBalance,
          disbursed_at: r.disbursed_at || '',
          days_since_disbursed: daysSinceDisbursed,
          expected_repaid: expectedRepaid,
          missed_days: missedDays,
          repayment_pct: repaymentPct,
          agent_id: r.agent_id || '',
          agent_name: agentProfile?.full_name || '—',
          agent_phone: agentProfile?.phone || '',
          tenant_wallet: walletMap.get(r.tenant_id) || 0,
          agent_wallet: r.agent_id ? (walletMap.get(r.agent_id) || 0) : 0,
        });
      }
    });

    const tenantList = Array.from(tenantMap.values());
    res.json({ tenantList });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegistrationReview = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const request = await prisma.rentRequests.findFirst({
      where: { tenant_id: tenantId },
      orderBy: { created_at: 'desc' },
      select: {
        id: true, landlord_id: true, lc1_id: true, house_category: true,
        tenant_water_meter: true, tenant_electricity_meter: true,
        house_image_urls: true, status: true, created_at: true
      }
    });

    const profile = await prisma.profiles.findUnique({
      where: { id: tenantId },
      select: {
        full_name: true, phone: true, email: true, city: true, country: true,
        national_id: true, mobile_money_number: true, mobile_money_provider: true
      }
    });

    let landlord = null;
    if (request?.landlord_id) {
      landlord = await prisma.landlords.findUnique({
        where: { id: request.landlord_id },
        select: {
          id: true, name: true, phone: true, property_address: true, bank_name: true,
          account_number: true, mobile_money_number: true, mobile_money_name: true,
          caretaker_name: true, caretaker_phone: true, electricity_meter_number: true,
          water_meter_number: true, village: true, district: true
        }
      });
    }

    let lc1 = null;
    if (request?.lc1_id) {
      lc1 = await prisma.lc1_chairpersons.findUnique({
        where: { id: request.lc1_id },
        select: { id: true, name: true, phone: true, village: true }
      });
    }

    res.json({
      profile,
      landlord,
      lc1,
      request
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRegistrationReview = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { table, recordId, updates, reason, section, changes, tenantName } = req.body;
    const userId = (req as any).user?.userId || '';

    if (!recordId) return res.status(400).json({ error: 'Record not found' });

    if (!['profiles', 'landlords', 'lc1_chairpersons', 'rent_requests'].includes(table)) {
      return res.status(400).json({ error: 'Invalid table' });
    }

    await prisma.$transaction(async (tx) => {
      if (table === 'profiles') {
        await tx.profiles.update({ where: { id: recordId }, data: updates });
      } else if (table === 'landlords') {
        await tx.landlords.update({ where: { id: recordId }, data: updates });
      } else if (table === 'lc1_chairpersons') {
        await tx.lc1_chairpersons.update({ where: { id: recordId }, data: updates });
      } else if (table === 'rent_requests') {
        await tx.rent_requests.update({ where: { id: recordId }, data: updates });
      }

      await tx.audit_logs.create({
        data: {
          user_id: userId,
          action_type: 'tenant_registration_edited',
          table_name: table,
          record_id: recordId,
          metadata: {
            reason,
            tenant_id: tenantId,
            tenant_name: tenantName,
            section,
            changes
          },
          created_at: new Date().toISOString()
        }
      });
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTenantBehaviorSegments = async (req: Request, res: Response) => {
  try {
    const activeRequests = await prisma.rentRequests.findMany({
      where: {
        status: { in: ['disbursed', 'repaying', 'funded'] },
        disbursed_at: { not: null }
      },
      select: {
        id: true, tenant_id: true, daily_repayment: true, rent_amount: true,
        amount_repaid: true, total_repayment: true, disbursed_at: true
      }
    });

    let total_with_requests = activeRequests.length;
    let critical_count = 0;
    let warning_count = 0;
    let healthy_count = 0;
    let first_default_count = 0;
    let recovering_count = 0;
    let overdue_count = 0;
    let total_overdue_amount = 0;

    const today = new Date();

    activeRequests.forEach(r => {
      const dailyRepayment = Number(r.daily_repayment || 0);
      const totalRepayment = Number(r.total_repayment || 0);
      const amountRepaid = Number(r.amount_repaid || 0);
      
      const disbursedAt = r.disbursed_at ? new Date(r.disbursed_at) : today;
      const diffTime = today.getTime() - disbursedAt.getTime();
      const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      
      const expectedRepaid = Math.min(dailyRepayment * diffDays, totalRepayment);
      const missedAmount = Math.max(0, expectedRepaid - amountRepaid);
      const missedDays = dailyRepayment > 0 ? Math.round(missedAmount / dailyRepayment) : 0;
      
      if (missedAmount > 0) {
        total_overdue_amount += missedAmount;
        overdue_count++;
      }

      if (missedDays >= 5) {
        critical_count++;
      } else if (missedDays >= 2) {
        warning_count++;
      } else {
        healthy_count++;
      }
    });

    res.json([{
      total_with_requests,
      critical_count,
      warning_count,
      healthy_count,
      first_default_count,
      recovering_count,
      overdue_count,
      total_overdue_amount
    }]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const searchTenantBehavior = async (req: Request, res: Response) => {
  try {
    const { search, segment, limit, offset } = req.body;

    const activeRequests = await prisma.rentRequests.findMany({
      where: {
        status: { in: ['disbursed', 'repaying', 'funded'] },
        disbursed_at: { not: null }
      },
      select: {
        id: true, tenant_id: true, daily_repayment: true, rent_amount: true,
        amount_repaid: true, total_repayment: true, disbursed_at: true, created_at: true
      }
    });

    const tenantIds = [...new Set(activeRequests.map(r => r.tenant_id))];
    
    const profiles = await prisma.profiles.findMany({
      where: { id: { in: tenantIds } },
      select: { id: true, full_name: true, phone: true }
    });
    
    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    let tenantList: any[] = [];
    const today = new Date();

    activeRequests.forEach(r => {
      const profile = profileMap.get(r.tenant_id);
      const dailyRepayment = Number(r.daily_repayment || 0);
      const totalRepayment = Number(r.total_repayment || 0);
      const amountRepaid = Number(r.amount_repaid || 0);
      
      const disbursedAt = r.disbursed_at ? new Date(r.disbursed_at) : today;
      const diffTime = today.getTime() - disbursedAt.getTime();
      const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      
      const expectedRepaid = Math.min(dailyRepayment * diffDays, totalRepayment);
      const missedAmount = Math.max(0, expectedRepaid - amountRepaid);
      const missedDays = dailyRepayment > 0 ? Math.round(missedAmount / dailyRepayment) : 0;
      
      let risk_level = 'healthy';
      if (missedDays >= 5) risk_level = 'critical';
      else if (missedDays >= 2) risk_level = 'warning';
      
      let health_score = 100;
      if (risk_level === 'critical') health_score = Math.max(0, 100 - (missedDays * 10));
      else if (risk_level === 'warning') health_score = Math.max(40, 100 - (missedDays * 10));

      // Filter by segment
      if (segment !== 'all') {
        if (segment === 'critical' && risk_level !== 'critical') return;
        if (segment === 'warning' && risk_level !== 'warning') return;
        if (segment === 'healthy' && risk_level !== 'healthy') return;
        if (segment === 'overdue' && missedAmount <= 0) return;
        if (segment === 'first_default' && missedDays !== 1) return;
        if (segment === 'recovering') return;
      }

      // Filter by search
      if (search) {
        const query = search.toLowerCase();
        if (!profile?.full_name?.toLowerCase().includes(query) && !profile?.phone?.includes(query)) {
          return;
        }
      }

      tenantList.push({
        tenant_id: r.tenant_id,
        full_name: profile?.full_name || 'Unknown',
        phone: profile?.phone || '',
        total_requests: 1, 
        total_rent_amount: Number(r.rent_amount || 0),
        total_repaid: amountRepaid,
        repayment_pct: totalRepayment > 0 ? Math.round((amountRepaid / totalRepayment) * 100) : 0,
        active_requests: 1,
        fully_repaid_count: amountRepaid >= totalRepayment ? 1 : 0,
        defaulted_count: risk_level === 'critical' ? 1 : 0,
        missed_payments: missedDays,
        on_time_payments: Math.max(0, diffDays - missedDays),
        health_score,
        risk_level,
        current_overdue_amount: missedAmount,
        last_payment_date: r.disbursed_at,
        first_request_date: r.created_at,
      });
    });

    const pagedList = tenantList.slice(offset || 0, (offset || 0) + (limit || 20));
    res.json(pagedList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTenantRequestsForLinker = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    
    const requests = await prisma.rentRequests.findMany({
      where: {
        tenant_id: tenantId,
        status: { in: ['pending', 'funded', 'disbursed', 'repaying', 'approved', 'tenant_ops_approved', 'agent_verified', 'landlord_ops_approved', 'coo_approved'] }
      },
      select: {
        id: true, status: true, rent_amount: true, amount_repaid: true,
        total_repayment: true, daily_repayment: true, agent_id: true,
        created_at: true, disbursed_at: true
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const agentIds = [...new Set(requests.map(r => r.agent_id).filter(Boolean))] as string[];
    const agents = await prisma.profiles.findMany({
      where: { id: { in: agentIds } },
      select: { id: true, full_name: true }
    });
    
    const agentMap = new Map();
    agents.forEach(a => agentMap.set(a.id, a.full_name));

    const result = requests.map(r => ({
      ...r,
      agent_name: r.agent_id ? agentMap.get(r.agent_id) || '—' : 'No agent'
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const linkAgentToRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { agentId } = req.body;
    const userId = (req as any).user?.userId || '';

    await prisma.rentRequests.update({
      where: { id: requestId },
      data: { agent_id: agentId }
    });

    await prisma.audit_logs.create({
      data: {
        user_id: userId,
        action_type: 'tenant_agent_linked',
        table_name: 'rent_requests',
        record_id: requestId,
        metadata: { agent_id: agentId },
        created_at: new Date().toISOString()
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLastKnownLocations = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body; 
    if (!userIds || userIds.length === 0) return res.json({});

    const locations = await prisma.user_locations.findMany({
      where: { user_id: { in: userIds } },
      orderBy: { captured_at: 'desc' },
      take: 50
    });

    const byUser = new Map();
    locations.forEach(row => {
      if (!byUser.has(row.user_id)) byUser.set(row.user_id, row);
    });

    res.json(Object.fromEntries(byUser));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const transferTenantAgent = async (req: Request, res: Response) => {
  try {
    const { tenant_id, from_agent_id, to_agent_id, reason, flag_type, actor_latitude, actor_longitude, actor_accuracy, actor_location_status } = req.body;
    const userId = (req as any).user?.userId || '';

    const requests = await prisma.rentRequests.findMany({
      where: {
        tenant_id,
        agent_id: from_agent_id,
        status: { in: ['pending', 'funded', 'disbursed', 'repaying', 'approved', 'tenant_ops_approved', 'agent_verified', 'landlord_ops_approved', 'coo_approved'] }
      }
    });

    const requestIds = requests.map(r => r.id);

    await prisma.$transaction(async (tx) => {
      if (requestIds.length > 0) {
        await tx.rent_requests.updateMany({
          where: { id: { in: requestIds } },
          data: { agent_id: to_agent_id }
        });
      }

      await tx.audit_logs.create({
        data: {
          user_id: userId,
          action_type: 'tenant_agent_transferred',
          table_name: 'rent_requests',
          record_id: tenant_id,
          metadata: {
            from_agent_id,
            to_agent_id,
            reason,
            flag_type,
            rent_requests_updated: requestIds.length,
            actor_location: { actor_latitude, actor_longitude, actor_accuracy, actor_location_status }
          },
          created_at: new Date().toISOString()
        }
      });
    });

    res.json({ rent_requests_updated: requestIds.length, subscriptions_updated: 0 });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getApprovalHistory = async (req: Request, res: Response) => {
  try {
    const PIPELINE_STATUSES = [
      'tenant_ops_approved',
      'agent_verified',
      'landlord_ops_approved',
      'coo_approved',
      'funded',
      'disbursed',
      'rejected',
      'approved',
      'repaying',
      'fully_repaid',
      'defaulted'
    ];

    const data = await prisma.rentRequests.findMany({
      where: { status: { in: PIPELINE_STATUSES } },
      select: {
        id: true, tenant_id: true, agent_id: true, rent_amount: true,
        status: true, created_at: true, updated_at: true,
        house_category: true, request_city: true, approval_comment: true,
        rejected_reason: true, tenant_ops_reviewed_by: true,
        tenant_ops_reviewed_at: true, agent_verified_by: true,
        agent_verified_at: true, landlord_ops_reviewed_by: true,
        landlord_ops_reviewed_at: true, coo_reviewed_by: true,
        coo_reviewed_at: true, cfo_reviewed_by: true, cfo_reviewed_at: true,
        assigned_agent_id: true, payout_method: true,
        payout_transaction_reference: true
      },
      orderBy: { updated_at: 'desc' },
      take: 100
    });

    if (data.length === 0) return res.json([]);

    const userIds = new Set<string>();
    data.forEach(r => {
      if (r.tenant_id) userIds.add(r.tenant_id);
      if (r.agent_id) userIds.add(r.agent_id);
      if (r.tenant_ops_reviewed_by) userIds.add(r.tenant_ops_reviewed_by);
      if (r.agent_verified_by) userIds.add(r.agent_verified_by);
      if (r.landlord_ops_reviewed_by) userIds.add(r.landlord_ops_reviewed_by);
      if (r.coo_reviewed_by) userIds.add(r.coo_reviewed_by);
      if (r.cfo_reviewed_by) userIds.add(r.cfo_reviewed_by);
    });

    const profiles = await prisma.profiles.findMany({
      where: { id: { in: [...userIds] } },
      select: { id: true, full_name: true }
    });

    const nameMap = new Map();
    profiles.forEach(p => nameMap.set(p.id, p.full_name));

    const result = data.map(r => ({
      ...r,
      tenant_name: nameMap.get(r.tenant_id) || 'Unknown',
      agent_name: r.agent_id ? (nameMap.get(r.agent_id) || 'Unknown') : null,
      reviewers: [
        r.tenant_ops_reviewed_at && { stage: 'Tenant Ops', by: nameMap.get(r.tenant_ops_reviewed_by!) || 'Staff', at: r.tenant_ops_reviewed_at },
        r.agent_verified_at && { stage: 'Agent Ops', by: nameMap.get(r.agent_verified_by!) || 'Staff', at: r.agent_verified_at },
        r.landlord_ops_reviewed_at && { stage: 'Landlord Ops', by: nameMap.get(r.landlord_ops_reviewed_by!) || 'Staff', at: r.landlord_ops_reviewed_at },
        r.coo_reviewed_at && { stage: 'COO', by: nameMap.get(r.coo_reviewed_by!) || 'Staff', at: r.coo_reviewed_at },
        r.cfo_reviewed_at && { stage: 'CFO', by: nameMap.get(r.cfo_reviewed_by!) || 'Staff', at: r.cfo_reviewed_at },
      ].filter(Boolean)
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTenantCollectData = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const requests = await prisma.rentRequests.findMany({
      where: {
        tenant_id: tenantId,
        status: { in: ['funded', 'disbursed', 'repaying', 'approved'] }
      },
      select: {
        id: true, status: true, rent_amount: true, amount_repaid: true,
        total_repayment: true, daily_repayment: true, agent_id: true, created_at: true
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const tenantWallet = await prisma.wallets.findFirst({
      where: { user_id: tenantId },
      select: { balance: true }
    });
    const tenantBalance = Number(tenantWallet?.balance || 0);

    const agentIds = [...new Set(requests.map(r => r.agent_id).filter(Boolean))] as string[];
    const agentMap = new Map();

    if (agentIds.length > 0) {
      const agents = await prisma.profiles.findMany({
        where: { id: { in: agentIds } },
        select: { id: true, full_name: true }
      });
      const wallets = await prisma.wallets.findMany({
        where: { user_id: { in: agentIds } },
        select: { user_id: true, balance: true }
      });
      
      const walletMap = new Map();
      wallets.forEach(w => walletMap.set(w.user_id, Number(w.balance)));

      agents.forEach(a => {
        agentMap.set(a.id, {
          name: a.full_name || '—',
          balance: walletMap.get(a.id) || 0
        });
      });
    }

    const mappedRequests = requests.map(r => ({
      ...r,
      outstanding: Number(r.total_repayment || 0) - Number(r.amount_repaid || 0),
      agent_name: r.agent_id ? agentMap.get(r.agent_id)?.name || '—' : 'No agent',
      agent_balance: r.agent_id ? agentMap.get(r.agent_id)?.balance || 0 : 0
    }));

    res.json({ requests: mappedRequests, tenantBalance });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTenantCollectionHistory = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const history = await prisma.general_ledger.findMany({
      where: {
        user_id: tenantId,
        ledger_scope: 'wallet',
        direction: 'cash_out',
        source_table: 'rent_requests'
      },
      select: {
        id: true, transaction_date: true, amount: true,
        category: true, description: true, direction: true
      },
      orderBy: { transaction_date: 'desc' },
      take: 20
    });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPipelineRequests = async (req: Request, res: Response) => {
  try {
    const { stage } = req.params;

    const data = await prisma.rentRequests.findMany({
      where: { status: stage },
      select: {
        id: true, tenant_id: true, agent_id: true, landlord_id: true, lc1_id: true,
        rent_amount: true, duration_days: true, access_fee: true, request_fee: true,
        total_repayment: true, daily_repayment: true, status: true, created_at: true,
        house_category: true, request_city: true, request_latitude: true, request_longitude: true,
        assigned_agent_id: true, payout_method: true, payout_transaction_reference: true,
        approval_comment: true, agent_ops_comment: true, tenant_ops_comment: true,
        landlord_ops_comment: true, registration_type: true, initial_outstanding_balance: true
      },
      orderBy: { created_at: 'asc' },
      take: 100
    });

    if (data.length === 0) return res.json([]);

    const userIds = new Set<string>();
    data.forEach(r => {
      if (r.tenant_id) userIds.add(r.tenant_id);
      if (r.agent_id) userIds.add(r.agent_id);
      if (r.assigned_agent_id) userIds.add(r.assigned_agent_id);
    });

    const landlordIds = [...new Set(data.map(r => r.landlord_id).filter(Boolean))] as string[];
    const lc1Ids = [...new Set(data.map(r => r.lc1_id).filter(Boolean))] as string[];

    const [profiles, landlords, lc1s] = await Promise.all([
      userIds.size > 0 ? prisma.profiles.findMany({ where: { id: { in: [...userIds] } }, select: { id: true, full_name: true, phone: true, email: true } }) : [],
      landlordIds.length > 0 ? prisma.landlords.findMany({ where: { id: { in: landlordIds } }, select: { id: true, name: true, phone: true, mobile_money_number: true } }) : [],
      lc1Ids.length > 0 ? prisma.lc1_chairpersons.findMany({ where: { id: { in: lc1Ids } }, select: { id: true, name: true, phone: true, village: true } }) : []
    ]);

    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    const landlordMap = new Map();
    landlords.forEach(l => landlordMap.set(l.id, l));

    const lc1Map = new Map();
    lc1s.forEach(l => lc1Map.set(l.id, l));

    const result = data.map(r => {
      const agentProfile = r.assigned_agent_id ? profileMap.get(r.assigned_agent_id) : r.agent_id ? profileMap.get(r.agent_id) : null;
      return {
        ...r,
        tenant_name: profileMap.get(r.tenant_id)?.full_name || 'Unknown',
        tenant_phone: profileMap.get(r.tenant_id)?.phone || '',
        agent_name: r.agent_id ? (profileMap.get(r.agent_id)?.full_name || 'Unassigned') : 'Unassigned',
        agent_phone: agentProfile?.phone || '',
        agent_email: agentProfile?.email || '',
        assigned_agent_name: r.assigned_agent_id ? (profileMap.get(r.assigned_agent_id)?.full_name || '') : '',
        landlord_name: landlordMap.get(r.landlord_id)?.name || 'Unknown',
        landlord_phone: landlordMap.get(r.landlord_id)?.phone || '',
        landlord_momo: landlordMap.get(r.landlord_id)?.mobile_money_number || landlordMap.get(r.landlord_id)?.phone || '',
        lc1_name: r.lc1_id ? (lc1Map.get(r.lc1_id)?.name || '') : '',
        lc1_phone: r.lc1_id ? (lc1Map.get(r.lc1_id)?.phone || '') : '',
        lc1_village: r.lc1_id ? (lc1Map.get(r.lc1_id)?.village || '') : ''
      };
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePipelineField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await prisma.rentRequests.update({
      where: { id },
      data: updates
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approvePipelineRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await prisma.rentRequests.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkApprovePipelineRequests = async (req: Request, res: Response) => {
  try {
    const { ids, updateData } = req.body;

    await prisma.rentRequests.updateMany({
      where: { id: { in: ids } },
      data: updateData
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const fundFloat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { notes, transaction_reference, payout_method } = req.body;

    // TODO: move edge function logic here later
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const landlordBonus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: move edge function logic here later
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransferAuditTrail = async (req: Request, res: Response) => {
  try {
    const [transfers, links] = await Promise.all([
      prisma.tenant_transfers.findMany({
        select: {
          id: true, tenant_id: true, from_agent_id: true, to_agent_id: true, transferred_by: true,
          reason: true, flag_type: true, rent_requests_updated: true, actor_latitude: true,
          actor_longitude: true, actor_accuracy: true, actor_location_status: true, created_at: true
        },
        orderBy: { created_at: 'desc' },
        take: 200
      }),
      prisma.audit_logs.findMany({
        where: { action_type: 'agent_linked' },
        select: {
          id: true, action_type: true, record_id: true, metadata: true, user_id: true, created_at: true
        },
        orderBy: { created_at: 'desc' },
        take: 200
      })
    ]);

    res.json({ transfers, links });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const searchAgents = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.length < 2) return res.json([]);

    const cleaned = q.replace(/\D/g, '');
    const isPhone = cleaned.length >= 3;

    const whereClause: any = isPhone
      ? { phone: { contains: cleaned.slice(-9), mode: 'insensitive' } }
      : { full_name: { contains: q, mode: 'insensitive' } };

    const profiles = await prisma.profiles.findMany({
      where: whereClause,
      select: { id: true, full_name: true, phone: true },
      take: 50
    });

    if (profiles.length === 0) return res.json([]);

    const profileIds = profiles.map(p => p.id);

    const roles = await prisma.userRoles.findMany({
      where: {
        role: 'agent',
        enabled: true,
        user_id: { in: profileIds }
      },
      select: { user_id: true }
    });

    const agentIds = new Set(roles.map(r => r.user_id));
    const agentProfiles = profiles.filter(p => agentIds.has(p.id));

    if (agentProfiles.length === 0) return res.json([]);

    const agentIdList = agentProfiles.map(a => a.id);
    const rentRequests = await prisma.rentRequests.findMany({
      where: {
        agent_id: { in: agentIdList },
        status: { in: ['funded', 'disbursed', 'repaying', 'approved', 'tenant_ops_approved', 'agent_verified', 'landlord_ops_approved', 'coo_approved'] }
      },
      select: { agent_id: true, tenant_id: true }
    });

    const countMap = new Map<string, Set<string>>();
    rentRequests.forEach(r => {
      if (r.agent_id) {
        if (!countMap.has(r.agent_id)) countMap.set(r.agent_id, new Set());
        if (r.tenant_id) countMap.get(r.agent_id)!.add(r.tenant_id);
      }
    });

    const result = agentProfiles.map(a => ({
      id: a.id,
      full_name: a.full_name || '—',
      phone: a.phone || '—',
      tenant_count: countMap.get(a.id)?.size || 0
    })).sort((a, b) => b.tenant_count - a.tenant_count);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAgentTenants = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const rentRequests = await prisma.rentRequests.findMany({
      where: {
        agent_id: agentId,
        status: { in: ['funded', 'disbursed', 'repaying', 'approved', 'tenant_ops_approved', 'agent_verified', 'landlord_ops_approved', 'coo_approved'] }
      },
      select: {
        id: true, tenant_id: true, status: true, rent_amount: true,
        daily_repayment: true, amount_repaid: true, total_repayment: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' },
      take: 200
    });

    if (rentRequests.length === 0) return res.json([]);

    const tenantIds = [...new Set(rentRequests.map(r => r.tenant_id).filter(Boolean))] as string[];

    const [profiles, wallets] = await Promise.all([
      prisma.profiles.findMany({
        where: { id: { in: tenantIds.slice(0, 100) } },
        select: { id: true, full_name: true, phone: true }
      }),
      prisma.wallets.findMany({
        where: { user_id: { in: tenantIds.slice(0, 100) } },
        select: { user_id: true, balance: true }
      })
    ]);

    const profileMap = new Map();
    profiles.forEach(p => profileMap.set(p.id, p));

    const walletMap = new Map();
    wallets.forEach(w => walletMap.set(w.user_id, Number(w.balance)));

    const seen = new Set<string>();
    const results = [];

    for (const r of rentRequests) {
      if (!r.tenant_id || seen.has(r.tenant_id)) continue;
      seen.add(r.tenant_id);

      const p = profileMap.get(r.tenant_id);
      results.push({
        tenant_id: r.tenant_id,
        tenant_name: p?.full_name || '—',
        tenant_phone: p?.phone || '—',
        rent_request_id: r.id,
        status: r.status,
        rent_amount: Number(r.rent_amount || 0),
        daily_repayment: Number(r.daily_repayment || 0),
        amount_repaid: Number(r.amount_repaid || 0),
        total_repayment: Number(r.total_repayment || 0),
        outstanding: Number(r.total_repayment || 0) - Number(r.amount_repaid || 0),
        wallet_balance: walletMap.get(r.tenant_id) || 0
      });
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTenantDetail = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;

    const profile = await prisma.profiles.findUnique({
      where: { id: tenantId },
      select: { id: true, full_name: true, phone: true, city: true, created_at: true }
    });

    const requests = await prisma.rentRequests.findMany({
      where: { tenant_id: tenantId },
      select: {
        id: true, status: true, rent_amount: true, amount_repaid: true,
        daily_repayment: true, duration_days: true, access_fee: true,
        request_fee: true, total_repayment: true, created_at: true,
        landlord_id: true, agent_id: true, assigned_agent_id: true
      },
      orderBy: { created_at: 'desc' }
    });

    const walletTxns = await prisma.wallet_transactions.findMany({
      where: {
        OR: [
          { sender_id: tenantId },
          { recipient_id: tenantId }
        ]
      },
      select: { id: true, amount: true, type: true, created_at: true, description: true },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const collections = await prisma.agent_collections.findMany({
      where: { tenant_id: tenantId },
      select: { id: true, amount: true, created_at: true, agent_id: true, payment_method: true },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const agentIds = [...new Set(requests.flatMap(r => [r.assigned_agent_id, r.agent_id]).filter(Boolean))] as string[];
    const agents = await prisma.profiles.findMany({
      where: { id: { in: agentIds } },
      select: { id: true, full_name: true, phone: true }
    });
    const agentMap = new Map();
    agents.forEach(a => agentMap.set(a.id, a));

    const landlordIds = [...new Set(requests.map(r => r.landlord_id).filter(Boolean))] as string[];
    const landlords = await prisma.landlords.findMany({
      where: { id: { in: landlordIds } },
      select: { id: true, name: true, phone: true }
    });
    const landlordMap = new Map();
    landlords.forEach(l => landlordMap.set(l.id, l));

    const enrichedRequests = requests.map(r => {
      const effectiveAgentId = r.assigned_agent_id || r.agent_id;
      return {
        ...r,
        agent_name: (effectiveAgentId && agentMap.get(effectiveAgentId)?.full_name) || 'Not Assigned',
        landlord_name: (r.landlord_id && landlordMap.get(r.landlord_id)?.name) || '—'
      };
    });

    res.json({
      profile,
      requests: enrichedRequests,
      walletTxns,
      collections
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTenantProfile = async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.params;
    const { full_name, phone, city } = req.body;

    const profile = await prisma.profiles.update({
      where: { id: tenantId },
      data: {
        full_name: full_name?.trim() || undefined,
        phone: phone?.trim() || undefined,
        city: city?.trim() || null
      }
    });

    // Audit
    await prisma.audit_logs.create({
      data: {
        action_type: 'tenant_profile_updated',
        user_id: req.user?.id || 'system',
        record_id: tenantId,
        metadata: { full_name, phone, city }
      }
    });

    res.json({ success: true, profile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRentRequestTerms = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { rent_amount, duration_days, access_fee, request_fee, total_repayment, daily_repayment, reason } = req.body;

    // 1. Update rent request
    const updatedRequest = await prisma.rentRequests.update({
      where: { id: requestId },
      data: {
        rent_amount,
        duration_days,
        access_fee,
        request_fee,
        total_repayment,
        daily_repayment
      }
    });

    // 2. Sync subscription charges
    const startDate = new Date(updatedRequest.created_at || new Date());
    const newEnd = new Date(startDate);
    newEnd.setDate(newEnd.getDate() + Number(duration_days));

    await prisma.subscription_charges.updateMany({
      where: {
        rent_request_id: requestId,
        status: { in: ['active', 'pending'] }
      },
      data: {
        charge_amount: daily_repayment,
        end_date: newEnd.toISOString().slice(0, 10)
      }
    });

    // 3. Log audit
    await prisma.audit_logs.create({
      data: {
        action_type: 'rent_request_terms_updated',
        user_id: req.user?.id || 'system',
        record_id: requestId,
        metadata: { rent_amount, duration_days, reason }
      }
    });

    res.json({ success: true, updatedRequest });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAgentAllocationsRaw = async (req: Request, res: Response) => {
  try {
    const { startISO, endISO } = req.query as { startISO?: string; endISO?: string };

    const where: any = {
      agent_id: { not: null },
      tenant_id: { not: null }
    };

    if (startISO || endISO) {
      where.created_at = {};
      if (startISO) where.created_at.gte = new Date(startISO);
      if (endISO) where.created_at.lte = new Date(endISO);
    }

    const reqs = await prisma.rentRequests.findMany({
      where,
      select: {
        id: true, agent_id: true, tenant_id: true, rent_amount: true,
        daily_repayment: true, duration_days: true, total_repayment: true,
        amount_repaid: true, status: true, created_at: true,
        funded_at: true, disbursed_at: true
      }
    });

    const tenantIds = [...new Set(reqs.map(r => r.tenant_id).filter(Boolean))] as string[];
    const agentIds = [...new Set(reqs.map(r => r.agent_id).filter(Boolean))] as string[];

    const collections = await prisma.agent_collections.findMany({
      where: {
        agent_id: { in: agentIds }
      },
      select: { agent_id: true, tenant_id: true, amount: true, created_at: true },
      orderBy: { created_at: 'desc' }
    });

    const allIds = [...new Set([...agentIds, ...tenantIds])];
    const profiles = await prisma.profiles.findMany({
      where: { id: { in: allIds } },
      select: { id: true, full_name: true, phone: true }
    });

    const profMap: Record<string, { name: string; phone: string }> = {};
    profiles.forEach(p => {
      profMap[p.id] = { name: p.full_name || p.id.slice(0, 8), phone: p.phone || '' };
    });

    res.json({ reqs, collections, profMap });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRentRequestField = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { field, value } = req.body;

    if (!['rent_amount', 'amount_repaid', 'duration_days'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field' });
    }

    await prisma.rentRequests.update({
      where: { id: requestId },
      data: { [field]: value }
    });

    await prisma.audit_logs.create({
      data: {
        action_type: 'rent_request_field_updated',
        user_id: req.user?.id || 'system',
        record_id: requestId,
        metadata: { field, value }
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLandlordFloat = async (req: Request, res: Response) => {
  try {
    const floats = await prisma.agent_landlord_float.findMany({
      select: { agent_id: true, balance: true, total_funded: true, total_paid_out: true, updated_at: true, region: true },
      orderBy: { balance: 'desc' },
      take: 500
    });

    const allocations = await prisma.agent_landlord_float_allocations.findMany({
      where: { status: { in: ['open', 'partially_paid'] } },
      select: {
        id: true, agent_id: true, tenant_id: true, landlord_id: true,
        landlord_name: true, landlord_phone: true, mobile_money_provider: true,
        allocated_amount: true, paid_out_amount: true, remaining_amount: true,
        status: true, created_at: true
      },
      orderBy: { created_at: 'desc' },
      take: 1000
    });

    const agentIds = new Set([
      ...floats.map(f => f.agent_id),
      ...allocations.map(a => a.agent_id)
    ]);
    const tenantIds = new Set(allocations.map(a => a.tenant_id).filter(Boolean)) as Set<string>;
    const ids = [...new Set([...agentIds, ...tenantIds])];

    const profiles = await prisma.profiles.findMany({
      where: { id: { in: ids } },
      select: { id: true, full_name: true, phone: true }
    });
    const nameMap = new Map();
    profiles.forEach(p => nameMap.set(p.id, { name: p.full_name || 'Unknown', phone: p.phone || null }));

    const groups = new Map();
    for (const f of floats) {
      const prof = nameMap.get(f.agent_id);
      groups.set(f.agent_id, {
        agent_id: f.agent_id,
        agent_name: prof?.name || 'Unknown Agent',
        agent_phone: prof?.phone ?? null,
        balance: Number(f.balance || 0),
        total_funded: Number(f.total_funded || 0),
        total_paid_out: Number(f.total_paid_out || 0),
        region: f.region,
        updated_at: f.updated_at,
        allocations: [],
        outstanding_allocated: 0
      });
    }

    for (const a of allocations) {
      let g = groups.get(a.agent_id);
      if (!g) {
        const prof = nameMap.get(a.agent_id);
        g = {
          agent_id: a.agent_id,
          agent_name: prof?.name || 'Unknown Agent',
          agent_phone: prof?.phone ?? null,
          balance: 0,
          total_funded: 0,
          total_paid_out: 0,
          region: null,
          updated_at: a.created_at,
          allocations: [],
          outstanding_allocated: 0
        };
        groups.set(a.agent_id, g);
      }
      g.allocations.push({
        ...a,
        allocated_amount: Number(a.allocated_amount || 0),
        paid_out_amount: Number(a.paid_out_amount || 0),
        remaining_amount: Number(a.remaining_amount || 0),
        tenant_name: a.tenant_id ? nameMap.get(a.tenant_id)?.name || 'Unknown Tenant' : '—'
      });
      g.outstanding_allocated += Number(a.remaining_amount || 0);
    }

    const list = [...groups.values()].sort((x, y) =>
      (y.balance + y.outstanding_allocated) - (x.balance + x.outstanding_allocated)
    );

    res.json(list);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLandlordFloatTimeline = async (req: Request, res: Response) => {
  try {
    const { fromIso, toIso } = req.query as { fromIso?: string; toIso?: string };

    const whereCreated: any = {};
    if (fromIso) whereCreated.gte = new Date(fromIso);
    if (toIso) whereCreated.lte = new Date(toIso);

    const whereClause = Object.keys(whereCreated).length > 0 ? { created_at: whereCreated } : {};

    const [fundings, allocs, pays] = await Promise.all([
      prisma.agent_float_funding.findMany({
        where: whereClause,
        select: { id: true, agent_id: true, amount: true, created_at: true, bank_reference: true, bank_name: true, notes: true, status: true },
        orderBy: { created_at: 'desc' },
        take: 500
      }),
      prisma.agent_landlord_float_allocations.findMany({
        where: whereClause,
        select: { id: true, agent_id: true, tenant_id: true, landlord_name: true, landlord_phone: true, allocated_amount: true, paid_out_amount: true, remaining_amount: true, status: true, created_at: true, notes: true },
        orderBy: { created_at: 'desc' },
        take: 500
      }),
      prisma.agent_float_withdrawals.findMany({
        where: whereClause,
        select: { id: true, agent_id: true, tenant_id: true, landlord_name: true, landlord_phone: true, amount: true, transaction_id: true, status: true, created_at: true, notes: true },
        orderBy: { created_at: 'desc' },
        take: 500
      })
    ]);

    const ids = new Set<string>();
    fundings.forEach(r => r.agent_id && ids.add(r.agent_id));
    allocs.forEach(r => {
      if (r.agent_id) ids.add(r.agent_id);
      if (r.tenant_id) ids.add(r.tenant_id);
    });
    pays.forEach(r => {
      if (r.agent_id) ids.add(r.agent_id);
      if (r.tenant_id) ids.add(r.tenant_id);
    });

    const profiles = await prisma.profiles.findMany({
      where: { id: { in: [...ids] } },
      select: { id: true, full_name: true }
    });
    const nameMap = new Map();
    profiles.forEach(p => nameMap.set(p.id, p.full_name || 'Unknown'));

    res.json({ fundings, allocs, pays, nameMap: Object.fromEntries(nameMap) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLandlordFloatDrill = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const [wallet, fundings, allocations, payouts] = await Promise.all([
      prisma.agent_landlord_float.findUnique({
        where: { agent_id: agentId },
        select: { id: true, balance: true, total_funded: true, total_paid_out: true, region: true, updated_at: true }
      }),
      prisma.agent_float_funding.findMany({
        where: { agent_id: agentId },
        select: { id: true, amount: true, bank_reference: true, bank_name: true, status: true, created_at: true, notes: true },
        orderBy: { created_at: 'desc' },
        take: 20
      }),
      prisma.agent_landlord_float_allocations.findMany({
        where: { agent_id: agentId },
        select: { id: true, tenant_id: true, landlord_name: true, landlord_phone: true, allocated_amount: true, paid_out_amount: true, remaining_amount: true, status: true, created_at: true },
        orderBy: { created_at: 'desc' },
        take: 50
      }),
      prisma.agent_float_withdrawals.findMany({
        where: { agent_id: agentId },
        select: { id: true, tenant_id: true, landlord_name: true, landlord_phone: true, amount: true, transaction_id: true, status: true, created_at: true, gps_match: true, gps_distance_meters: true, mobile_money_provider: true, receipt_photo_urls: true },
        orderBy: { created_at: 'desc' },
        take: 50
      })
    ]);

    res.json({ wallet, fundings, allocations, payouts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRejectedRequests = async (req: Request, res: Response) => {
  try {
    const { stages } = req.query as { stages?: string };
    
    let whereClause: any = { status: 'rejected' };
    if (stages && stages !== 'all') {
      whereClause.rejected_at_stage = { in: stages.split(',') };
    }

    const requests = await prisma.rentRequests.findMany({
      where: whereClause,
      select: {
        id: true, tenant_id: true, agent_id: true, landlord_id: true, rent_amount: true,
        status: true, rejected_reason: true, rejected_at: true, rejected_at_stage: true,
        reopen_count: true, reopened_at: true, reopen_reason: true, created_at: true
      },
      orderBy: { rejected_at: 'desc' },
      take: 200
    });

    const tenantIds = [...new Set(requests.map(r => r.tenant_id).filter(Boolean))] as string[];
    let profilesMap: Record<string, any> = {};
    
    if (tenantIds.length > 0) {
      const profiles = await prisma.profiles.findMany({
        where: { id: { in: tenantIds } },
        select: { id: true, full_name: true, phone: true }
      });
      profiles.forEach(p => {
        profilesMap[p.id] = p;
      });
    }

    const result = requests.map(r => ({
      ...r,
      tenant_name: r.tenant_id && profilesMap[r.tenant_id] ? profilesMap[r.tenant_id].full_name || 'Unknown' : 'Unknown',
      tenant_phone: r.tenant_id && profilesMap[r.tenant_id] ? profilesMap[r.tenant_id].phone || '' : ''
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getAdvanceRequests = async (req: Request, res: Response) => {
  try {
    const { stage } = req.params;
    
    // config maps stage to filterStatus
    const configMap: Record<string, string> = {
      agent_ops: 'pending',
      tenant_ops: 'agent_ops_approved',
      landlord_ops: 'tenant_ops_approved',
      coo: 'landlord_ops_approved'
    };
    
    const filterStatus = configMap[stage] || 'pending';
    
    const requests = await prisma.agent_advance_requests.findMany({
      where: { status: filterStatus },
      orderBy: { created_at: 'asc' },
    });

    const agentIds = [...new Set(requests.map(r => r.agent_id).filter(Boolean))] as string[];
    let profilesMap: Record<string, any> = {};
    if (agentIds.length > 0) {
      const profiles = await prisma.profiles.findMany({
        where: { id: { in: agentIds } },
        select: { id: true, full_name: true, phone: true }
      });
      profiles.forEach(p => { profilesMap[p.id] = p; });
    }

    const result = requests.map(r => ({
      ...r,
      profiles: r.agent_id && profilesMap[r.agent_id] ? profilesMap[r.agent_id] : null
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveAdvanceRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approve, stage, notes, user_id } = req.body;
    const userId = (req as any).user?.id || user_id;

    if (!userId) throw new Error('Not authenticated');

    const configMap: Record<string, any> = {
      agent_ops: { nextStatus: 'agent_ops_approved', reviewerCol: 'reviewed_by_agent_ops', reviewedAtCol: 'agent_ops_reviewed_at', notesCol: 'agent_ops_notes' },
      tenant_ops: { nextStatus: 'tenant_ops_approved', reviewerCol: 'reviewed_by_tenant_ops', reviewedAtCol: 'tenant_ops_reviewed_at', notesCol: 'tenant_ops_notes' },
      landlord_ops: { nextStatus: 'landlord_ops_approved', reviewerCol: 'reviewed_by_landlord_ops', reviewedAtCol: 'landlord_ops_reviewed_at', notesCol: 'landlord_ops_notes' },
      coo: { nextStatus: 'coo_approved', reviewerCol: 'approved_by_coo', reviewedAtCol: 'coo_approved_at', notesCol: 'coo_notes' },
    };

    const config = configMap[stage];
    if (!config) throw new Error('Invalid stage');

    const updateData: any = {};
    if (approve) {
      updateData.status = config.nextStatus;
      updateData[config.reviewerCol] = userId;
      updateData[config.reviewedAtCol] = new Date();
      if (notes) updateData[config.notesCol] = notes;
    } else {
      updateData.status = 'rejected';
      updateData.rejection_reason = notes || 'Rejected at ' + stage.replace('_', ' ') + ' stage';
      updateData[config.reviewerCol] = userId;
      updateData[config.reviewedAtCol] = new Date();
    }

    const data = await prisma.agent_advance_requests.update({
      where: { id },
      data: updateData,
      select: { id: true }
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBusinessAdvances = async (req: Request, res: Response) => {
  try {
    const { stage } = req.params;
    
    const configMap: Record<string, string> = {
      agent_ops: 'pending',
      tenant_ops: 'agent_ops_approved',
      landlord_ops: 'tenant_ops_approved',
      coo: 'landlord_ops_approved',
      cfo: 'coo_approved'
    };
    
    const filterStatus = configMap[stage] || 'pending';
    
    const requests = await prisma.businessAdvances.findMany({
      where: { status: filterStatus },
      orderBy: { created_at: 'asc' },
    });

    const tenantIds = [...new Set(requests.map(r => r.tenant_id).filter(Boolean))] as string[];
    const agentIds = [...new Set(requests.map(r => r.agent_id).filter(Boolean))] as string[];
    const allProfileIds = [...new Set([...tenantIds, ...agentIds])];

    let profilesMap: Record<string, any> = {};
    if (allProfileIds.length > 0) {
      const profiles = await prisma.profiles.findMany({
        where: { id: { in: allProfileIds } },
        select: { id: true, full_name: true, phone: true }
      });
      profiles.forEach(p => { profilesMap[p.id] = p; });
    }

    const result = requests.map(r => ({
      ...r,
      tenant: r.tenant_id && profilesMap[r.tenant_id] ? profilesMap[r.tenant_id] : null,
      agent: r.agent_id && profilesMap[r.agent_id] ? profilesMap[r.agent_id] : null
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const approveBusinessAdvance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approve, stage, notes, user_id } = req.body;
    const userId = (req as any).user?.id || user_id;

    if (!userId) throw new Error('Not authenticated');

    const configMap: Record<string, any> = {
      agent_ops: { nextStatus: 'agent_ops_approved', reviewerCol: 'agent_ops_reviewed_by', reviewedAtCol: 'agent_ops_reviewed_at', notesCol: 'agent_ops_notes' },
      tenant_ops: { nextStatus: 'tenant_ops_approved', reviewerCol: 'tenant_ops_reviewed_by', reviewedAtCol: 'tenant_ops_reviewed_at', notesCol: 'tenant_ops_notes' },
      landlord_ops: { nextStatus: 'landlord_ops_approved', reviewerCol: 'landlord_ops_reviewed_by', reviewedAtCol: 'landlord_ops_reviewed_at', notesCol: 'landlord_ops_notes' },
      coo: { nextStatus: 'coo_approved', reviewerCol: 'coo_approved_by', reviewedAtCol: 'coo_approved_at', notesCol: 'coo_notes' },
      cfo: { nextStatus: null, reviewerCol: 'cfo_disbursed_by', reviewedAtCol: 'cfo_disbursed_at', notesCol: 'cfo_notes' },
    };

    const config = configMap[stage];
    if (!config) throw new Error('Invalid stage');

    const updateData: any = {};
    if (approve) {
      if (stage !== 'cfo') {
        updateData.status = config.nextStatus;
      }
      updateData[config.reviewerCol] = userId;
      updateData[config.reviewedAtCol] = new Date();
      if (notes) updateData[config.notesCol] = notes;
    } else {
      updateData.status = 'rejected';
      updateData.rejection_reason = notes || `Rejected at ${stage.replace('_', ' ')} stage`;
      updateData[config.reviewerCol] = userId;
      updateData[config.reviewedAtCol] = new Date();
    }

    const data = await prisma.businessAdvances.update({
      where: { id },
      data: updateData,
      select: { id: true }
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRentHistoryVerify = async (req: Request, res: Response) => {
  try {
    // const { dept } = req.params; // we fetch all pending/verified for the UI
    const records = await prisma.rent_history_records.findMany({
      where: { status: { in: ['pending', 'verified'] } },
      orderBy: { created_at: 'desc' },
      take: 200
    });

    const tenantIds = [...new Set(records.map(r => r.tenant_id).filter(Boolean))] as string[];
    let profilesMap: Record<string, any> = {};
    if (tenantIds.length > 0) {
      const profiles = await prisma.profiles.findMany({
        where: { id: { in: tenantIds } },
        select: { id: true, full_name: true, phone: true }
      });
      profiles.forEach(p => { profilesMap[p.id] = p; });
    }

    const result = records.map(r => ({
      ...r,
      tenant: r.tenant_id && profilesMap[r.tenant_id] ? profilesMap[r.tenant_id] : null
    }));

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyRentHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approve, dept, notes, user_id } = req.body;
    const userId = (req as any).user?.id || user_id;

    if (!userId) throw new Error('Not authenticated');

    const configMap: Record<string, any> = {
      tenant_ops: { verifyCol: 'tenant_ops_verified_at', byCol: 'tenant_ops_verified_by' },
      agent_ops: { verifyCol: 'agent_ops_verified_at', byCol: 'agent_ops_verified_by' },
      landlord_ops: { verifyCol: 'landlord_ops_verified_at', byCol: 'landlord_ops_verified_by' },
    };

    const cfg = configMap[dept];
    if (!cfg) throw new Error('Invalid dept');

    const updateData: any = {};
    if (notes) updateData.verification_notes = notes;

    if (approve) {
      updateData[cfg.verifyCol] = new Date();
      updateData[cfg.byCol] = userId;
      updateData.status = 'verified';
    } else {
      updateData.status = 'rejected';
      updateData.rejection_reason = notes || `Rejected by ${dept}`;
    }

    const data = await prisma.rent_history_records.update({
      where: { id },
      data: updateData,
      select: { id: true }
    });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// 1. GET /tenant-ops/drilldown/:userId
export const getUserDrilldown = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Fetch profile
    const profile = await prisma.profiles.findUnique({ where: { id: userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Fetch roles
    const rolesData = await prisma.userRoles.findMany({ 
      where: { user_id: userId, enabled: true },
      select: { role: true }
    });
    const roles = rolesData.map(r => r.role);

    // Common Tenant Data
    const rentRequests = await prisma.rentRequests.findMany({
      where: { tenant_id: userId },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const activeRr = rentRequests[0];
    let activeLandlord = null;
    if (activeRr?.landlord_id) {
      activeLandlord = await prisma.landlords.findUnique({
        where: { id: activeRr.landlord_id },
        select: { id: true, name: true, phone: true, property_address: true }
      });
    }

    // Common Agent Data
    // Find all profile IDs sharing this agent's phone
    let agentIds = [userId];
    if (profile.phone) {
      const siblings = await prisma.profiles.findMany({
        where: { phone: profile.phone },
        select: { id: true }
      });
      agentIds = siblings.map(s => s.id);
    }

    const listings = await prisma.houseListings.findMany({
      where: { agent_id: { in: agentIds } },
      orderBy: { created_at: 'desc' },
      take: 200
    });

    const listingLandlordIds = [...new Set(listings.map(l => l.landlord_id).filter(Boolean))] as string[];
    const listingLandlords = listingLandlordIds.length ? await prisma.landlords.findMany({
      where: { id: { in: listingLandlordIds } },
      select: { id: true, name: true, phone: true }
    }) : [];

    const listingsWithLandlord = listings.map(l => ({
      ...l,
      landlord: listingLandlords.find(ll => ll.id === l.landlord_id) || null
    }));

    // Stats
    const tenantCount = await prisma.profiles.count({ where: { managing_agent_id: userId } });
    
    // rentSum
    const rentSumReqs = await prisma.rentRequests.findMany({
      where: { assigned_agent_id: userId },
      select: { rent_amount: true },
      take: 1000
    });
    const totalRent = rentSumReqs.reduce((sum, r) => sum + Number(r.rent_amount || 0), 0);

    const landlords = await prisma.agentLandlordAssignments.findMany({
      where: { agent_id: userId, status: 'active' },
      include: { landlords: { select: { id: true, name: true, phone: true } } }
    });

    const wallet = await prisma.wallets.findFirst({ where: { user_id: userId },
      select: {    balance: true, currency: true,  }
    });

    // RPC equivalents or simple approximations for stats
    // We can just rely on the frontend fetching `get_user_available_balance` and `get_agent_rent_request_capacity` via rpc or we can do it here.
    // For simplicity we will return these values if possible, or omit them and let the frontend do the RPC since Prisma doesn't have typed RPCs.
    // Actually, prisma.$queryRaw can do it:
    const strictWithdrawableRes: any = await prisma.$queryRaw`SELECT get_user_available_balance(${userId}::uuid) as val`;
    const strictWithdrawable = strictWithdrawableRes?.[0]?.val ?? 0;

    const capacityRes: any = await prisma.$queryRaw`SELECT * FROM get_agent_rent_request_capacity(${userId}::uuid)`;
    const capacity = capacityRes?.[0] ?? null;

    const referralCount = await prisma.profiles.count({ where: { referrer_id: userId } });

    const proxyAgents = await prisma.proxyAgentAssignments.findMany({
      where: { agent_id: userId, is_active: true },
      select: { beneficiary_id: true, beneficiary_role: true, is_managed_account: true, approval_status: true }
    });

    const partnersOnboarded = proxyAgents.filter(p => p.beneficiary_role === 'supporter').length;
    const proxyLandlords = proxyAgents.filter(p => p.beneficiary_role === 'landlord').length;
    const managedAccounts = proxyAgents.filter(p => p.is_managed_account && p.approval_status === 'approved').length;

    const agentAdvances = await prisma.agentAdvances.findMany({
      where: { agent_id: userId, status: { in: ['active','outstanding','approved','disbursed'] } },
      select: { outstanding_balance: true }
    });
    const outstandingAdvance = agentAdvances.reduce((sum, r) => sum + Number(r.outstanding_balance || 0), 0);

    const stats = {
      tenantCount,
      totalRent,
      landlords,
      wallet,
      strictWithdrawable: Number(strictWithdrawable),
      capacity,
      referralCount,
      partnersOnboarded,
      proxyLandlords,
      managedAccounts,
      outstandingAdvance
    };

    res.json({
      profile,
      roles,
      tenantData: { rentRequests, activeLandlord },
      agentData: { listings: listingsWithLandlord, stats }
    });
  } catch (error: any) {
    console.error("Drilldown error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. PATCH /tenant-ops/listings/:id
export const updateListing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.houseListings.update({
      where: { id },
      data
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 3. POST /tenant-ops/storage/presigned-url
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, contentType, bucketName } = req.body;
    const bucket = bucketName || process.env.AWS_S3_BUCKET_NAME || 'welile-images';
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      ContentType: contentType,
      // Optional: ACL: 'public-read' if your bucket supports it
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    // Also return the final public URL
    const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION || 'eu-central-1'}.amazonaws.com/${fileName}`;

    res.json({ url, publicUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 4. GET /tenant-ops/business-advances/economics
export const getBusinessAdvancesEconomics = async (req: Request, res: Response) => {
  try {
    // Just return all active advances to calculate economics on frontend, or calculate here
    const advances = await prisma.businessAdvances.findMany({
      where: { status: { in: ['approved', 'disbursed', 'active', 'outstanding'] } },
      select: {
        id: true, principal_amount: true, outstanding_balance: true,
        total_interest_accrued: true, total_repaid: true, status: true
      }
    });
    res.json(advances);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 5. PATCH /tenant-ops/landlords/:id
export const updateLandlord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.landlords.update({
      where: { id },
      data
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 6. POST /tenant-ops/assignments/nearby
export const assignNearbyAgent = async (req: Request, res: Response) => {
  try {
    const { propertyId, maxDistanceKm } = req.body;
    // For now just return empty, or implement the logic
    res.json({ message: "Not fully implemented yet" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

