<template>
  <q-page class="q-pa-xl">
    <div class="text-h4 text-weight-bold q-mb-xs">Overview</div>
    <div class="text-grey-7 q-mb-xl">Welcome back! Here's what's happening at peeps.</div>

    <div class="row q-col-gutter-md">
      <div v-for="stat in stats" :key="stat.label" class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="stat-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <span class="text-grey-7">{{ stat.label }}</span>
              <q-icon :name="stat.icon" size="24px" color="purple" />
            </div>

            <div class="text-h4 text-weight-bold q-mt-md">
              {{ stat.value }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="q-mt-lg stat-card">
      <q-card-section>
        <div class="text-h6">Needs your attention</div>
        <div class="text-grey-7 q-mb-md">Open requests that require admin action</div>

        <q-list separator>
          <q-item v-for="task in tasks" :key="task.label">
            <q-item-section avatar>
              <q-icon :name="task.icon" color="purple" />
            </q-item-section>
            <q-item-section>{{ task.label }}</q-item-section>
            <q-item-section side>
              <q-badge color="orange" rounded>
                {{ task.count }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
const stats = [
  { label: 'Total Users', value: '2,548', icon: 'people' },
  { label: 'Active Users', value: '1,284', icon: 'trending_up' },
  { label: 'Pending Reports', value: '12', icon: 'flag' },
  { label: 'Pending Approvals', value: '8', icon: 'verified_user' },
];

const tasks = [
  { label: 'User Reports', count: 7, icon: 'person_off' },
  { label: 'Event Reports', count: 5, icon: 'flag' },
  { label: 'Business Verifications', count: 4, icon: 'business' },
  { label: 'Connector Approvals', count: 4, icon: 'event' },
];
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  background: #fff;
}
</style>
