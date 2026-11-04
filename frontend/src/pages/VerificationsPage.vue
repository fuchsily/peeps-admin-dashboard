<template>
  <q-page class="verification-page q-pa-lg">
    <div class="page-header">
      <div>
        <div class="peeps-page-title">User Verification</div>
        <div class="peeps-page-subtitle">Review identity verification requests.</div>
      </div>

      <q-chip color="warning" text-color="dark" icon="pending_actions">
        {{ pendingCount }} pending
      </q-chip>
    </div>

    <q-card flat bordered class="content-card">
      <q-card-section class="row items-center justify-between">
        <div class="text-subtitle1 text-weight-bold">Verification requests</div>

        <q-select
          v-model="statusFilter"
          dense
          outlined
          :options="['All', 'Pending', 'Verified', 'Declined']"
          class="status-filter"
        />
      </q-card-section>

      <q-table
        flat
        :rows="filteredRequests"
        :columns="columns"
        row-key="id"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template #body-cell-user="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-sm">
              <q-avatar color="primary" text-color="white" size="38px">
                {{ props.row.name.charAt(0) }}
              </q-avatar>
              <div>
                <div class="text-weight-bold">{{ props.row.name }}</div>
                <div class="text-caption text-grey-6">
                  {{ props.row.email }}
                </div>
              </div>
            </div>
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              :color="statusColor(props.row.status)"
              :text-color="statusTextColor(props.row.status)"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              no-caps
              color="primary"
              label="Review"
              icon-right="chevron_right"
              @click="selectedRequest = props.row"
            />
          </q-td>
        </template>

        <template #no-data>
          <div class="full-width text-center text-grey-6 q-pa-xl">
            No verification requests found.
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Right-side details overlay -->
    <q-dialog
      :model-value="selectedRequest !== null"
      position="right"
      seamless
      @update:model-value="closeDetails"
    >
      <q-card v-if="selectedRequest" class="details-panel">
        <q-card-section class="row justify-between items-start">
          <div>
            <div class="text-h6 text-weight-bold">Identity Review</div>
            <div class="text-caption text-grey-6">
              {{ selectedRequest.id }}
            </div>
          </div>
          <q-btn flat round dense icon="close" @click="closeDetails" />
        </q-card-section>

        <q-separator />

        <q-card-section class="details-content">
          <div class="user-summary">
            <q-avatar color="primary" text-color="white" size="52px">
              {{ selectedRequest.name.charAt(0) }}
            </q-avatar>
            <div>
              <div class="text-subtitle1 text-weight-bold">
                {{ selectedRequest.name }}
              </div>
              <div class="text-caption text-grey-7">
                {{ selectedRequest.email }}
              </div>
            </div>
          </div>

          <div class="detail-section">
            <div class="field-label">SUBMITTED INFORMATION</div>
            <div class="info-row">
              <span>Full name</span>
              <strong>{{ selectedRequest.name }}</strong>
            </div>
            <div class="info-row">
              <span>Submitted</span>
              <strong>{{ selectedRequest.submittedAt }}</strong>
            </div>
            <div class="info-row">
              <span>Document type</span>
              <strong>{{ selectedRequest.documentType }}</strong>
            </div>
          </div>

          <div class="detail-section">
            <div class="field-label">IDENTITY DOCUMENT</div>

            <div class="document-placeholder">
              <q-icon name="badge" size="52px" color="grey-5" />
              <div class="text-weight-bold q-mt-sm">Document preview</div>
              <div class="text-caption text-grey-6">Demo placeholder – no real identity data</div>
            </div>
          </div>

          <q-banner class="review-note">
            <template #avatar>
              <q-icon name="info_outline" color="primary" />
            </template>
            In this prototype, decisions are simulated and do not affect real user accounts.
          </q-banner>
        </q-card-section>

        <div class="panel-actions">
          <q-separator />

          <div v-if="selectedRequest.status === 'Pending'" class="action-buttons">
            <q-btn
              outline
              no-caps
              color="negative"
              icon="close"
              label="Decline"
              @click="requestDecision('Declined')"
            />

            <q-btn
              unelevated
              no-caps
              color="positive"
              icon="check"
              label="Accept"
              @click="requestDecision('Verified')"
            />
          </div>

          <div v-else class="processed-message">
            <q-icon name="check_circle" color="positive" size="20px" />
            This request has already been reviewed.
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Confirmation -->
    <q-dialog v-model="confirmOpen" persistent>
      <q-card class="confirm-card">
        <q-card-section>
          <div class="text-h6">Confirm decision</div>
        </q-card-section>

        <q-card-section>
          {{ decision === 'Verified' ? 'Verify' : 'Decline' }}
          the identity request for
          <strong>{{ selectedRequest?.name }}</strong
          >?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Cancel" v-close-popup />
          <q-btn unelevated no-caps color="primary" label="Confirm" @click="confirmDecision" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';

import { useDemoVerifications, type VerificationStatus } from '../composables/useDemoVerifications';

const $q = useQuasar();

const { requests, pendingCount, reviewVerification } = useDemoVerifications();

type VerificationRequest = (typeof requests.value)[number];

const statusFilter = ref('All');
const selectedRequest = ref<VerificationRequest | null>(null);
const confirmOpen = ref(false);
const decision = ref<'Verified' | 'Declined' | null>(null);

const filteredRequests = computed(() =>
  requests.value.filter(
    (request) => statusFilter.value === 'All' || request.status === statusFilter.value,
  ),
);

const columns: QTableColumn<VerificationRequest>[] = [
  {
    name: 'user',
    label: 'User',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'documentType',
    label: 'Document',
    field: 'documentType',
    align: 'left',
  },
  {
    name: 'submittedAt',
    label: 'Submitted',
    field: 'submittedAt',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
  },
  {
    name: 'actions',
    label: '',
    field: 'id',
    align: 'right',
  },
];

function statusColor(status: VerificationStatus): string {
  if (status === 'Pending') return 'orange-1';
  if (status === 'Verified') return 'green-1';
  return 'red-1';
}

function statusTextColor(status: VerificationStatus): string {
  if (status === 'Pending') return 'orange-10';
  if (status === 'Verified') return 'green-9';
  return 'negative';
}

function closeDetails() {
  if (confirmOpen.value) return;

  selectedRequest.value = null;
}

function requestDecision(value: 'Verified' | 'Declined') {
  if (!selectedRequest.value || selectedRequest.value.status !== 'Pending') {
    return;
  }

  decision.value = value;
  confirmOpen.value = true;
}

function confirmDecision() {
  const request = selectedRequest.value;
  const newStatus = decision.value;

  if (!request || !newStatus) return;

  const success = reviewVerification(request.id, newStatus);

  if (!success) {
    $q.notify({
      type: 'negative',
      message: 'Could not update verification status.',
    });
    return;
  }

  // Close both dialogs
  confirmOpen.value = false;
  selectedRequest.value = null;
  decision.value = null;

  $q.notify({
    type: 'positive',
    message:
      newStatus === 'Verified'
        ? `${request.name} has been verified (demo).`
        : `${request.name}'s verification has been declined (demo).`,
  });
}
</script>

<style scoped lang="scss">
@use '../css/variables' as *;

.verification-page {
  background: $background;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  flex-wrap: wrap;
}

.content-card {
  background: $surface;
  border: 1px solid $border-color;
  border-radius: $radius-lg;
  box-shadow: $shadow-card;
}

.status-filter {
  min-width: 160px;
}

.details-panel {
  width: 480px;
  max-width: 100vw;
  height: calc(100dvh - 48px);
  max-height: calc(100dvh - 48px);
  min-height: 0;

  display: flex;
  flex-direction: column;

  border-radius: 0;
  background: $surface;
  overflow: hidden;
}

.details-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.panel-actions {
  flex: 0 0 auto;
  margin-top: auto;
  background: $surface;
  z-index: 1;
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
  color: $text-secondary;
  font-size: $font-size-sm;
}

.user-summary {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $background;
  border-radius: $radius-md;
}

.detail-section {
  margin-top: $spacing-lg;
}

.field-label {
  font-size: $font-size-xs;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: $text-muted;
  margin-bottom: $spacing-sm;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: $spacing-md;
  padding: $spacing-sm 0;
  font-size: $font-size-sm;

  span {
    color: $text-secondary;
  }
}

.document-placeholder {
  padding: $spacing-xl;
  border: 1px dashed $border-color;
  border-radius: $radius-lg;
  background: $background;
  text-align: center;
}

.review-note {
  background: $primary-light;
  border-radius: $radius-md;
  margin-top: $spacing-lg;
  font-size: $font-size-xs;
}

.panel-actions {
  margin-top: auto;
  background: $surface;
}

.confirm-card {
  width: 420px;
  max-width: 90vw;
  border-radius: $radius-lg;
}
</style>
