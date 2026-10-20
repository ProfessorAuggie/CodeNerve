import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditProfileModal } from '../components/common/EditProfileModal';
import { useUserStore } from '../store/userStore';

describe('EditProfileModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    useUserStore.getState().logoutStudent();
    useUserStore.getState().authenticateAdmin('CodeNerve#26');
  });

  it('allows a student to edit their own profile', async () => {
    // Register and login active student
    const testStudent = useUserStore.getState().registerStudent({
      name: 'Alex Rivera',
      email: 'alex.rivera@lpu.in',
      registrationNumber: '12104921',
      track: 'lpu',
      batch: 'LPU B.Tech CSE (CSE202/205)',
      status: 'online',
      approvalStatus: 'approved',
    });
    useUserStore.getState().loginStudent('12104921');
    const onClose = () => {};

    render(
      <EditProfileModal
        isOpen={true}
        onClose={onClose}
        mode="student-self"
      />
    );

    expect(screen.getByText('Edit Your Profile')).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Alex Rivera');
    fireEvent.change(nameInput, { target: { value: 'Alex R. Rivera' } });

    const batchInput = screen.getByDisplayValue('LPU B.Tech CSE (CSE202/205)');
    fireEvent.change(batchInput, { target: { value: 'LPU B.Tech CSE Honors' } });

    const saveBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const user = useUserStore.getState().user;
      expect(user.name).toBe('Alex R. Rivera');
      expect(user.batch).toBe('LPU B.Tech CSE Honors');

      // Also verifies cohort student roster entry was synced
      const studentInRoster = useUserStore.getState().students.find((s) => s.id === testStudent.id);
      expect(studentInRoster?.name).toBe('Alex R. Rivera');
      expect(studentInRoster?.batch).toBe('LPU B.Tech CSE Honors');
    });
  });

  it('allows admin to edit their own faculty profile', async () => {
    render(
      <EditProfileModal
        isOpen={true}
        onClose={() => {}}
        mode="admin-self"
      />
    );

    expect(screen.getByText('Edit Admin Profile')).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Dr. Auggie');
    fireEvent.change(nameInput, { target: { value: 'Prof. Augustine Rivera' } });

    const saveBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const user = useUserStore.getState().user;
      expect(user.name).toBe('Prof. Augustine Rivera');
    });
  });

  it('allows admin to edit a student profile from the roster', async () => {
    const student = useUserStore.getState().registerStudent({
      name: 'Priya Sharma',
      email: 'priya.sharma@lpu.in',
      registrationNumber: '12104999',
      track: 'lpu',
      batch: 'LPU B.Tech CSE (CSE202/205)',
      status: 'online',
      approvalStatus: 'approved',
    });

    render(
      <EditProfileModal
        isOpen={true}
        onClose={() => {}}
        mode="admin-student"
        student={student}
      />
    );

    expect(screen.getByText(/edit student: priya sharma/i)).toBeInTheDocument();

    const nameInput = screen.getByDisplayValue('Priya Sharma');
    fireEvent.change(nameInput, { target: { value: 'Priya Sharma (Class Rep)' } });

    const saveBtn = screen.getByRole('button', { name: /save profile/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const updated = useUserStore.getState().students.find((s) => s.id === student.id);
      expect(updated?.name).toBe('Priya Sharma (Class Rep)');
    });
  });
});
