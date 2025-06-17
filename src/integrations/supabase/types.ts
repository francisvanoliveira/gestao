export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: {
          cidade: string | null
          criado_em: string | null
          criado_por_id: string
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
        }
        Insert: {
          cidade?: string | null
          criado_em?: string | null
          criado_por_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
        }
        Update: {
          cidade?: string | null
          criado_em?: string | null
          criado_por_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_criado_por_id_fkey"
            columns: ["criado_por_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      deslocamentos: {
        Row: {
          atualizado_em: string | null
          cliente_id: string
          criado_em: string | null
          data_deslocamento: string
          finalizado_por_financeiro: boolean | null
          hora_ida: string | null
          hora_volta: string | null
          id: string
          meio_transporte: Database["public"]["Enums"]["meio_transporte"]
          usuario_id: string
          validado_por_gestor: boolean | null
          valor_ida: number | null
          valor_volta: number | null
        }
        Insert: {
          atualizado_em?: string | null
          cliente_id: string
          criado_em?: string | null
          data_deslocamento: string
          finalizado_por_financeiro?: boolean | null
          hora_ida?: string | null
          hora_volta?: string | null
          id?: string
          meio_transporte: Database["public"]["Enums"]["meio_transporte"]
          usuario_id: string
          validado_por_gestor?: boolean | null
          valor_ida?: number | null
          valor_volta?: number | null
        }
        Update: {
          atualizado_em?: string | null
          cliente_id?: string
          criado_em?: string | null
          data_deslocamento?: string
          finalizado_por_financeiro?: boolean | null
          hora_ida?: string | null
          hora_volta?: string | null
          id?: string
          meio_transporte?: Database["public"]["Enums"]["meio_transporte"]
          usuario_id?: string
          validado_por_gestor?: boolean | null
          valor_ida?: number | null
          valor_volta?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deslocamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deslocamentos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          atualizado_em: string | null
          criado_em: string | null
          id: string
          login: string
          nome_completo: string
          perfil: Database["public"]["Enums"]["perfil_usuario"]
          senha: string
        }
        Insert: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          login: string
          nome_completo: string
          perfil: Database["public"]["Enums"]["perfil_usuario"]
          senha: string
        }
        Update: {
          atualizado_em?: string | null
          criado_em?: string | null
          id?: string
          login?: string
          nome_completo?: string
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
          senha?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["perfil_usuario"]
      }
      hash_password: {
        Args: { password: string }
        Returns: string
      }
      verify_user_login: {
        Args: { p_login: string; p_password: string }
        Returns: {
          id: string
          login: string
          nome_completo: string
          perfil: Database["public"]["Enums"]["perfil_usuario"]
          criado_em: string
          atualizado_em: string
        }[]
      }
    }
    Enums: {
      meio_transporte: "uber" | "veiculo_proprio"
      perfil_usuario: "gestor" | "usuario" | "financeiro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      meio_transporte: ["uber", "veiculo_proprio"],
      perfil_usuario: ["gestor", "usuario", "financeiro"],
    },
  },
} as const
