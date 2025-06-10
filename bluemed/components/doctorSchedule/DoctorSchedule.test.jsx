import { render, screen, waitFor } from '@testing-library/react';
import DoctorSchedule from './DoctorSchedule';
import { vi, beforeEach, afterEach, test, expect } from 'vitest';

beforeEach(() => {
  global.fetch = vi.fn();
  window.alert = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

test('renders loading state initially', () => {
  render(<DoctorSchedule id="123" />);
  expect(screen.getByText((content) => content.includes('იტვირთება განრიგი'))).toBeInTheDocument();
});

test('renders error message if fetch fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
  render(<DoctorSchedule id="123" />);
  await waitFor(() => {
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });
});
