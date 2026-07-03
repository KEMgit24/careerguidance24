import { describe, it, expect } from 'vitest';
import { ChatbotMessageSchema } from '@/lib/validation';

describe('Chatbot Validation', () => {
  it('should accept valid message', () => {
    const result = ChatbotMessageSchema.safeParse({
      message: 'Quelles sont les universités au Togo ?'
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty message', () => {
    const result = ChatbotMessageSchema.safeParse({
      message: ''
    });
    expect(result.success).toBe(false);
  });

  it('should reject message over 5000 characters', () => {
    const longMessage = 'a'.repeat(5001);
    const result = ChatbotMessageSchema.safeParse({
      message: longMessage
    });
    expect(result.success).toBe(false);
  });

  it('should trim whitespace from message', () => {
    const result = ChatbotMessageSchema.safeParse({
      message: '  Test message  '
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe('Test message');
    }
  });

  it('should include history if provided', () => {
    const result = ChatbotMessageSchema.safeParse({
      message: 'Follow up question',
      history: [
        { role: 'user', content: 'First question' },
        { role: 'model', content: 'Answer' }
      ]
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.history).toHaveLength(2);
    }
  });

  it('should default to empty history if not provided', () => {
    const result = ChatbotMessageSchema.safeParse({
      message: 'Test'
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.history).toEqual([]);
    }
  });
});
