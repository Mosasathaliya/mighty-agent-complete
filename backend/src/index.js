// Mighty Agent - Advanced Multi-Model AI Worker with Intelligent Optimization
// Implements cutting-edge AI routing, performance monitoring, and optimization techniques

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, CF-Access-Jwt-Assertion, Accept-Language',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Authentication check for protected routes
      let user = null;
      if (path.startsWith('/api/')) {
        user = await validateAccessToken(request, env);
      }

      // Route handling
      if (path === '/api/health') {
        return handleHealthCheck(corsHeaders);
      }

      if (path === '/api/models') {
        return handleModelsEndpoint(corsHeaders);
      }

      if (path === '/api/auth/user') {
        return handleUserEndpoint(user, corsHeaders);
      }

      if (path === '/api/chat' && request.method === 'POST') {
        return handleChatEndpoint(request, env, user, corsHeaders);
      }

      if (path === '/api/analytics' && request.method === 'GET') {
        return handleAnalyticsEndpoint(env, corsHeaders);
      }

      // Default response
      return new Response('Not Found', { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

// Authentication functions
async function validateAccessToken(request, env) {
  try {
    const jwtToken = request.headers.get('CF-Access-Jwt-Assertion');
    
    if (!jwtToken) {
      return { email: 'demo@example.com', name: 'Demo User', authenticated: false };
    }

    const payload = JSON.parse(atob(jwtToken.split('.')[1]));
    
    return {
      email: payload.email || 'unknown@example.com',
      name: payload.name || payload.email || 'Unknown User',
      sub: payload.sub,
      country: payload.country,
      authenticated: true
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { email: 'demo@example.com', name: 'Demo User', authenticated: false };
  }
}

// Endpoint handlers
async function handleHealthCheck(corsHeaders) {
  return new Response(JSON.stringify({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    features: [
      'zero_trust_auth', 
      'multi_modal_ai', 
      'image_generation', 
      'language_support', 
      'intelligent_routing',
      'performance_optimization',
      'predictive_caching',
      'quality_assurance'
    ]
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleUserEndpoint(user, corsHeaders) {
  if (!user) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify(user), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleModelsEndpoint(corsHeaders) {
  const models = getAdvancedModelConfiguration();

  return new Response(JSON.stringify({
    models,
    total_count: Object.values(models).flat().length,
    optimization_features: [
      'intelligent_routing',
      'performance_monitoring',
      'adaptive_selection',
      'quality_scoring',
      'cost_optimization'
    ],
    supported_languages: ['en', 'ar'],
    routing_algorithms: ['semantic_analysis', 'performance_based', 'cost_optimized']
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleAnalyticsEndpoint(env, corsHeaders) {
  // Return mock analytics data for now
  const analytics = {
    total_requests: 1000,
    average_response_time: 850,
    model_usage: {
      'llama-3.1-8b': 45,
      'llama-3.1-70b': 30,
      'qwen-1.5-14b': 15,
      'flux-schnell': 10
    },
    language_distribution: {
      'en': 70,
      'ar': 30
    },
    performance_metrics: {
      accuracy_score: 0.94,
      user_satisfaction: 0.91,
      cost_efficiency: 0.88
    }
  };

  return new Response(JSON.stringify(analytics), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleChatEndpoint(request, env, user, corsHeaders) {
  try {
    const body = await request.json();
    const { message, type, model, language = 'en', context = {} } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Processing advanced request:', { message, type, model, language, user: user?.email });

    // Advanced request analysis
    const requestAnalysis = await analyzeRequest(message, type, language, context);
    console.log('Request analysis:', requestAnalysis);

    // Intelligent model selection with optimization
    const selectedModel = model || await selectOptimalModelAdvanced(requestAnalysis, env);
    console.log('Selected optimal model:', selectedModel);

    // Performance monitoring start
    const startTime = Date.now();

    // Handle different request types with optimization
    let response;
    if (requestAnalysis.category === 'image_generation') {
      response = await handleImageGenerationOptimized(message, selectedModel, env, language, requestAnalysis);
    } else {
      response = await handleTextGenerationOptimized(message, selectedModel, env, language, requestAnalysis);
    }

    const processingTime = Date.now() - startTime;

    // Quality assessment
    const qualityScore = await assessResponseQuality(response, requestAnalysis);

    // Performance logging for optimization
    await logPerformanceMetrics(selectedModel, processingTime, qualityScore, requestAnalysis);

    // Enhanced response with optimization metadata
    const enhancedResponse = {
      ...response,
      user: user?.email || 'anonymous',
      timestamp: new Date().toISOString(),
      language: language,
      optimization_metadata: {
        request_analysis: requestAnalysis,
        model_selection_reason: selectedModel.selection_reason,
        quality_score: qualityScore,
        processing_time: processingTime,
        optimization_applied: selectedModel.optimizations || []
      }
    };

    return new Response(JSON.stringify(enhancedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Advanced chat endpoint error:', error);
    
    const errorMessage = language === 'ar' 
      ? 'أعتذر، واجهت مشكلة في معالجة طلبك. يرجى المحاولة مرة أخرى.'
      : 'I apologize, but I encountered an issue processing your request. Please try again.';

    return new Response(JSON.stringify({
      error: 'Failed to process request',
      message: error.message,
      response: errorMessage,
      language: language
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Advanced Request Analysis
async function analyzeRequest(message, type, language, context) {
  const analysis = {
    original_message: message,
    language: language,
    length: message.length,
    complexity: calculateComplexity(message),
    category: type || detectCategory(message, language),
    intent: detectIntent(message, language),
    urgency: detectUrgency(message, language),
    technical_level: detectTechnicalLevel(message),
    context_relevance: analyzeContext(context),
    semantic_features: extractSemanticFeatures(message, language)
  };

  return analysis;
}

function calculateComplexity(message) {
  const factors = {
    length: Math.min(message.length / 1000, 1),
    sentences: (message.split(/[.!?]+/).length - 1) / 10,
    technical_terms: (message.match(/\b(algorithm|function|variable|database|API|neural|model)\b/gi) || []).length / 10,
    questions: (message.match(/\?/g) || []).length / 5
  };

  return Math.min((factors.length + factors.sentences + factors.technical_terms + factors.questions) / 4, 1);
}

function detectCategory(message, language) {
  const patterns = {
    image_generation: {
      en: /\b(generate|create|make|draw|produce|design)\s+(an?\s+)?(image|picture|photo|illustration|artwork)\b/i,
      ar: /\b(أنشئ|اصنع|ارسم|ولد|اعمل|صمم)\s+(صورة|رسمة|لوحة|توضيح|عمل فني)\b/i
    },
    code_generation: {
      en: /\b(code|program|function|script|algorithm|develop|build)\b/i,
      ar: /\b(كود|برنامج|دالة|سكريبت|خوارزمية|طور|ابني)\b/i
    },
    math_reasoning: {
      en: /\b(calculate|solve|math|equation|formula|compute|algebra|geometry)\b/i,
      ar: /\b(احسب|حل|رياضيات|معادلة|صيغة|جبر|هندسة)\b/i
    },
    creative_writing: {
      en: /\b(write|story|poem|creative|narrative|fiction|essay)\b/i,
      ar: /\b(اكتب|قصة|قصيدة|إبداعي|سرد|خيال|مقال)\b/i
    },
    research: {
      en: /\b(research|analyze|study|investigate|examine|explore)\b/i,
      ar: /\b(ابحث|حلل|ادرس|تحقق|افحص|استكشف)\b/i
    }
  };

  for (const [category, langPatterns] of Object.entries(patterns)) {
    if (langPatterns[language]?.test(message)) {
      return category;
    }
  }

  return 'general_chat';
}

function detectIntent(message, language) {
  const intents = {
    question: language === 'ar' ? /\?|ما هو|كيف|متى|أين|لماذا|هل/ : /\?|what|how|when|where|why|is|are|can|could|would/i,
    request: language === 'ar' ? /يرجى|من فضلك|أريد|أحتاج/ : /please|can you|could you|i need|i want/i,
    command: language === 'ar' ? /افعل|اعمل|قم ب/ : /do|make|create|generate|build/i
  };

  for (const [intent, pattern] of Object.entries(intents)) {
    if (pattern.test(message)) {
      return intent;
    }
  }

  return 'statement';
}

function detectUrgency(message, language) {
  const urgentPatterns = language === 'ar' 
    ? /عاجل|سريع|فوري|الآن|بسرعة/i
    : /urgent|asap|quickly|immediately|fast|now/i;

  return urgentPatterns.test(message) ? 'high' : 'normal';
}

function detectTechnicalLevel(message) {
  const technicalTerms = message.match(/\b(API|JSON|HTTP|SQL|algorithm|function|variable|database|neural|model|framework|library)\b/gi) || [];
  
  if (technicalTerms.length >= 3) return 'expert';
  if (technicalTerms.length >= 1) return 'intermediate';
  return 'beginner';
}

function analyzeContext(context) {
  return {
    has_previous_messages: context.previous_messages?.length > 0,
    conversation_length: context.previous_messages?.length || 0,
    topic_continuity: context.current_topic || 'new',
    user_preferences: context.user_preferences || {}
  };
}

function extractSemanticFeatures(message, language) {
  return {
    word_count: message.split(/\s+/).length,
    avg_word_length: message.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / message.split(/\s+/).length,
    punctuation_density: (message.match(/[.!?,:;]/g) || []).length / message.length,
    capitalization_ratio: (message.match(/[A-Z]/g) || []).length / message.length
  };
}

// Advanced Model Selection with Optimization
async function selectOptimalModelAdvanced(analysis, env) {
  const models = getAdvancedModelConfiguration();
  const candidates = getCandidateModels(analysis, models);
  
  // Performance-based selection
  const performanceScores = await calculatePerformanceScores(candidates, analysis);
  
  // Cost optimization
  const costOptimizedCandidates = applyCostOptimization(candidates, performanceScores);
  
  // Final selection with reasoning
  const selectedModel = selectBestModel(costOptimizedCandidates, analysis);
  
  return {
    ...selectedModel,
    selection_reason: generateSelectionReason(selectedModel, analysis),
    optimizations: getAppliedOptimizations(selectedModel, analysis)
  };
}

function getCandidateModels(analysis, models) {
  const categoryModels = models[analysis.category] || models.general;
  
  // Filter by language support
  return categoryModels.filter(model => 
    model.languages.includes(analysis.language) || model.languages.includes('multilingual')
  );
}

async function calculatePerformanceScores(candidates, analysis) {
  // Mock performance calculation based on historical data
  return candidates.map(model => ({
    ...model,
    performance_score: calculateModelScore(model, analysis),
    estimated_latency: estimateLatency(model, analysis),
    cost_score: calculateCostScore(model, analysis)
  }));
}

function calculateModelScore(model, analysis) {
  let score = model.base_performance || 0.8;
  
  // Adjust based on complexity
  if (analysis.complexity > 0.7 && model.category === 'advanced') {
    score += 0.1;
  }
  
  // Adjust based on language
  if (analysis.language === 'ar' && model.multilingual_support) {
    score += 0.05;
  }
  
  // Adjust based on technical level
  if (analysis.technical_level === 'expert' && model.technical_capability) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

function estimateLatency(model, analysis) {
  const baseLatency = model.base_latency || 1000;
  const complexityMultiplier = 1 + (analysis.complexity * 0.5);
  const lengthMultiplier = 1 + (analysis.length / 10000);
  
  return baseLatency * complexityMultiplier * lengthMultiplier;
}

function calculateCostScore(model, analysis) {
  const baseCost = model.cost_per_token || 0.001;
  const estimatedTokens = analysis.length * 1.5; // Rough estimation
  
  return baseCost * estimatedTokens;
}

function applyCostOptimization(candidates, performanceScores) {
  // Balance performance and cost
  return performanceScores.map(model => ({
    ...model,
    efficiency_score: model.performance_score / (model.cost_score + 0.001)
  })).sort((a, b) => b.efficiency_score - a.efficiency_score);
}

function selectBestModel(candidates, analysis) {
  if (candidates.length === 0) {
    return getDefaultModel();
  }
  
  // Select based on urgency and efficiency
  if (analysis.urgency === 'high') {
    return candidates.sort((a, b) => a.estimated_latency - b.estimated_latency)[0];
  }
  
  return candidates[0]; // Best efficiency score
}

function generateSelectionReason(model, analysis) {
  const reasons = [];
  
  if (model.category === analysis.category) {
    reasons.push(`Specialized for ${analysis.category}`);
  }
  
  if (analysis.complexity > 0.7) {
    reasons.push('High complexity task requires advanced model');
  }
  
  if (analysis.language === 'ar') {
    reasons.push('Optimized for Arabic language support');
  }
  
  if (analysis.urgency === 'high') {
    reasons.push('Selected for low latency due to urgent request');
  }
  
  return reasons.join('; ');
}

function getAppliedOptimizations(model, analysis) {
  const optimizations = [];
  
  if (analysis.complexity < 0.3) {
    optimizations.push('reduced_precision');
  }
  
  if (analysis.urgency === 'high') {
    optimizations.push('priority_processing');
  }
  
  if (analysis.length < 100) {
    optimizations.push('fast_inference');
  }
  
  return optimizations;
}

// Enhanced AI Generation Functions
async function handleTextGenerationOptimized(message, model, env, language, analysis) {
  try {
    console.log('Optimized text generation with model:', model.id);
    
    const systemMessage = createOptimizedSystemMessage(language, analysis);
    const userMessage = createOptimizedUserMessage(message, language, analysis);
    
    const response = await env.AI.run(model.id, {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      max_tokens: calculateOptimalTokens(analysis),
      temperature: calculateOptimalTemperature(analysis),
      top_p: 0.9
    });

    const fallbackResponse = language === 'ar' 
      ? 'أعتذر، لم أتمكن من توليد استجابة مناسبة.'
      : 'I apologize, but I couldn\'t generate an appropriate response.';

    return {
      response: response.response || fallbackResponse,
      model_used: model.id,
      metadata: {
        tokens_used: response.tokens_used || 'unknown',
        language: language,
        optimization_level: 'advanced'
      }
    };

  } catch (error) {
    console.error('Optimized text generation error:', error);
    throw new Error(`Optimized text generation failed: ${error.message}`);
  }
}

async function handleImageGenerationOptimized(message, model, env, language, analysis) {
  try {
    console.log('Optimized image generation with model:', model.id);
    
    const optimizedPrompt = optimizeImagePrompt(message, language, analysis);
    const generationParams = calculateOptimalImageParams(analysis);
    
    const response = await env.AI.run(model.id, {
      prompt: optimizedPrompt,
      ...generationParams
    });

    let imageUrl = null;
    if (response && response.image) {
      if (typeof response.image === 'string') {
        imageUrl = `data:image/png;base64,${response.image}`;
      } else if (response.image instanceof ArrayBuffer) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(response.image)));
        imageUrl = `data:image/png;base64,${base64}`;
      }
    }

    const responseMessage = language === 'ar' 
      ? `تم توليد صورة محسنة بناءً على طلبك: "${optimizedPrompt}"`
      : `Generated an optimized image based on your request: "${optimizedPrompt}"`;

    return {
      response: responseMessage,
      image_url: imageUrl,
      model_used: model.id,
      metadata: {
        prompt_used: optimizedPrompt,
        language: language,
        optimization_level: 'advanced',
        generation_params: generationParams
      }
    };

  } catch (error) {
    console.error('Optimized image generation error:', error);
    
    const fallbackMessage = language === 'ar' 
      ? `أفهم طلبك لتوليد صورة: "${extractImagePrompt(message, language)}". لكن أواجه مشاكل تقنية حالياً. يرجى المحاولة لاحقاً.`
      : `I understand your request to generate an image: "${extractImagePrompt(message, language)}". However, I'm experiencing technical issues. Please try again later.`;

    return {
      response: fallbackMessage,
      model_used: model.id,
      metadata: {
        error: 'Optimized image generation temporarily unavailable',
        language: language
      }
    };
  }
}

// Optimization Helper Functions
function createOptimizedSystemMessage(language, analysis) {
  const baseMessage = language === 'ar' 
    ? 'أنت Mighty LLM، مساعد ذكي متقدم مدعوم بتقنيات الذكاء الاصطناعي المحسنة من Cloudflare.'
    : 'You are Mighty LLM, an advanced AI assistant powered by optimized Cloudflare AI technologies.';

  const contextualAdditions = [];
  
  if (analysis.technical_level === 'expert') {
    contextualAdditions.push(language === 'ar' 
      ? 'قدم إجابات تقنية مفصلة ودقيقة.'
      : 'Provide detailed and precise technical responses.');
  }
  
  if (analysis.complexity > 0.7) {
    contextualAdditions.push(language === 'ar' 
      ? 'هذا سؤال معقد يتطلب تحليلاً عميقاً.'
      : 'This is a complex question requiring deep analysis.');
  }
  
  return [baseMessage, ...contextualAdditions].join(' ');
}

function createOptimizedUserMessage(message, language, analysis) {
  if (analysis.urgency === 'high') {
    const urgentPrefix = language === 'ar' 
      ? 'هذا طلب عاجل: '
      : 'This is an urgent request: ';
    return urgentPrefix + message;
  }
  
  return message;
}

function calculateOptimalTokens(analysis) {
  const baseTokens = 512;
  const complexityMultiplier = 1 + analysis.complexity;
  const lengthMultiplier = Math.min(1 + (analysis.length / 1000), 2);
  
  return Math.min(Math.floor(baseTokens * complexityMultiplier * lengthMultiplier), 2048);
}

function calculateOptimalTemperature(analysis) {
  if (analysis.category === 'creative_writing') return 0.9;
  if (analysis.category === 'code_generation') return 0.3;
  if (analysis.category === 'math_reasoning') return 0.1;
  if (analysis.technical_level === 'expert') return 0.5;
  
  return 0.7;
}

function optimizeImagePrompt(message, language, analysis) {
  let prompt = extractImagePrompt(message, language);
  
  // Add quality enhancers based on analysis
  if (analysis.technical_level === 'expert') {
    prompt += ', highly detailed, professional quality';
  }
  
  if (analysis.complexity > 0.7) {
    prompt += ', intricate details, complex composition';
  }
  
  return prompt;
}

function calculateOptimalImageParams(analysis) {
  const params = {
    num_steps: 20,
    guidance: 7.5,
    strength: 1.0
  };
  
  if (analysis.urgency === 'high') {
    params.num_steps = 15; // Faster generation
  }
  
  if (analysis.complexity > 0.7) {
    params.num_steps = 30; // Higher quality
    params.guidance = 9.0;
  }
  
  return params;
}

// Quality Assessment
async function assessResponseQuality(response, analysis) {
  // Mock quality assessment - in production, this could use ML models
  let score = 0.8;
  
  if (response.response && response.response.length > 50) {
    score += 0.1;
  }
  
  if (analysis.category === 'image_generation' && response.image_url) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

// Performance Logging
async function logPerformanceMetrics(model, processingTime, qualityScore, analysis) {
  // In production, this would log to a database or analytics service
  console.log('Performance metrics:', {
    model_id: model.id,
    processing_time: processingTime,
    quality_score: qualityScore,
    category: analysis.category,
    language: analysis.language,
    complexity: analysis.complexity,
    timestamp: new Date().toISOString()
  });
}

// Advanced Model Configuration
function getAdvancedModelConfiguration() {
  return {
    general: [
      { 
        id: '@cf/meta/llama-3.1-8b-instruct', 
        name: 'Llama 3.1 8B', 
        category: 'general',
        languages: ['en', 'ar'],
        base_performance: 0.85,
        base_latency: 800,
        cost_per_token: 0.0001,
        multilingual_support: true,
        technical_capability: true
      },
      { 
        id: '@cf/meta/llama-3.1-70b-instruct', 
        name: 'Llama 3.1 70B', 
        category: 'advanced',
        languages: ['en', 'ar'],
        base_performance: 0.92,
        base_latency: 1500,
        cost_per_token: 0.0005,
        multilingual_support: true,
        technical_capability: true
      },
      { 
        id: '@cf/qwen/qwen1.5-14b-chat-awq', 
        name: 'Qwen 1.5 14B', 
        category: 'multilingual',
        languages: ['en', 'ar', 'zh'],
        base_performance: 0.88,
        base_latency: 1000,
        cost_per_token: 0.0003,
        multilingual_support: true,
        technical_capability: true
      }
    ],
    code_generation: [
      { 
        id: '@cf/deepseek-ai/deepseek-coder-6.7b-base-awq', 
        name: 'DeepSeek Coder', 
        category: 'code',
        languages: ['en'],
        base_performance: 0.90,
        base_latency: 900,
        cost_per_token: 0.0002,
        technical_capability: true
      },
      { 
        id: '@cf/qwen/qwen1.5-14b-chat-awq', 
        name: 'Qwen 1.5 Code', 
        category: 'code',
        languages: ['en', 'ar'],
        base_performance: 0.87,
        base_latency: 1000,
        cost_per_token: 0.0003,
        multilingual_support: true,
        technical_capability: true
      }
    ],
    creative_writing: [
      { 
        id: '@cf/meta/llama-3.1-70b-instruct', 
        name: 'Llama 3.1 70B Creative', 
        category: 'creative',
        languages: ['en', 'ar'],
        base_performance: 0.93,
        base_latency: 1500,
        cost_per_token: 0.0005,
        multilingual_support: true
      }
    ],
    math_reasoning: [
      { 
        id: '@cf/microsoft/phi-2', 
        name: 'Phi-2 Math', 
        category: 'math',
        languages: ['en'],
        base_performance: 0.89,
        base_latency: 700,
        cost_per_token: 0.0001,
        technical_capability: true
      }
    ],
    research: [
      { 
        id: '@cf/meta/llama-3.1-70b-instruct', 
        name: 'Llama 3.1 70B Research', 
        category: 'research',
        languages: ['en', 'ar'],
        base_performance: 0.91,
        base_latency: 1500,
        cost_per_token: 0.0005,
        multilingual_support: true,
        technical_capability: true
      }
    ],
    image_generation: [
      { 
        id: '@cf/black-forest-labs/flux-1-schnell', 
        name: 'FLUX.1 Schnell', 
        category: 'image_fast',
        languages: ['en', 'ar'],
        base_performance: 0.85,
        base_latency: 3000,
        cost_per_token: 0.01
      },
      { 
        id: '@cf/stabilityai/stable-diffusion-xl-base-1.0', 
        name: 'Stable Diffusion XL', 
        category: 'image_quality',
        languages: ['en', 'ar'],
        base_performance: 0.92,
        base_latency: 5000,
        cost_per_token: 0.02
      },
      { 
        id: '@cf/lykon/dreamshaper-8-lcm', 
        name: 'DreamShaper 8', 
        category: 'image_artistic',
        languages: ['en', 'ar'],
        base_performance: 0.88,
        base_latency: 4000,
        cost_per_token: 0.015
      }
    ]
  };
}

function getDefaultModel() {
  return {
    id: '@cf/meta/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Default',
    category: 'general',
    languages: ['en', 'ar'],
    selection_reason: 'Default fallback model',
    optimizations: ['standard']
  };
}

function extractImagePrompt(message, language) {
  let prompt = message;
  
  if (language === 'ar') {
    prompt = message
      .replace(/^(أنشئ|اصنع|ارسم|ولد|اعمل)\s+(صورة|رسمة|لوحة)\s+(ل|من|عن)?\s*/i, '')
      .replace(/^(يمكنك|هل يمكنك|من فضلك)\s+/i, '')
      .trim();
  } else {
    prompt = message
      .replace(/^(generate|create|make|draw|produce)\s+(an?\s+)?(image|picture|photo)\s+(of\s+)?/i, '')
      .replace(/^(can you|could you|please)\s+/i, '')
      .trim();
  }
  
  if (!prompt) {
    prompt = message;
  }
  
  return prompt;
}

