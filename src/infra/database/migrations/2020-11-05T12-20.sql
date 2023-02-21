--init (up)

ALTER TABLE public.application add COLUMN stage int NOT NULL DEFAULT 1;
ALTER TABLE public.application add COLUMN type int NOT NULL DEFAULT 1;
ALTER TABLE public.application add COLUMN terms_and_limitations character varying(2048);
ALTER TABLE public.application add COLUMN additional_features json DEFAULT '[]';

ALTER TABLE public.application ALTER COLUMN thickness TYPE JSON USING json_build_array(json_build_object('values', json_build_array(thickness), 'stage', 1));
ALTER TABLE public.application ALTER COLUMN width TYPE JSON USING json_build_array(json_build_object('min', width, 'max', width, 'stage', 1));
ALTER TABLE public.application ALTER COLUMN height TYPE JSON USING json_build_array(json_build_object('min', height, 'max', height, 'stage', 1));
