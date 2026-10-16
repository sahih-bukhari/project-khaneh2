CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.apk_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  description text NOT NULL DEFAULT '' CHECK (char_length(description) <= 4000),
  version text NOT NULL CHECK (char_length(version) BETWEEN 1 AND 40),
  category text NOT NULL DEFAULT 'mobile',
  file_path text NOT NULL,
  file_size bigint NOT NULL CHECK (file_size > 0),
  icon_path text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.apk_apps TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.apk_apps TO authenticated;
GRANT ALL ON public.apk_apps TO service_role;
ALTER TABLE public.apk_apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads published" ON public.apk_apps FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "admin reads all" ON public.apk_apps FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin inserts" ON public.apk_apps FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin updates" ON public.apk_apps FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin deletes" ON public.apk_apps FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER apk_apps_touch BEFORE UPDATE ON public.apk_apps FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "apk admin all" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id IN ('apks','app-icons') AND public.has_role(auth.uid(),'admin'))
  WITH CHECK (bucket_id IN ('apks','app-icons') AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "apk public download published" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'apks' AND EXISTS (SELECT 1 FROM public.apk_apps a WHERE a.file_path = storage.objects.name AND a.status = 'published'));
CREATE POLICY "icon public read published" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'app-icons' AND EXISTS (SELECT 1 FROM public.apk_apps a WHERE a.icon_path = storage.objects.name AND a.status = 'published'));

-- Only the owner email becomes admin, and only once the email is confirmed.
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'frdaws.samad@gmail.com' AND NEW.email_confirmed_at IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.grant_owner_admin() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_owner_admin AFTER INSERT OR UPDATE OF email_confirmed_at, email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();