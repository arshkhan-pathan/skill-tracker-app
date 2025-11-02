import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Skill, Category, ActivityLog, Todo } from './types';
import { defaultCategories } from './data/categories';

interface SkillStore {
  skills: Skill[];
  categories: Category[];
  activityLogs: ActivityLog[];

  // Skill actions
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  // Daily progress actions
  toggleDailyProgress: (skillId: string, date: string, notes?: string) => void;
  getDailyProgressForDate: (skillId: string, date: string) => boolean;
  getStreak: (skillId: string) => number;
  getTotalPracticeDays: (skillId: string) => number;

  // Todo actions
  addTodo: (skillId: string, todo: Omit<Todo, 'id'>) => void;
  toggleTodo: (skillId: string, todoId: string) => void;
  deleteTodo: (skillId: string, todoId: string) => void;
  updateTodo: (skillId: string, todoId: string, updates: Partial<Todo>) => void;

  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Activity log actions
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;

  // Utility actions
  getSkillsByCategory: (categoryId: string) => Skill[];
  getSkillsByStatus: (status: Skill['status']) => Skill[];
}

export const useSkillStore = create<SkillStore>()(
  persist(
    (set, get) => ({
      skills: [],
      categories: defaultCategories,
      activityLogs: [],

      addSkill: (skillData) => {
        const newSkill: Skill = {
          ...skillData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dailyProgress: skillData.dailyProgress || [],
          todos: skillData.todos || [],
        };

        set((state) => ({
          skills: [...state.skills, newSkill],
        }));

        get().addActivityLog({
          skillId: newSkill.id,
          action: 'created',
          description: `Created skill: ${newSkill.title}`,
        });
      },

      updateSkill: (id, updates) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === id
              ? { ...skill, ...updates, updatedAt: new Date().toISOString() }
              : skill
          ),
        }));

        if (updates.status) {
          const skill = get().skills.find(s => s.id === id);
          if (skill) {
            get().addActivityLog({
              skillId: id,
              action: 'status_changed',
              description: `Changed status to: ${updates.status}`,
            });
          }
        }
      },

      deleteSkill: (id) => {
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== id),
          activityLogs: state.activityLogs.filter((log) => log.skillId !== id),
        }));
      },

      toggleDailyProgress: (skillId, date, notes) => {
        const skill = get().skills.find(s => s.id === skillId);
        if (!skill) return;

        // Initialize dailyProgress if it doesn't exist (for existing skills)
        if (!skill.dailyProgress) {
          skill.dailyProgress = [];
        }

        const existingIndex = skill.dailyProgress.findIndex(dp => dp.date === date);
        let newDailyProgress;
        let practiced = true;

        if (existingIndex >= 0) {
          // Toggle off if already exists
          newDailyProgress = skill.dailyProgress.filter(dp => dp.date !== date);
          practiced = false;
        } else {
          // Add new entry
          newDailyProgress = [...skill.dailyProgress, { date, practiced: true, notes }];
        }

        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === skillId
              ? { ...s, dailyProgress: newDailyProgress, updatedAt: new Date().toISOString() }
              : s
          ),
        }));

        if (practiced) {
          get().addActivityLog({
            skillId,
            action: 'daily_checkin',
            description: `Practiced today${notes ? ': ' + notes : ''}`,
          });
        }
      },

      getDailyProgressForDate: (skillId, date) => {
        const skill = get().skills.find(s => s.id === skillId);
        if (!skill || !skill.dailyProgress) return false;
        return skill.dailyProgress.some(dp => dp.date === date && dp.practiced);
      },

      getStreak: (skillId) => {
        const skill = get().skills.find(s => s.id === skillId);
        if (!skill || !skill.dailyProgress || skill.dailyProgress.length === 0) return 0;

        const sortedDates = skill.dailyProgress
          .filter(dp => dp.practiced)
          .map(dp => new Date(dp.date))
          .sort((a, b) => b.getTime() - a.getTime());

        if (sortedDates.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if today or yesterday has practice (to maintain streak)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const currentDate = sortedDates[0];
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate.getTime() !== today.getTime() && currentDate.getTime() !== yesterday.getTime()) {
          return 0; // Streak broken
        }

        let expectedDate = new Date(today);
        if (currentDate.getTime() === yesterday.getTime()) {
          expectedDate = yesterday;
        }

        for (const date of sortedDates) {
          const checkDate = new Date(date);
          checkDate.setHours(0, 0, 0, 0);

          if (checkDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
          } else if (checkDate.getTime() < expectedDate.getTime()) {
            break;
          }
        }

        return streak;
      },

      getTotalPracticeDays: (skillId) => {
        const skill = get().skills.find(s => s.id === skillId);
        if (!skill || !skill.dailyProgress) return 0;
        return skill.dailyProgress.filter(dp => dp.practiced).length;
      },

      // Todo actions
      addTodo: (skillId, todoData) => {
        const newTodo: Todo = {
          ...todoData,
          id: uuidv4(),
        };

        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId
              ? {
                  ...skill,
                  todos: [...(skill.todos || []), newTodo],
                  updatedAt: new Date().toISOString(),
                }
              : skill
          ),
        }));
      },

      toggleTodo: (skillId, todoId) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId
              ? {
                  ...skill,
                  todos: (skill.todos || []).map((todo) =>
                    todo.id === todoId
                      ? {
                          ...todo,
                          completed: !todo.completed,
                          completedAt: !todo.completed ? new Date().toISOString() : undefined,
                        }
                      : todo
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : skill
          ),
        }));

        const skill = get().skills.find(s => s.id === skillId);
        const todo = skill?.todos?.find(t => t.id === todoId);
        if (skill && todo && !todo.completed) {
          get().addActivityLog({
            skillId,
            action: 'todo_completed',
            description: `Completed todo: ${todo.title}`,
          });
        }
      },

      deleteTodo: (skillId, todoId) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId
              ? {
                  ...skill,
                  todos: (skill.todos || []).filter((todo) => todo.id !== todoId),
                  updatedAt: new Date().toISOString(),
                }
              : skill
          ),
        }));
      },

      updateTodo: (skillId, todoId, updates) => {
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === skillId
              ? {
                  ...skill,
                  todos: (skill.todos || []).map((todo) =>
                    todo.id === todoId ? { ...todo, ...updates } : todo
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : skill
          ),
        }));
      },

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: uuidv4(),
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, ...updates } : category
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      addActivityLog: (logData) => {
        const newLog: ActivityLog = {
          ...logData,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          activityLogs: [newLog, ...state.activityLogs].slice(0, 100), // Keep last 100 logs
        }));
      },

      getSkillsByCategory: (categoryId) => {
        return get().skills.filter((skill) => skill.category === categoryId);
      },

      getSkillsByStatus: (status) => {
        return get().skills.filter((skill) => skill.status === status);
      },
    }),
    {
      name: 'skill-tracker-storage',
    }
  )
);
