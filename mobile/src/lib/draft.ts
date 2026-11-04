import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PlanInput } from './useResource';

/*
 * Plan wizard drafts. A business plan takes ten steps, so the form is saved on the phone as you type
 * and can be continued later, the way mail and notes apps keep drafts. One draft per plan being
 * edited, and one for a new plan. The company logo is left out of a draft when it is very large,
 * because Android cannot read very big values back from AsyncStorage.
 */

export type Draft = { data: PlanInput; step: number; savedAt: number };

const key = (editId?: string) => `planner.draft.${editId ?? 'new'}`;
const MAX_CHARS = 1_500_000;

export async function loadDraft(editId?: string): Promise<Draft | null> {
  try {
    const raw = await AsyncStorage.getItem(key(editId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    return parsed?.data && typeof parsed.step === 'number' ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveDraft(editId: string | undefined, data: PlanInput, step: number): Promise<boolean> {
  try {
    let draft: Draft = { data, step, savedAt: Date.now() };
    let raw = JSON.stringify(draft);
    if (raw.length > MAX_CHARS && data.companyInfo?.companyLogo) {
      draft = { ...draft, data: { ...data, companyInfo: { ...data.companyInfo, companyLogo: '' } } };
      raw = JSON.stringify(draft);
    }
    if (raw.length > MAX_CHARS) return false;
    await AsyncStorage.setItem(key(editId), raw);
    return true;
  } catch {
    return false;
  }
}

export async function clearDraft(editId?: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key(editId));
  } catch {
    // nothing to clear
  }
}
