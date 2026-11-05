const fs = require("fs");
const path = require("path");

// Target BOTH paths that the compiler looks for
const devPath = path.join(__dirname, "./src/environments/environment.ts");
const prodPath = path.join(__dirname, "./src/environments/environment.prod.ts");

// Create the production configuration string using Vercel variables
const envConfigFile = `export const environment = {
  production: true,
  backUrl: '${process.env.BACKEND_URL || ""}',
  stripe_public_key: '${process.env.STRIPE_PUBLIC_KEY || ""}'
};
`;

// Make sure the target environments directory exists first
const dir = path.join(__dirname, "./src/environments");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write to BOTH file paths dynamically on the Vercel build machine
fs.writeFileSync(devPath, envConfigFile, "utf8");
fs.writeFileSync(prodPath, envConfigFile, "utf8");

console.log(`Successfully generated both environment files inside Vercel.`);
