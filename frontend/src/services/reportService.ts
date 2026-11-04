import { collection, getDocs, type DocumentData } from 'firebase/firestore';

import { db } from './firebase';
import type { Report, ReportStatus } from '../types/reports';

function parseStatus(value: unknown): ReportStatus {
  if (value === 'blocked') return 'blocked';
  if (value === 'closed_groundless') return 'closed_groundless';
  return 'pending';
}

function getDate(value: unknown): string {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof value.toDate === 'function'
  ) {
    return (value.toDate() as Date).toISOString().slice(0, 10);
  }

  return typeof value === 'string' ? value.slice(0, 10) : '';
}

function mapUserReport(id: string, data: DocumentData): Report {
  return {
    id,
    type: 'User',
    targetId: data.reportedId ?? '',
    targetName: data.reportedName ?? 'Unknown user',
    reporterId: data.reporterId ?? '',
    reporterName: data.reporterName ?? 'Unknown',
    reporterEmail: data.reporterEmail ?? '',
    reason: data.reason ?? 'No reason provided',
    details: data.details ?? '',
    screenshotUrl: data.screenshotUrl,
    status: parseStatus(data.status),
    createdAt: getDate(data.createdAt),
  };
}

function mapEventReport(id: string, data: DocumentData): Report {
  return {
    id,
    type: 'Event',
    targetId: data.eventId ?? '',
    targetName: data.eventTitle ?? 'Unknown event',
    reporterId: data.reporterId ?? '',
    reporterName: data.reporterName ?? 'Unknown',
    reporterEmail: data.reporterEmail ?? '',
    reason: data.reason ?? 'No reason provided',
    details: data.details ?? '',
    screenshotUrl: data.screenshotUrl,
    status: parseStatus(data.status),
    createdAt: getDate(data.createdAt),
    eventType: data.eventCollection === 'businessEvents' ? 'Business Event' : 'User Event',
    hostName: data.hostName ?? '',
    eventImageUrl: data.eventImageUrl,
    hasPaidTickets: data.hasPaidTickets ?? false,
  };
}

export async function getReports(): Promise<Report[]> {
  const [userSnapshot, eventSnapshot] = await Promise.all([
    getDocs(collection(db, 'userReports')),
    getDocs(collection(db, 'eventReports')),
  ]);

  const userReports = userSnapshot.docs.map((doc) => mapUserReport(doc.id, doc.data()));

  const eventReports = eventSnapshot.docs.map((doc) => mapEventReport(doc.id, doc.data()));

  return [...userReports, ...eventReports].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
