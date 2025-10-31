'use client';

import { useState, useEffect } from 'react';
import { useSkillStore } from '@/lib/store';
import { Skill, Milestone, Resource, Todo } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus, X, CheckCircle, Flame, Calendar, TrendingUp, Clock, ListTodo, AlertCircle } from 'lucide-react';

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill;
}

export function SkillDialog({ open, onOpenChange, skill }: SkillDialogProps) {
  const {
    addSkill,
    updateSkill,
    deleteSkill,
    categories,
    getStreak,
    getTotalPracticeDays,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
  } = useSkillStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'to-learn' as Skill['status'],
    progress: 0,
    targetDate: '',
    tags: [] as string[],
    milestones: [] as Milestone[],
    resources: [] as Resource[],
  });

  const [tagInput, setTagInput] = useState('');
  const [milestoneInput, setMilestoneInput] = useState({ title: '', description: '' });
  const [resourceInput, setResourceInput] = useState({ title: '', url: '', type: 'article' as Resource['type'] });
  const [todoInput, setTodoInput] = useState({ title: '', priority: 'medium' as Todo['priority'], dueDate: '' });

  useEffect(() => {
    if (skill) {
      setFormData({
        title: skill.title,
        description: skill.description,
        category: skill.category,
        status: skill.status,
        progress: skill.progress,
        targetDate: skill.targetDate || '',
        tags: skill.tags,
        milestones: skill.milestones,
        resources: skill.resources,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: categories[0]?.id || '',
        status: 'to-learn',
        progress: 0,
        targetDate: '',
        tags: [],
        milestones: [],
        resources: [],
      });
    }
  }, [skill, open, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) return;

    if (skill) {
      updateSkill(skill.id, formData);
    } else {
      addSkill(formData);
    }

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (skill && confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(skill.id);
      onOpenChange(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addMilestone = () => {
    if (milestoneInput.title.trim()) {
      const newMilestone: Milestone = {
        id: crypto.randomUUID(),
        title: milestoneInput.title,
        description: milestoneInput.description,
        completed: false,
      };
      setFormData({ ...formData, milestones: [...formData.milestones, newMilestone] });
      setMilestoneInput({ title: '', description: '' });
    }
  };

  const toggleMilestone = (id: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.map((m) =>
        m.id === id
          ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date().toISOString() : undefined }
          : m
      ),
    });
  };

  const removeMilestone = (id: string) => {
    setFormData({ ...formData, milestones: formData.milestones.filter((m) => m.id !== id) });
  };

  const addResource = () => {
    if (resourceInput.title.trim() && resourceInput.url.trim()) {
      const newResource: Resource = {
        id: crypto.randomUUID(),
        title: resourceInput.title,
        url: resourceInput.url,
        type: resourceInput.type,
      };
      setFormData({ ...formData, resources: [...formData.resources, newResource] });
      setResourceInput({ title: '', url: '', type: 'article' });
    }
  };

  const removeResource = (id: string) => {
    setFormData({ ...formData, resources: formData.resources.filter((r) => r.id !== id) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{skill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          <DialogDescription>
            {skill ? 'Update your skill details and track your progress' : 'Define a new skill to learn and track your journey'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Learn React.js"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of what you want to learn"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Skill['status'] })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-learn">To Learn</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="practiced">Practiced</SelectItem>
                      <SelectItem value="mastered">Mastered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Progress: {formData.progress}%</Label>
                <input
                  type="range"
                  id="progress"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
                <Progress value={formData.progress} className="h-2" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="todos" className="space-y-4">
              {skill ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="todo-title">Add Todo</Label>
                    <Input
                      id="todo-title"
                      placeholder="What needs to be done?"
                      value={todoInput.title}
                      onChange={(e) => setTodoInput({ ...todoInput, title: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (todoInput.title.trim()) {
                            addTodo(skill.id, {
                              title: todoInput.title,
                              completed: false,
                              priority: todoInput.priority,
                              dueDate: todoInput.dueDate || undefined,
                            });
                            setTodoInput({ title: '', priority: 'medium', dueDate: '' });
                          }
                        }
                      }}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={todoInput.priority}
                        onValueChange={(value) => setTodoInput({ ...todoInput, priority: value as Todo['priority'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="date"
                        value={todoInput.dueDate}
                        onChange={(e) => setTodoInput({ ...todoInput, dueDate: e.target.value })}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        if (todoInput.title.trim()) {
                          addTodo(skill.id, {
                            title: todoInput.title,
                            completed: false,
                            priority: todoInput.priority,
                            dueDate: todoInput.dueDate || undefined,
                          });
                          setTodoInput({ title: '', priority: 'medium', dueDate: '' });
                        }
                      }}
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Todo
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {skill.todos && skill.todos.length > 0 ? (
                      <>
                        {['high', 'medium', 'low'].map((priority) => {
                          const todos = (skill.todos || []).filter(t => t.priority === priority && !t.completed);
                          if (todos.length === 0) return null;

                          return (
                            <div key={priority} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <AlertCircle className={`h-4 w-4 ${
                                  priority === 'high' ? 'text-red-500' :
                                  priority === 'medium' ? 'text-yellow-500' :
                                  'text-gray-400'
                                }`} />
                                <span className="text-sm font-medium capitalize">{priority} Priority</span>
                              </div>
                              {todos.map((todo) => (
                                <div
                                  key={todo.id}
                                  className="flex items-start gap-3 p-3 border rounded-lg"
                                >
                                  <button
                                    type="button"
                                    onClick={() => toggleTodo(skill.id, todo.id)}
                                    className="mt-1"
                                  >
                                    {todo.completed ? (
                                      <CheckCircle className="h-5 w-5 text-green-500 fill-green-500" />
                                    ) : (
                                      <div className="h-5 w-5 border-2 rounded-full" />
                                    )}
                                  </button>
                                  <div className="flex-1">
                                    <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                      {todo.title}
                                    </p>
                                    {todo.dueDate && (
                                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(todo.dueDate).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => deleteTodo(skill.id, todo.id)}
                                    className="text-destructive hover:text-destructive/80"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          );
                        })}

                        {(skill.todos || []).filter(t => t.completed).length > 0 && (
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-muted-foreground">Completed</span>
                            {(skill.todos || []).filter(t => t.completed).map((todo) => (
                              <div
                                key={todo.id}
                                className="flex items-start gap-3 p-3 border rounded-lg bg-muted/50"
                              >
                                <CheckCircle className="h-5 w-5 text-green-500 fill-green-500 mt-1" />
                                <div className="flex-1">
                                  <p className="font-medium line-through text-muted-foreground">
                                    {todo.title}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => deleteTodo(skill.id, todo.id)}
                                  className="text-destructive hover:text-destructive/80"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No todos yet. Add tasks to track what needs to be done!
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Create the skill to start adding todos
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="milestones" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="milestone-title">Add Milestone</Label>
                <Input
                  id="milestone-title"
                  placeholder="Milestone title"
                  value={milestoneInput.title}
                  onChange={(e) => setMilestoneInput({ ...milestoneInput, title: e.target.value })}
                />
                <Input
                  placeholder="Description (optional)"
                  value={milestoneInput.description}
                  onChange={(e) => setMilestoneInput({ ...milestoneInput, description: e.target.value })}
                />
                <Button type="button" onClick={addMilestone} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-2">
                {formData.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <button
                      type="button"
                      onClick={() => toggleMilestone(milestone.id)}
                      className="mt-1"
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${
                          milestone.completed ? 'text-green-500 fill-green-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                    <div className="flex-1">
                      <p className={`font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {milestone.title}
                      </p>
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMilestone(milestone.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.milestones.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No milestones yet. Add your first milestone above!
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resource-title">Add Resource</Label>
                <Input
                  id="resource-title"
                  placeholder="Resource title"
                  value={resourceInput.title}
                  onChange={(e) => setResourceInput({ ...resourceInput, title: e.target.value })}
                />
                <Input
                  placeholder="URL"
                  value={resourceInput.url}
                  onChange={(e) => setResourceInput({ ...resourceInput, url: e.target.value })}
                />
                <Select
                  value={resourceInput.type}
                  onValueChange={(value) => setResourceInput({ ...resourceInput, type: value as Resource['type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addResource} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>

              <div className="space-y-2">
                {formData.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-start gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{resource.title}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {resource.url}
                      </a>
                      <Badge variant="outline" className="mt-1">
                        {resource.type}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResource(resource.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.resources.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No resources yet. Add learning resources above!
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              {skill ? (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 dark:border-orange-900/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Current Streak</span>
                      </div>
                      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{getStreak(skill.id)}</p>
                      <p className="text-xs text-orange-700 dark:text-orange-500 mt-1">days in a row</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 dark:border-blue-900/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Total Days</span>
                      </div>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{getTotalPracticeDays(skill.id)}</p>
                      <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">days practiced</p>
                    </div>

                    <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 dark:border-green-900/30">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-900 dark:text-green-300">This Week</span>
                      </div>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {(() => {
                          if (!skill.dailyProgress) return 0;
                          const today = new Date();
                          const weekAgo = new Date(today);
                          weekAgo.setDate(today.getDate() - 7);
                          return skill.dailyProgress.filter(dp => {
                            const dpDate = new Date(dp.date);
                            return dp.practiced && dpDate >= weekAgo && dpDate <= today;
                          }).length;
                        })()}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-500 mt-1">days this week</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Recent Activity (Last 30 Days)</Label>
                    <div className="border rounded-lg p-4">
                      <div className="grid grid-cols-7 gap-1.5">
                        {(() => {
                          const days = [];
                          const today = new Date();
                          for (let i = 29; i >= 0; i--) {
                            const date = new Date(today);
                            date.setDate(today.getDate() - i);
                            const dateStr = date.toISOString().split('T')[0];
                            const practiced = skill.dailyProgress && skill.dailyProgress.some(dp => dp.date === dateStr && dp.practiced);
                            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
                            const dayOfMonth = date.getDate();

                            days.push(
                              <div key={dateStr} className="flex flex-col items-center">
                                <div
                                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition-colors ${
                                    practiced
                                      ? 'bg-green-500 dark:bg-green-600 text-white font-medium'
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                                  }`}
                                  title={`${dateStr}${practiced ? ' - Practiced' : ''}`}
                                >
                                  {dayOfMonth}
                                </div>
                                {i % 7 === 6 && (
                                  <span className="text-[10px] text-muted-foreground mt-0.5">{dayOfWeek}</span>
                                )}
                              </div>
                            );
                          }
                          return days;
                        })()}
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800"></div>
                          <span>Not practiced</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-green-500 dark:bg-green-600"></div>
                          <span>Practiced</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {skill.dailyProgress && skill.dailyProgress.length > 0 && (
                    <div className="space-y-2">
                      <Label>Progress History</Label>
                      <div className="border rounded-lg max-h-60 overflow-y-auto">
                        {skill.dailyProgress
                          .filter(dp => dp.practiced)
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 10)
                          .map((dp) => (
                            <div
                              key={dp.date}
                              className="p-3 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="font-medium">
                                    {new Date(dp.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                              </div>
                              {dp.notes && (
                                <p className="text-sm text-muted-foreground mt-1 ml-6">{dp.notes}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {(!skill.dailyProgress || skill.dailyProgress.filter(dp => dp.practiced).length === 0) && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No practice recorded yet. Start tracking your daily progress!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Create the skill to start tracking daily progress
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6 gap-2">
            {skill && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {skill ? 'Update' : 'Create'} Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
