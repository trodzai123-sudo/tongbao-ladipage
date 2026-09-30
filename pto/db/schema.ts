import {sqliteTable,text,integer,index} from "drizzle-orm/sqlite-core";
export const leads=sqliteTable("leads",{
 id:text("id").primaryKey(),reference:text("reference").notNull().unique(),idempotencyKey:text("idempotency_key").notNull().unique(),brand:text("brand").notNull(),name:text("name").notNull(),phone:text("phone").notNull(),application:text("application").notNull(),status:text("status").notNull().default("NEW"),payload:text("payload").notNull(),createdAt:text("created_at").notNull(),updatedAt:text("updated_at").notNull()
},t=>[index("idx_leads_created_at").on(t.createdAt)]);
export const attachments=sqliteTable("attachments",{id:text("id").primaryKey(),leadId:text("lead_id").notNull().references(()=>leads.id,{onDelete:"cascade"}),objectKey:text("object_key").notNull(),name:text("name").notNull(),mime:text("mime").notNull(),role:text("role").notNull(),size:integer("size").notNull()},t=>[index("idx_attachments_lead_id").on(t.leadId)]);
export const rateLimits=sqliteTable("rate_limits",{key:text("key").primaryKey(),count:integer("count").notNull(),expiresAt:integer("expires_at").notNull()});
export const auditLog=sqliteTable("audit_log",{id:text("id").primaryKey(),leadId:text("lead_id").notNull(),actorId:text("actor_id").notNull(),action:text("action").notNull(),createdAt:text("created_at").notNull()});
