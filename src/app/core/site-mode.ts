/**
 * Ported from the source's SITE_MODE script:
 *   'std'  = save-the-date only
 *   'full' = complete site (RSVP, schedule, Villa Fund, FAQs)
 * The value is set per-environment (environment.siteMode) and stamped onto
 * <html data-mode="..."> at bootstrap; the global CSS hides elements whose
 * data-only attribute does not match the active mode.
 */
export type SiteMode = 'std' | 'full';
