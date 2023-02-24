--init (up)

ALTER TABLE public.product add COLUMN notes_area text;
ALTER TABLE public.application drop COLUMN notes_area;