<template>
  <q-page class="overview-page q-pa-lg">
    <!-- Header -->
    <div class="page-header">
      <div>
        <div class="peeps-page-title">Overview</div>
        <div class="peeps-page-subtitle">Welcome back! Here's what's happening at peeps.</div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="row q-col-gutter-md">
      <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-lg-4">
        <q-card flat bordered class="stat-card">
          <q-card-section class="stat-content">
            <div>
              <div class="stat-label">
                {{ stat.label }}
              </div>

              <div class="stat-value">
                {{ stat.value }}
              </div>
            </div>

            <q-avatar size="48px" :class="stat.avatarClass">
              <q-icon :name="stat.icon" size="24px" />
            </q-avatar>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Pending tasks -->
    <q-card flat bordered class="content-card q-mt-lg">
      <q-card-section class="tasks-header">
        <div>
          <div class="section-title">Needs your attention</div>

          <div class="section-subtitle">Open requests that require admin action</div>
        </div>

        <q-icon name="assignment_late" color="primary" size="26px" />
      </q-card-section>

      <q-separator />

      <q-list class="tasks-list">
        <q-item
          v-for="task in tasks"
          :key="task.label"
          clickable
          v-ripple
          :to="task.route"
          class="task-item"
        >
          <q-item-section avatar>
            <q-avatar size="42px" class="task-avatar">
              <q-icon :name="task.icon" size="22px" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="task-label">
              {{ task.label }}
            </q-item-label>

            <q-item-label caption>
              {{ task.description }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="task-actions">
              <q-badge color="warning" text-color="dark" rounded>
                {{ task.count }}
              </q-badge>

              <q-icon name="chevron_right" size="20px" color="grey-6" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useDemoUsers } from '../composables/useDemoUsers';
import { useDemoVerifications } from '../composables/useDemoVerifications';

import { getReports } from '../services/reportService';
import type { Report } from '../types/reports';

const { users } = useDemoUsers();
const { pendingCount } = useDemoVerifications();

const reports = ref<Report[]>([]);
const reportsLoaded = ref(false);

onMounted(async () => {
  try {
    reports.value = await getReports();
    reportsLoaded.value = true;
  } catch (error) {
    console.error('Failed to load overview reports:', error);
  }
});

const stats = computed(() => [
  {
    label: 'Total Users',
    value: users.value.length,
    icon: 'groups',
    avatarClass: 'avatar-primary',
  },
  {
    label: 'Active Users',
    value: users.value.filter((user) => user.status === 'Active').length,
    icon: 'person_outline',
    avatarClass: 'avatar-success',
  },
  {
    label: 'Blocked Users',
    value: users.value.filter((user) => user.status === 'Blocked').length,
    icon: 'block',
    avatarClass: 'avatar-danger',
  },
]);

const tasks = computed(() => [
  {
    label: 'User Reports',
    description: 'Review reported user accounts',
    count: reportsLoaded.value
      ? reports.value.filter((report) => report.type === 'User' && report.status === 'pending')
          .length
      : '—',
    icon: 'person_off',
    route: '/reports',
  },
  {
    label: 'Event Reports',
    description: 'Review reported events',
    count: reportsLoaded.value
      ? reports.value.filter((report) => report.type === 'Event' && report.status === 'pending')
          .length
      : '—',
    icon: 'flag',
    route: '/reports',
  },
  {
    label: 'User Verifications',
    description: 'Review pending identity requests',
    count: pendingCount.value,
    icon: 'verified_user',
    route: '/verifications',
  },
]);
</script>

<style scoped lang="scss">
@use '../css/variables' as *;

.overview-page {
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
.content-card {
  background: $surface;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.stat-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-lg;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: 600;
}

.stat-value {
  font-size: 32px;
  font-weight: 800;
  color: $text-primary;
  margin-top: $spacing-sm;
}

.avatar-primary {
  background: $primary-light;
  color: $primary-dark;
}

.avatar-success {
  background: #e8f5e9;
  color: $positive;
}

.avatar-danger {
  background: #ffebee;
  color: $negative;
}

.tasks-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
}

.section-title {
  font-size: $font-size-md;
  font-weight: 800;
  color: $text-primary;
}

.section-subtitle {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.tasks-list {
  padding: $spacing-sm;
}

.task-item {
  border-radius: $radius-md;
  padding: $spacing-md;
  min-height: 72px;
  transition: background 0.2s ease;

  &:hover {
    background: $primary-light;
  }
}

.task-avatar {
  background: $primary-light;
  color: $primary-dark;
}

.task-label {
  font-size: $font-size-sm;
  font-weight: 700;
  color: $text-primary;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}
</style>
