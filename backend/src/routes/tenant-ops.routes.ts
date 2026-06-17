import {
  getUserDrilldown,
  updateListing,
  getPresignedUrl,
  getBusinessAdvancesEconomics,
  updateLandlord,
  assignNearbyAgent
} from '../controllers/tenant-ops.controller';
import express from 'express';
import {
  getAppliedExtract,
  getApprovedExtract,
  getFundedExtract,
  getCollectedExtract,
  getExpectedExtract,
  getReportData,
  getRentRequests,
  deleteTenant,
  getDailyTrackerData,
  manualCollectRent,
  updateSmartphoneStatus,
  getMissedDaysTrackerData,
  getRegistrationReview,
  updateRegistrationReview,
  getTenantBehaviorSegments,
  searchTenantBehavior,
  getTenantRequestsForLinker,
  linkAgentToRequest,
  getLastKnownLocations,
  transferTenantAgent,
  getApprovalHistory,
  getTenantCollectData,
  getTenantCollectionHistory,
  getPipelineRequests,
  updatePipelineField,
  approvePipelineRequest,
  bulkApprovePipelineRequests,
  fundFloat,
  landlordBonus,
  getTransferAuditTrail,
  searchAgents,
  getAgentTenants,
  getTenantDetail,
  updateTenantProfile,
  updateRentRequestTerms,
  getAgentAllocationsRaw,
  updateRentRequestField,
  getLandlordFloat,
  getLandlordFloatTimeline,
  getLandlordFloatDrill,
  getRejectedRequests,
  getAdvanceRequests,
  approveAdvanceRequest,
  getBusinessAdvances,
  approveBusinessAdvance,
  getRentHistoryVerify,
  verifyRentHistory
} from '../controllers/tenant-ops.controller';

const router = express.Router();

// Report Generation Data (PDF / CSV Extracts)
router.get('/extracts/applied', getAppliedExtract);
router.get('/extracts/approved', getApprovedExtract);
router.get('/extracts/funded', getFundedExtract);
router.get('/extracts/collected', getCollectedExtract);
router.get('/extracts/expected', getExpectedExtract);

// Main dashboard report
router.get('/report', getReportData);

// All rent requests
router.get('/requests', getRentRequests);

// Delete/Archive tenant
router.post('/delete', deleteTenant);

// Daily Payment Tracker
router.get('/daily-tracker', getDailyTrackerData);
router.post('/manual-collect', manualCollectRent);
router.post('/smartphone-status', updateSmartphoneStatus);

// Missed Days Tracker
router.get('/missed-days', getMissedDaysTrackerData);

// Registration Review
router.get('/registration-review/:tenantId', getRegistrationReview);
router.post('/registration-review/:tenantId/update', updateRegistrationReview);

// Tenant Behavior
router.get('/behavior-segments', getTenantBehaviorSegments);
router.post('/behavior-search', searchTenantBehavior);

// Agent Linker
router.get('/agent-linker/requests/:tenantId', getTenantRequestsForLinker);
router.post('/agent-linker/link/:requestId', linkAgentToRequest);
router.post('/agent-linker/locations', getLastKnownLocations);
router.post('/agent-linker/transfer', transferTenantAgent);

// Rent Collector
router.get('/collector/:tenantId/data', getTenantCollectData);
router.get('/collector/:tenantId/history', getTenantCollectionHistory);

// Approval History
router.get('/approval-history', getApprovalHistory);

// Rent Pipeline
router.get('/pipeline/:stage', getPipelineRequests);
router.post('/pipeline/update-field/:id', updatePipelineField);
router.post('/pipeline/approve/:id', approvePipelineRequest);
router.post('/pipeline/bulk-approve', bulkApprovePipelineRequests);

// Edge Function Replacements
router.post('/fund-float/:id', fundFloat);
router.post('/landlord-bonus/:id', landlordBonus);

// Audit Trail
router.get('/transfer-audit', getTransferAuditTrail);

// Agent Search
router.get('/search-agents', searchAgents);
router.get('/agent-tenants/:agentId', getAgentTenants);

// Tenant Detail
router.get('/tenant-detail/:tenantId', getTenantDetail);
router.put('/tenant-detail/:tenantId/profile', updateTenantProfile);
router.put('/tenant-detail/request/:requestId', updateRentRequestTerms);

// Agent Allocations
router.get('/agent-allocations-raw', getAgentAllocationsRaw);
router.put('/rent-request-field/:requestId', updateRentRequestField);

// Landlord Float
router.get('/landlord-float', getLandlordFloat);
router.get('/landlord-float-timeline', getLandlordFloatTimeline);
router.get('/landlord-float-drill/:agentId', getLandlordFloatDrill);

// Rejected Requests
router.get('/rejected-requests', getRejectedRequests);

// Advance Requests
router.get('/advance-requests/:stage', getAdvanceRequests);
router.post('/advance-requests/:id/approve', approveAdvanceRequest);

// Business Advances
router.get('/business-advances/:stage', getBusinessAdvances);
router.post('/business-advances/:id/approve', approveBusinessAdvance);

// Rent History Verification
router.get('/rent-history/:dept', getRentHistoryVerify);
router.post('/rent-history/:id/verify', verifyRentHistory);

export default router;
import { getDailyCollectionDashboard, recordDailyCollection } from '../controllers/daily-collection.controller';
router.get('/daily-collection/dashboard', getDailyCollectionDashboard);
router.post('/daily-collection/record', recordDailyCollection);

// Drilldown
router.get('/drilldown/:userId', getUserDrilldown);

// Listings
router.patch('/listings/:id', updateListing);

// Storage
router.post('/storage/presigned-url', getPresignedUrl);

// Economics
router.get('/business-advances/economics', getBusinessAdvancesEconomics);

// Landlords
router.patch('/landlords/:id', updateLandlord);

// Assignments
router.post('/assignments/nearby', assignNearbyAgent);

