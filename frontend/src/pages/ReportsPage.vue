<template>
  <q-page class="reports-page q-pa-lg">
    <div class="text-h4 text-weight-bold">Reports</div>
    <div class="text-grey-7 q-mb-lg">Review and manage reported users and events.</div>

    <div class="row q-col-gutter-md">
      <!-- Report list -->
      <div :class="selectedReport ? 'col-12 col-lg-7' : 'col-12'">
        <q-card flat bordered class="content-card">
          <q-card-section class="row q-col-gutter-sm">
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
          </q-card-section>

          <q-table
            flat
            :rows="filteredReports"
            :columns="columns"
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            :rows-per-page-options="[5, 10, 20]"
            @row-click="(_, row) => selectReport(row)"
          >
            <template #body-cell-targetName="props">
              <q-td :props="props">
                <div class="text-weight-medium">
                  {{ props.row.targetName }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ props.row.id }}
                </div>
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="statusColor(props.row.status)">
                  {{ statusLabel(props.row.status) }}
                </q-badge>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  dense
                  icon="chevron_right"
                  color="primary"
                  @click.stop="selectReport(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <!-- Detail panel -->
      <div v-if="selectedReport" class="col-12 col-lg-5">
        <ReportDetailPanel
          :report="selectedReport"
          @close="selectedReportId = null"
          @action="requestAction"
        />
      </div>
    </div>

    <!-- Confirmation dialog -->
    <q-dialog v-model="confirmOpen">
      <q-card style="width: 450px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Confirm action</div>
        </q-card-section>

        <q-card-section>
          <p>{{ confirmationMessage }}</p>
          <div class="text-caption text-grey-7">
            This is a prototype. Only local test data will change.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            label="Confirm"
            :color="pendingAction === 'block' ? 'negative' : 'primary'"
            @click="confirmAction"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QTableColumn } from 'quasar';

import ReportDetailPanel from '../components/reports/ReportDetailPanel.vue';
import { mockReports } from '../data/mockReports';
import type { Report, ReportStatus } from '../types/reports';

const reports = ref<Report[]>(mockReports.map((report) => ({ ...report })));

const selectedReportId = ref<string | null>(null);

const selectedReport = computed(
  () => reports.value.find((r) => r.id === selectedReportId.value) ?? null,
);

const search = ref('');
const typeFilter = ref('All');
const statusFilter = ref('All');

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
  const query = (search.value || '').trim().toLowerCase();

  return reports.value.filter((report) => {
    const matchesType = typeFilter.value === 'All' || report.type === typeFilter.value;

    const matchesStatus = statusFilter.value === 'All' || report.status === statusFilter.value;

    const matchesSearch = [report.id, report.targetName, report.reporterName, report.reason].some(
      (value) => value.toLowerCase().includes(query),
    );

    return matchesType && matchesStatus && matchesSearch;
  });
});

function selectReport(report: Report) {
  selectedReportId.value = report.id;
}

function statusColor(status: ReportStatus): string {
  if (status === 'pending') return 'orange';
  if (status === 'blocked') return 'negative';
  return 'grey-6';
}

function statusLabel(status: ReportStatus): string {
  if (status === 'pending') return 'Pending';
  if (status === 'blocked') return 'Blocked';
  return 'Closed';
}

const confirmOpen = ref(false);
const pendingAction = ref<'block' | 'close' | null>(null);

const confirmationMessage = computed(() => {
  if (!selectedReport.value) return '';

  if (pendingAction.value === 'close') {
    return `Close report ${selectedReport.value.id} as groundless?`;
  }

  if (selectedReport.value.type === 'User') {
    return `Block user ${selectedReport.value.targetName}?`;
  }

  return selectedReport.value.hasPaidTickets
    ? `Cancel ${selectedReport.value.targetName}? In production, this action would also trigger ticket refunds.`
    : `Cancel event ${selectedReport.value.targetName}?`;
});

function requestAction(action: 'block' | 'close') {
  if (selectedReport.value?.status !== 'pending') return;

  pendingAction.value = action;
  confirmOpen.value = true;
}

function confirmAction() {
  const report = selectedReport.value;

  if (!report || !pendingAction.value || report.status !== 'pending') {
    confirmOpen.value = false;
    pendingAction.value = null;
    return;
  }

  report.status = pendingAction.value === 'block' ? 'blocked' : 'closed_groundless';

  confirmOpen.value = false;
  pendingAction.value = null;
}
</script>

<style scoped>
.reports-page {
  background: #fbf7ea;
}

.content-card {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.q-table tbody tr) {
  cursor: pointer;
}

:deep(.q-table tbody tr:hover) {
  background: #f8edff;
}
</style>
