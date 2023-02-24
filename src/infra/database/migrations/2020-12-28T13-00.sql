--init (up)

ALTER TABLE public.product add COLUMN application integer[] DEFAULT '{}';
ALTER TABLE public.product add COLUMN manufacturing_technique int;

ALTER TABLE public.product ALTER COLUMN width TYPE JSON USING json_build_array(json_build_object('min', width, 'max', width, 'stage', 1));