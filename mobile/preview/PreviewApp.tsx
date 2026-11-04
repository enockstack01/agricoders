/*
 * Development preview only (see metro.config.js): installs the mock API, then renders the real app.
 */
import { api } from '../src/lib/api';
import { installMockApi } from './mockApi';

installMockApi(api);

export { default } from '../src/App';
