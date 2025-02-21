import { supabase } from './supabase'

// Define the Task interface
export interface Task {
  id: string
  user_id: string
  title: string
  tag: string
  date: string
  time: string
  is_starred: boolean
  is_completed: boolean
  created_at: string
}

// Create a new task
export async function createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      ...task,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Get all tasks for the current user
export async function getUserTasks() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Update a task
export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('user_id', user.id) // Ensure user owns the task
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete a task
export async function deleteTask(taskId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', user.id) // Ensure user owns the task

  if (error) throw error
} 