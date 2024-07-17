import { Database } from "@nozbe/watermelondb";
import database from "../DB";
import AuthSession from "../DB/model/AuthSession";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import * as aesjs from "aes-js";
import { TableName } from "@/DB/schema";

/**
 * AnyFunction, MaybePromisify, SupportedStorage code taken from node_modules/@supabase/auth-js/src/lib/types.ts
 */

type AnyFunction = (...args: any[]) => any;
type MaybePromisify<T> = T | Promise<T>;

type PromisifyMethods<T> = {
  [K in keyof T]: T[K] extends AnyFunction
    ? (...args: Parameters<T[K]>) => MaybePromisify<ReturnType<T[K]>>
    : T[K];
};

type SupportedStorage = PromisifyMethods<
  Pick<Storage, "getItem" | "setItem" | "removeItem">
> & {
  isServer?: boolean;
};

class SupabaseClientStorage implements SupportedStorage {
  private static instance: SupabaseClientStorage | null = null;
  private db: Database;
  public isServer?: boolean;

  private constructor() {
    this.db = database;
    this.isServer = false;
  }

  public static getInstance(): SupabaseClientStorage {
    if (!SupabaseClientStorage.instance) {
      SupabaseClientStorage.instance = new SupabaseClientStorage();
    }
    return SupabaseClientStorage.instance;
  }

  getItem(key: string): MaybePromisify<string | null> {
    return this.db
      .get<AuthSession>(TableName.AuthSession)
      .find(key)
      .then(async (result) => {
        const decryptedValue = await this._decrypt(key, result.session);
        return decryptedValue;
      })
      .catch(() => null);
  }

  async setItem(key: string, value: string): Promise<void> {
    const encryptedValue = await this._encrypt(key, value);
    await this.db.write(async () => {
      await this.db
        .get<AuthSession>(TableName.AuthSession)
        .create((record) => {
          record._raw.id = key;
          record.session = encryptedValue;
        })
        .catch((error) => {});
    });
  }

  async removeItem(key: string): Promise<void> {
    try {
      const session = await this.db
        .get<AuthSession>(TableName.AuthSession)
        .find(key);
      if (session) {
        await this.db.write(async () => {
          await session.destroyPermanently();
          await SecureStore.deleteItemAsync(key);
        });
      }
    } catch (error) {}
  }

  private async _encrypt(key: string, value: string) {
    // 128-bit key
    const encryptionKey = Crypto.getRandomValues(new Uint8Array(16));

    // convert the value to bytes (UTF-8 to Uint8Array.)
    const valueBytes = aesjs.utils.utf8.toBytes(value);
    // counter CTR
    const aesCtr = new aesjs.ModeOfOperation.ctr(encryptionKey);

    // converting encryption key to hex string and storing in secure store
    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey)
    );

    // encrypt the value bytes
    const encryptedBytes = aesCtr.encrypt(valueBytes);
    // convert encrypted bytes to hex string
    const encryptedValue = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedValue;
  }

  private async _decrypt(key: string, value: string) {
    // retrive hex key from secure store
    const encryptionKey = await SecureStore.getItemAsync(key);
    if (!encryptionKey) {
      return null;
    }
    const encryptedKeyInBytes = aesjs.utils.hex.toBytes(encryptionKey);
    // counter CTR
    const aesCtr = new aesjs.ModeOfOperation.ctr(encryptedKeyInBytes);
    const decryptedBytes = aesCtr.decrypt(aesjs.utils.hex.toBytes(value));

    // Convert our bytes back into text
    var decryptedValue = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedValue;
  }
}

const clientAuthStorageInstance = SupabaseClientStorage.getInstance();

export default clientAuthStorageInstance;
