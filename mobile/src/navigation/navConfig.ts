import type { NavRole } from '../lib/useResource';

/** roles: who sees the item (everyone when omitted). The server checks the role again on every call. */
export type NavItem = { route: string; label: string; icon: string; roles?: NavRole[] };
export type NavSection = { label?: string; items: NavItem[] };

/**
 * Drawer layout, the same sections as the Agriplan website's sidebar (AppShell.tsx), with
 * Font Awesome solid icons. The Administration section is only shown to admins.
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
    label: 'Administration',
    items: [
      { route: 'admin', label: 'Admin Panel', icon: 'chart-column', roles: ['admin', 'super_admin'] },
      { route: 'user-management', label: 'User Management', icon: 'users', roles: ['super_admin'] },
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
