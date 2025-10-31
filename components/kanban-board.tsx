'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useSkillStore } from '@/lib/store';
import { Skill } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, CheckCircle2, Circle, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanColumn {
  id: Skill['status'];
  title: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: 'to-learn', title: 'To Learn', color: 'bg-slate-100 dark:bg-slate-900/50 dark:border dark:border-slate-800/50' },
  { id: 'learning', title: 'Learning', color: 'bg-blue-50 dark:bg-blue-950/30 dark:border dark:border-blue-900/50' },
  { id: 'practiced', title: 'Practiced', color: 'bg-amber-50 dark:bg-amber-950/20 dark:border dark:border-amber-900/40' },
];

interface KanbanBoardProps {
  onAddSkill: () => void;
  onEditSkill: (skill: Skill) => void;
}

export function KanbanBoard({ onAddSkill, onEditSkill }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);
  const { skills, updateSkill, categories, toggleDailyProgress, getDailyProgressForDate, getStreak } = useSkillStore();

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newStatus = destination.droppableId as Skill['status'];
    updateSkill(draggableId, { status: newStatus });
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const getSkillsByStatus = (status: Skill['status']) => {
    return skills.filter((skill) => skill.status === status);
  };


  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-[700px]`}>
            <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">{column.title}</h3>
            <div className="space-y-3 text-gray-900 dark:text-gray-100">Loading...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className={`${column.color} rounded-lg p-4 min-h-[700px]`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{column.title}</h3>
              <Badge variant="secondary">{getSkillsByStatus(column.id).length}</Badge>
            </div>

            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[600px] transition-colors ${
                    snapshot.isDraggingOver ? 'bg-white/50 dark:bg-slate-800/40' : ''
                  }`}
                >
                  {getSkillsByStatus(column.id).map((skill, index) => {
                    const category = getCategoryById(skill.category);
                    const todayDate = getTodayDate();
                    const isPracticedToday = getDailyProgressForDate(skill.id, todayDate);
                    const currentStreak = getStreak(skill.id);

                    return (
                      <Draggable key={skill.id} draggableId={skill.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              className={`hover:shadow-md transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              }`}
                            >
                              <CardHeader className="pb-2 pt-3 px-3">
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-sm line-clamp-1 cursor-pointer" onClick={() => onEditSkill(skill)}>
                                    {skill.title}
                                  </CardTitle>
                                  {category && (
                                    <Badge
                                      variant="outline"
                                      style={{ borderColor: category.color, color: category.color }}
                                      className="shrink-0 text-xs"
                                    >
                                      {category.name}
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 pb-3 px-3" onClick={() => onEditSkill(skill)}>
                                <div className="space-y-0.5">
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{skill.progress}%</span>
                                  </div>
                                  <Progress value={skill.progress} className="h-1.5" />
                                </div>

                                {skill.targetDate && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Target className="h-3 w-3" />
                                    <span>{new Date(skill.targetDate).toLocaleDateString()}</span>
                                  </div>
                                )}

                                {skill.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {skill.tags.slice(0, 2).map((tag, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs py-0 px-1.5">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {skill.tags.length > 2 && (
                                      <Badge variant="secondary" className="text-xs py-0 px-1.5">
                                        +{skill.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}

                                <div className="pt-1 border-t flex items-center justify-between">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDailyProgress(skill.id, todayDate);
                                    }}
                                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                                      isPracticedToday
                                        ? 'text-green-600 dark:text-green-400 font-medium'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {isPracticedToday ? (
                                      <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                      <Circle className="h-4 w-4" />
                                    )}
                                    <span>{isPracticedToday ? 'Practiced today' : 'Mark as practiced'}</span>
                                  </button>
                                  {currentStreak > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                                      <Flame className="h-3.5 w-3.5" />
                                      <span>{currentStreak}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}

                  {column.id === 'to-learn' && getSkillsByStatus(column.id).length === 0 && (
                    <Button
                      variant="outline"
                      className="w-full border-dashed"
                      onClick={onAddSkill}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add your first skill
                    </Button>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
