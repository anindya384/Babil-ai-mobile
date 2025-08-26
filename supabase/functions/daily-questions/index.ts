import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, action } = await req.json()
    
    console.log(`🔍 [${action}] Processing request for user: ${userId}`)
    
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current date
    const today = new Date().toISOString().split('T')[0]

    if (action === 'get') {
      console.log(`🔍 [GET] Starting profile lookup for user: ${userId}`)
      
      // Get current daily question count
      let { data, error } = await supabaseClient
        .from('profiles')
        .select('daily_questions_used, last_question_date')
        .eq('id', userId)
        .single()

      console.log(`🔍 [GET] Database response - data:`, data, `error:`, error)

      // If profile doesn't exist, return 20 questions for new users
      if (error && error.code === 'PGRST116') {
        console.log(`🆕 New user detected: ${userId} - returning 20 questions`)
        const response = { 
          daily_questions_used: 0, 
          remaining: 20 
        }
        console.log(`📤 [GET] Sending response:`, response)
        return new Response(
          JSON.stringify(response),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else if (error) {
        console.log(`❌ [GET] Unexpected error:`, error)
        throw error
      }

      // Check if it's a new day and reset if needed
      if (data.last_question_date !== today) {
        console.log(`🔄 New day detected for user ${userId}, resetting daily questions`)
        // Reset for new day
        await supabaseClient
          .from('profiles')
          .update({ 
            daily_questions_used: 0, 
            last_question_date: today 
          })
          .eq('id', userId)
        
        data.daily_questions_used = 0
      }

      const remaining = 20 - data.daily_questions_used
      const response = { 
        daily_questions_used: data.daily_questions_used, 
        remaining: Math.max(0, remaining) 
      }
      console.log(`📊 [GET] Response for user ${userId}: daily_questions_used=${data.daily_questions_used}, remaining=${remaining}`)
      console.log(`📤 [GET] Sending response:`, response)
      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'increment') {
      // Increment daily question count
      let { data, error } = await supabaseClient
        .from('profiles')
        .select('daily_questions_used, last_question_date')
        .eq('id', userId)
        .single()

      let newCount: number

      // If profile doesn't exist, create one for the user
      if (error && error.code === 'PGRST116') {
        console.log(`🆕 [INCREMENT] Creating profile for new user: ${userId}`)
        const { data: newProfile, error: createError } = await supabaseClient
          .from('profiles')
          .insert({
            id: userId,
            email: '', // Will be filled by trigger
            full_name: 'User',
            daily_questions_used: 0,
            last_question_date: today
          })
          .select('daily_questions_used, last_question_date')
          .single()
        
        if (createError) throw createError
        console.log(`✅ [INCREMENT] Profile created for new user: daily_questions_used=${newProfile.daily_questions_used}`)
        data = newProfile
        // For new users, first question should set daily_questions_used to 1
        newCount = 1
      } else if (error) {
        throw error
      } else {
        // Check if it's a new day
        if (data.last_question_date !== today) {
          console.log(`🔄 [INCREMENT] New day detected for user ${userId}, starting from 1`)
          // New day, start from 1
          newCount = 1
        } else {
          // Same day, increment
          newCount = data.daily_questions_used + 1
        }
      }

      // Update the count
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ 
          daily_questions_used: newCount, 
          last_question_date: today 
        })
        .eq('id', userId)

      if (updateError) throw updateError

      const remaining = 20 - newCount
      console.log(`📊 [INCREMENT] Final response: daily_questions_used=${newCount}, remaining=${remaining}`)
      return new Response(
        JSON.stringify({ 
          daily_questions_used: newCount, 
          remaining: Math.max(0, remaining) 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else {
      throw new Error('Invalid action. Use "get" or "increment"')
    }

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
