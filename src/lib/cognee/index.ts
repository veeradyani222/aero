export {
  cogneeAdd,
  cogneeCognify,
  cogneeHealthCheck,
  cogneeRemember,
  cogneeSearch,
  getCogneeDatasetName,
  getCogneeStatus,
  isCogneeConfigured,
} from './cognee-client';

export { formatCogneeRecommendations } from './format-recommendations';
export { buildBrandContextDocument, syncBrandContextToCognee } from './sync-brand-context';

export type {
  CogneeSearchType,
  CogneeSearchRequest,
  CogneeAddRequest,
  CogneeCognifyRequest,
  CogneeSearchResult,
  CogneeSyncPayload,
  CogneeStatus,
} from './types';
