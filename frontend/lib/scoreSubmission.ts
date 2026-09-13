import forge from "node-forge";

export const MAX_SCORE = 2_147_483_647;

export type RunSession = {
  runId: string;
  expiresAt: string;
  modulus: string;
  exponent: string;
};

export type SubmissionResult = {
  status: "accepted";
  runId: string;
  score: number;
  bestScore: number;
  newBest: boolean;
};

export type UnityScoreMessage = {
  type: "unity-score-submit";
  score: number;
};

export function isUnityScoreMessage(value: unknown): value is UnityScoreMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Record<string, unknown>;
  return message.type === "unity-score-submit" && isValidScore(message.score);
}

export function isValidScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= MAX_SCORE
  );
}

export function encryptScore(run: RunSession, score: number): string {
  if (!isValidScore(score)) throw new Error("The game sent an invalid score.");

  const modulus = base64Integer(run.modulus);
  const exponent = base64Integer(run.exponent);
  const publicKey = forge.pki.rsa.setPublicKey(modulus, exponent);
  const payload = forge.util.encodeUtf8(
    JSON.stringify({ runId: run.runId, score }),
  );
  const encrypted = publicKey.encrypt(payload, "RSAES-PKCS1-V1_5");

  return forge.util.encode64(encrypted);
}

function base64Integer(value: string): forge.jsbn.BigInteger {
  const hexadecimal = forge.util.bytesToHex(forge.util.decode64(value));
  if (!hexadecimal) throw new Error("The server returned an invalid RSA key.");
  return new forge.jsbn.BigInteger(hexadecimal, 16);
}
