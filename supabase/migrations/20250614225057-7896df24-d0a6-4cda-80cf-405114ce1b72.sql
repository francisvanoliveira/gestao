
-- Remover quaisquer políticas RLS existentes na tabela clientes
DROP POLICY IF EXISTS "Users can view clientes" ON public.clientes;
DROP POLICY IF EXISTS "Users can create clientes" ON public.clientes;
DROP POLICY IF EXISTS "Users can update clientes" ON public.clientes;
DROP POLICY IF EXISTS "Users can delete clientes" ON public.clientes;
DROP POLICY IF EXISTS "Gestores podem ver todos os clientes" ON public.clientes;
DROP POLICY IF EXISTS "Gestores podem criar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Gestores podem atualizar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Gestores podem deletar clientes" ON public.clientes;

-- Desabilitar RLS na tabela clientes para funcionar com autenticação customizada
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;

-- Fazer o mesmo para a tabela deslocamentos para evitar problemas futuros
DROP POLICY IF EXISTS "Users can view deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Users can create deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Users can update deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Users can delete deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Usuarios podem ver seus deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Gestores podem ver todos os deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Usuarios podem criar deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Gestores podem atualizar deslocamentos" ON public.deslocamentos;
DROP POLICY IF EXISTS "Financeiro pode finalizar deslocamentos" ON public.deslocamentos;

-- Desabilitar RLS na tabela deslocamentos
ALTER TABLE public.deslocamentos DISABLE ROW LEVEL SECURITY;
