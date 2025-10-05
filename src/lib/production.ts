// Production environment check
if (typeof window !== 'undefined') {
  // Disable console.log in production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
  }

  // Add performance monitoring
  if (process.env.NODE_ENV === 'production' && 'performance' in window) {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      if (loadTime > 0) {
        console.info(`Page loaded in  ${loadTime}ms`);
      }
    });
  }
}

export {};