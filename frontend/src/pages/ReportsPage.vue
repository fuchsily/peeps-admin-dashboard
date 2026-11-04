<template>
  <q-page class="reports-page q-pa-lg">
    <div class="page-header">
      <div>
        <div class="peeps-page-title">Reports</div>
        <div class="peeps-page-subtitle">Review and manage reported users and events.</div>
      </div>

      <div class="header-actions">
        <q-chip color="warning" text-color="dark" icon="pending_actions" class="pending-chip">
          {{ pendingCount }} pending
        </q-chip>

        <q-btn
          outline
          no-caps
          color="primary"
          icon="refresh"
          label="Refresh"
          :loading="loading"
          @click="loadReports"
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-card flat bordered class="content-card">
          <q-card-section class="filters-section">
            <div class="section-heading">
              <div>
                <div class="section-title">All reports</div>
                <div class="section-description">
                  {{ filteredReports.length }} of {{ reports.length }} reports
                </div>
              </div>
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-12 col-md-5">
                <q-input v-model="search" outlined dense clearable placeholder="Search reports...">
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <div class="col-6 col-md-3">
                <q-select
                  v-model="typeFilter"
                  outlined
                  dense
                  :options="['All', 'User', 'Event']"
                  label="Type"
                />
              </div>

              <div class="col-6 col-md-4">
                <q-select
                  v-model="statusFilter"
                  outlined
                  dense
                  :options="statusOptions"
                  option-label="label"
                  option-value="value"
                  emit-value
                  map-options
                  label="Status"
                />
              </div>
            </div>
          </q-card-section>

          <q-banner v-if="errorMessage" class="bg-red-1 text-negative q-ma-md rounded-borders">
            {{ errorMessage }}
            <template #action>
              <q-btn flat color="negative" label="Retry" @click="loadReports" />
            </template>
          </q-banner>

          <q-table
            v-model:pagination="pagination"
            flat
            :loading="loading"
            :rows="filteredReports"
            :columns="columns"
            row-key="id"
            :rows-per-page-options="[5, 10, 20]"
            class="reports-table"
            @row-click="(_, row) => selectReport(row)"
          >
            <template #body-cell-targetName="props">
              <q-td :props="props">
                <div class="report-target">
                  <q-avatar
                    size="34px"
                    :class="props.row.type === 'User' ? 'avatar-user' : 'avatar-event'"
                  >
                    <q-icon :name="props.row.type === 'User' ? 'person' : 'event'" size="18px" />
                  </q-avatar>

                  <div>
                    <div class="target-name">
                      {{ props.row.targetName }}
                    </div>
                    <div class="target-id">
                      {{ props.row.id }}
                    </div>
                  </div>
                </div>
              </q-td>
            </template>

            <template #body-cell-type="props">
              <q-td :props="props">
                <span class="type-label">
                  {{ props.row.type }}
                </span>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  dense
                  :color="statusColor(props.row.status)"
                  :text-color="statusTextColor(props.row.status)"
                  class="status-chip"
                >
                  <span class="status-dot" :class="`status-${props.row.status}`" />
                  {{ statusLabel(props.row.status) }}
                </q-chip>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  :icon="selectedReportId === props.row.id ? 'chevron_left' : 'chevron_right'"
                  color="primary"
                  @click.stop="selectReport(props.row)"
                >
                  <q-tooltip>View details</q-tooltip>
                </q-btn>
              </q-td>
            </template>

            <template #no-data>
              <div class="empty-state">
                <q-icon name="inbox" size="44px" color="grey-5" />
                <div class="empty-title">No reports found</div>
                <div class="empty-description">Try adjusting your search or filters.</div>
              </div>
            </template>
          </q-table>
        </q-card>
      </div>
    </div>

    <q-dialog
      :model-value="selectedReport !== null"
      position="right"
      seamless
      full-height
      @update:model-value="
        (value) => {
          if (!value) selectedReportId = null;
        }
      "
    >
      <ReportDetailPanel
        :report="selectedReport"
        class="report-overlay"
        @close="selectedReportId = null"
        @action="requestAction"
      />
    </q-dialog>

    <q-dialog v-model="confirmOpen" persistent>
      <q-card class="confirm-card">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar
            :color="pendingAction === 'block' ? 'red-1' : 'purple-1'"
            :text-color="pendingAction === 'block' ? 'negative' : 'primary'"
            size="46px"
          >
            <q-icon
              :name="pendingAction === 'block' ? 'warning_amber' : 'check_circle_outline'"
              size="25px"
            />
          </q-avatar>

          <div class="text-h6 q-ml-md">Confirm action</div>
        </q-card-section>

        <q-card-section>
          <p class="confirmation-message">
            {{ confirmationMessage }}
          </p>

          <div class="prototype-note">
            <q-icon name="info_outline" size="18px" />
            <span>
              Prototype mode: only local test data will change. No real users are blocked and no
              refunds are issued.
            </span>
          </div>

          <q-banner v-if="actionError" class="bg-red-1 text-negative rounded-borders q-mt-md">
            {{ actionError }}
          </q-banner>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md q-pt-none">
          <q-btn flat no-caps label="Cancel" @click="closeConfirmation" />
          <q-btn
            unelevated
            no-caps
            label="Confirm action"
            :color="pendingAction === 'block' ? 'negative' : 'primary'"
            @click="confirmAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';

import ReportDetailPanel from '../components/reports/ReportDetailPanel.vue';
import { getReports } from '../services/reportService';
import type { Report, ReportStatus } from '../types/reports';

const reports = ref<Report[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const selectedReportId = ref<string | null>(null);

const selectedReport = computed(
  () => reports.value.find((report) => report.id === selectedReportId.value) ?? null,
);

const search = ref('');
const typeFilter = ref('All');
const statusFilter = ref('All');

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

const pendingCount = computed(
  () => reports.value.filter((report) => report.status === 'pending').length,
);

const statusOptions = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'pending' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Closed as groundless', value: 'closed_groundless' },
];

const columns: QTableColumn<Report>[] = [
  {
    name: 'targetName',
    label: 'Reported',
    field: 'targetName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
    sortable: true,
  },
  {
    name: 'reporterName',
    label: 'Reported by',
    field: 'reporterName',
    align: 'left',
  },
  {
    name: 'reason',
    label: 'Reason',
    field: 'reason',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
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

const filteredReports = computed(() => {
  const query = search.value.trim().toLowerCase();

  return reports.value.filter((report) => {
    const matchesType = typeFilter.value === 'All' || report.type === typeFilter.value;

    const matchesStatus = statusFilter.value === 'All' || report.status === statusFilter.value;

    const matchesSearch = [report.id, report.targetName, report.reporterName, report.reason].some(
      (value) => value.toLowerCase().includes(query),
    );

    return matchesType && matchesStatus && matchesSearch;
  });
});

async function loadReports() {
  loading.value = true;
  errorMessage.value = '';

  try {
    reports.value = await getReports();
  } catch (error) {
    console.error('Failed to load reports:', error);
    errorMessage.value = 'Could not load reports. Please try again.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  void loadReports();
});

function selectReport(report: Report) {
  selectedReportId.value = report.id;
}

function statusColor(status: ReportStatus): string {
  if (status === 'pending') return 'orange-1';
  if (status === 'blocked') return 'red-1';
  return 'grey-3';
}

function statusTextColor(status: ReportStatus): string {
  if (status === 'pending') return 'orange-10';
  if (status === 'blocked') return 'negative';
  return 'grey-8';
}

function statusLabel(status: ReportStatus): string {
  if (status === 'pending') return 'Pending';
  if (status === 'blocked') return 'Blocked';
  return 'Closed';
}

function closeConfirmation() {
  confirmOpen.value = false;
  pendingAction.value = null;
  actionError.value = '';
}

const confirmOpen = ref(false);
const pendingAction = ref<'block' | 'close' | null>(null);
const actionError = ref('');

const confirmationMessage = computed(() => {
  const report = selectedReport.value;

  if (!report) return '';

  if (pendingAction.value === 'close') {
    return `Close report ${report.id} as groundless?`;
  }

  if (report.type === 'User') {
    return `Block user ${report.targetName}?`;
  }

  return report.hasPaidTickets
    ? `Cancel ${report.targetName}? In production, this could also trigger ticket refunds.`
    : `Cancel event ${report.targetName}?`;
});

function requestAction(action: 'block' | 'close') {
  if (selectedReport.value?.status !== 'pending') return;

  pendingAction.value = action;
  actionError.value = '';
  confirmOpen.value = true;
}

function confirmAction() {
  const report = selectedReport.value;
  const action = pendingAction.value;

  if (!report || !action) return;

  report.status = action === 'block' ? 'blocked' : 'closed_groundless';

  closeConfirmation();
  selectedReportId.value = null;
}
</script>

<style scoped lang="scss">
@use '../css/variables' as *;

.reports-page {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.pending-chip {
  font-weight: 700;
}

.content-card,
.confirm-card {
  background: $surface;
  border-radius: $radius-lg;
  border-color: $border-color;
  overflow: hidden;
  box-shadow: $shadow-card;
}

.confirm-card {
  width: 460px;
  max-width: 90vw;
}

.filters-section {
  padding: $spacing-lg;
  border-bottom: 1px solid $border-color;
}

.section-title {
  font-size: $font-size-md;
  font-weight: 800;
}

.section-description {
  color: $text-muted;
  font-size: $font-size-xs;
  margin-top: $spacing-xs;
}

.reports-table {
  :deep(.q-table tbody tr) {
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: $primary-light;
    }
  }

  :deep(.q-table tbody td) {
    padding-top: $spacing-md;
    padding-bottom: $spacing-md;
  }
}

.report-target {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.avatar-user {
  background: $primary-light;
  color: $primary-dark;
}

.avatar-event {
  background: $background;
  color: $text-secondary;
}

.target-name {
  font-size: $font-size-sm;
  font-weight: 700;
  color: $text-primary;
}

.target-id {
  font-size: $font-size-xs;
  color: $text-muted;
}

.type-label {
  font-size: $font-size-xs;
  color: $text-secondary;
  font-weight: 600;
}

.status-chip {
  font-size: $font-size-xs;
  font-weight: 700;
}

.status-dot {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 6px;

  &.status-pending {
    background: $warning;
  }

  &.status-blocked {
    background: $negative;
  }

  &.status-closed_groundless {
    background: $text-muted;
  }
}

.empty-state {
  padding: $spacing-xl;
  text-align: center;
  width: 100%;
}

.empty-title {
  font-weight: 700;
  margin-top: $spacing-sm;
}

.empty-description {
  font-size: $font-size-sm;
  color: $text-muted;
}

.confirmation-message {
  font-size: $font-size-sm;
  line-height: 1.6;
}

.prototype-note {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  background: $background;
  color: $text-secondary;
  padding: $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-xs;
}

.report-overlay {
  width: 480px;
  max-width: 100vw;
  height: 100%;
  max-height: 100%;
  border-radius: 0;
  overflow: hidden;
}
</style>
