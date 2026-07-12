import { integer, uuid, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const formateursTable = pgTable("formateurs", {
    id: uuid('id').primaryKey().defaultRandom(),
    nom: varchar('nom', { length: 255 }).notNull(),
    prenom: varchar('prenom', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    minHeures: integer('min_heures').notNull(),
    maxHeures: integer('max_heures').notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export type NewFormateur = typeof formateursTable.$inferInsert;