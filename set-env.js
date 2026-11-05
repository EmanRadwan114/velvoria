const fs = require("fs");
const path = require("path");

// Target the production environment file path
const targetPath = path.join(
  __dirname,
  "./src/environments/environment.prod.ts",
);

// Format the file contents using Vercel's environment variables
const envConfigFile = `export const environment = {
  production: true,
  backUrl: '${process.env.BACKEND_URL || ""}',
  stripe_public_key: '${process.env.STRIPE_PUBLIC_KEY || ""}'
};
`;

// Write the file so the Angular compiler can find it
fs.writeFileSync(targetPath, envConfigFile, "utf8");
console.log(`Production environment.prod.ts file generated dynamically.`);
