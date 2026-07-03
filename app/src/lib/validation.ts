import { z } from 'zod';

// Validation for chatbot messages
export const ChatbotMessageSchema = z.object({
  message: z.string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message is too long (max 5000 characters)')
    .describe('User message to the chatbot'),
  history: z.array(z.object({
    role: z.enum(['user', 'model', 'assistant']),
    content: z.string()
  })).optional().default([])
});

export type ChatbotMessage = z.infer<typeof ChatbotMessageSchema>;

// Validation for recommendations API
export const RecommendationsSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  interests: z.array(z.string().min(1)).min(1, 'At least one interest required'),
  level: z.enum(['lycee', 'etudiant', 'professionnel']).optional(),
});

export type RecommendationsInput = z.infer<typeof RecommendationsSchema>;

// Validation for roadmap API
export const RoadmapSchema = z.object({
  career_id: z.string().uuid('Invalid career ID'),
  career_name: z.string().min(1, 'Career name required').max(200),
});

export type RoadmapInput = z.infer<typeof RoadmapSchema>;

/**
 * Safely parse and validate data against schema
 * Returns { data, error } tuple
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { data: T | null; error: string | null } {
  try {
    const validated = schema.parse(data);
    return { data: validated, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const firstError = err.errors[0];
      return { data: null, error: `${firstError.path.join('.')}: ${firstError.message}` };
    }
    return { data: null, error: 'Validation failed' };
  }
}
