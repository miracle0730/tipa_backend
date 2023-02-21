--init (up)

ALTER TABLE public.application add COLUMN segment integer[] NOT NULL DEFAULT '{}';

ALTER TABLE public.application add COLUMN segment_type integer[] NOT NULL DEFAULT '{}';