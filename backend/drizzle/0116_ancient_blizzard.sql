CREATE TYPE "public"."preference_stance" AS ENUM('exclude', 'require');--> statement-breakpoint
CREATE TABLE "user_ingredient_preferences" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"canonical_key" text NOT NULL,
	"stance" "preference_stance" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_ingredient_preferences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_ingredient_preferences" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_tag_preferences" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"stance" "preference_stance" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_tag_preferences" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_tag_preferences" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_ingredient_preferences" ADD CONSTRAINT "user_ingredient_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tag_preferences" ADD CONSTRAINT "user_tag_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tag_preferences" ADD CONSTRAINT "user_tag_preferences_tag_id_product_tag_types_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."product_tag_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_ingredient_pref_idx" ON "user_ingredient_preferences" USING btree ("user_id","canonical_key");--> statement-breakpoint
CREATE UNIQUE INDEX "user_tag_pref_idx" ON "user_tag_preferences" USING btree ("user_id","tag_id");--> statement-breakpoint
CREATE POLICY "user_ingredient_preferences_tenant_isolation" ON "user_ingredient_preferences" AS PERMISSIVE FOR ALL TO "app_runtime" USING ("user_ingredient_preferences"."user_id" = (SELECT auth.uid())) WITH CHECK ("user_ingredient_preferences"."user_id" = (SELECT auth.uid()));--> statement-breakpoint
CREATE POLICY "user_ingredient_preferences_admin_bypass" ON "user_ingredient_preferences" AS PERMISSIVE FOR ALL TO "app_runtime" USING ((SELECT auth.role()) = 'admin') WITH CHECK ((SELECT auth.role()) = 'admin');--> statement-breakpoint
CREATE POLICY "user_tag_preferences_tenant_isolation" ON "user_tag_preferences" AS PERMISSIVE FOR ALL TO "app_runtime" USING ("user_tag_preferences"."user_id" = (SELECT auth.uid())) WITH CHECK ("user_tag_preferences"."user_id" = (SELECT auth.uid()));--> statement-breakpoint
CREATE POLICY "user_tag_preferences_admin_bypass" ON "user_tag_preferences" AS PERMISSIVE FOR ALL TO "app_runtime" USING ((SELECT auth.role()) = 'admin') WITH CHECK ((SELECT auth.role()) = 'admin');