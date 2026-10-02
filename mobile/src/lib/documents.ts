import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { API_URL } from '../env';
import { ApiError, getAuthToken } from './api';

export type DocType = 'business-plan' | 'financial-model';

export const CREDITS_PER_DOC = 5;

const MIME: Record<DocType, string> = {
  'business-plan': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'financial-model': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const UTI: Record<DocType, string> = {
  'business-plan': 'org.openxmlformats.wordprocessingml.document',
  'financial-model': 'org.openxmlformats.spreadsheetml.sheet',
};

export const docLabel = (t: DocType) => (t === 'business-plan' ? 'Business Plan' : 'Financial Model');
export const docExt = (t: DocType) => (t === 'business-plan' ? 'docx' : 'xlsx');

/** Thrown when the account doesn't have enough credits (HTTP 402). */
export class InsufficientCreditsError extends Error {
  required: number;
  balance: number;
  constructor(required: number, balance: number) {
    super('Insufficient credits');
    this.name = 'InsufficientCreditsError';
    this.required = required;
    this.balance = balance;
  }
}

function fileName(companyName: string, type: DocType) {
  const base = (companyName || 'Agriplan').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_') || 'Agriplan';
  return `${base}_${type === 'business-plan' ? 'Business_Plan' : 'Financial_Model'}.${docExt(type)}`;
}

/**
 * Generates (5 credits) or re-downloads a stored copy (free) of a plan's document via the
 * same endpoint the website uses, saves it to the app cache and opens the share sheet so
 * the user can open it in Word/Excel, save it to Files, or send it.
 * Resolves with the credits remaining after a generation (when the server reports it).
 */
export async function getDocument(opts: {
  id: string;
  type: DocType;
  companyName: string;
  stored?: boolean;
}): Promise<{ creditsRemaining?: number }> {
  const { id, type, companyName, stored } = opts;
  const params = new URLSearchParams({ id });
  if (stored) {
    params.set('stored', 'true');
    params.set('name', companyName);
  }
  const token = await getAuthToken();

  let res: Response;
  try {
    res = await fetch(`${API_URL}/generate/${type}?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server', undefined, true);
  }

  if (res.status === 402) {
    const body = await res.json().catch(() => ({}));
    throw new InsufficientCreditsError(body.required ?? CREDITS_PER_DOC, body.balance ?? 0);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || body.message || (stored ? 'Download failed. The document may no longer be available.' : 'Generation failed. Please try again.'), res.status);
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  const file = new File(Paths.cache, fileName(companyName, type));
  if (file.exists) file.delete();
  file.write(bytes);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, { mimeType: MIME[type], UTI: UTI[type], dialogTitle: `${docLabel(type)} — ${companyName}` });
  }

  const remaining = res.headers.get('x-credits-remaining');
  return { creditsRemaining: remaining != null ? parseInt(remaining, 10) || 0 : undefined };
}
