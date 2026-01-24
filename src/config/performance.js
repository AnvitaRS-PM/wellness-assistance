// Performance Configuration
// AGGRESSIVELY disable console logs for maximum performance

// Disable ALL console methods ALWAYS (both dev and production)
console.log = () => {};
console.info = () => {};
console.warn = () => {};
console.error = () => {};
console.debug = () => {};

// Performance monitoring helper (disabled)
export const measurePerformance = (label, fn) => {
  return fn(); // Just run, no logging
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
