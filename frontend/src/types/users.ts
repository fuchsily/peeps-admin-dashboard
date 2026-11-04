export type UserStatus = 'Active' | 'Blocked';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  status: UserStatus;
  blockReason?: string;
  blockedAt?: string;
}
