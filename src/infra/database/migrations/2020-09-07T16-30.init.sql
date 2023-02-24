--init (up)

CREATE TABLE public.application (
    "id" SERIAL PRIMARY KEY,
    "title" character varying(256) NOT NULL,
    "description" character varying(2048) NOT NULL,
    "application" integer[] NOT NULL,
    "segment" integer[] NOT NULL,
    "product" integer[] NOT NULL,
    "thickness" character varying(256),
    "width" character varying(256),
    "height" character varying(256),
    "production_process" character varying(256),
    "tipa_production_site" character varying(256),
    "technical_considerations" character varying(2048),
    "features" character varying(2048),
    "positive_experiments" character varying(2048),
    "negative_feedback_to_be_aware_of" character varying(2048),
    "dieline" json,
    "customers" json,
    "draft" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL
);

DROP TABLE "product_image";
DROP TABLE "product";
DROP TABLE "material_image";
DROP TABLE "material";

CREATE TABLE public.product (
    "id" SERIAL PRIMARY KEY,
    "title" character varying(256) NOT NULL,
    "description" character varying(2048) NOT NULL,
    "family" integer[] NOT NULL,
    "segment" integer[] NOT NULL,
    "thickness" character varying(256),
    "width" character varying(256),
    "height" character varying(256),
    "features" character varying(2048),
    "technical_considerations" character varying(2048),
    "tds" json,
    "certifications" json,
    "draft" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.product_image (
    "id" SERIAL PRIMARY KEY,
    "product_id" int NOT NULL,
    "image" character varying(2048) NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.application_image (
    "id" SERIAL PRIMARY KEY,
    "application_id" int NOT NULL,
    "image" character varying(2048) NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.product ADD CONSTRAINT "unique_product_title" UNIQUE (title);
ALTER TABLE ONLY public.application ADD CONSTRAINT "unique_application_title" UNIQUE (title);


CREATE INDEX "index_product_title" ON public.product USING btree (title);
CREATE INDEX "index_application_title" ON public.application USING btree (title);


ALTER TABLE ONLY public.product_image ADD CONSTRAINT "fk_product_image_product" FOREIGN KEY ("product_id") REFERENCES public.product(id) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY public.application_image ADD CONSTRAINT "fk_application_image_item" FOREIGN KEY ("application_id") REFERENCES public.application(id) MATCH FULL ON DELETE CASCADE;
