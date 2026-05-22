import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/tasks - Fetch all tasks
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, description, status, due_date } = body

    if (!title || title.trim() === '') {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'todo',
        due_date: due_date || null,
      }])
      .select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
