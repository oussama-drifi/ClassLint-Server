import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();


function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    url : string
    migrationConfig: MigrationConfig
}
type APIConfig = {
    platform: string
}

type Config = {
    api: APIConfig
    db: DBConfig
}


export const config : Config = {
    api: {
        platform: envOrThrow('PLATFORM')
    },
    db: {
        url: envOrThrow('DATABASE_URL'),
        migrationConfig: migrationConfig
    }
}