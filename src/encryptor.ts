import crypto from "crypto";

const ALGORITHM = "aes-256-ctr";

type Encrypt = (buffer: Buffer) => Buffer;
type Decrypt = (encrypted: Buffer) => Buffer;

type CreateEncryptor = (
  password: string
) => { encrypt: Encrypt; decrypt: Decrypt };
export const createEncryptor: CreateEncryptor = password => {
  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64")
    .substr(0, 32);

  const encrypt: Encrypt = buffer => {
    // Create an initialization vector
    const iv = crypto.randomBytes(16);

    // Create a new cipher using the algorithm, key, and iv
    const cipher = crypto.createCipheriv(ALGORITHM, hash, iv);

    // Create the new (encrypted) buffer
    const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

    return result;
  };

  const decrypt: Decrypt = encrypted => {
    // Get the iv: the first 16 bytes
    const iv = encrypted.slice(0, 16);

    // Get the rest
    encrypted = encrypted.slice(16);

    // Create a decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, hash, iv);

    // Actually decrypt it
    const result = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    return result;
  };

  return {
    encrypt,
    decrypt
  };
};
