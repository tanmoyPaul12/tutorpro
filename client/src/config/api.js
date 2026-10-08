// TutorPro Centralized API Configuration
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://tutorpro-api-xql9.onrender.com');

// Intercept relative /api calls in production to automatically route to the Render backend
if (API_BASE) {
  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    if (typeof input === 'string') {
      if (input.startsWith('/api')) {
        input = `${API_BASE}${input}`;
      }
    } else if (input instanceof Request) {
      try {
        const parsed = new URL(input.url);
        if (parsed.pathname.startsWith('/api') && parsed.origin === window.location.origin) {
          input = new Request(`${API_BASE}${parsed.pathname}${parsed.search}`, input);
        }
      } catch {
        // Fallback for unusual Request url patterns
      }
    }
    return originalFetch.call(this, input, init);
  };
}
