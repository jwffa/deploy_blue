import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { useAuth } from '../../context/AuthContext';

// Mock react-router-dom's useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

// Mock the AuthContext hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn()
}));

// Mock fetch
global.fetch = vi.fn();

describe('Login Component', () => {
  const mockNavigate = vi.fn();
  const mockHandleLogin = vi.fn();
  
  beforeEach(() => {
    // Setup mocks
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ handleLogin: mockHandleLogin });
    fetch.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
  
    expect(screen.getByRole('heading', { name: 'შესვლა' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ელ. ფოსტა')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('პაროლი')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'შესვლა' })).toBeInTheDocument();
  });
  
  it('updates email and password state on input change', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });
  
  it('shows error message on login failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'არასწორი მომხმარებელი ან პაროლი' })
    });
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    const submitButton = screen.getByRole('button', { name: 'შესვლა' });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('არასწორი მომხმარებელი ან პაროლი')).toBeInTheDocument();
    });
    
    expect(mockHandleLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  it('handles successful login', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ 
        user: { name: 'Test User' },
        token: 'fake-token'
      })
    };
    
    fetch.mockResolvedValueOnce(mockResponse);
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    const submitButton = screen.getByRole('button', { name: 'შესვლა' });
    
    fireEvent.change(emailInput, { target: { value: 'correct@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/login'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ email: 'correct@example.com', password: 'correctpassword' })
        })
      );
    });
    
    expect(mockHandleLogin).toHaveBeenCalledWith('Test User', 'fake-token');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('handles network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    const submitButton = screen.getByRole('button', { name: 'შესვლა' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('დაფიქსირდა შეცდომა, თავიდან სცადეთ.')).toBeInTheDocument();
    });
  });
});

describe('Register Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    fetch.mockReset();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('renders registration form correctly', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    expect(screen.getByText('მომხმარებლის რეგისტრაცია')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('სახელი, გვარი')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ელ. ფოსტა')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('პაროლი')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'რეგისტრაცია' })).toBeInTheDocument();
  });
  
  it('updates form fields on input change', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('სახელი, გვარი');
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    
    fireEvent.change(nameInput, { target: { value: 'გიორგი მაისურაძე' } });
    fireEvent.change(emailInput, { target: { value: 'giorgi@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(nameInput.value).toBe('გიორგი მაისურაძე');
    expect(emailInput.value).toBe('giorgi@example.com');
    expect(passwordInput.value).toBe('password123');
  });
  
  it('handles successful registration', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'რეგისტრაცია წარმატებულია' })
    });
    
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('სახელი, გვარი');
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    const submitButton = screen.getByRole('button', { name: 'რეგისტრაცია' });
    
    fireEvent.change(nameInput, { target: { value: 'გიორგი მაისურაძე' } });
    fireEvent.change(emailInput, { target: { value: 'giorgi@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/register'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ 
            name: 'გიორგი მაისურაძე', 
            email: 'giorgi@example.com', 
            password: 'password123' 
          })
        })
      );
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(screen.getByText('თქვენ წარმატებით დარეგისტრირდით!')).toBeInTheDocument();
    
    // Form should be reset
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });
  
  it('shows error message on registration failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'მომხმარებელი უკვე არსებობს' })
    });
    
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('სახელი, გვარი');
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    const submitButton = screen.getByRole('button', { name: 'რეგისტრაცია' });
    
    fireEvent.change(nameInput, { target: { value: 'გიორგი მაისურაძე' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('მომხმარებელი უკვე არსებობს')).toBeInTheDocument();
    });
    
    expect(mockNavigate).not.toHaveBeenCalled();
    
    // Form should be reset on error too
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });
  
  it('handles network errors during registration', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByPlaceholderText('სახელი, გვარი');
    const emailInput = screen.getByPlaceholderText('ელ. ფოსტა');
    const passwordInput = screen.getByPlaceholderText('პაროლი');
    const submitButton = screen.getByRole('button', { name: 'რეგისტრაცია' });
    
    fireEvent.change(nameInput, { target: { value: 'გიორგი მაისურაძე' } });
    fireEvent.change(emailInput, { target: { value: 'giorgi@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('დაფიქსირდა შეცდომა, თავიდან სცადეთ.')).toBeInTheDocument();
    });
    
    // Form should be reset
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });
});