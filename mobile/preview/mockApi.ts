/*
 * Development preview only: answers the Planner API calls with sample data so every screen can be
 * viewed without a server or a login. Nothing here ships in a production or release build.
 */
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { buildDefaultFormData } from '../src/shared/defaults';
import type { UserProfileDefaults } from '../src/shared/types';

const profile: UserProfileDefaults = {
  currency: 'RWF', location: 'Kigali, Rwanda', companyType: 'Private Limited Company', industry: 'Agribusiness',
  authorTitle: 'Founder & CEO', citRate: 0.3, rssbRate: 0.05, healthInsuranceRate: 0.075, maternityRate: 0.003,
  discountRate: 0.12, loanRate: 0.14, loanTermYears: 5,
};

const ago = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

function plan(id: string, company: string, product: string, focus: string, location: string, days: number) {
  const base: any = buildDefaultFormData(profile) as any;
  base.companyInfo = { ...base.companyInfo, companyName: company, productName: product, companyFocus: focus, location, authorName: 'Enock Nshimiyimana', currency: 'RWF' };
  return { ...base, _id: id, userId: 'user_preview_1', createdAt: ago(days), updatedAt: ago(days) };
}

const submissions = [
  plan('p1', 'Green Valley Poultry', 'Layer egg production', 'Poultry', 'Kigali, Rwanda', 1),
  plan('p2', 'Kivu Maize Cooperative', 'Maize flour milling', 'Agro processing', 'Rubavu, Rwanda', 6),
  plan('p3', 'Sunrise Dairy', 'Yoghurt and milk', 'Dairy', 'Musanze, Rwanda', 19),
  plan('p4', 'Highland Coffee Estate', 'Specialty coffee export', 'Coffee', 'Huye, Rwanda', 40),
];

const users = [
  { id: 'u1', name: 'Enock Nshimiyimana', email: 'enock@example.com', role: 'super_admin', submissionCount: 4, lastActive: Date.now() - 3600e3, createdAt: Date.now() - 90 * 86400e3, credits: 25 },
  { id: 'u2', name: 'Aline Uwase', email: 'aline.uwase@example.com', role: 'admin', submissionCount: 2, lastActive: Date.now() - 2 * 86400e3, createdAt: Date.now() - 60 * 86400e3, credits: 8 },
  { id: 'u3', name: 'Jean Claude Habimana', email: 'jc.habimana@example.com', role: 'user', submissionCount: 7, lastActive: Date.now() - 9 * 86400e3, createdAt: Date.now() - 45 * 86400e3, credits: 0 },
  { id: 'u4', name: 'Grace Mukamana', email: 'grace@example.com', role: 'user', submissionCount: 0, lastActive: Date.now() - 30 * 86400e3, createdAt: Date.now() - 30 * 86400e3, credits: 15 },
];

const today = new Date();
const dailyCounts: Record<string, number> = {};
[2, 0, 3, 1, 4, 2, 5].forEach((n, i) => {
  const d = new Date(today.getTime() - (6 - i) * 86400000);
  dailyCounts[d.toISOString().slice(0, 10)] = n;
});

const creditRequests = [
  { _id: 'r1', userId: 'u3', status: 'pending', documents: [{ type: 'business-plan', count: 2 }, { type: 'financial-model', count: 1 }], creditsRequested: 15, note: 'For my bank loan application', createdAt: ago(1), user: { name: 'Jean Claude Habimana', email: 'jc.habimana@example.com' } },
  { _id: 'r2', userId: 'u4', status: 'pending', documents: [{ type: 'business-plan', count: 1 }], creditsRequested: 5, createdAt: ago(3), user: { name: 'Grace Mukamana', email: 'grace@example.com' } },
];

const routes: [RegExp, (config: InternalAxiosRequestConfig, match: RegExpMatchArray) => unknown][] = [
  [/^\/profile$/, () => ({ defaults: profile })],
  [/^\/submissions$/, () => submissions],
  [/^\/submissions\/(.+)$/, (_c, m) => submissions.find((s) => s._id === m[1]) ?? submissions[0]],
  [/^\/documents\/meta$/, () => ({ p1: { docx: ago(1), xlsx: ago(1) }, p2: { docx: ago(5) } })],
  [/^\/credits$/, () => ({
    credits: 25,
    transactions: [
      { type: 'purchase', credits: 30, balanceAfter: 30, note: 'Credits assigned by admin', createdAt: ago(14) },
      { type: 'generate', credits: -5, balanceAfter: 25, note: 'Business Plan generation', createdAt: ago(1) },
    ],
  })],
  [/^\/credits\/request$/, () => [{ _id: 'cr1', status: 'approved', documents: [{ type: 'business-plan', count: 2 }], creditsRequested: 10, adminNote: 'Approved', createdAt: ago(14) }]],
  [/^\/notifications$/, () => ({
    notifications: [
      { _id: 'n1', type: 'document_ready', title: 'Business Plan ready', body: 'Your Business Plan for Green Valley Poultry was generated.', read: false, createdAt: ago(1) },
      { _id: 'n2', type: 'credits_approved', title: 'Credit request approved', body: 'Your request for 10 credits has been approved.', read: true, createdAt: ago(14) },
    ],
  })],
  [/^\/admin\/stats$/, () => ({ totalUsers: 48, totalSubmissions: 132, plansThisWeek: 17, activeUsers: 31, admins: 3, dailyCounts })],
  [/^\/admin\/users$/, () => ({ users, total: users.length })],
  [/^\/admin\/submissions$/, () => ({
    submissions: submissions.map((s, i) => ({ _id: s._id, userId: users[i % 4].id, userName: users[i % 4].name, createdAt: s.createdAt, companyInfo: s.companyInfo })),
    total: submissions.length, page: 1, limit: 20,
  })],
  [/^\/admin\/credits\/requests$/, (c) => {
    const status = (c.params as any)?.status ?? 'pending';
    return status === 'pending' || status === 'all' ? creditRequests : [];
  }],
  [/^\/admin\/credits\/assign$/, () => ({ credits: 8, transactions: [{ type: 'purchase', credits: 10, balanceAfter: 10, note: 'Assigned by admin', createdAt: ago(10) }, { type: 'generate', credits: -2, balanceAfter: 8, note: 'Admin credit deduction', createdAt: ago(4) }] })],
];

export function installMockApi(api: AxiosInstance) {
  api.defaults.adapter = async (config) => {
    const url = (config.url ?? '').replace(/\?.*$/, '');
    const method = (config.method ?? 'get').toLowerCase();
    await new Promise((r) => setTimeout(r, 250));
    let data: unknown = { ok: true };
    if (method === 'get') {
      for (const [re, fn] of routes) {
        const m = url.match(re);
        if (m) { data = fn(config, m); break; }
      }
    } else if (method === 'post' && url === '/submissions') {
      data = { id: 'p-new' };
    }
    return { data, status: 200, statusText: 'OK', headers: {}, config } as any;
  };
}
