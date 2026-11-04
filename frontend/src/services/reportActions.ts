import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';

import { firebaseApp } from './firebase';
import type { Report, ReportStatus } from '../types/reports';

const functions = getFunctions(firebaseApp, 'europe-west3');

// Use local Firebase Functions Emulator during development
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}

interface ProcessReportResponse {
  success: boolean;
  alreadyProcessed: boolean;
  status: ReportStatus;
}

const processReport = httpsCallable<
  {
    reportId: string;
    reportType: 'User' | 'Event';
    action: 'block' | 'close';
  },
  ProcessReportResponse
>(functions, 'processReport');

export async function executeReportAction(
  report: Report,
  action: 'block' | 'close',
): Promise<ProcessReportResponse> {
  const result = await processReport({
    reportId: report.id,
    reportType: report.type,
    action,
  });

  return result.data;
}
