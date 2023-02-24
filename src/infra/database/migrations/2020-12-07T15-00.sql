--init (up)

ALTER TABLE public.application add COLUMN available_marketing_samples json DEFAULT '[]';
