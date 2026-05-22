'use client'
import { useState, useEffect } from 'react'
import { X, Loader2, Calendar, AlignLeft, Tag } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do', color: '#3B5BDB' },
  { value: 'in_progress', label: 'In Progress', color: '#E67700' },
  { value: 'completed', label: 'Completed', color: '#2F9E44' },
]

export default function TaskForm({ task, onSubmit, onClose }) {
  const isEdit = !!task
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    due_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
      })
    }
  }, [task])

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.title.trim().length > 100) errs.title = 'Title too long (max 100 chars)'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await onSubmit(form)
    setLoading(false)
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isEdit ? 'Update task details below' : 'Fill in the details for your new task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-gray-100"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Task Title <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Design landing page mockup"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--surface-2)',
                borderColor: errors.title ? 'var(--accent)' : 'var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => { if (!errors.title) e.target.style.borderColor = 'var(--todo)' }}
              onBlur={(e) => { e.target.style.borderColor = errors.title ? 'var(--accent)' : 'var(--border)' }}
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5"><AlignLeft size={14} /> Description</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all resize-none"
              style={{
                backgroundColor: 'var(--surface-2)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--todo)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Status + Due Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5"><Tag size={14} /> Status</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all appearance-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--todo)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Due Date</span>
              </label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--surface-2)',
                  borderColor: 'var(--border)',
                  color: form.due_date ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--todo)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--surface-2)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? 'var(--text-muted)' : 'var(--text-primary)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
