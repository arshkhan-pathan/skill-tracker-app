'use client';

import { useState, useMemo } from 'react';
import { useSkillStore } from '@/lib/store';
import { Todo, Skill } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  ListTodo,
  Filter,
  Edit2,
  X,
} from 'lucide-react';

type FilterStatus = 'all' | 'active' | 'completed';
type FilterPriority = 'all' | 'high' | 'medium' | 'low';
type SortBy = 'dueDate' | 'priority' | 'created' | 'skill';

interface TodoWithSkill extends Todo {
  skill: Skill;
  skillId: string;
}

export function TodosView() {
  const { skills, addTodo, toggleTodo, deleteTodo, updateTodo, categories } = useSkillStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<{ todo: TodoWithSkill; skillId: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('active');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    skillId: '',
    priority: 'medium' as Todo['priority'],
    dueDate: '',
  });

  // Get all todos with their associated skills
  const allTodos = useMemo(() => {
    const todos: TodoWithSkill[] = [];
    skills.forEach((skill) => {
      if (skill.todos && skill.todos.length > 0) {
        skill.todos.forEach((todo) => {
          todos.push({ ...todo, skill, skillId: skill.id });
        });
      }
    });
    return todos;
  }, [skills]);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    let filtered = allTodos;

    // Filter by status
    if (filterStatus === 'active') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filterStatus === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    // Filter by priority
    if (filterPriority !== 'all') {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    // Filter by skill
    if (filterSkill !== 'all') {
      filtered = filtered.filter((t) => t.skillId === filterSkill);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) =>
        t.title.toLowerCase().includes(query) ||
        t.skill.title.toLowerCase().includes(query)
      );
    }

    // Sort todos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'skill':
          return a.skill.title.localeCompare(b.skill.title);
        case 'created':
        default:
          return 0;
      }
    });

    return filtered;
  }, [allTodos, filterStatus, filterPriority, filterSkill, sortBy, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = allTodos.length;
    const completed = allTodos.filter((t) => t.completed).length;
    const active = total - completed;
    const highPriority = allTodos.filter((t) => !t.completed && t.priority === 'high').length;
    const overdue = allTodos.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    return { total, completed, active, highPriority, overdue };
  }, [allTodos]);

  const handleOpenDialog = (todo?: TodoWithSkill, skillId?: string) => {
    if (todo && skillId) {
      setEditingTodo({ todo, skillId });
      setFormData({
        title: todo.title,
        skillId,
        priority: todo.priority,
        dueDate: todo.dueDate || '',
      });
    } else {
      setEditingTodo(null);
      setFormData({
        title: '',
        skillId: skills[0]?.id || '',
        priority: 'medium',
        dueDate: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTodo(null);
    setFormData({
      title: '',
      skillId: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.skillId) return;

    if (editingTodo) {
      updateTodo(editingTodo.skillId, editingTodo.todo.id, {
        title: formData.title,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      });
    } else {
      addTodo(formData.skillId, {
        title: formData.title,
        completed: false,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
      });
    }

    handleCloseDialog();
  };

  const handleToggle = (todo: TodoWithSkill) => {
    toggleTodo(todo.skillId, todo.id);
  };

  const handleDelete = (todo: TodoWithSkill) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      deleteTodo(todo.skillId, todo.id);
    }
  };

  const isOverdue = (todo: TodoWithSkill) => {
    if (todo.completed || !todo.dueDate) return false;
    return new Date(todo.dueDate) < new Date();
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
    }
  };

  const getPriorityIcon = (priority: Todo['priority']) => {
    const className = priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-gray-400';
    return <AlertCircle className={`h-4 w-4 ${className}`} />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All todos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">Not completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-900 dark:text-red-300">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{stats.highPriority}</div>
            <p className="text-xs text-red-700 dark:text-red-500 mt-1">Urgent tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-300">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.overdue}</div>
            <p className="text-xs text-orange-700 dark:text-orange-500 mt-1">Past deadline</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              <CardTitle>All Todos</CardTitle>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Todo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Input
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={(value) => setFilterPriority(value as FilterPriority)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSkill} onValueChange={setFilterSkill}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {skills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="skill">Skill</SelectItem>
                <SelectItem value="created">Created</SelectItem>
              </SelectContent>
            </Select>

            {(filterStatus !== 'active' || filterPriority !== 'all' || filterSkill !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterStatus('active');
                  setFilterPriority('all');
                  setFilterSkill('all');
                  setSearchQuery('');
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Todos List */}
          <div className="space-y-2 mt-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <ListTodo className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {allTodos.length === 0
                    ? 'No todos yet. Create your first todo to get started!'
                    : 'No todos match your filters.'}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => {
                const category = categories.find((c) => c.id === todo.skill.category);
                const overdueStatus = isOverdue(todo);

                return (
                  <Card
                    key={`${todo.skillId}-${todo.id}`}
                    className={`${todo.completed ? 'opacity-60' : ''} ${overdueStatus ? 'border-orange-500 dark:border-orange-600' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggle(todo)}
                          className="mt-1"
                        >
                          {todo.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 fill-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {todo.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  style={{ borderColor: category?.color, color: category?.color }}
                                  className="text-xs"
                                >
                                  {todo.skill.title}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getPriorityColor(todo.priority)}`}
                                >
                                  {getPriorityIcon(todo.priority)}
                                  <span className="ml-1 capitalize">{todo.priority}</span>
                                </Badge>
                                {todo.dueDate && (
                                  <div
                                    className={`flex items-center gap-1 text-xs ${
                                      overdueStatus
                                        ? 'text-orange-600 dark:text-orange-400 font-medium'
                                        : 'text-muted-foreground'
                                    }`}
                                  >
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {new Date(todo.dueDate).toLocaleDateString()}
                                      {overdueStatus && ' (Overdue)'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(todo, todo.skillId)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(todo)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</DialogTitle>
            <DialogDescription>
              {editingTodo ? 'Update your todo details' : 'Create a new todo item'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill">Skill *</Label>
                <Select
                  value={formData.skillId}
                  onValueChange={(value) => setFormData({ ...formData, skillId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as Todo['priority'] })}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTodo ? 'Update' : 'Create'} Todo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
