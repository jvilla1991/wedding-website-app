import { SiteMode } from '../app/core/site-mode';

// IMPORTANT: the deploy workflow (.github/workflows/deploy.yml) patches the
// empty/zero placeholders below in place with sed at build time:
//   apiUrl: ''  -> secrets.API_URL
//   eventId: 0  -> secrets.EVENT_ID
// Never rewrite this file wholesale — only edit individual fields, or the
// sed patterns (and the deployed site) will silently break.
export const environment = {
  production: true,
  apiUrl: '',
  eventId: 0,
  siteMode: 'std' as SiteMode,
};
