--init (up)

ALTER TABLE public.product add COLUMN packed_goods integer[] DEFAULT '{}';