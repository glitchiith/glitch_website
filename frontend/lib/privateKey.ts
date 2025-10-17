import fs from "fs";
import path from "path";
import forge from "node-forge";

const privateKeyPath = path.join(process.cwd(), "secrets", "private.pem");
const privateKeyPem = fs.readFileSync(privateKeyPath, "utf8");

// Parse it using node-forge (or crypto)
export const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
