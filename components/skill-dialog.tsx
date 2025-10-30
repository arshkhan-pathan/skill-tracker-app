'use client';

import { useState, useEffect } from 'react';
import { useSkillStore } from '@/lib/store';
import { Skill, Milestone, Resource } from '@/lib/types';
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
import { Trash2, Plus, X, CheckCircle } from 'lucide-react';

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill;
}

export function SkillDialog({ open, onOpenChange, skill }: SkillDialogProps) {
  const { addSkill, updateSkill, deleteSkill, categories } = useSkillStore();

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
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
