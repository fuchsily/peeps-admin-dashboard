import { ref, readonly } from 'vue';
import { mockUsers } from '../data/mockUsers';
import type { DemoUser } from '../types/users';

// Shared state: initialized once for all pages
const users = ref<DemoUser[]>(mockUsers.map((user) => ({ ...user })));

function blockUser(userId: string, reason: string): boolean {
  const user = users.value.find((item) => item.id === userId);
  const trimmedReason = reason.trim();

  if (!user || user.status === 'Blocked' || !trimmedReason) {
    return false;
  }

  user.status = 'Blocked';
  user.blockReason = trimmedReason;
  user.blockedAt = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return true;
}

function unblockUser(userId: string): boolean {
  const user = users.value.find((item) => item.id === userId);

  if (!user || user.status !== 'Blocked') {
    return false;
  }

  user.status = 'Active';
  delete user.blockReason;
  delete user.blockedAt;

  return true;
}

export function useDemoUsers() {
  return {
    users: readonly(users),
    blockUser,
    unblockUser,
  };
}
