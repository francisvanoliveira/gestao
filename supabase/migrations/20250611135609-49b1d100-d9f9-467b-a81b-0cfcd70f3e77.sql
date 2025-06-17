
-- Primeiro, vamos verificar se o usuário existe e criar se não existir
INSERT INTO usuarios (login, senha, nome_completo, perfil)
VALUES ('sistema', crypt('Gr7@Sites##', gen_salt('bf')), 'Administrador do Sistema', 'gestor')
ON CONFLICT (login) 
DO UPDATE SET 
  senha = crypt('Gr7@Sites##', gen_salt('bf')),
  nome_completo = 'Administrador do Sistema',
  perfil = 'gestor';
