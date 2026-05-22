'use client'
import { useState } from 'react'
import { Calendar, Pencil, Trash2, Clock } from 'lucide-react'

const STATUS_CONFIG = {
  todo: { label: 'To Do', color: 'var(--todo)', bg: 'var(--todo-bg)' },
  in_progress: { label: 'In Progress', color: 'var(--progress)', bg: 'var(--progress-bg)' },
  completed: { label: 'Completed', color: 'var(--done)', bg: 'var(--done-bg)' },
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isOverdue(dateStr) {
  if (!dateStr) return false
  const due = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export default function TaskCard({ task, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const overdue = task.status !== 'completed' && isOverdue(task.due_date)

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(task.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div
      className="task-card rounded-xl p-4 border group"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        borderLeft: `3px solid ${status.color}`,
      }}
    >
      {/* Top row: Status badge + actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span
          className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg transition-colors hover:bg-gray-100"
            style={{ color: 'var(--text-muted)' }}
            title="Edit task"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 rounded-lg transition-colors"
            style={{
              color: confirmDelete ? '#fff' : 'var(--text-muted)',
              backgroundColor: confirmDelete ? 'var(--accent)' : 'transparent',
            }}
            title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-sm font-semibold leading-snug mb-1"
        style={{
          color: 'var(--text-primary)',
          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
          opacity: task.status === 'completed' ? 0.6 : 1,
        }}
      >
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {task.description}
        </p>
      )}

      {/* Due date */}
      {task.due_date && (
        <div
          className="flex items-center gap-1.5 text-xs mt-2"
          style={{ color: overdue ? 'var(--accent)' : 'var(--text-muted)' }}
        >
          {overdue ? <Clock size={12} /> : <Calendar size={12} />}
          <span className={overdue ? 'font-semibold' : ''}>
            {overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
          </span>
        </div>
      )}
    </div>
  )
}
