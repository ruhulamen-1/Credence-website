import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('facebook', 'x', 'instagram', 'youtube', 'linkedin', 'tiktok');
  CREATE TABLE "site_settings_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings_offices_locales" (
  	"label" varchar NOT NULL,
  	"address" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "footer_logo_id" integer;
  ALTER TABLE "site_settings_locales" ADD COLUMN "tagline" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "copyright" varchar;
  ALTER TABLE "site_settings_locales" ADD COLUMN "credit" varchar;
  ALTER TABLE "site_settings_offices" ADD CONSTRAINT "site_settings_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_offices_locales" ADD CONSTRAINT "site_settings_offices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_offices_order_idx" ON "site_settings_offices" USING btree ("_order");
  CREATE INDEX "site_settings_offices_parent_id_idx" ON "site_settings_offices" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_offices_locales_locale_parent_id_unique" ON "site_settings_offices_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_offices_locales_parent_id_idx" ON "site_settings_offices_locales" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_footer_logo_id_media_id_fk" FOREIGN KEY ("footer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_footer_logo_idx" ON "site_settings" USING btree ("footer_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings_offices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_offices_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_socials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_settings_offices" CASCADE;
  DROP TABLE "site_settings_offices_locales" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_logo_id_media_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_footer_logo_id_media_id_fk";
  
  DROP INDEX "site_settings_logo_idx";
  DROP INDEX "site_settings_footer_logo_idx";
  ALTER TABLE "site_settings" DROP COLUMN "logo_id";
  ALTER TABLE "site_settings" DROP COLUMN "footer_logo_id";
  ALTER TABLE "site_settings_locales" DROP COLUMN "tagline";
  ALTER TABLE "site_settings_locales" DROP COLUMN "copyright";
  ALTER TABLE "site_settings_locales" DROP COLUMN "credit";
  DROP TYPE "public"."enum_site_settings_socials_platform";`)
}
