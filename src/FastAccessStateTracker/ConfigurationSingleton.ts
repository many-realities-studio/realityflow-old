import { IDatabase } from "./Database/IDatabase";
import { MongooseDatabase } from "./Database/MongooseDatabase";

export class ConfigurationSingleton
{
  public static DatabaseURL : string= "";
  public static Database : IDatabase = new MongooseDatabase(ConfigurationSingleton.DatabaseURL);
}