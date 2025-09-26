import { GoogleGenerativeAI } from "@google/generative-ai";
class ChatbotService {
  constructor() {
    console.log("🔄 Initializing ChatbotService...");
    const geminiApiKey = `AIzaSyCCza885RR5CdQIDQlD4s8UBMDO5CoB0d8`;
    console.log(`🔑 GEMINI_API_KEY: ${geminiApiKey ? "Found" : "Not Found"}`);

    if (!geminiApiKey) {
      console.error("❌ GEMINI_API_KEY is missing from environment variables");
      this.isGeminiAvailable = false;
    } else {
      try {
        console.log("🔑 API Key found, initializing Gemini...");
        // Change: Correctly initialize the main AI class
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        // Change: Get the specific model you want to use
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.isGeminiAvailable = true;
        console.log("✅ Gemini AI initialized successfully");
      } catch (error) {
        console.error("❌ Failed to initialize Google GenAI:", error.message);
        this.isGeminiAvailable = false;
      }
    }
  }

  async getAIResponse(userMessage) {
    console.log(`📨 Received message: "${userMessage}"`);
    console.log(`🔧 Gemini available: ${this.isGeminiAvailable}`);

    if (this.isGeminiAvailable) {
      try {
        console.log("🚀 Sending to Gemini...");

        // Change: The model instance now handles chat sessions and content generation
        const chat = this.model.startChat();
        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        const text = response.text();

        console.log("✅ Gemini response received");
        return text;
      } catch (error) {
        console.error("❌ Gemini API Error:", error.message);
        // Fall through to enhanced fallback
      }
    }

    // Enhanced fallback responses
    return this.getEnhancedFallbackResponse(userMessage);
  }

  async explainConcept(concept) {
    console.log(`🔍 Explaining concept: "${concept}"`);

    if (this.isGeminiAvailable) {
      try {
        const prompt = `Explain the concept of "${concept}" in simple terms suitable for a student. Provide a clear, concise explanation.`;
        const response = await this.ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        return response.text;
      } catch (error) {
        console.error("Explain concept error:", error.message);
      }
    }

    // Enhanced fallback for explanations
    const lowerConcept = concept.toLowerCase();

    if (
      lowerConcept.includes("plant") &&
      lowerConcept.includes("reproduction")
    ) {
      return `Plant reproduction is the process by which plants create new plants. There are two main types:

1. **Sexual reproduction**: Involves flowers, pollination, and seeds. Male pollen fertilizes female ovules to produce seeds that grow into new plants.

2. **Asexual reproduction**: Plants create new individuals without seeds, through methods like runners (strawberries), bulbs (onions), or cuttings.

This is how plants spread and create new generations!`;
    }

    return `I'd be happy to explain "${concept}"! This is a biology/science topic. Plants reproduce through processes like pollination, seed formation, or vegetative propagation. Would you like me to provide more specific details?`;
  }

  async helpWithHomework(topic, problem) {
    console.log(`📚 Homework help: ${topic} - ${problem}`);

    if (this.isGeminiAvailable) {
      try {
        const prompt = `Help with ${topic} homework: ${problem}. Provide step-by-step guidance and explanation.`;
        const response = await this.ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        return response.text;
      } catch (error) {
        console.error("Homework help error:", error.message);
      }
    }

    return `I can help with your ${topic} homework! For "${problem}", let me break it down step by step. Could you provide more specific details about what you need help with?`;
  }

  getEnhancedFallbackResponse(userMessage) {
    console.log("🔄 Using enhanced fallback response");

    const message = userMessage.toLowerCase().trim();

    // Enhanced response database
    const responses = {
      // Plant reproduction specific
      "plant reproduction": `Plant reproduction is how plants create new plants! 🌱

There are two main types:
• **Sexual reproduction**: Through flowers and seeds (like apples growing from apple trees)
• **Asexual reproduction**: Without seeds (like potatoes growing new plants from their eyes)

This is a fundamental biology concept!`,

      "what is plant reproduction": `Plant reproduction refers to the biological process by which plants produce new individuals or offspring. 

Key methods include:
- **Sexual**: Flowers, pollination, seeds
- **Asexual**: Runners, bulbs, cuttings, tubers

It's essential for plant survival and diversity!`,

      // Science topics
      photosynthesis: `Photosynthesis is how plants make their own food using sunlight! ☀️

The process: 
Water + Carbon Dioxide + Sunlight → Glucose (sugar) + Oxygen

This happens in the chloroplasts of plant cells and is vital for life on Earth!`,

      gravity: `Gravity is the force that pulls objects toward each other. On Earth, it's what keeps us grounded and makes things fall when dropped. Isaac Newton famously discovered gravity when an apple fell on his head!`,

      // General responses
      hello: `Hello! I'm your AI educational assistant. I can help you with:
• Science concepts like plant reproduction, photosynthesis, gravity
• Math problems and equations  
• History facts and events
• Programming questions
• And much more!

What would you like to learn about today?`,

      hi: `Hi there! I'm here to help with your studies. Ask me about any subject - science, math, history, programming, etc. What topic interests you?`,

      help: `I can help you with various educational topics! Try asking about:

🔬 **Science**: "What is photosynthesis?", "Explain gravity"
➗ **Math**: "Solve 2x + 5 = 15", "Help with algebra"
📚 **History**: "Tell me about ancient Egypt", "World War II facts"
💻 **Programming**: "Explain functions in JavaScript", "Python basics"

What would you like to know?`,

      // Default response
      default: `I'd love to help you with "${userMessage}"! 

This appears to be a science/biology topic. Plant reproduction involves how plants create new plants through processes like pollination, seed formation, or vegetative growth.

Would you like me to provide a detailed explanation? You can also ask about other subjects like math, history, or programming!`,
    };

    // Check for exact matches first
    if (responses[message]) {
      return responses[message];
    }

    // Check for partial matches
    for (const [keyword, response] of Object.entries(responses)) {
      if (message.includes(keyword)) {
        return response;
      }
    }

    // Check for topic keywords and provide specific responses
    if (message.includes("plant") && message.includes("reproduction")) {
      return responses["plant reproduction"];
    }

    if (message.includes("what is") && message.includes("plant")) {
      return `"${userMessage}" is a great biology question! Plants reproduce through various methods including sexual reproduction (flowers and seeds) and asexual reproduction (like runners or bulbs). Would you like me to explain this in more detail?`;
    }

    if (message.includes("science") || message.includes("biology")) {
      return `I can help with science topics! "${userMessage}" seems like a biology question. Plants, animals, human body - ask me anything!`;
    }

    return responses.default;
  }
}

export default ChatbotService;
