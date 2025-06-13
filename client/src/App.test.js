import { render, screen } from '@testing-library/react';
import App from './App';

// axios는 ESM 모듈이므로 테스트에서 가볍게 모킹한다
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  })
}), { virtual: true });

beforeAll(() => {
  global.window.matchMedia = global.window.matchMedia || (() => ({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }));
});

test('renders home page hero title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /AI 채팅 플랫폼/i });
  expect(heading).toBeInTheDocument();
});
