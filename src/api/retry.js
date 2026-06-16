// This class is not currently in use.

/**
 * Determines if a request error is retryable.
 * We only retry transient/network/server issues.
 */
function isRetryableError(error) {
  if (!error.response) {
    // Network error or timeout (Render sleep case)
    return true;
  }

  const status = error.response.status;

  // Retry only server-side or gateway issues
  return [502, 503, 504].includes(status);
}

/**
 * Sleep utility for delay between retries
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Executes a request with retry logic (exponential backoff)
 *
 * @param {Function} requestFn - async function that returns a promise
 * @param {Object} options
 * @param {number} options.retries - max retry attempts
 * @param {number} options.baseDelay - initial delay in ms
 */
export async function withRetry(requestFn, options = {}) {
  const { retries = 3, baseDelay = 1000 } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      const canRetry = isRetryableError(error);

      // If not retryable or last attempt → throw error
      if (!canRetry || attempt === retries) {
        throw error;
      }

      // Exponential backoff: 1s → 2s → 4s → 8s
      const delay = baseDelay * Math.pow(2, attempt);

      await sleep(delay);
    }
  }

  throw lastError;
}