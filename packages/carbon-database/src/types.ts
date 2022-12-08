export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          id: string
          checksum: string
          finished_at: string | null
          migration_name: string
          logs: string | null
          rolled_back_at: string | null
          started_at: string
          applied_steps_count: number
        }
        Insert: {
          id: string
          checksum: string
          finished_at?: string | null
          migration_name: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
        Update: {
          id?: string
          checksum?: string
          finished_at?: string | null
          migration_name?: string
          logs?: string | null
          rolled_back_at?: string | null
          started_at?: string
          applied_steps_count?: number
        }
      }
      employee: {
        Row: {
          id: string
          employeeTypeId: string
        }
        Insert: {
          id: string
          employeeTypeId: string
        }
        Update: {
          id?: string
          employeeTypeId?: string
        }
      }
      employeeType: {
        Row: {
          name: string
          updatedAt: string | null
          id: string
          color: string | null
          protected: boolean
          createdAt: string
        }
        Insert: {
          name: string
          updatedAt?: string | null
          id?: string
          color?: string | null
          protected?: boolean
          createdAt?: string
        }
        Update: {
          name?: string
          updatedAt?: string | null
          id?: string
          color?: string | null
          protected?: boolean
          createdAt?: string
        }
      }
      employeeTypePermission: {
        Row: {
          employeeTypeId: string
          featureId: string
          updatedAt: string | null
          createdAt: string
          create: boolean
          delete: boolean
          update: boolean
          view: boolean
        }
        Insert: {
          employeeTypeId: string
          featureId: string
          updatedAt?: string | null
          createdAt?: string
          create?: boolean
          delete?: boolean
          update?: boolean
          view?: boolean
        }
        Update: {
          employeeTypeId?: string
          featureId?: string
          updatedAt?: string | null
          createdAt?: string
          create?: boolean
          delete?: boolean
          update?: boolean
          view?: boolean
        }
      }
      feature: {
        Row: {
          name: string
          updatedAt: string | null
          id: string
          createdAt: string
        }
        Insert: {
          name: string
          updatedAt?: string | null
          id?: string
          createdAt?: string
        }
        Update: {
          name?: string
          updatedAt?: string | null
          id?: string
          createdAt?: string
        }
      }
      user: {
        Row: {
          id: string
          email: string
          firstName: string
          lastName: string
          emailVerified: string | null
          updatedAt: string | null
          fullName: string | null
          createdAt: string
        }
        Insert: {
          id: string
          email: string
          firstName: string
          lastName: string
          emailVerified?: string | null
          updatedAt?: string | null
          fullName?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          email?: string
          firstName?: string
          lastName?: string
          emailVerified?: string | null
          updatedAt?: string | null
          fullName?: string | null
          createdAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: { uid: string; claim: string }
        Returns: string
      }
      get_claim: {
        Args: { uid: string; claim: string }
        Returns: Json
      }
      get_claims: {
        Args: { uid: string }
        Returns: Json
      }
      get_my_claim: {
        Args: { claim: string }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: { uid: string; claim: string; value: Json }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

