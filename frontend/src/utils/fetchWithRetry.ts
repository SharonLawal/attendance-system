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
               // Fallback
               response = Object.assign({}, await apiClient({ url, ...options }));
            }
            
            return response.data;
        } catch (error: any) {
            const isClientError = error.response?.status >= 400 && error.response?.status < 500;
            const isLastAttempt = i === retries - 1;

            // Do not retry client errors (like 401 Unauthorized or 400 Bad Request) 
            // since those won't fix themselves with a retry.
            if (isClientError || isLastAttempt) {
                throw error;
            }

            // Exponential backoff
            const delay = Math.min(1000 * 2 ** i, 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}
