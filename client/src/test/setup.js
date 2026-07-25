import '@testing-library/jest-dom';

// jsdom has no ResizeObserver; recharts' ResponsiveContainer needs one.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = global.ResizeObserver || ResizeObserverMock;

// jsdom reports 0x0 layout size, which recharts' ResponsiveContainer refuses
// to render into. Give every element a fixed, non-zero size for tests.
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 400,
});
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 300,
});
HTMLElement.prototype.getBoundingClientRect = () => ({
  width: 400,
  height: 300,
  top: 0,
  left: 0,
  bottom: 300,
  right: 400,
  x: 0,
  y: 0,
  toJSON() {},
});
