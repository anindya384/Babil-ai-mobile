import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIProvider {
  name: string;
  apiCall: (message: string, userContext?: UserContext) => Promise<string>;
}

interface UserContext {
  fullName?: string;
  email?: string;
  userId?: string;
}

// Initialize providers
// Available models:
// Claude: claude-sonnet-4-20250514 (currently used), claude-3-5-haiku-20241022
// Grok: grok-4-0709, grok-3, grok-2-image-1212
// Perplexity: sonar, sonar-pro, sonar-reasoning, sonar-reasoning-pro, sonar-deep-research
// 
// IMPORTANT: JWT verification is disabled in config.toml to allow third-party API calls
// This prevents Supabase from intercepting Authorization headers meant for Anthropic/OpenAI/etc.
const providers: AIProvider[] = [
  {
    name: 'chatgpt',
    apiCall: async (message: string, userContext?: UserContext) => {
      const openaiKey = Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) throw new Error('OpenAI API key not configured');

      // Create personalized system prompt
      let systemPrompt = 'You are ChatGPT, a helpful AI assistant created by OpenAI. Provide concise, helpful responses.';
      if (userContext?.fullName) {
        systemPrompt = `You are ChatGPT, a helpful AI assistant created by OpenAI. You are talking to ${userContext.fullName}. 

IMPORTANT: If ${userContext.fullName} asks "What is my name?" or similar questions about their identity, respond with their name and ask follow-up questions to learn more about them. Be friendly and personal.

Always remember you're talking to ${userContext.fullName} and provide personalized responses when appropriate.`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  },

  {
    name: 'gemini',
    apiCall: async (message: string, userContext?: UserContext) => {
      const geminiKey = Deno.env.get('GOOGLE_AI_API_KEY');
      if (!geminiKey) throw new Error('Gemini API key not configured');

      // Create personalized prompt for Gemini
      let promptText = message;
      if (userContext?.fullName) {
        promptText = `[Context: You are talking to ${userContext.fullName}. If they ask about their name or identity, respond with their name and ask follow-up questions to learn more about them. Be friendly and personal.]

User message: ${message}`;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  },
  {
    name: 'grok',
    apiCall: async (message: string, userContext?: UserContext) => {
      const grokKey = Deno.env.get('XAI_API_KEY');
      if (!grokKey) throw new Error('Grok API key not configured');

      // Create personalized system prompt
      let systemPrompt = 'You are Grok, a helpful and witty AI assistant.';
      if (userContext?.fullName) {
        systemPrompt = `You are Grok, a helpful and witty AI assistant. You are talking to ${userContext.fullName}.

IMPORTANT: If ${userContext.fullName} asks "What is my name?" or similar questions about their identity, respond with their name and ask follow-up questions to learn more about them. Be friendly, personal, and maintain your witty personality.`;
      }

      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${grokKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          model: 'grok-4-0709',
          stream: false,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Grok API error ${response.status}:`, errorText);
        throw new Error(`Grok API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  {
    name: 'perplexity',
    apiCall: async (message: string, userContext?: UserContext) => {
      const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
      if (!perplexityKey) throw new Error('Perplexity API key not configured');

      // Create personalized system prompt
      let systemPrompt = 'You are Perplexity, an AI assistant that provides accurate and up-to-date information.';
      if (userContext?.fullName) {
        systemPrompt = `You are Perplexity, an AI assistant that provides accurate and up-to-date information. You are talking to ${userContext.fullName}.

IMPORTANT: If ${userContext.fullName} asks "What is my name?" or similar questions about their identity, respond with their name and ask follow-up questions to learn more about them. Be friendly and personal while maintaining your informative nature.`;
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.2,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Perplexity API error ${response.status}:`, errorText);
        throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  {
    name: 'mistral',
    apiCall: async (message: string, userContext?: UserContext) => {
      const mistralKey = Deno.env.get('MISTRAL_API_KEY');
      if (!mistralKey) throw new Error('Mistral API key not configured');

      // Create personalized system prompt
      let systemPrompt = 'You are Mistral, a helpful AI assistant.';
      if (userContext?.fullName) {
        systemPrompt = `You are Mistral, a helpful AI assistant. You are talking to ${userContext.fullName}.

IMPORTANT: If ${userContext.fullName} asks "What is my name?" or similar questions about their identity, respond with their name and ask follow-up questions to learn more about them. Be friendly and personal.`;
      }

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mistralKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }
  },
  {
    name: 'claude',
    apiCall: async (message: string, userContext?: UserContext) => {
      // Get raw tokens first
      const rawAnthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
      const rawClaudeKey = Deno.env.get('CLAUDE_API_KEY');
      
      console.log('=== CLAUDE API KEY DEBUG ===');
      console.log('Raw ANTHROPIC_API_KEY exists:', !!rawAnthropicKey);
      console.log('Raw CLAUDE_API_KEY exists:', !!rawClaudeKey);
      console.log('Raw ANTHROPIC_API_KEY type:', typeof rawAnthropicKey);
      console.log('Raw CLAUDE_API_KEY type:', typeof rawClaudeKey);
      
      if (rawAnthropicKey) {
        console.log('Raw ANTHROPIC_API_KEY length:', rawAnthropicKey.length);
        console.log('Raw ANTHROPIC_API_KEY first 10 chars:', rawAnthropicKey.substring(0, 10));
        console.log('Raw ANTHROPIC_API_KEY last 10 chars:', rawAnthropicKey.substring(rawAnthropicKey.length - 10));
        console.log('Raw ANTHROPIC_API_KEY contains newline:', rawAnthropicKey.includes('\n'));
        console.log('Raw ANTHROPIC_API_KEY contains carriage return:', rawAnthropicKey.includes('\r'));
        console.log('Raw ANTHROPIC_API_KEY has leading spaces:', rawAnthropicKey.startsWith(' '));
        console.log('Raw ANTHROPIC_API_KEY has trailing spaces:', rawAnthropicKey.endsWith(' '));
      }
      
      if (rawClaudeKey) {
        console.log('Raw CLAUDE_API_KEY length:', rawClaudeKey.length);
        console.log('Raw CLAUDE_API_KEY first 10 chars:', rawClaudeKey.substring(0, 10));
        console.log('Raw CLAUDE_API_KEY last 10 chars:', rawClaudeKey.substring(rawClaudeKey.length - 10));
        console.log('Raw CLAUDE_API_KEY contains newline:', rawClaudeKey.includes('\n'));
        console.log('Raw CLAUDE_API_KEY contains carriage return:', rawClaudeKey.includes('\r'));
        console.log('Raw CLAUDE_API_KEY has leading spaces:', rawClaudeKey.startsWith(' '));
        console.log('Raw CLAUDE_API_KEY has trailing spaces:', rawClaudeKey.endsWith(' '));
      }
      
      // Now trim and get final key
      const claudeKey = (rawAnthropicKey || rawClaudeKey)?.trim();
      console.log('Final claudeKey after trim:', claudeKey ? 'Yes (length: ' + claudeKey.length + ')' : 'No');
      if (claudeKey) {
        console.log('Final claudeKey starts with:', claudeKey.substring(0, 10) + '...');
        console.log('Final claudeKey ends with:', '...' + claudeKey.substring(claudeKey.length - 10));
      }
      if (!claudeKey) {
        console.error('=== CLAUDE API KEY ERROR ===');
        console.error('ANTHROPIC_API_KEY raw:', rawAnthropicKey);
        console.error('CLAUDE_API_KEY raw:', rawClaudeKey);
        console.error('Final claudeKey after trim:', claudeKey);
        throw new Error('Claude API key not configured - check environment variables');
      }
      
      // Validate API key format
      console.log('=== CLAUDE API KEY VALIDATION ===');
      console.log('API key starts with "sk-ant-":', claudeKey.startsWith('sk-ant-'));
      console.log('API key length is valid (should be ~67 chars):', claudeKey.length);
      console.log('API key contains only valid characters:', /^[a-zA-Z0-9_-]+$/.test(claudeKey));

      console.log('=== CLAUDE API REQUEST DEBUG ===');
      console.log('Request URL:', 'https://api.anthropic.com/v1/messages');
      console.log('Full API Key (for debugging):', claudeKey);
      console.log('API Key length:', claudeKey.length);
      console.log('API Key first 20 chars:', claudeKey.substring(0, 20));
      console.log('API Key last 20 chars:', claudeKey.substring(claudeKey.length - 20));
      console.log('API Key has leading spaces:', claudeKey.startsWith(' '));
      console.log('API Key has trailing spaces:', claudeKey.endsWith(' '));
      console.log('API Key contains newlines:', claudeKey.includes('\n') || claudeKey.includes('\r'));
      // Log the actual x-api-key header being sent
      const apiKeyHeader = claudeKey;
      console.log('=== CLAUDE REQUEST HEADERS DEBUG ===');
      console.log('Full x-api-key header:', apiKeyHeader);
      console.log('x-api-key header length:', apiKeyHeader.length);
      console.log('x-api-key header starts with:', apiKeyHeader.substring(0, 20) + '...');
      console.log('x-api-key header ends with:', '...' + apiKeyHeader.substring(apiKeyHeader.length - 20));
      
      // Create personalized system prompt for Claude
      let systemPrompt = 'You are Claude, a helpful AI assistant.';
      if (userContext?.fullName) {
        systemPrompt = `You are Claude, a helpful AI assistant. You are talking to ${userContext.fullName}.

IMPORTANT: If ${userContext.fullName} asks "What is my name?" or similar questions about their identity, respond with their name and ask follow-up questions to learn more about them. Be friendly and personal.`;
      }
      
      console.log('Request headers:', {
        'x-api-key': `${claudeKey.substring(0, 10)}...`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      });
      console.log('Request body:', {
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [
          { role: 'user', content: message }
        ],
        system: systemPrompt,
      });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': claudeKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: message }
          ],
          system: systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Claude API error ${response.status}:`, errorText);
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    }
  },
];

// Disable JWT verification for this function to allow third-party API calls
serve(async (req) => {
  // Skip JWT verification - this function doesn't need user authentication
  // and needs to make third-party API calls with different Authorization headers
  
  console.log('=== REQUEST RECEIVED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try to parse the request body
    let body;
    
    // First, let's see the raw request body
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    console.log('Raw body length:', rawBody.length);
    console.log('Raw body first 50 chars:', rawBody.substring(0, 50));
    console.log('Raw body last 50 chars:', rawBody.substring(Math.max(0, rawBody.length - 50)));
    
    try {
      body = JSON.parse(rawBody);
      console.log('Successfully parsed JSON body:', body);
      console.log('Body type:', typeof body);
      console.log('Body keys:', Object.keys(body || {}));
    } catch (parseError) {
      console.error('Failed to parse JSON body:', parseError);
      console.error('Parse error details:', {
        message: parseError.message,
        position: parseError.message.match(/position (\d+)/)?.[1],
        line: parseError.message.match(/line (\d+)/)?.[1],
        column: parseError.message.match(/column (\d+)/)?.[1]
      });
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
          parseError: parseError.message,
          rawBody: rawBody,
          rawBodyLength: rawBody.length,
          requestInfo: {
            method: req.method,
            url: req.url,
            contentType: req.headers.get('content-type')
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if message exists (accept both 'message' and 'prompt' fields)
    const { message, prompt, userContext } = body || {};
    const actualMessage = message || prompt;
    console.log('Extracted message:', actualMessage);
    console.log('Message field:', message);
    console.log('Prompt field:', prompt);
    console.log('User context:', userContext);

    if (!actualMessage) {
      console.error('Missing message/prompt in request body');
      return new Response(
        JSON.stringify({ 
          error: 'Message or prompt is required', 
          receivedBody: body,
          requestInfo: {
            method: req.method,
            url: req.url,
            bodyType: typeof body,
            bodyKeys: Object.keys(body || {})
          }
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing message:', actualMessage);
    console.log('With user context:', userContext);

    // Call all AI providers concurrently
    const responses = await Promise.allSettled(
      providers.map(async (provider) => {
        try {
          const response = await provider.apiCall(actualMessage, userContext);
          return {
            provider: provider.name,
            response,
            loading: false,
          };
        } catch (error) {
          console.error(`Error with ${provider.name}:`, error.message);
          console.error(`Full error for ${provider.name}:`, error);
          return {
            provider: provider.name,
            response: '',
            error: `${provider.name} is currently unavailable: ${error.message}`,
            loading: false,
          };
        }
      })
    );

    // Process all responses
    const finalResponses = responses.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          provider: providers[index].name,
          response: '',
          error: 'Service temporarily unavailable',
          loading: false,
        };
      }
    });

    console.log('Returning responses:', finalResponses);
    return new Response(
      JSON.stringify({ responses: finalResponses }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in Edge Function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        requestInfo: {
          method: req.method,
          url: req.url
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});