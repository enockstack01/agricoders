export type NavItem = { route: string; label: string; icon: string };
export type NavSection = { label?: string; items: NavItem[] };

/**
 * Drawer layout — mirrors the Agriplan website's sidebar sections (AppShell.tsx), with
 * Font Awesome solid icons as in CropManager. Admin tools stay on the website for now.
 */
export const NAV_SECTIONS: NavSection[] = [
  { items: [{ route: 'dashboard', label: 'Dashboard', icon: 'table-cells-large' }] },
  {
    label: 'Planning',
    items: [
      { route: 'plans', label: 'My Business Plans', icon: 'folder-open' },
      { route: 'plan-form', label: 'New Business Plan', icon: 'circle-plus' },
    ],
  },
  {
    label: 'Account',
    items: [
      { route: 'credits', label: 'Credits', icon: 'coins' },
      { route: 'settings', label: 'Profile & Settings', icon: 'gear' },
    ],
  },
];
