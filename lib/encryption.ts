const ALG = "aes-256-cbc";
import crypto from "crypto";
import "server-only";

export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);

  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("Encryption key not found");
  }

  const textParts = encrypted.split(":");
  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedData = Buffer.from(textParts.join(":"), "hex");

  let decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), iv);

  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
