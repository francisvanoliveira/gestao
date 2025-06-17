
-- Criar função para verificar login com senha hasheada
CREATE OR REPLACE FUNCTION verify_user_login(p_login TEXT, p_password TEXT)
RETURNS TABLE (
  id UUID,
  login TEXT,
  nome_completo TEXT,
  perfil perfil_usuario,
  criado_em TIMESTAMP WITH TIME ZONE,
  atualizado_em TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
END;
$$;
