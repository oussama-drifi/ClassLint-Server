import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "../config.js";

export const db = drizzle(config.db.url);
