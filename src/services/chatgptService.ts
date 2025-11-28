import OpenAI from 'openai';

export class ChatGPTService {
  private static openai: OpenAI | null = null;

  private static initializeOpenAI() {
    if (!this.openai && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  /**
   * Get AI explanation for a chemical reaction
   */
  static async getExplanation(reactionData: {
    balanced: string;
    types: string[];
    precipitate?: any;
    gas?: any;
    locale?: string;
  }): Promise<string> {
    this.initializeOpenAI();

    // If no API key, return a fallback explanation
    if (!this.openai) {
      return this.getFallbackExplanation(reactionData, reactionData.locale);
    }

    try {
      const isVietnamese = reactionData.locale === 'vi';
      const prompt = this.buildPrompt(reactionData, isVietnamese);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: isVietnamese
              ? `Bạn là một giáo viên hóa học thân thiện đang giải thích phản ứng cho học sinh trung học.
Sử dụng ngôn ngữ đơn giản, tránh thuật ngữ quá phức tạp, và tập trung vào hiện tượng quan sát được.
Hãy nhiệt tình và làm cho hóa học trở nên thú vị! Giữ câu trả lời dưới 200 từ.
TRẢ LỜI HOÀN TOÀN BẰNG TIẾNG VIỆT.`
              : `You are a friendly chemistry teacher explaining reactions to high school students.
Use simple language, avoid excessive jargon, and focus on observable phenomena.
Be enthusiastic and make chemistry exciting! Keep responses under 200 words.
RESPOND ENTIRELY IN ENGLISH.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content || this.getFallbackExplanation(reactionData, reactionData.locale);
    } catch (error) {
      console.error('ChatGPT API error:', error);
      return this.getFallbackExplanation(reactionData, reactionData.locale);
    }
  }

  private static buildPrompt(data: {
    balanced: string;
    types: string[];
    precipitate?: any;
    gas?: any;
  }, isVietnamese: boolean): string {
    if (isVietnamese) {
      let prompt = `Giải thích phản ứng hóa học này cho học sinh trung học:\n\n`;
      prompt += `Phản ứng: ${data.balanced}\n`;
      prompt += `Loại: ${data.types.join(', ')}\n\n`;

      if (data.precipitate) {
        prompt += `Có ${data.precipitate.description} hình thành.\n`;
      }

      if (data.gas) {
        prompt += `${data.gas.description}.\n`;
      }

      prompt += `\nVui lòng giải thích:\n`;
      prompt += `- Tại sao phản ứng này xảy ra\n`;
      prompt += `- Bạn sẽ quan sát thấy gì (màu sắc, kết tủa, bọt khí, v.v.)\n`;
      prompt += `- Ứng dụng thực tế hoặc lưu ý an toàn\n\n`;
      prompt += `Giữ cho nó đơn giản và thú vị!`;

      return prompt;
    } else {
      let prompt = `Explain this chemical reaction to a high school student:\n\n`;
      prompt += `Reaction: ${data.balanced}\n`;
      prompt += `Type: ${data.types.join(', ')}\n\n`;

      if (data.precipitate) {
        prompt += `A ${data.precipitate.description} forms.\n`;
      }

      if (data.gas) {
        prompt += `${data.gas.description}.\n`;
      }

      prompt += `\nPlease explain:\n`;
      prompt += `- Why this reaction happens\n`;
      prompt += `- What you would observe (colors, precipitate, bubbles, etc.)\n`;
      prompt += `- Any practical uses or safety notes\n\n`;
      prompt += `Keep it simple and exciting!`;

      return prompt;
    }
  }

  private static getFallbackExplanation(data: {
    balanced: string;
    types: string[];
    precipitate?: any;
    gas?: any;
  }, locale?: string): string {
    const isVietnamese = locale === 'vi';

    if (isVietnamese) {
      let explanation = `Đây là phản ứng ${data.types.join(' và ')}.\n\n`;
      explanation += `**Điều gì xảy ra:** ${data.balanced}\n\n`;

      if (data.types.includes('acid-base')) {
        explanation += `Axit phản ứng với bazơ tạo thành muối và nước. Bạn sẽ thấy dung dịch trung hòa.\n\n`;
      }

      if (data.types.includes('precipitation')) {
        explanation += `Hai dung dịch trộn lẫn và tạo thành chất rắn không tan rơi ra khỏi dung dịch.\n\n`;
      }

      if (data.types.includes('single-displacement')) {
        explanation += `Một nguyên tố hoạt động mạnh hơn thay thế nguyên tố hoạt động yếu hơn trong hợp chất.\n\n`;
      }

      if (data.types.includes('combustion')) {
        explanation += `Chất cháy trong oxy, giải phóng năng lượng dưới dạng nhiệt và ánh sáng.\n\n`;
      }

      if (data.precipitate) {
        explanation += `**Quan sát:** Bạn sẽ thấy ${data.precipitate.description} hình thành!\n\n`;
      }

      if (data.gas) {
        explanation += `**Quan sát:** ${data.gas.description} - bạn sẽ thấy bọt khí!\n\n`;
      }

      explanation += `\n*Để nhận giải thích bằng AI, hãy thêm khóa OpenAI API vào .env.local*`;

      return explanation;
    } else {
      let explanation = `This is a ${data.types.join(' and ')} reaction.\n\n`;
      explanation += `**What happens:** ${data.balanced}\n\n`;

      if (data.types.includes('acid-base')) {
        explanation += `An acid reacts with a base to form salt and water. You'll see the solution neutralize.\n\n`;
      }

      if (data.types.includes('precipitation')) {
        explanation += `Two solutions mix and form an insoluble solid that falls out of solution.\n\n`;
      }

      if (data.types.includes('single-displacement')) {
        explanation += `A more reactive element replaces a less reactive one in a compound.\n\n`;
      }

      if (data.types.includes('combustion')) {
        explanation += `A substance burns in oxygen, releasing energy as heat and light.\n\n`;
      }

      if (data.precipitate) {
        explanation += `**Observable:** You'll see a ${data.precipitate.description} forming!\n\n`;
      }

      if (data.gas) {
        explanation += `**Observable:** ${data.gas.description} - you'll see bubbles!\n\n`;
      }

      explanation += `\n*To get AI-powered explanations, add your OpenAI API key to .env.local*`;

      return explanation;
    }
  }
}
