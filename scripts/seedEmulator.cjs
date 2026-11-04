const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

const projectId = "peeps-admin-dashboard";

process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

initializeApp({ projectId });

const auth = getAuth();
const db = getFirestore();

const adminEmail = "admin@peeps-test.local";
const adminPassword = "LocalDemo-ChangeMe-2026!";

const date = (value) => Timestamp.fromDate(new Date(value));

const userReports = [
  {
    id: "UR-001",
    reportedId: "user-101",
    reportedName: "Max Weber",
    reportedUsername: "maxw",
    reportedEmail: "max@example.com",
    reportedAccountType: "User",
    reporterId: "user-201",
    reporterName: "Sarah Klein",
    reporterUsername: "sarahk",
    reporterEmail: "sarah@example.com",
    reason: "Harassment",
    details: "Repeated unwanted messages.",
    status: "pending",
    createdAt: date("2026-10-26T10:00:00Z"),
  },
  {
    id: "UR-002",
    reportedId: "user-102",
    reportedName: "Alex Fischer",
    reportedAccountType: "User",
    reporterName: "Tom Müller",
    reporterEmail: "tom@example.com",
    reason: "Spam",
    details: "Multiple unsolicited messages.",
    status: "closed_groundless",
    createdAt: date("2026-10-24T12:00:00Z"),
  },
  {
    id: "UR-003",
    reportedId: "user-103",
    reportedName: "Chris Hoffmann",
    reportedAccountType: "User",
    reporterName: "Mia Schneider",
    reporterEmail: "mia@example.com",
    reason: "Fake profile",
    details: "Possible impersonation.",
    status: "blocked",
    createdAt: date("2026-10-22T09:00:00Z"),
  },
  {
    id: "UR-004",
    reportedId: "business-101",
    reportedName: "Social Corner",
    reportedAccountType: "Business",
    reporterName: "Laura Becker",
    reporterEmail: "laura@example.com",
    reason: "Misleading information",
    details: "Business information appears inaccurate.",
    status: "pending",
    createdAt: date("2026-10-21T14:00:00Z"),
  },
  {
    id: "UR-005",
    reportedId: "user-104",
    reportedName: "Daniel Braun",
    reportedAccountType: "User",
    reporterName: "Anna Schmidt",
    reporterEmail: "anna@example.com",
    reason: "Inappropriate behavior",
    details: "Repeated inappropriate comments at events.",
    status: "pending",
    createdAt: date("2026-10-20T11:00:00Z"),
  },
  {
    id: "UR-006",
    reportedId: "user-105",
    reportedName: "Lisa Wolf",
    reportedAccountType: "User",
    reporterName: "Nina Roth",
    reporterEmail: "nina@example.com",
    reason: "Spam",
    details: "Unsolicited advertising in messages.",
    status: "closed_groundless",
    createdAt: date("2026-10-19T16:00:00Z"),
  },
  {
    id: "UR-007",
    reportedId: "business-102",
    reportedName: "Event Garden",
    reportedAccountType: "Business",
    reporterName: "Ben Richter",
    reporterEmail: "ben@example.com",
    reason: "Suspicious account",
    details: "Possible misuse of the business account.",
    status: "pending",
    createdAt: date("2026-10-18T13:00:00Z"),
  },
  {
    id: "UR-008",
    reportedId: "user-106",
    reportedName: "Tim Wagner",
    reportedAccountType: "User",
    reporterName: "Julia Sommer",
    reporterEmail: "julia@example.com",
    reason: "Harassment",
    details: "Multiple reports of unwanted contact.",
    status: "blocked",
    createdAt: date("2026-10-17T08:00:00Z"),
  },
];

const eventReports = [
  {
    id: "ER-001",
    eventId: "event-101",
    eventTitle: "Paint & Connect",
    eventCollection: "businessEvents",
    hostId: "business-201",
    hostName: "Studio Bloom",
    reporterId: "user-202",
    reporterName: "Lisa Bauer",
    reporterEmail: "lisa@example.com",
    reason: "Misleading content",
    details: "Advertised activities do not match.",
    hasPaidTickets: true,
    status: "pending",
    createdAt: date("2026-10-25T10:00:00Z"),
  },
  {
    id: "ER-002",
    eventId: "event-102",
    eventTitle: "Social Night",
    eventCollection: "userEvents",
    hostName: "Laura Becker",
    reporterName: "Anna Schmidt",
    reporterEmail: "anna@example.com",
    reason: "Inappropriate content",
    details: "Reported inappropriate event description.",
    hasPaidTickets: false,
    status: "pending",
    createdAt: date("2026-10-23T10:00:00Z"),
  },
  {
    id: "ER-003",
    eventId: "event-103",
    eventTitle: "Creative Workshop",
    eventCollection: "businessEvents",
    hostName: "Creative Studio",
    reporterName: "Sarah Klein",
    reporterEmail: "sarah@example.com",
    reason: "Incorrect pricing",
    details: "Ticket pricing information was unclear.",
    hasPaidTickets: true,
    status: "blocked",
    createdAt: date("2026-10-20T10:00:00Z"),
  },
  {
    id: "ER-004",
    eventId: "event-104",
    eventTitle: "Sunday Walk",
    eventCollection: "userEvents",
    hostName: "Tom Müller",
    reporterName: "Mia Schneider",
    reporterEmail: "mia@example.com",
    reason: "Spam",
    details: "Possible promotional event.",
    hasPaidTickets: false,
    status: "closed_groundless",
    createdAt: date("2026-10-18T10:00:00Z"),
  },
  {
    id: "ER-005",
    eventId: "event-105",
    eventTitle: "Afterwork Meetup",
    eventCollection: "userEvents",
    hostName: "Chris Hoffmann",
    reporterName: "Nina Roth",
    reporterEmail: "nina@example.com",
    reason: "Misleading description",
    details: "Meeting point was not as advertised.",
    hasPaidTickets: false,
    status: "pending",
    createdAt: date("2026-10-16T10:00:00Z"),
  },
];

async function seed() {
  let adminUser;

  try {
    adminUser = await auth.getUserByEmail(adminEmail);
    console.log("Local admin already exists.");
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error;

    adminUser = await auth.createUser({
      email: adminEmail,
      password: adminPassword,
      emailVerified: true,
    });

    console.log("Local admin created.");
  }

  await auth.setCustomUserClaims(adminUser.uid, {
    ...adminUser.customClaims,
    admin: true,
  });

  const batch = db.batch();

  for (const { id, ...data } of userReports) {
    batch.set(db.collection("userReports").doc(id), data);
  }

  for (const { id, ...data } of eventReports) {
    batch.set(db.collection("eventReports").doc(id), data);
  }

  await batch.commit();

  console.log("Seed completed.");
  console.log(`Admin email: ${adminEmail}`);
  console.log("Reports: 8 users, 5 events");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
