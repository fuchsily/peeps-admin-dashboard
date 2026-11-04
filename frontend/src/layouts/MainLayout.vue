<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="header" bordered>
      <q-toolbar class="q-px-lg toolbar">
        <q-btn v-if="$q.screen.lt.md" flat round icon="menu" @click="drawerOpen = !drawerOpen" />

        <q-space />

        <q-btn flat round icon="notifications_none" color="grey-7">
          <q-tooltip>Notifications</q-tooltip>
        </q-btn>

        <q-separator vertical inset class="q-mx-md" />

        <q-avatar size="36px" class="admin-avatar"> A </q-avatar>

        <q-btn flat round icon="logout" color="grey-7" class="q-ml-sm" @click="logout">
          <q-tooltip>Sign out</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      :width="260"
      :breakpoint="1024"
      bordered
      class="sidebar"
    >
      <div class="brand">
        <img src="../assets/peeps-logo.avif" alt="peeps Logo" class="brand-logo" />
      </div>

      <q-list padding>
        <div class="nav-heading">WORKSPACE</div>

        <q-item
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          clickable
          exact
          class="nav-item"
          active-class="nav-active"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" size="21px" />
          </q-item-section>

          <q-item-section>
            {{ item.label }}
          </q-item-section>
        </q-item>
      </q-list>

      <div class="sidebar-bottom">
        <q-separator />
        <div class="q-pa-lg">
          <div class="text-weight-medium text-grey-9">peeps Admin</div>
          <div class="text-caption text-grey-6">Prototype environment</div>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page-background">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

const $q = useQuasar();
const router = useRouter();

const drawerOpen = ref(false);

const navigation = [
  { label: 'Overview', icon: 'dashboard', path: '/' },
  { label: 'Reports', icon: 'flag', path: '/reports' },
  { label: 'User Verification', icon: 'verified_user', path: '/verifications' },
  { label: 'User Management', icon: 'manage_accounts', path: '/users' },
  { label: 'Connectors', icon: 'event_available', path: '/connectors' },
  { label: 'Analytics', icon: 'insert_chart', path: '/analytics' },
  { label: 'Feedback', icon: 'forum', path: '/feedback' },
];

async function logout() {
  await signOut(auth);
  await router.replace('/login');
}
</script>

<style scoped lang="scss">
@use '../css/variables' as *;

.header {
  background: $surface;
  color: $text-primary;
  border-color: $border-color;
}

.toolbar {
  height: $header-height;
}

.sidebar {
  background: $surface;
  color: $text-secondary;
}

.nav-heading {
  padding: 12px $spacing-lg;
  color: $text-muted;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.nav-item {
  margin: $spacing-xs 12px;
  padding: 10px 14px;
  border-radius: $radius-md;
  min-height: 46px;
  font-size: 13px;
  font-weight: 600;

  :deep(.q-item__section--avatar) {
    min-width: 36px;
  }
}

.nav-active {
  background: $primary-light;
  color: $primary-dark;
}

.admin-avatar {
  background: $primary-light;
  color: $primary-dark;
  font-weight: 800;
}

.page-background {
  background: $background;
  min-height: 100vh;
}

.sidebar-bottom {
  margin-top: $spacing-xl;
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: $spacing-lg $spacing-md $spacing-md;
  text-align: center;
}

.brand-logo {
  display: block;
  width: 165px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
