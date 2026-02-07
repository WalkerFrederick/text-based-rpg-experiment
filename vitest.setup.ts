import '@testing-library/jest-dom'

// Mock window.matchMedia for responsive hook tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false, // Default to desktop mode in tests
    media: query,
    onchange: null,
    addListener: () => {}, // Deprecated
    removeListener: () => {}, // Deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
})

// Mock window.innerWidth for useWindowWidth hook
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  value: 1200, // Default to desktop width in tests
})

// Mock window.visualViewport for mobile keyboard handling
Object.defineProperty(window, 'visualViewport', {
  writable: true,
  value: {
    height: 800,
    width: 1200,
    offsetTop: 0,
    offsetLeft: 0,
    pageTop: 0,
    pageLeft: 0,
    scale: 1,
    addEventListener: () => {},
    removeEventListener: () => {},
  },
})
