
-- Habilitar RLS na tabela usuarios (caso não esteja habilitado)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que gestores vejam todos os usuários
CREATE POLICY "Gestores podem ver todos os usuários" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.id = auth.uid() AND u.perfil = 'gestor'
  )
);

-- Política para permitir que gestores criem novos usuários
CREATE POLICY "Gestores podem criar usuários" 
ON public.usuarios 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.id = auth.uid() AND u.perfil = 'gestor'
  )
);

-- Política para permitir que gestores atualizem usuários
CREATE POLICY "Gestores podem atualizar usuários" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.id = auth.uid() AND u.perfil = 'gestor'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.id = auth.uid() AND u.perfil = 'gestor'
  )
);

-- Política para permitir que gestores deletem usuários
CREATE POLICY "Gestores podem deletar usuários" 
ON public.usuarios 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios u 
    WHERE u.id = auth.uid() AND u.perfil = 'gestor'
  )
);

-- Política para permitir que usuários vejam seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados" 
ON public.usuarios 
FOR SELECT 
TO authenticated
USING (id = auth.uid());

-- Política para permitir que usuários atualizem seus próprios dados
CREATE POLICY "Usuários podem atualizar seus próprios dados" 
ON public.usuarios 
FOR UPDATE 
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
