import { computed, ref } from 'vue';
import { useDemoUsers } from './useDemoUsers';

export type VerificationStatus = 'Pending' | 'Verified' | 'Declined';

interface DemoVerification {
  id: string;
  userId: string;
  documentType: string;
  submittedAt: string;
  status: VerificationStatus;
}

const verifications = ref<DemoVerification[]>([
  {
    id: 'VER-001',
    userId: 'USR-001',
    documentType: 'National ID',
    submittedAt: '29 Oct 2026',
    status: 'Pending',
  },
  {
    id: 'VER-002',
    userId: 'USR-002',
    documentType: 'Passport',
    submittedAt: '28 Oct 2026',
    status: 'Pending',
  },
  {
    id: 'VER-003',
    userId: 'USR-003',
    documentType: 'National ID',
    submittedAt: '27 Oct 2026',
    status: 'Pending',
  },
  {
    id: 'VER-004',
    userId: 'USR-004',
    documentType: 'Passport',
    submittedAt: '26 Oct 2026',
    status: 'Verified',
  },
]);

export function useDemoVerifications() {
  const { users } = useDemoUsers();

  const requests = computed(() =>
    verifications.value.flatMap((verification) => {
      const user = users.value.find((item) => item.id === verification.userId);

      if (!user) return [];

      return [
        {
          ...verification,
          name: user.name,
          email: user.email,
        },
      ];
    }),
  );

  const pendingCount = computed(
    () => verifications.value.filter((item) => item.status === 'Pending').length,
  );

  function reviewVerification(id: string, status: 'Verified' | 'Declined'): boolean {
    const verification = verifications.value.find((item) => item.id === id);

    if (!verification || verification.status !== 'Pending') {
      return false;
    }

    verification.status = status;
    return true;
  }

  return {
    requests,
    pendingCount,
    reviewVerification,
  };
}
