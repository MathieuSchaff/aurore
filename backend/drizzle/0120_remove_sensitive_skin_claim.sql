ALTER TABLE "products" DROP COLUMN "sensitive_skin_claim";
--> statement-breakpoint
UPDATE "product_tag_types" SET "label" = 'Peau sensible · signal calculé' WHERE "slug" = 'peau-sensible';