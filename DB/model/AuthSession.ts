import { Model } from "@nozbe/watermelondb";
import { text } from "@nozbe/watermelondb/decorators";
import { TableName } from "../schema";

export default class AuthSession extends Model {
  static table = TableName.AuthSession;

  @text("session") session: string;
}
