--init (up)

ALTER TABLE public.product add COLUMN certificates JSONB DEFAULT '[]';
ALTER TABLE public.application add COLUMN certificates JSONB DEFAULT '[]';