import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT /api/tasks/:id - Update a task
export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const { title, description, status, due_date } = body

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        status,
        due_date: due_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(request, { params }) {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', params.id)

    if (error) throw error
    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
