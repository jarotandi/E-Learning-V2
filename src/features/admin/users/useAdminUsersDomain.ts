/**
 * Admin Users domain hook
 * ========================
 * B1.4D-T3 — Users domain extraction
 *
 * Authority: docs/aksa/b1/10-b1.4d-execution-map.md
 *            docs/aksa/b1/12-b1.4d-t3-platform-users.md
 *
 * ## Why a hook and not a route-mounted page
 *
 * The Users data is consumed OUTSIDE the Users tab by at least:
 *
 *   - Lead -> Student conversion (`convertLeadToStudent`)
 *   - Finance approval -> automatic Student creation (`updateFinanceRecordStatus`)
 *   - the contextual "Add" action (`runContextualAdd`)
 *
 * If the state lived only inside an `AdminUsersPage` that mounts for the
 * `/admin/users` route, tab navigation would unmount it and every cross-domain
 * caller would lose its canonical owner. So the hook is invoked by the
 * PERSISTENT `AdminDashboard`, and the page receives the surface as props.
 *
 * ## Inject, do not import
 *
 * `programs`, `notify` and `recordAudit` are injected by the caller so the hook
 * owns users-domain state only. It never imports `AdminDashboard`, and it does
 * not take over finance/audit/toast state.
 *
 * ## No security claim
 *
 * This is demo data management, not authorization. SEC-P1-03 remains OPEN (B2).
 */

import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { USER_ACCOUNTS } from '../../../constants';
import type { UserAccount } from '../../../types';
import { readStorageArray } from '../adminStorage';
import {
  USER_STORAGE_KEY,
  isApprovedStudentRecord,
  userFromStudentRecord,
} from './adminUserRecords';

/* ------------------------------------------------------------------ */
/* Injection contract                                                  */
/* ------------------------------------------------------------------ */

export interface UseAdminUsersDomainOptions {
  /** Program list used to seed/validate the program field. */
  programs: Array<{ title: string }>;
  /** Toast adapter (stays owned by AdminDashboard). */
  notify: (message: string) => void;
  /** Audit adapter (stays owned by AdminDashboard). */
  recordAudit: (module: string, action: string, detail: string) => void;
}

export type UserDirectoryView = 'students' | 'staff';

/* ------------------------------------------------------------------ */
/* Public surface                                                      */
/* ------------------------------------------------------------------ */

export interface UseAdminUsersDomainResult {
  users: UserAccount[];
  editingUser: UserAccount | null;
  setEditingUser: Dispatch<SetStateAction<UserAccount | null>>;
  userDirectoryView: UserDirectoryView;
  setUserDirectoryView: Dispatch<SetStateAction<UserDirectoryView>>;
  roleFilter: string;
  setRoleFilter: Dispatch<SetStateAction<string>>;
  usersSearchTerm: string;
  setUsersSearchTerm: Dispatch<SetStateAction<string>>;
  filteredUsers: UserAccount[];
  persistUsers: (nextUsers: UserAccount[]) => void;
  syncApprovedStudentsToUsers: (baseUsers?: UserAccount[]) => UserAccount[];
  openNewUserForm: (kind: 'student' | 'staff') => void;
  saveUser: (user: UserAccount) => void;
  deleteUser: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* Hook                                                                */
/* ------------------------------------------------------------------ */

export function useAdminUsersDomain({
  programs,
  notify,
  recordAudit,
}: UseAdminUsersDomainOptions): UseAdminUsersDomainResult {
  // Seed fallback is byte-for-byte the legacy default: the `USER_ACCOUNTS`
  // constant augmented with `accountType` (Paid for students, Staff otherwise)
  // and `source: 'Demo Seed'`.
  const [users, setUsers] = useState<UserAccount[]>(() =>
    readStorageArray(
      USER_STORAGE_KEY,
      USER_ACCOUNTS.map((user) => ({
        ...user,
        accountType: user.role === 'Student' ? 'Paid' : 'Staff',
        source: 'Demo Seed',
      })),
    ),
  );
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [userDirectoryView, setUserDirectoryView] =
    useState<UserDirectoryView>('students');
  const [roleFilter, setRoleFilter] = useState('All');
  // The T2 transitional toolbar carried a "Search dashboard..." input that was
  // actually bound to Users filtering only. T3 moves that state here; matching
  // semantics (name + email, case-insensitive) are unchanged.
  const [usersSearchTerm, setUsersSearchTerm] = useState('');

  const persistUsers = (nextUsers: UserAccount[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const syncApprovedStudentsToUsers = (baseUsers: UserAccount[] = users) => {
    const registrations = readStorageArray<any>('theprams_demo_registrations');
    const transactions = readStorageArray<any>('theprams_demo_transactions');
    const systemStudents = [
      ...transactions.filter(isApprovedStudentRecord).map((record) => userFromStudentRecord(record, 'tx')),
      ...registrations.filter(isApprovedStudentRecord).map((record) => userFromStudentRecord(record, 'reg')),
    ];
    const existingIds = new Set(baseUsers.map((user) => user.id));
    const existingEmails = new Set(baseUsers.map((user) => `${user.email}-${user.program}-${user.packageName || ''}`.toLowerCase()));
    const newStudents = systemStudents.filter((student) => {
      const key = `${student.email}-${student.program}-${student.packageName || ''}`.toLowerCase();
      return !existingIds.has(student.id) && !existingEmails.has(key);
    });
    if (!newStudents.length) return baseUsers;
    const nextUsers = [...newStudents, ...baseUsers];
    persistUsers(nextUsers);
    return nextUsers;
  };

  // Mount-time synchronization, matching the legacy `useEffect(..., [])`.
  useEffect(() => {
    syncApprovedStudentsToUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNewUserForm = (kind: 'student' | 'staff') => {
    setEditingUser({
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: kind === 'student' ? 'Student' : 'Support',
      program: kind === 'student' ? (programs[0]?.title || 'SNBT Kedokteran') : 'Admin Panel',
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
      joinedAt: new Date().toISOString().slice(0, 10),
      accountType: kind === 'student' ? 'Free' : 'Staff',
      packageName: kind === 'student' ? 'Manual Input' : 'Staff Account',
      paymentStatus: kind === 'student' ? 'Manual Active' : 'Internal',
      source: kind === 'student' ? 'Add User Siswa' : 'Add User Admin',
    });
  };

  const saveUser = (user: UserAccount) => {
    if (!user.name.trim() || !user.email.trim()) {
      notify('Nama dan email user wajib diisi.');
      return;
    }
    const sanitizedUser: UserAccount = {
      ...user,
      id: user.id || `user-${Date.now()}`,
      name: user.name.trim(),
      email: user.email.trim(),
      avatar: user.avatar.trim() || `https://i.pravatar.cc/150?u=${encodeURIComponent(user.email)}`,
      joinedAt: user.joinedAt || new Date().toISOString().slice(0, 10),
      program: ['Student', 'Tutor'].includes(user.role) ? (user.program?.trim() || programs[0]?.title || 'General') : user.program?.trim(),
      accountType: user.role === 'Student' ? (user.accountType === 'Staff' ? 'Free' : user.accountType || 'Free') : 'Staff',
      packageName: user.packageName?.trim() || (user.role === 'Student' ? 'Manual Input' : 'Staff Account'),
      paymentStatus: user.paymentStatus?.trim() || (user.role === 'Student' ? 'Manual Active' : 'Internal'),
      source: user.source?.trim() || (user.role === 'Student' ? 'Add User Siswa' : 'Add User Admin'),
    };
    const nextUsers = users.some((item) => item.id === sanitizedUser.id)
      ? users.map((item) => item.id === sanitizedUser.id ? sanitizedUser : item)
      : [sanitizedUser, ...users];
    persistUsers(nextUsers);
    setEditingUser(null);
    recordAudit('User & Roles', 'Save User', `${sanitizedUser.name} - ${sanitizedUser.role}`);
    notify('User berhasil disimpan.');
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(usersSearchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(usersSearchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;
      const matchesDirectory = userDirectoryView === 'students'
        ? u.role === 'Student'
        : u.role !== 'Student';
      return matchesSearch && matchesRole && matchesDirectory;
    });
  }, [users, usersSearchTerm, roleFilter, userDirectoryView]);

  const deleteUser = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      persistUsers(users.filter((u) => u.id !== id));
      notify('User berhasil dihapus.');
    }
  };

  return {
    users,
    editingUser,
    setEditingUser,
    userDirectoryView,
    setUserDirectoryView,
    roleFilter,
    setRoleFilter,
    usersSearchTerm,
    setUsersSearchTerm,
    filteredUsers,
    persistUsers,
    syncApprovedStudentsToUsers,
    openNewUserForm,
    saveUser,
    deleteUser,
  };
}
