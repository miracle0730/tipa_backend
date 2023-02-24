--init (up)

ALTER TABLE public.application RENAME segment TO packed_goods;

ALTER TABLE public.application ALTER COLUMN packed_goods DROP NOT NULL;