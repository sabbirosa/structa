import "@testing-library/jest-dom"

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "ResizeObserver", { value: ResizeObserverMock })
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { value: jest.fn(), writable: true })
Object.defineProperty(HTMLElement.prototype, "getAnimations", { value: () => [], writable: true })
Object.defineProperty(window, "matchMedia", { value: jest.fn().mockImplementation(() => ({ matches: false, addEventListener: jest.fn(), removeEventListener: jest.fn() })), writable: true })
Object.defineProperty(globalThis, "structuredClone", { value: <T>(value: T): T => JSON.parse(JSON.stringify(value)), writable: true })
Object.defineProperty(globalThis, "fetch", { value: jest.fn(async (_input: RequestInfo | URL, init?: RequestInit) => ({ ok: true, json: async () => init?.body ? JSON.parse(String(init.body)) : null })), writable: true })
