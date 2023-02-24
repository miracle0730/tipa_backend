--init (up)

ALTER TABLE public.application add COLUMN display_priority int DEFAULT 5;
ALTER TABLE public.product add COLUMN display_priority int DEFAULT 5;