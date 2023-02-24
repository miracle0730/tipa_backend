--init (up)

CREATE TABLE public.thickness (
    "id" SERIAL PRIMARY KEY,
    "value" int NOT NULL
);

ALTER TABLE ONLY public.thickness ADD CONSTRAINT "unique_thickness_value" UNIQUE (value);

ALTER TABLE public.product add COLUMN stage int NOT NULL DEFAULT 1;
ALTER TABLE public.product add COLUMN terms_and_limitations character varying(2048);

ALTER TABLE public.product ALTER COLUMN thickness TYPE JSON USING json_build_array();
