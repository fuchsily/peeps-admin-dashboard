<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="bg-white text-dark" bordered>
      <q-toolbar class="q-px-lg" style="height: 64px">
        <q-toolbar-title class="text-weight-medium"> Admin Dashboard </q-toolbar-title>

        <q-btn flat round icon="notifications_none" />
        <q-avatar color="purple-1" text-color="purple-8" size="36px"> A </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above :model-value="true" :width="250" bordered class="bg-white">
      <div class="q-pa-lg text-h5 text-weight-bold">
        <span style="color: #c234ff">peeps</span>
        <span class="text-caption q-ml-sm">Admin</span>
      </div>

      <q-list padding>
        <q-item
          v-for="item in navigation"
          :key="item.path"
          v-ripple
          clickable
          :to="item.path"
          exact
          active-class="nav-active"
          class="q-mx-sm q-mb-xs rounded-borders"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="app-background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
const navigation = [
  { label: 'Overview', icon: 'dashboard', path: '/' },
  { label: 'Reports', icon: 'flag', path: '/reports' },
  { label: 'Verifications', icon: 'verified_user', path: '/verifications' },
  { label: 'Connectors', icon: 'event', path: '/connectors' },
  { label: 'Users & Businesses', icon: 'people', path: '/users' },
  { label: 'Analytics', icon: 'analytics', path: '/analytics' },
  { label: 'Feedback', icon: 'feedback', path: '/feedback' },
];
</script>

<style scoped>
.app-background {
  background: #fbf7ea;
  min-height: 100vh;
}

.nav-active {
  color: #c234ff;
  background: rgba(194, 52, 255, 0.09);
  font-weight: 600;
}
</style>
