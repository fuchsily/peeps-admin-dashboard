import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";

initializeApp();

const db = getFirestore();

type ReportType = "User" | "Event";
type ReportAction = "block" | "close";

interface ProcessReportRequest {
  reportId: string;
  reportType: ReportType;
  action: ReportAction;
}

export const processReport = onCall(
  {
    region: "europe-west3",
    maxInstances: 3,
  },
  async (request) => {
    // 1. Authentication
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    // 2. Admin authorization
    if (request.auth.token.admin !== true) {
      throw new HttpsError("permission-denied", "Admin access required.");
    }

    // 3. Validate input
    const data = request.data as Partial<ProcessReportRequest> | null;

    if (
      !data ||
      typeof data.reportId !== "string" ||
      !/^[a-zA-Z0-9_-]{1,128}$/.test(data.reportId) ||
      (data.reportType !== "User" && data.reportType !== "Event") ||
      (data.action !== "block" && data.action !== "close")
    ) {
      throw new HttpsError("invalid-argument", "Invalid report action.");
    }

    const { reportId, reportType, action } = data;

    const collectionName =
      reportType === "User" ? "userReports" : "eventReports";

    const reportRef = db.collection(collectionName).doc(reportId);
    const auditRef = db.collection("adminAuditLog").doc();

    // 4. Transaction: status update + audit entry
    return db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(reportRef);

      if (!snapshot.exists) {
        throw new HttpsError("not-found", "Report not found.");
      }

      const report = snapshot.data();

      // Already processed -> don't process again
      if (report?.status !== "pending") {
        return {
          success: true,
          alreadyProcessed: true,
          status: report?.status ?? "unknown",
        };
      }

      const newStatus = action === "close" ? "closed_groundless" : "blocked";

      const actionName =
        action === "close"
          ? "close_report"
          : reportType === "User"
            ? "block_user_report"
            : "block_event_report";

      transaction.update(reportRef, {
        status: newStatus,
        processedAt: FieldValue.serverTimestamp(),
        processedBy: request.auth!.uid,
      });

      transaction.create(auditRef, {
        actor: request.auth!.uid,
        action: actionName,
        reportType,
        reportId,
        targetId:
          reportType === "User"
            ? (report?.reportedId ?? null)
            : (report?.eventId ?? null),
        createdAt: FieldValue.serverTimestamp(),
        simulation: true,
      });

      return {
        success: true,
        alreadyProcessed: false,
        status: newStatus,
      };
    });
  },
);
