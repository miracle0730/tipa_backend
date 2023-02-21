--init (up)

ALTER TABLE public.category ALTER COLUMN metadata TYPE JSONB USING '{}';