import { createEncryptor } from ".";

describe("encryptor", () => {
  it("works properly", () => {
    const encryptor = createEncryptor("SomePassword");

    const buffer = Buffer.from("Hello world");

    const encrypted = encryptor.encrypt(buffer);

    expect(encrypted.toString()).toBeDefined();

    const decrypted = encryptor.decrypt(encrypted);

    expect(decrypted.toString()).toBe("Hello world");
  });
});
