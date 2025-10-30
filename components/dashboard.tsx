'use client';

import { useSkillStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Activity,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const { skills, categories, activityLogs } = useSkillStore();

  const stats = {
    total: skills.length,
    toLearn: skills.filter((s) => s.status === 'to-learn').length,
    learning: skills.filter((s) => s.status === 'learning').length,
    practiced: skills.filter((s) => s.status === 'practiced').length,
    mastered: skills.filter((s) => s.status === 'mastered').length,
    avgProgress: skills.length > 0
      ? Math.round(skills.reduce((acc, skill) => acc + skill.progress, 0) / skills.length)
      : 0,
  };

  const statusData = [
    { name: 'To Learn', value: stats.toLearn, color: COLORS[0] },
    { name: 'Learning', value: stats.learning, color: COLORS[1] },
    { name: 'Practiced', value: stats.practiced, color: COLORS[2] },
    { name: 'Mastered', value: stats.mastered, color: COLORS[3] },
  ].filter((item) => item.value > 0);

  const categoryData = categories
    .map((category) => ({
      name: category.name,
      count: skills.filter((skill) => skill.category === category.id).length,
      color: category.color,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);


  const recentActivity = activityLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.learning} currently learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
            <Progress value={stats.avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mastered</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mastered}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Skills completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills by Status */}
        {statusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Skills by Category */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((log) => {
                const skill = skills.find((s) => s.id === log.skillId);
                return (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5">
                      {log.action === 'created' && <Target className="h-4 w-4 text-blue-500" />}
                      {log.action === 'status_changed' && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {log.action === 'milestone_completed' && <Award className="h-4 w-4 text-yellow-500" />}
                      {log.action === 'updated' && <Activity className="h-4 w-4 text-purple-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        {log.description}
                        {skill && <span className="font-medium"> - {skill.title}</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {skills.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No skills tracked yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Start your learning journey by adding your first skill. Track your progress and
              watch your dashboard come to life!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
