// Polyfill for crypto.getRandomValues
// This is needed for the uuid library to work on platforms that don't support crypto.getRandomValues

// Check if crypto.getRandomValues is not available
if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
  // Create a simple polyfill that uses Math.random
  // Note: This is not cryptographically secure, but it's sufficient for generating UUIDs for our app
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
    },
  });
}

export {}; 