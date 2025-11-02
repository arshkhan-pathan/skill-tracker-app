'use client';

import { useSkillStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Flame,
  Calendar,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const { skills, categories, activityLogs, getStreak, getTotalPracticeDays } = useSkillStore();

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

  // Daily progress stats
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const todayDate = getTodayDate();

  const dailyStats = {
    practicedToday: skills.filter(skill =>
      skill.dailyProgress && skill.dailyProgress.some(dp => dp.date === todayDate && dp.practiced)
    ).length,
    activeSkills: skills.filter(s => s.status === 'learning' || s.status === 'practiced').length,
    totalStreaks: skills.reduce((acc, skill) => acc + getStreak(skill.id), 0),
    maxStreak: Math.max(0, ...skills.map(skill => getStreak(skill.id))),
    totalPracticeDays: skills.reduce((acc, skill) => acc + getTotalPracticeDays(skill.id), 0),
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
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Skills</CardTitle>
            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {stats.learning} learning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{stats.avgProgress}%</div>
            <Progress value={stats.avgProgress} className="mt-2 h-1 sm:h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-900 dark:text-green-300">Today</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
              {dailyStats.practicedToday}/{dailyStats.activeSkills}
            </div>
            <p className="text-[10px] sm:text-xs text-green-700 dark:text-green-500 mt-1">
              Active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-900 dark:text-orange-300">Streak</CardTitle>
            <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-400">{dailyStats.maxStreak}</div>
            <p className="text-[10px] sm:text-xs text-orange-700 dark:text-orange-500 mt-1">
              days
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Days</CardTitle>
            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{dailyStats.totalPracticeDays}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              practiced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Skills by Status */}
        {statusData.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Skills by Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Skills by Category */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Skills by Category</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
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
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((log) => {
                const skill = skills.find((s) => s.id === log.skillId);
                return (
                  <div key={log.id} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="mt-0.5">
                      {log.action === 'created' && <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />}
                      {log.action === 'status_changed' && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />}
                      {log.action === 'milestone_completed' && <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />}
                      {log.action === 'updated' && <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs sm:text-sm">
                        {log.description}
                        {skill && <span className="font-medium"> - {skill.title}</span>}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
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
