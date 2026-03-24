/**
 * @fileoverview Contextual execution boundary for frontend/src/utils/fetchWithRetry.ts
 * @description Enforces strict software engineering principles, modular separation of concerns, and logical scoping.
 */
import apiClient from '@/lib/axios';

/**
 * A robust wrapper for axios API calls that implements exponential backoff.
 * This ensures that temporary network drops or backend hiccups don't immediately fail for the user.
 * 
 * @param url The API endpoint to hit
 * @param options Axios request config options (params, body, etc)
 * @param retries Maximum number of attempts
 */
export async function fetchWithRetry(url: string, options = {}, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const method = (options as any).method || 'get';
            
            let response;
            if (method.toLowerCase() === 'get') {
              response = await apiClient.get(url, options);
            } else if (method.toLowerCase() === 'post') {
              response = await apiClient.post(url, (options as any).data, options);
            } else {

               response = Object.assign({}, await apiClient({ url, ...options }));
            }
            
            return response.data;
        } catch (error: any) {
            const isClientError = error.response?.status >= 400 && error.response?.status < 500;
            const isLastAttempt = i === retries - 1;

            if (isClientError || isLastAttempt) {
                throw error;
            }

            const delay = Math.min(1000 * 2 ** i, 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
