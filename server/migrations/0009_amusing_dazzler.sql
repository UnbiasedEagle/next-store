CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"color" text NOT NULL,
	"product_type" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"product_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"size" real NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"variant_id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_tags" (
	"variant_id" serial NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_images" ADD CONSTRAINT "variant_images_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variant_tags" ADD CONSTRAINT "variant_tags_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;