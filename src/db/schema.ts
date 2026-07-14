import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

// Enums

export const niveauEnum = pgEnum("niveau", ["1A", "2A", "3A"]);
export const formateurTypeEnum = pgEnum("type", ["vacataire", "permanent"]);
export const moduleTypeEnum = pgEnum("type", ["locale", "regionale"]);
export const seanceTypeEnum = pgEnum("type", ["presentiel", "distanciel"]);

// Tables

export const groupesTable = pgTable("groupes", {
    id: uuid("id").primaryKey().defaultRandom(),
    nom: varchar("nom", { length: 255 }).notNull(),
    niveau: niveauEnum("niveau").notNull(),
    filiere: varchar("filiere", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const etudiantsTable = pgTable("etudiants", {
    id: uuid("id").primaryKey().defaultRandom(),
    nom: varchar("nom", { length: 255 }).notNull(),
    prenom: varchar("prenom", { length: 255 }).notNull(),
    identifiant: varchar("identifiant", { length: 255 }).notNull().unique(),
    idGroupe: uuid("id_groupe").notNull().references(() => groupesTable.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const formateursTable = pgTable("formateurs", {
    id: uuid("id").primaryKey().defaultRandom(),
    nom: varchar("nom", { length: 255 }).notNull(),
    prenom: varchar("prenom", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    minHeures: integer("min_heures").notNull(),
    maxHeures: integer("max_heures").notNull(),
    type: formateurTypeEnum("type").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const modulesTable = pgTable("modules", {
    id: uuid("id").primaryKey().defaultRandom(),
    nom: varchar("nom", { length: 255 }).notNull(),
    type: moduleTypeEnum("type").notNull(),
    masseHoraire: integer("masse_horaire").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const semainesTable = pgTable("semaines", {
    id: uuid("id").primaryKey().defaultRandom(),
    dateDebut: timestamp("date_debut").notNull(),
    dateFin: timestamp("date_fin").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const sallesTable = pgTable("salles", {
    id: uuid("id").primaryKey().defaultRandom(),
    nom: varchar("nom", { length: 255 }).notNull(),
    capacite: integer("capacite").notNull(),
    type: varchar("type", { length: 100 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const seancesTable = pgTable("seances", {
    id: uuid("id").primaryKey().defaultRandom(),
    idFormateur: uuid("id_formateur").notNull().references(() => formateursTable.id),
    date: timestamp("date").notNull(),
    numSeance: integer("num_seance").notNull(),
    type: seanceTypeEnum("type").notNull(),
    tag: varchar("tag", { length: 255 }),
    idModule: uuid("id_module").notNull().references(() => modulesTable.id),
    idSemaine: uuid("id_semaine").notNull().references(() => semainesTable.id),
    idSalle: uuid("id_salle").references(() => sallesTable.id), // nullable
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});

export const seanceGroupesTable = pgTable("seance_groupes", {
    idGroupe: uuid("id_groupe").notNull().references(() => groupesTable.id),
    idSeance: uuid("id_seance").notNull().references(() => seancesTable.id),
}, (t) => [
    primaryKey({ columns: [t.idGroupe, t.idSeance] }),
]);

export const affectationsTable = pgTable("affectations", {
    idGroupe: uuid("id_groupe").notNull().references(() => groupesTable.id),
    idFormateur: uuid("id_formateur").notNull().references(() => formateursTable.id),
    idModule: uuid("id_module").notNull().references(() => modulesTable.id),
    heuresConsommees: integer("heures_consommees").notNull().default(0),
    principale: boolean("principale").notNull().default(false),
}, (t) => [
    primaryKey({ columns: [t.idGroupe, t.idFormateur, t.idModule] }),
]);

export const absencesTable = pgTable("absences", {
    idEtudiant: uuid("id_etudiant").notNull().references(() => etudiantsTable.id),
    idSeance: uuid("id_seance").notNull().references(() => seancesTable.id),
    justifiee: boolean("justifiee").notNull().default(false),
    remarque: varchar("remarque", { length: 500 }),
}, (t) => [
    primaryKey({ columns: [t.idEtudiant, t.idSeance] }),
]);

// Types 
export type NewGroupe = typeof groupesTable.$inferInsert;
export type NewEtudiant = typeof etudiantsTable.$inferInsert;
export type NewFormateur = typeof formateursTable.$inferInsert;
export type NewModule = typeof modulesTable.$inferInsert;
export type NewSemaine = typeof semainesTable.$inferInsert;
export type NewSalle = typeof sallesTable.$inferInsert;
export type NewSeance = typeof seancesTable.$inferInsert;
export type NewSeanceGroupe = typeof seanceGroupesTable.$inferInsert;
export type NewAffectation = typeof affectationsTable.$inferInsert;
export type NewAbsence = typeof absencesTable.$inferInsert;