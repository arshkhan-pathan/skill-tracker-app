'use client';

import { useState } from 'react';
import { KanbanBoard } from '@/components/kanban-board';
import { Dashboard } from '@/components/dashboard';
import { TodosView } from '@/components/todos-view';
import { SkillDialog } from '@/components/skill-dialog';
import { SampleDataSeeder } from '@/components/sample-data-seeder';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeVariantSwitcher } from '@/components/theme-variant-switcher';
import { YouTubeBackground } from '@/components/youtube-background';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-black dark:via-gray-950 dark:to-black relative">
      {/* YouTube Background Video */}
      <YouTubeBackground videoId="iKBs9l8jS6Q" opacity={0.12} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Skill Tracker
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Define, manage, and track your learning journey
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ThemeVariantSwitcher />
              <ThemeToggle />
              <Button onClick={handleAddSkill} size="default" className="gap-2 flex-1 sm:flex-initial">
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:inline">Add Skill</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Sample Data Seeder */}
        <SampleDataSeeder />

        {/* Main Content */}
        <Tabs defaultValue="kanban" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
            <TabsList className="grid w-full sm:max-w-2xl grid-cols-3">
              <TabsTrigger value="kanban" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <KanbanSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Kanban Board</span>
                <span className="sm:hidden">Kanban</span>
              </TabsTrigger>
              <TabsTrigger value="todos" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <ListTodo className="h-3 w-3 sm:h-4 sm:w-4" />
                Todos
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>
            <Link href="/all-skills" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
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
