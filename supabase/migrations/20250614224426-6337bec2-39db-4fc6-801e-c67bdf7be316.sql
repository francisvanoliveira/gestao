
-- Remover todas as políticas RLS existentes que dependem de auth.uid()
DROP POLICY IF EXISTS "Gestores podem ver todos os usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Gestores podem criar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Gestores podem atualizar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Gestores podem deletar usuários" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios dados" ON public.usuarios;

-- Desabilitar RLS temporariamente para permitir operações básicas
-- Isso é necessário porque o sistema usa autenticação customizada
ALTER TABLE public.usuarios DISABLE ROW LEVEL SECURITY;

-- Criar função para hash de senhas (necessária para segurança)
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$;

-- Atualizar a função verify_user_login para usar senhas hasheadas e texto plano
CREATE OR REPLACE FUNCTION public.verify_user_login(p_login text, p_password text)
RETURNS TABLE(id uuid, login text, nome_completo text, perfil perfil_usuario, criado_em timestamp with time zone, atualizado_em timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Primeiro tenta com senha hasheada
  RETURN QUERY
  SELECT 
    u.id,
    u.login,
    u.nome_completo,
    u.perfil,
    u.criado_em,
    u.atualizado_em
  FROM usuarios u
  WHERE u.login = p_login 
    AND u.senha = crypt(p_password, u.senha);
    
  -- Se não encontrou nada, tenta com senha em texto plano (para desenvolvimento)
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      u.id,
      u.login,
      u.nome_completo,
      u.perfil,
      u.criado_em,
      u.atualizado_em
    FROM usuarios u
    WHERE u.login = p_login 
      AND u.senha = p_password;
  END IF;
END;
$$;
