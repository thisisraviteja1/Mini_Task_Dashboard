'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, RefreshCw, CheckSquare, ListTodo, TrendingUp, AlertCircle } from 'lucide-react'
import TaskBoard from '@/components/TaskBoard'
import TaskForm from '@/components/TaskForm'

function StatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div
      className="rounded-xl px-5 py-4 flex items-center gap-3"
      style={{ backgroundColor: bg, border: '1px solid transparent' }}
    >
      <div className="p-2 rounded-lg" style={{ backgroundColor: color + '22' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [notification, setNotification] = useState(null)
  const [filter, setFilter] = useState('all')

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const fetchTasks = useCallback(async () => {
    try {
      setError(null)
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleCreate = async (formData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create task')
      }
      const newTask = await res.json()
      setTasks(prev => [newTask, ...prev])
      setShowForm(false)
      notify('Task created successfully!')
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleUpdate = async (formData) => {
    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to update task')
      }
      const updated = await res.json()
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      setEditingTask(null)
      notify('Task updated successfully!')
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete task')
      setTasks(prev => prev.filter(t => t.id !== id))
      notify('Task deleted.')
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  // Stats
  const total = tasks.length
  const todo = tasks.filter(t => t.status === 'todo').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completed = tasks.filter(t => t.status === 'completed').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  // Filter tasks for board
  const today = new Date().toISOString().split('T')[0]
  const filteredTasks = filter === 'overdue'
    ? tasks.filter(t => t.due_date && t.due_date < today && t.status !== 'completed')
    : filter === 'today'
    ? tasks.filter(t => t.due_date && t.due_date.startsWith(today))
    : tasks

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Notification toast */}
      {notification && (
        <div
          className="fixed top-5 right-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-up"
          style={{
            backgroundColor: notification.type === 'error' ? 'var(--accent)' : 'var(--text-primary)',
            color: '#fff',
          }}
        >
          {notification.type === 'error' ? <AlertCircle size={16} /> : <CheckSquare size={16} />}
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className="border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--text-primary)' }}
            >
              <CheckSquare size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', lineHeight: 1 }}>
                TaskFlow
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Task Management Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTasks}
              className="p-2.5 rounded-xl transition-colors hover:bg-gray-100"
              style={{ color: 'var(--text-muted)' }}
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => { setEditingTask(null); setShowForm(true) }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--text-primary)' }}
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Tasks" value={total} icon={ListTodo} color="var(--text-primary)" bg="var(--surface)" />
          <StatCard label="To Do" value={todo} icon={ListTodo} color="var(--todo)" bg="var(--todo-bg)" />
          <StatCard label="In Progress" value={inProgress} icon={TrendingUp} color="var(--progress)" bg="var(--progress-bg)" />
          <StatCard label="Completion Rate" value={`${completionRate}%`} icon={CheckSquare} color="var(--done)" bg="var(--done-bg)" />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'today', 'overdue'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize"
              style={{
                backgroundColor: filter === f ? 'var(--text-primary)' : 'var(--surface)',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {f === 'all' ? 'All Tasks' : f === 'today' ? 'Due Today' : 'Overdue'}
            </button>
          ))}
          {total > 0 && (
            <span className="ml-auto text-sm self-center" style={{ color: 'var(--text-muted)' }}>
              Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Board */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--text-primary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading tasks...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <AlertCircle size={32} style={{ color: 'var(--accent)' }} />
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Failed to load tasks</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--text-primary)' }}
            >
              Try again
            </button>
          </div>
        ) : (
          <TaskBoard
            tasks={filteredTasks}
            onEdit={(task) => { setEditingTask(task); setShowForm(true) }}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditingTask(null) }}
        />
      )}
    </div>
  )
}
