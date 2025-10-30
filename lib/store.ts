import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skill, Category, ActivityLog } from './types';
import { defaultCategories } from './data/categories';

interface SkillStore {
  skills: Skill[];
  categories: Category[];
  activityLogs: ActivityLog[];

  // Skill actions
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

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
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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

      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
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
          id: crypto.randomUUID(),
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
