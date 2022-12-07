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
      Employee: {
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
      EmployeeType: {
        Row: {
          id: string
          name: string
          color: string | null
          protected: boolean
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          protected?: boolean
          createdAt?: string
          updatedAt?: string | null
        }
      }
      EmployeeTypePermission: {
        Row: {
          employeeTypeId: string
          moduleId: string
          createdAt: string
          updatedAt: string | null
          create: boolean
          delete: boolean
          update: boolean
          view: boolean
        }
        Insert: {
          employeeTypeId: string
          moduleId: string
          createdAt?: string
          updatedAt?: string | null
          create?: boolean
          delete?: boolean
          update?: boolean
          view?: boolean
        }
        Update: {
          employeeTypeId?: string
          moduleId?: string
          createdAt?: string
          updatedAt?: string | null
          create?: boolean
          delete?: boolean
          update?: boolean
          view?: boolean
        }
      }
      Feature: {
        Row: {
          id: string
          name: string
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id?: string
          name: string
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          name?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }
      User: {
        Row: {
          id: string
          email: string
          firstName: string
          lastName: string
          emailVerified: string | null
          createdAt: string
          updatedAt: string | null
        }
        Insert: {
          id: string
          email: string
          firstName: string
          lastName: string
          emailVerified?: string | null
          createdAt?: string
          updatedAt?: string | null
        }
        Update: {
          id?: string
          email?: string
          firstName?: string
          lastName?: string
          emailVerified?: string | null
          createdAt?: string
          updatedAt?: string | null
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

