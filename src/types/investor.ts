export interface Investor {
    id: string;
    name: string;
    email: string;
    organization: string | null;
    total_investment: string | null;
    invested_startups: number;
    investment_focus: string | null;
    city: string | null;
    country: string | null;
    minimum_investment: string | null;
    maximum_investment: string | null;
    status: 'pending' | 'verified';
    active: boolean;
    created_at: string;
    updated_at: string;
    avatar: string | null;
    linkedin_url: string | null;
    website: string | null;
}
