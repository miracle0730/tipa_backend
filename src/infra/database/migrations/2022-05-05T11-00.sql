--init (up)

ALTER TABLE public.product add COLUMN printing_method JSONB DEFAULT '[]';
ALTER TABLE public.product add COLUMN available_territories JSONB DEFAULT '[]';
ALTER TABLE public.product add COLUMN moq JSONB DEFAULT '[]';
ALTER TABLE public.product add COLUMN partner_name character varying(255);
ALTER TABLE public.product add COLUMN production_site character varying(255);
ALTER TABLE public.application add COLUMN notes_area text;