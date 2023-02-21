--init (up)

ALTER TABLE public.product drop COLUMN partner_name;
ALTER TABLE public.product add COLUMN partner_name integer[];