<template>
  <q-page class="q-pa-xl">
    <div class="text-h4 text-weight-bold">
      {{ pageTitle }}
    </div>

    <div class="text-grey-7 q-mt-sm">This section is coming soon.</div>

    <q-card flat bordered class="q-mt-lg placeholder-card">
      <q-card-section class="text-center q-py-xl">
        <q-icon name="construction" size="64px" color="purple-4" />

        <div class="text-h6 q-mt-md">Under Construction</div>

        <div class="text-grey-7 q-mt-sm">We're working on this feature.</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const pageTitle = computed(() => {
  const path = String(route.path.split('/').pop() || 'Overview');

  return path
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});
</script>

<style scoped>
.placeholder-card {
  border-radius: 12px;
  background: white;
}
</style>
