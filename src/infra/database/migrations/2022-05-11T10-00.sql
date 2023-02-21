--init (up)

ALTER TABLE public.application add COLUMN printing_method JSONB DEFAULT '[]';
ALTER TABLE public.application add COLUMN partner_name integer[];
ALTER TABLE public.application add COLUMN production_site character varying(255);
ALTER TABLE public.application add COLUMN notes_area text;