export interface Mentor {
    id?: string;
    name: string;
    email: string;
    expertise?: string;
    years_of_experience: number;
    industry?: string;
    city?: string;
    country?: string;
    availability?: string;
    linkedin_url?: string;
    website?: string;
    avatar?: string | null;  // Make avatar optional
    active: boolean;
    status: 'pending' | 'verified';
    timeSlots?: Array<{
      day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
      start_time: string;
      end_time: string;
    }>;
  }
