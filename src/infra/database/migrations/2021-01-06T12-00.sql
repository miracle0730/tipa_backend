--init (up)

ALTER TABLE public.user add COLUMN last_sign_in timestamp without time zone DEFAULT now() NOT NULL;
