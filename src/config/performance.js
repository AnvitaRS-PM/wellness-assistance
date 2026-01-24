// Performance Configuration
// Disable console logs in production for better performance

if (!__DEV__) {
  // Disable all console methods in production
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};
  console.debug = () => {};
}

// Performance monitoring helper
export const measurePerformance = (label, fn) => {
  if (__DEV__) {
    const start = Date.now();
    const result = fn();
    const end = Date.now();
    console.log(`⏱️ ${label}: ${end - start}ms`);
    return result;
  }
  return fn();
};

// Debounce helper for expensive operations
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle helper for scroll/touch events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  measurePerformance,
  debounce,
  throttle,
};
