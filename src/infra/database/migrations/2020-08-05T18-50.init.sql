--init (up)

CREATE TABLE public.user (
    "id" SERIAL PRIMARY KEY,
    "role" smallint NOT NULL,
    "email" character varying(256) NOT NULL,
    "fullname" character varying(256) NOT NULL,
    "password" character varying(256) NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.category (
    "id" SERIAL PRIMARY KEY,
    "parent_id" int,
    "level" int,
    "title" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.product (
    "id" SERIAL PRIMARY KEY,
    "title" character varying(256) NOT NULL,
    "description" character varying(2048) NOT NULL,
    "reel" integer[] NOT NULL,
    "application" integer[] NOT NULL,
    "segment" integer[] NOT NULL,
    "material" integer[] NOT NULL,
    "width" character varying(256),
    "height" character varying(256),
    "packet_goods" character varying(256),
    "use_cases" character varying(2048),
    "production_process" character varying(256),
    "machine_method" character varying(256),
    "future_dimensions" character varying(256),
    "location_of_product" character varying(256),
    "technical_considerations" character varying(256),
    "product_site" character varying(256),
    "seeding" character varying(256),
    "bpi" character varying(256),
    "tds" character varying(256),
    "limitations" character varying(2048),
    "features" character varying(2048),
    "positive_experiments" character varying(2048),
    "ok_compost_home" character varying(256),
    "ok_compost_industrial" character varying(256),
    "compliance_with_australia_standarts" character varying(256),
    "food_contact_usa" character varying(256),
    "food_contact_canada" character varying(256),
    "food_contact_eu" character varying(256),
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.material (
    "id" SERIAL PRIMARY KEY,
    "title" character varying(256) NOT NULL,
    "description" character varying(2048) NOT NULL,
    "reel" integer[] NOT NULL,
    "color" character varying(256),
    "metalized" boolean NOT NULL,
    "industrial_compostable" boolean NOT NULL,
    "home_compostable" boolean NOT NULL,
    "moisture_barrier" boolean NOT NULL,
    "oxigen_barrier" boolean NOT NULL,
    "printability" boolean NOT NULL,
    "layers" character varying(256),
    "variant" character varying(256),
    "thickness" character varying(256),
    "features" character varying(2048),
    "suggested_use" character varying(2048),
    "moq" character varying(2048),
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

CREATE TABLE public.material_image (
    "id" SERIAL PRIMARY KEY,
    "material_id" int NOT NULL,
    "image" character varying(2048) NOT NULL,
    "created_at" timestamp without time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE ONLY public.user ADD CONSTRAINT "unique_user_email" UNIQUE (email);
ALTER TABLE ONLY public.product ADD CONSTRAINT "unique_product_title" UNIQUE (title);
ALTER TABLE ONLY public.material ADD CONSTRAINT "unique_material_title" UNIQUE (title);


CREATE INDEX "index_user_email" ON public.user USING btree (email);
CREATE INDEX "index_product_title" ON public.product USING btree (title);
CREATE INDEX "index_material_title" ON public.material USING btree (title);
CREATE INDEX "index_category_parentId" ON public.category USING btree (parent_id);


ALTER TABLE ONLY public.category ADD CONSTRAINT "fk_category_category" FOREIGN KEY ("parent_id") REFERENCES public.category(id) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY public.product_image ADD CONSTRAINT "fk_product_image_product" FOREIGN KEY ("product_id") REFERENCES public.product(id) MATCH FULL ON DELETE CASCADE;
ALTER TABLE ONLY public.material_image ADD CONSTRAINT "fk_material_image_material" FOREIGN KEY ("material_id") REFERENCES public.material(id) MATCH FULL ON DELETE CASCADE;
