'use client'
import TaskCard from './TaskCard'
import { CheckCircle2, Circle, Timer } from 'lucide-react'

const COLUMNS = [
  { key: 'todo', label: 'To Do', icon: Circle, color: 'var(--todo)', bg: 'var(--todo-bg)' },
  { key: 'in_progress', label: 'In Progress', icon: Timer, color: 'var(--progress)', bg: 'var(--progress-bg)' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'var(--done)', bg: 'var(--done-bg)' },
]

export default function TaskBoard({ tasks, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter(t => t.status === col.key)
        const Icon = col.icon

        return (
          <div key={col.key} className="flex flex-col min-h-64">
            {/* Column header */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl mb-3"
              style={{ backgroundColor: col.bg }}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} style={{ color: col.color }} />
                <span className="text-sm font-semibold" style={{ color: col.color }}>
                  {col.label}
                </span>
              </div>
              <span
                className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: col.color, color: '#fff' }}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3 flex-1">
              {colTasks.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed text-center"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  <Icon size={28} className="mb-2 opacity-30" />
                  <p className="text-xs">No tasks here yet</p>
                </div>
              ) : (
                colTasks.map((task, i) => (
                  <div
                    key={task.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
