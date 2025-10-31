export interface DailyProgress {
  date: string; // ISO date string (YYYY-MM-DD)
  practiced: boolean;
  notes?: string;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'to-learn' | 'learning' | 'practiced' | 'mastered';
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
  tags: string[];
  resources: Resource[];
  targetDate?: string;
  dailyProgress: DailyProgress[];
  todos: Todo[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'video' | 'book' | 'course' | 'other';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface ActivityLog {
  id: string;
  skillId: string;
  action: 'created' | 'updated' | 'milestone_completed' | 'status_changed' | 'daily_checkin' | 'todo_completed';
  description: string;
  timestamp: string;
}
