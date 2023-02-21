--init (up)

ALTER TABLE public.application add COLUMN rtf character varying(2048);
ALTER TABLE public.application add COLUMN certifications json DEFAULT '[]';