import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { useUserStore } from '../store/userStore';

describe('LoginPage Component', () => {
  beforeEach(() => {
    localStorage.clear();
    useUserStore.getState().resetProgress();
    useUserStore.getState().logoutStudent();
  });

  it('renders student sign in tab by default with platform highlights', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Student Sign In')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByText('Unified Academic & DSA Platform')).toBeInTheDocument();
    expect(screen.getByText('Curriculum & DSA Roadmaps')).toBeInTheDocument();
    expect(screen.getByText('Sign In to CodeNerve')).toBeInTheDocument();
    expect(screen.queryByText('Instant Demo Access')).not.toBeInTheDocument();
  });

  it('toggles to registration mode when Create Account is clicked', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const createAccountTab = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountTab);

    expect(screen.getByText('Start Your Coding Journey')).toBeInTheDocument();
    expect(screen.getByText(/create account & start learning/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Sahil Sharma')).toBeInTheDocument();
  });

  it('renders generic login identifier and password fields without track-specific options', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.queryByRole('button', { name: /lpu university/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /global dsa/i })).not.toBeInTheDocument();
    expect(screen.getByText(/registration number, student id, or email/i)).toBeInTheDocument();
  });

  it('allows student login using registered credentials', async () => {
    useUserStore.getState().registerStudent({
      name: 'Sahil Sharma',
      email: 'sahil@lpu.in',
      registrationNumber: '12104921',
      track: 'lpu',
      batch: 'LPU B.Tech CSE',
      approvalStatus: 'approved',
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/12104921/i);
    fireEvent.change(input, { target: { value: '12104921' } });

    const submitBtn = screen.getByRole('button', { name: /sign in to codenerve/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(useUserStore.getState().isStudentAuthenticated).toBe(true);
      expect(useUserStore.getState().user.name).toBe('Sahil Sharma');
    });
  });

  it('shows error message when invalid registration is submitted', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const createAccountTab = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountTab);

    const submitBtn = screen.getByRole('button', { name: /create account & start learning/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
  });

  it('successfully registers a new student with pending approval notification', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const createAccountTab = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountTab);

    const nameInput = screen.getByPlaceholderText('e.g. Sahil Sharma');
    const emailInput = screen.getByPlaceholderText('name@example.com');
    const regInput = screen.getByPlaceholderText(/12110294/);
    const [passwordInput, confirmInput] = screen.getAllByPlaceholderText('••••••••');

    fireEvent.change(nameInput, { target: { value: 'Tanvi Kapoor' } });
    fireEvent.change(emailInput, { target: { value: 'tanvi.k@lpu.in' } });
    fireEvent.change(regInput, { target: { value: '12119933' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password123' } });

    const submitBtn = screen.getByRole('button', { name: /create account & start learning/i });
    const form = submitBtn.closest('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/your account is pending administrator approval/i)).toBeInTheDocument();
      const student = useUserStore.getState().students.find((s) => s.email === 'tanvi.k@lpu.in');
      expect(student).toBeDefined();
      expect(student?.approvalStatus).toBe('pending');
      expect(useUserStore.getState().isStudentAuthenticated).toBe(false);
    });
  });
});
