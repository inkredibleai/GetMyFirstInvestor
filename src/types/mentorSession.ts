export interface MentorSession {
  id: string;
  mentor_id: string;
  founder_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meeting_link?: string;
  notes?: string;
  created_at: string;
}
