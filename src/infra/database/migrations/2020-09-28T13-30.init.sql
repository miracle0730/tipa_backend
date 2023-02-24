--init (up)

ALTER TABLE public.application ALTER COLUMN technical_considerations TYPE JSON USING json_build_object('description', technical_considerations, 'url', null);
ALTER TABLE public.product ALTER COLUMN technical_considerations TYPE JSON USING json_build_object('description', technical_considerations, 'url', null);

ALTER TABLE public.application DROP CONSTRAINT unique_application_title;

ALTER TABLE public.application ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.product ALTER COLUMN description DROP NOT NULL;