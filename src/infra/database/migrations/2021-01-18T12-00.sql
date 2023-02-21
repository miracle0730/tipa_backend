--init (up)

ALTER TABLE public.product add COLUMN barrier json DEFAULT '{}';
ALTER TABLE public.product add COLUMN printability json DEFAULT '{}';