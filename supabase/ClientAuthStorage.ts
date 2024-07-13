import { Database } from "@nozbe/watermelondb";
import database from "../DB";
import AuthSession from "../DB/model/AuthSession";

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

export default class SupabaseClientStorage implements SupportedStorage {
  private db: Database;
  public isServer?: boolean;

  constructor() {
    this.db = database;
    this.isServer = false;
  }

  getItem(key: string): MaybePromisify<string | null> {
    return this.db
      .get<AuthSession>("auth_session")
      .find(key)
      .then((result) => {
        return result.session;
      })
      .catch(() => null);
  }

  async setItem(key: string, value: string): Promise<void> {
    await this.db.write(async () => {
      await this.db
        .get<AuthSession>("auth_session")
        .create((record) => {
          record._raw.id = key;
          record.session = value;
        })
        .catch((error) => {});
    });
  }

  async removeItem(key: string): Promise<void> {
    try {
      const session = await this.db.get<AuthSession>("auth_session").find(key);
      if (session) {
        await this.db.write(async () => {
          await session.destroyPermanently();
        });
      }
    } catch (error) {}
  }
}
