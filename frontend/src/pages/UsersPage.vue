<template>
  <q-page class="users-page q-pa-lg">
    <div class="page-header">
      <div>
        <div class="peeps-page-title">User Management</div>
        <div class="peeps-page-subtitle">Manage platform users and account restrictions.</div>
      </div>

      <q-chip color="primary" text-color="white" icon="groups"> Demo environment </q-chip>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-4">
        <q-card flat bordered class="stat-card">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-value">{{ stat.value }}</div>
            </div>

            <q-avatar size="44px" :class="stat.avatarClass">
              <q-icon :name="stat.icon" size="23px" />
            </q-avatar>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="content-card q-mb-lg">
      <q-card-section>
        <q-input
          v-model="search"
          outlined
          dense
          clearable
          placeholder="Search users by name, email or ID..."
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <!-- Active Users -->
    <q-card flat bordered class="content-card q-mb-lg">
      <q-card-section class="table-heading">
        <div>
          <div class="section-title">
            <q-icon name="people_outline" color="primary" />
            Active Users
          </div>
          <div class="section-subtitle">Search and manage active accounts</div>
        </div>

        <q-chip dense color="green-1" text-color="green-9">
          {{ activeUsers.length }} active
        </q-chip>
      </q-card-section>

      <q-separator />

      <q-table
        flat
        :rows="activeUsers"
        :columns="activeColumns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
        :rows-per-page-options="[5, 10, 20]"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="user-cell">
              <q-avatar size="38px" class="user-avatar">
                {{ initials(props.row.name) }}
              </q-avatar>

              <div>
                <div class="user-name">{{ props.row.name }}</div>
                <div class="user-email">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              outline
              dense
              no-caps
              color="negative"
              icon="block"
              label="Block"
              @click="openAction(props.row)"
            />
          </q-td>
        </template>

        <template #no-data>
          <div class="empty-state">No active users found.</div>
        </template>
      </q-table>
    </q-card>

    <!-- Blocked Users -->
    <q-card flat bordered class="content-card">
      <q-card-section class="table-heading">
        <div>
          <div class="section-title">
            <q-icon name="block" color="negative" />
            Blocked Users
          </div>
          <div class="section-subtitle">Accounts currently restricted from the platform</div>
        </div>

        <q-chip dense color="red-1" text-color="negative">
          {{ blockedUsers.length }} blocked
        </q-chip>
      </q-card-section>

      <q-separator />

      <q-table
        flat
        :rows="blockedUsers"
        :columns="blockedColumns"
        row-key="id"
        :pagination="{ rowsPerPage: 5 }"
        :rows-per-page-options="[5, 10, 20]"
      >
        <template #body-cell-name="props">
          <q-td :props="props">
            <div class="user-cell">
              <q-avatar size="38px" class="blocked-avatar">
                {{ initials(props.row.name) }}
              </q-avatar>

              <div>
                <div class="user-name">{{ props.row.name }}</div>
                <div class="user-email">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-blockReason="props">
          <q-td :props="props">
            <div class="reason-cell">
              <q-icon name="info_outline" color="grey-6" size="17px" />
              <span>
                {{ props.row.blockReason || 'Not specified' }}
              </span>
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              outline
              dense
              no-caps
              color="positive"
              icon="lock_open"
              label="Unblock"
              @click="openAction(props.row)"
            />
          </q-td>
        </template>

        <template #no-data>
          <div class="empty-state">No blocked users found.</div>
        </template>
      </q-table>
    </q-card>

    <!-- Confirmation dialog -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card class="confirm-card">
        <q-card-section class="dialog-header">
          <q-avatar
            :color="isUnblocking ? 'green-1' : 'red-1'"
            :text-color="isUnblocking ? 'positive' : 'negative'"
            size="48px"
          >
            <q-icon :name="isUnblocking ? 'lock_open' : 'block'" size="25px" />
          </q-avatar>

          <div>
            <div class="text-h6 text-weight-bold">
              {{ isUnblocking ? 'Unblock user' : 'Block user' }}
            </div>
            <div class="text-caption text-grey-7">
              {{ selectedUser?.name }}
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <p class="dialog-description">
            Are you sure you want to
            {{ isUnblocking ? 'unblock' : 'block' }}
            this account?
          </p>

          <div v-if="isUnblocking && selectedUser?.blockReason" class="previous-reason q-mb-md">
            <div class="field-label">CURRENT BLOCK REASON</div>
            {{ selectedUser.blockReason }}
          </div>

          <q-input
            v-model="reason"
            outlined
            type="textarea"
            autogrow
            :label="isUnblocking ? 'Reason for unblocking *' : 'Block reason *'"
            hint="A reason is required for this action."
            :rules="[(value) => Boolean(value.trim()) || 'Reason is required']"
          />

          <q-banner class="demo-note q-mt-md">
            <template #avatar>
              <q-icon name="info_outline" color="primary" />
            </template>
            Demo only. No real user account will be changed.
          </q-banner>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancel" @click="closeDialog" />

          <q-btn
            unelevated
            no-caps
            :color="isUnblocking ? 'positive' : 'negative'"
            :label="isUnblocking ? 'Confirm unblock' : 'Confirm block'"
            :disable="!reason.trim()"
            @click="confirmAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';

import { useDemoUsers } from '../composables/useDemoUsers';
import type { DemoUser } from '../types/users';

const $q = useQuasar();
const { users, blockUser, unblockUser } = useDemoUsers();

const search = ref('');
const dialogOpen = ref(false);
const selectedUser = ref<DemoUser | null>(null);
const reason = ref('');

const activeCount = computed(() => users.value.filter((user) => user.status === 'Active').length);
const blockedCount = computed(() => users.value.filter((user) => user.status === 'Blocked').length);

const stats = computed(() => [
  {
    label: 'Total Users',
    value: users.value.length,
    icon: 'groups',
    avatarClass: 'avatar-primary',
  },
  {
    label: 'Active Users',
    value: activeCount.value,
    icon: 'check_circle_outline',
    avatarClass: 'avatar-success',
  },
  {
    label: 'Blocked Users',
    value: blockedCount.value,
    icon: 'block',
    avatarClass: 'avatar-danger',
  },
]);

// Search across both tables
const searchedUsers = computed(() => {
  const query = search.value?.trim().toLowerCase() || '';

  return users.value.filter((user) =>
    [user.name, user.email, user.id].some((value) => value.toLowerCase().includes(query)),
  );
});

const activeUsers = computed(() => searchedUsers.value.filter((user) => user.status === 'Active'));

const blockedUsers = computed(() =>
  searchedUsers.value.filter((user) => user.status === 'Blocked'),
);

const activeColumns: QTableColumn<DemoUser>[] = [
  {
    name: 'name',
    label: 'User',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'joinedAt',
    label: 'Joined',
    field: 'joinedAt',
    align: 'left',
    sortable: true,
  },
  {
    name: 'id',
    label: 'User ID',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: '',
    field: 'id',
    align: 'right',
  },
];

const blockedColumns: QTableColumn<DemoUser>[] = [
  {
    name: 'name',
    label: 'User',
    field: 'name',
    align: 'left',
  },
  {
    name: 'blockedAt',
    label: 'Blocked on',
    field: (row) => row.blockedAt ?? '',
    align: 'left',
    sortable: true,
  },
  {
    name: 'blockReason',
    label: 'Reason for blocking',
    field: (row) => row.blockReason ?? '',
    align: 'left',
  },
  {
    name: 'actions',
    label: '',
    field: 'id',
    align: 'right',
  },
];

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// Dialog actions
const isUnblocking = computed(() => selectedUser.value?.status === 'Blocked');

function openAction(user: DemoUser) {
  selectedUser.value = user;
  reason.value = '';
  dialogOpen.value = true;
}

function closeDialog() {
  dialogOpen.value = false;
  selectedUser.value = null;
  reason.value = '';
}

function confirmAction() {
  const user = selectedUser.value;
  const actionReason = reason.value.trim();

  if (!user || !actionReason) return;

  const wasBlocked = user.status === 'Blocked';

  const success = wasBlocked ? unblockUser(user.id) : blockUser(user.id, actionReason);

  if (!success) {
    $q.notify({
      type: 'negative',
      message: 'Could not update user status.',
    });
    return;
  }

  closeDialog();

  $q.notify({
    type: 'positive',
    message: wasBlocked
      ? `${user.name} has been unblocked (demo).`
      : `${user.name} has been blocked (demo).`,
  });
}
</script>

<style scoped lang="scss">
@use '../css/variables' as *;

.users-page {
  background: $background;
  min-height: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.stat-card,
.content-card,
.confirm-card {
  background: $surface;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  margin-top: $spacing-sm;
}

.avatar-primary,
.user-avatar {
  background: $primary-light;
  color: $primary-dark;
}

.avatar-success {
  background: #e8f5e9;
  color: $positive;
}

.avatar-danger,
.blocked-avatar {
  background: #ffebee;
  color: $negative;
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-md;
  padding: $spacing-lg;
}

.section-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-md;
  font-weight: 800;
}

.section-subtitle {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.user-name {
  font-size: $font-size-sm;
  font-weight: 700;
}

.user-email,
.user-id {
  font-size: $font-size-xs;
  color: $text-muted;
}

.reason-cell {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  max-width: 350px;
  white-space: normal;
  font-size: $font-size-xs;
  color: $text-secondary;
}

.empty-state {
  width: 100%;
  text-align: center;
  padding: $spacing-xl;
  color: $text-muted;
}

.confirm-card {
  width: 480px;
  max-width: 90vw;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.dialog-description {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.field-label {
  font-size: $font-size-xs;
  font-weight: 700;
  color: $text-muted;
  margin-bottom: $spacing-sm;
}

.previous-reason {
  padding: $spacing-md;
  border-radius: $radius-md;
  background: $background;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.demo-note {
  background: $primary-light;
  border-radius: $radius-md;
  font-size: $font-size-xs;
  color: $text-secondary;
}
</style>
