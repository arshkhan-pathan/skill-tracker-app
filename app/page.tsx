'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { Dashboard } from '@/components/dashboard';
import { TodosView } from '@/components/todos-view';
import { SkillDialog } from '@/components/skill-dialog';
import { SampleDataSeeder } from '@/components/sample-data-seeder';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeVariantSwitcher } from '@/components/theme-variant-switcher';
import { Skill } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, LayoutDashboard, KanbanSquare, List, ListTodo } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | undefined>(undefined);

  const handleAddSkill = () => {
    setSelectedSkill(undefined);
    setDialogOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setSelectedSkill(skill);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Skill Tracker
              </h1>
              <p className="text-muted-foreground mt-1">
                Define, manage, and track your learning journey
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeVariantSwitcher />
              <ThemeToggle />
              <Button onClick={handleAddSkill} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Skill
              </Button>
            </div>
          </div>
        </div>

        {/* Sample Data Seeder */}
        <SampleDataSeeder />

        {/* Main Content */}
        <Tabs defaultValue="kanban" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="kanban" className="gap-2">
                <KanbanSquare className="h-4 w-4" />
                Kanban Board
              </TabsTrigger>
              <TabsTrigger value="todos" className="gap-2">
                <ListTodo className="h-4 w-4" />
                Todos
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>
            <Link href="/all-skills">
              <Button variant="outline" className="gap-2">
                <List className="h-4 w-4" />
                View All Skills
              </Button>
            </Link>
          </div>

          <TabsContent value="kanban" className="space-y-4">
            <KanbanBoard onAddSkill={handleAddSkill} onEditSkill={handleEditSkill} />
          </TabsContent>

          <TabsContent value="todos" className="space-y-4">
            <TodosView />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard />
          </TabsContent>
        </Tabs>

        {/* Skill Dialog */}
        <SkillDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          skill={selectedSkill}
        />
      </div>
    </div>
  );
}
