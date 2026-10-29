<template>
  <q-card flat bordered class="detail-panel">
    <template v-if="report">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-h6">Report details</div>
          <div class="text-caption text-grey-7">
            {{ report.id }}
          </div>
        </div>
        <q-btn flat round dense icon="close" @click="emit('close')" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-badge :color="statusColor">
          {{ statusLabel }}
        </q-badge>

        <div class="q-mt-lg">
          <div class="field-label">REPORTED {{ report.type.toUpperCase() }}</div>
          <div class="text-subtitle1 text-weight-bold">
            {{ report.targetName }}
          </div>
          <div class="text-caption text-grey-7">ID: {{ report.targetId }}</div>
        </div>

        <div class="q-mt-lg">
          <div class="field-label">REPORTED BY</div>
          <div>{{ report.reporterName }}</div>
          <div class="text-caption text-grey-7">
            {{ report.reporterEmail }}
          </div>
        </div>

        <div class="q-mt-lg">
          <div class="field-label">REASON</div>
          <div class="text-weight-medium">{{ report.reason }}</div>
          <div class="bg-grey-2 rounded-borders q-pa-md q-mt-sm">
            {{ report.details }}
          </div>
        </div>

        <div v-if="report.type === 'Event'" class="q-mt-lg">
          <div class="field-label">EVENT INFORMATION</div>
          <div>Host: {{ report.hostName || 'Unknown' }}</div>
          <div>Type: {{ report.eventType || 'Unknown' }}</div>
          <q-banner
            v-if="report.hasPaidTickets"
            class="bg-orange-1 text-orange-10 q-mt-md rounded-borders"
          >
            <template #avatar>
              <q-icon name="warning_amber" />
            </template>
            This event has paid tickets. Cancelling it may trigger refunds in production.
          </q-banner>
        </div>

        <div v-if="report.screenshotUrl" class="q-mt-lg">
          <div class="field-label">SCREENSHOT</div>
          <a :href="report.screenshotUrl" target="_blank" rel="noopener noreferrer">
            View screenshot
          </a>
        </div>
      </q-card-section>

      <q-space />

      <q-separator />

      <q-card-actions v-if="report.status === 'pending'" align="right" class="q-pa-md">
        <q-btn
          flat
          no-caps
          label="Close as groundless"
          color="grey-8"
          @click="emit('action', 'close')"
        />
        <q-btn
          unelevated
          no-caps
          color="negative"
          :label="report.type === 'User' ? 'Block user' : 'Block & cancel'"
          @click="emit('action', 'block')"
        />
      </q-card-actions>
    </template>

    <q-card-section v-else class="text-center text-grey-6 q-py-xl">
      <q-icon name="description" size="48px" />
      <div class="q-mt-md">Select a report to view its details.</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Report } from '../../types/reports';

const props = defineProps<{
  report: Report | null;
}>();

const emit = defineEmits<{
  close: [];
  action: [action: 'block' | 'close'];
}>();

const statusColor = computed(() => {
  if (props.report?.status === 'pending') return 'orange';
  if (props.report?.status === 'blocked') return 'negative';
  return 'grey-6';
});

const statusLabel = computed(() => {
  switch (props.report?.status) {
    case 'pending':
      return 'Pending';
    case 'blocked':
      return 'Blocked';
    case 'closed_groundless':
      return 'Closed as groundless';
    default:
      return '';
  }
});
</script>

<style scoped>
.detail-panel {
  border-radius: 12px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: #777;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}
</style>
