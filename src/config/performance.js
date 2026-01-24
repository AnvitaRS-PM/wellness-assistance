// Performance Configuration
// COMPLETELY DISABLED - All optimizations removed for maximum speed

// DO NOTHING - Let React Native handle everything naturally
// All previous "optimizations" were causing slowness

export const measurePerformance = (label, fn) => {
  return fn(); // Just run, no overhead
};

export const debounce = (func, wait) => {
  // DISABLED - Just return the function as-is
  return func;
};

export const throttle = (func, limit) => {
  // DISABLED - Just return the function as-is
  return func;
};

export default {
  measurePerformance,
  debounce,
  throttle,
};
