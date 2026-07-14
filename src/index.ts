import express from "express";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";

const migrationClient = drizzle(config.db.url);
await migrate(migrationClient, config.db.migrationConfig);

const app = express();
const PORT = process.env.PORT || 3080;

app.use(express.json());

app.get("/api/health", (_, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK");
});

const server = app.listen(PORT, () => {
    console.log("server running on port", PORT);
});

server.on("error", (error) => {
    if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error("server error", error);
    }
    process.exitCode = 1;
});

server.on("close", () => {
    console.log("server closed");
});
