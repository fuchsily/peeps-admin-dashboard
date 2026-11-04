const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("node:path");
const fs = require("node:fs");

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const email = process.argv[2];

if (!keyPath || !email) {
  console.error(
    "Usage: set FIREBASE_SERVICE_ACCOUNT_PATH and pass the admin email",
  );
  process.exit(1);
}

const resolvedPath = path.resolve(keyPath);

if (!fs.existsSync(resolvedPath)) {
  console.error(`Service account file not found: ${resolvedPath}`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

async function main() {
  const auth = getAuth();

  const user = await auth.getUserByEmail(email);

  await auth.setCustomUserClaims(user.uid, {
    ...user.customClaims,
    admin: true,
  });

  console.log(`Admin role assigned to UID: ${user.uid}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
