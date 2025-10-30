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
  action: 'created' | 'updated' | 'milestone_completed' | 'status_changed';
  description: string;
  timestamp: string;
}
