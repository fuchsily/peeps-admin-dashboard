<template>
  <q-card flat bordered class="detail-panel">
    <template v-if="report">
      <q-card-section class="panel-header">
        <div class="row items-start justify-between no-wrap">
          <div>
            <div class="panel-title">Report details</div>
            <div class="panel-id">{{ report.id }}</div>
          </div>

          <q-btn
            flat
            round
            dense
            icon="close"
            color="grey-7"
            aria-label="Close details"
            @click="emit('close')"
          />
        </div>

        <q-chip
          dense
          :color="statusColor"
          :text-color="statusTextColor"
          class="status-chip q-mt-md"
        >
          <q-icon :name="statusIcon" size="14px" class="q-mr-xs" />
          {{ statusLabel }}
        </q-chip>
      </q-card-section>

      <q-separator />

      <q-card-section class="panel-content">
        <div class="entity-card">
          <q-avatar
            size="44px"
            :class="report.type === 'User' ? 'entity-avatar-user' : 'entity-avatar-event'"
          >
            <q-icon :name="report.type === 'User' ? 'person' : 'event'" size="24px" />
          </q-avatar>

          <div class="entity-details">
            <div class="field-label">REPORTED {{ report.type.toUpperCase() }}</div>
            <div class="entity-name">
              {{ report.targetName }}
            </div>
            <div class="entity-id">ID: {{ report.targetId }}</div>
          </div>
        </div>

        <div class="detail-section">
          <div class="field-label">REPORTED BY</div>
          <div class="field-value">
            {{ report.reporterName }}
          </div>
          <div class="field-secondary">
            {{ report.reporterEmail || 'No email available' }}
          </div>
        </div>

        <q-separator class="section-divider" />

        <div class="detail-section">
          <div class="field-label">REPORT REASON</div>
          <div class="reason-title">
            <q-icon name="report_problem" color="warning" size="20px" />
            {{ report.reason }}
          </div>

          <div class="report-description">
            {{ report.details || 'No additional details provided.' }}
          </div>
        </div>

        <template v-if="report.type === 'Event'">
          <q-separator class="section-divider" />

          <div class="detail-section">
            <div class="field-label">EVENT INFORMATION</div>

            <div class="info-row">
              <span>Host</span>
              <strong>{{ report.hostName || 'Unknown' }}</strong>
            </div>

            <div class="info-row">
              <span>Event type</span>
              <strong>{{ report.eventType || 'Unknown' }}</strong>
            </div>
          </div>

          <q-banner v-if="report.hasPaidTickets" class="ticket-warning">
            <template #avatar>
              <q-icon name="warning_amber" color="warning" size="23px" />
            </template>

            <div class="warning-title">Paid tickets</div>
            <div class="warning-description">
              Cancelling this event may require refunds in production. No refunds are triggered in
              this prototype.
            </div>
          </q-banner>
        </template>

        <div v-if="report.screenshotUrl" class="detail-section q-mt-lg">
          <div class="field-label">ATTACHMENT</div>
          <a
            :href="report.screenshotUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="attachment-link"
          >
            <q-icon name="attachment" size="18px" />
            View screenshot
            <q-icon name="open_in_new" size="16px" />
          </a>
        </div>
      </q-card-section>

      <div class="panel-actions">
        <q-separator />

        <div v-if="report.status === 'pending'" class="action-buttons">
          <q-btn
            outline
            no-caps
            color="primary"
            label="Close as groundless"
            :disable="loading"
            @click="emit('action', 'close')"
          />

          <q-btn
            unelevated
            no-caps
            color="negative"
            :label="report.type === 'User' ? 'Block user' : 'Block & cancel'"
            :loading="loading"
            :disable="loading"
            @click="emit('action', 'block')"
          />
        </div>

        <div v-else class="processed-message">
          <q-icon name="check_circle" color="positive" size="20px" />
          This report has already been processed.
        </div>
      </div>
    </template>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Report } from '../../types/reports';

const props = withDefaults(
  defineProps<{
    report: Report | null;
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  close: [];
  action: [action: 'block' | 'close'];
}>();

const statusColor = computed(() => {
  if (props.report?.status === 'pending') return 'orange-1';
  if (props.report?.status === 'blocked') return 'red-1';
  return 'grey-3';
});

const statusTextColor = computed(() => {
  if (props.report?.status === 'pending') return 'orange-10';
  if (props.report?.status === 'blocked') return 'negative';
  return 'grey-8';
});

const statusIcon = computed(() => {
  if (props.report?.status === 'pending') return 'schedule';
  if (props.report?.status === 'blocked') return 'block';
  return 'check_circle';
});

const statusLabel = computed(() => {
  switch (props.report?.status) {
    case 'pending':
      return 'Pending review';
    case 'blocked':
      return 'Blocked';
    case 'closed_groundless':
      return 'Closed as groundless';
    default:
      return '';
  }
});
</script>

<style scoped lang="scss">
@use '../../css/variables' as *;

.detail-panel {
  width: 480px;
  max-width: 100vw;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: $surface;
  border-radius: 0;
  overflow: hidden;
}

.panel-header {
  flex: 0 0 auto;
}

.panel-content {
  flex: 1 1 0;
  min-height: 0;
  padding: $spacing-lg;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.panel-actions {
  flex: 0 0 auto;
  margin-top: auto;
  background: $surface;
  z-index: 1;
}

.panel-title {
  font-size: $font-size-lg;
  font-weight: 800;
  color: $text-primary;
}

.panel-id {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
}

.status-chip {
  font-size: $font-size-xs;
  font-weight: 700;
}

.entity-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  background: $background;
  border-radius: $radius-md;
  padding: $spacing-md;
}

.entity-avatar-user {
  background: $primary-light;
  color: $primary-dark;
}

.entity-avatar-event {
  background: $surface;
  color: $primary-dark;
}

.entity-details {
  min-width: 0;
}

.entity-name {
  font-size: $font-size-md;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.entity-id {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $spacing-xs;
  overflow-wrap: anywhere;
}

.detail-section {
  margin-top: $spacing-lg;
}

.field-label {
  font-size: $font-size-xs;
  font-weight: 700;
  color: $text-muted;
  letter-spacing: 0.6px;
  margin-bottom: $spacing-sm;
}

.field-value {
  font-size: $font-size-sm;
  font-weight: 700;
}

.field-secondary {
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-top: $spacing-xs;
  overflow-wrap: anywhere;
}

.section-divider {
  margin-top: $spacing-lg;
  background: $border-color;
}

.reason-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-sm;
  font-weight: 700;
}

.report-description {
  background: $background;
  padding: $spacing-md;
  border-radius: $radius-md;
  margin-top: $spacing-md;
  color: $text-secondary;
  font-size: $font-size-sm;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: $spacing-md;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;

  span {
    color: $text-secondary;
  }

  strong {
    color: $text-primary;
    text-align: right;
  }
}

.ticket-warning {
  margin-top: $spacing-lg;
  border-radius: $radius-md;
  background: $background;
  border: 1px solid $warning;
}

.warning-title {
  font-size: $font-size-sm;
  font-weight: 800;
}

.warning-description {
  color: $text-secondary;
  font-size: $font-size-xs;
  margin-top: $spacing-xs;
  line-height: 1.6;
}

.attachment-link {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  color: $primary-dark;
  text-decoration: none;
  font-size: $font-size-sm;
  font-weight: 700;

  &:hover {
    text-decoration: underline;
  }
}

.action-buttons {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md;

  .q-btn {
    flex: 1;
    min-width: 0;
    border-radius: $radius-md;
  }
}

.processed-message {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg;
  font-size: $font-size-sm;
  color: $text-secondary;
}
</style>
