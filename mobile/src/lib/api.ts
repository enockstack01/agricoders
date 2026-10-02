import axios, { AxiosError } from 'axios';
import { API_URL } from '../env';

// generous timeout: plan generation (AI narrative + charts) can take 30–90s, and a
// sleeping host can take a while to wake on the first request
export const api = axios.create({ baseURL: API_URL, timeout: 120000 });

type TokenGetter = () => Promise<string | null>;
let tokenGetter: TokenGetter | null = null;

/** Wired once from a component that has access to Clerk's `useAuth().getToken`. */
export function setTokenGetter(fn: TokenGetter | null) {
  tokenGetter = fn;
}

/** Current Clerk session token, for requests made outside axios (document downloads). */
export async function getAuthToken(): Promise<string | null> {
  try {
    return tokenGetter ? await tokenGetter() : null;
  } catch {
    return null;
  }
}

api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export class ApiError extends Error {
  status?: number;
  /** true when the server was never reached (offline, wrong address, firewall, timeout) */
  network: boolean;
  /** parsed JSON body of an error response (e.g. 402 { required, balance }) */
  data?: any;
  constructor(message: string, status?: number, network = false, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.network = network;
    this.data = data;
  }
}

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    if (!error.response) {
      const timedOut = error.code === 'ECONNABORTED' || /timeout/i.test(error.message);
      return Promise.reject(
        new ApiError(timedOut ? 'The server took too long to respond' : 'Could not reach the server', undefined, true),
      );
    }
    const data = error.response.data as any;
    // Agriplan's API reports problems as { error } (some routes add { message })
    const message = data?.message || data?.error || error.response.statusText || error.message || 'Request failed';
    return Promise.reject(new ApiError(message, error.response.status, false, data));
  },
);
