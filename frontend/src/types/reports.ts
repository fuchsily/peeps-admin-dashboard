export type ReportType = 'User' | 'Event';

export type ReportStatus = 'pending' | 'blocked' | 'closed_groundless';

export interface Report {
  id: string;
  type: ReportType;
  targetId: string;
  targetName: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reason: string;
  details: string;
  screenshotUrl?: string;
  status: ReportStatus;
  createdAt: string;

  // Event-specific context
  eventType?: 'User Event' | 'Business Event';
  hostName?: string;
  eventImageUrl?: string;
  hasPaidTickets?: boolean;
}
