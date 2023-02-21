--init (up)

ALTER TABLE public.product RENAME segment TO segment_type;
ALTER TABLE public.product add COLUMN segment integer[] DEFAULT '{}';