
const originalWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('React Router Future Flag Warning')) {
      return; // Ignore this specific warning
    }
    originalWarn(msg, ...args);
  });
});

afterAll(() => {
  console.warn.mockRestore();
});
