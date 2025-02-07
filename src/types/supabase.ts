export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string
          email: string
          role: string
          created_at?: string
        }
        Insert: {
          user_id: string
          email: string
          role: string
          created_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          role?: string
          created_at?: string
        }
      },
      investors: {
        Row: {
          id: string
          name: string
          email: string | null
          organization: string | null
          total_investment: string | null
          invested_startups: number | null
          investment_focus: string | null
          city: string | null
          country: string | null
          minimum_investment: string | null
          maximum_investment: string | null
          status: 'pending' | 'verified'
          active: boolean
          created_at: string
          updated_at: string
          avatar: string | null
          linkedin_url: string | null
          website: string | null
        }
        Insert: {
          id?: string
          name?: string
          email?: string | null
          organization?: string | null
          total_investment?: string | null
          invested_startups?: number | null
          investment_focus?: string | null
          city?: string | null
          country?: string | null
          minimum_investment?: string | null
          maximum_investment?: string | null
          status?: 'pending' | 'verified'
          active?: boolean
          created_at?: string
          updated_at?: string
          avatar?: string | null
          linkedin_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          organization?: string | null
          total_investment?: string | null
          invested_startups?: number | null
          investment_focus?: string | null
          city?: string | null
          country?: string | null
          minimum_investment?: string | null
          maximum_investment?: string | null
          status?: 'pending' | 'verified'
          active?: boolean
          created_at?: string
          updated_at?: string
          avatar?: string | null
          linkedin_url?: string | null
          website?: string | null
        }
      },
      founders: {
        Row: {
          id: string
          user_id: string
          name: string | null
          company_name: string | null
          industry: string | null
          founded_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          company_name?: string | null
          industry?: string | null
          founded_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          company_name?: string | null
          industry?: string | null
          founded_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // ... other tables
    }
  }
} 