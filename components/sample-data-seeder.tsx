'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSkillStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const sampleSkills = [
  {
    title: 'Learn TypeScript',
    description: 'Master TypeScript for type-safe JavaScript development',
    category: '1', // Programming Languages
    status: 'learning' as const,
    progress: 45,
    timeSpent: 240,
    tags: ['javascript', 'typescript', 'web'],
    milestones: [
      {
        id: uuidv4(),
        title: 'Complete basic types tutorial',
        description: 'Learn primitive types, interfaces, and type aliases',
        completed: true,
      },
      {
        id: uuidv4(),
        title: 'Build a TypeScript project',
        description: 'Create a real-world application using TypeScript',
        completed: false,
      },
    ],
    resources: [
      {
        id: uuidv4(),
        title: 'TypeScript Official Documentation',
        url: 'https://www.typescriptlang.org/docs/',
        type: 'article' as const,
      },
    ],
    dailyProgress: [],
    todos: [],
  },
  {
    title: 'React Hooks',
    description: 'Master React hooks including custom hooks',
    category: '2', // Web Development
    status: 'practiced' as const,
    progress: 75,
    timeSpent: 180,
    tags: ['react', 'hooks', 'frontend'],
    milestones: [
      {
        id: uuidv4(),
        title: 'Learn useState and useEffect',
        description: 'Master the fundamental React hooks',
        completed: true,
      },
      {
        id: uuidv4(),
        title: 'Create custom hooks',
        description: 'Build reusable custom hooks for common patterns',
        completed: true,
      },
    ],
    resources: [],
    dailyProgress: [],
    todos: [],
  },
  {
    title: 'Python Machine Learning',
    description: 'Learn ML algorithms with scikit-learn and TensorFlow',
    category: '4', // Data Science & AI
    status: 'to-learn' as const,
    progress: 0,
    timeSpent: 0,
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: ['python', 'ml', 'ai', 'data-science'],
    milestones: [
      {
        id: uuidv4(),
        title: 'Complete ML basics course',
        description: 'Understand fundamental ML concepts',
        completed: false,
      },
    ],
    resources: [],
    dailyProgress: [],
    todos: [],
  },
  {
    title: 'Docker & Kubernetes',
    description: 'Container orchestration and deployment',
    category: '5', // Cloud & DevOps
    status: 'learning' as const,
    progress: 30,
    timeSpent: 120,
    tags: ['docker', 'kubernetes', 'devops', 'containers'],
    milestones: [],
    resources: [
      {
        id: uuidv4(),
        title: 'Docker Getting Started',
        url: 'https://docs.docker.com/get-started/',
        type: 'article' as const,
      },
    ],
    dailyProgress: [],
    todos: [],
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn design thinking and user-centered design',
    category: '6', // Design
    status: 'to-learn' as const,
    progress: 10,
    timeSpent: 30,
    tags: ['design', 'ux', 'ui'],
    milestones: [],
    resources: [],
    dailyProgress: [],
    todos: [],
  },
  {
    title: 'Git Advanced Workflows',
    description: 'Master Git branching, rebasing, and collaboration',
    category: '9', // Tools & Frameworks
    status: 'mastered' as const,
    progress: 100,
    timeSpent: 300,
    tags: ['git', 'version-control', 'collaboration'],
    milestones: [
      {
        id: uuidv4(),
        title: 'Learn Git basics',
        description: 'Commit, push, pull, and branch',
        completed: true,
      },
      {
        id: uuidv4(),
        title: 'Master rebasing and merging',
        description: 'Handle complex merge scenarios',
        completed: true,
      },
    ],
    resources: [],
    dailyProgress: [],
    todos: [],
  },
];

export function SampleDataSeeder() {
  const { skills, addSkill } = useSkillStore();
  const [seeded, setSeeded] = useState(false);

  const loadSampleData = () => {
    sampleSkills.forEach((skill) => {
      addSkill(skill);
    });
    setSeeded(true);
  };

  // Don't show if already seeded or if skills exist
  if (seeded || skills.length > 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-2 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Get Started Quickly
        </CardTitle>
        <CardDescription>
          Load sample skills to see how the tracker works, or start fresh by adding your own skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={loadSampleData} className="gap-2">
          <Sparkles className="h-4 w-4" />
          Load Sample Skills
        </Button>
      </CardContent>
    </Card>
  );
}
