'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSkillStore } from '@/lib/store';
import { Skill } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Search, Filter, Target } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AllSkillsPage() {
  const router = useRouter();
  const { skills, categories } = useSkillStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getStatusLabel = (status: Skill['status']) => {
    const labels = {
      'to-learn': 'To Learn',
      'learning': 'Learning',
      'practiced': 'Practiced',
      'mastered': 'Mastered',
    };
    return labels[status];
  };

  const getStatusColor = (status: Skill['status']) => {
    const colors = {
      'to-learn': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      'learning': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'practiced': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'mastered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[status];
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || skill.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  All Skills
                </h1>
                <p className="text-muted-foreground mt-1">
                  View and manage all your skills
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="to-learn">To Learn</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="practiced">Practiced</SelectItem>
                <SelectItem value="mastered">Mastered</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skills Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSkills.length} of {skills.length} skills
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => {
            const category = getCategoryById(skill.category);
            return (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-base line-clamp-2">
                      {skill.title}
                    </CardTitle>
                    <Badge className={getStatusColor(skill.status)}>
                      {getStatusLabel(skill.status)}
                    </Badge>
                  </div>
                  {category && (
                    <Badge
                      variant="outline"
                      style={{ borderColor: category.color, color: category.color }}
                      className="w-fit"
                    >
                      {category.name}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {skill.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>
                  )}

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>

                  {skill.targetDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Target className="h-3 w-3" />
                      <span>{new Date(skill.targetDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {skill.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {skill.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{skill.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {skill.milestones.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {skill.milestones.filter(m => m.completed).length} / {skill.milestones.length} milestones
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredSkills.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No skills found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {skills.length === 0
                  ? 'Start your learning journey by adding your first skill.'
                  : 'Try adjusting your search or filters.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
