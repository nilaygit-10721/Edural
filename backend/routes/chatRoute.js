import express from "express";
import Chat from "../models/Chat.js";
import ChatbotService from "../services/chatbotService.js";

const router = express.Router();
const chatbotService = new ChatbotService();

// Helper function to detect topic from message content
// Simple but improved topic detection
const detectTopic = (message) => {
  const msg = message.toLowerCase();

  const topicKeywords = {
    mathematics: [
      "math",
      "algebra",
      "geometry",
      "calculus",
      "equation",
      "number",
      "integral",
      "derivative",
    ],
    science: [
      "science",
      "physics",
      "chemistry",
      "biology",
      "quantum",
      "experiment",
      "atom",
      "molecule",
      "energy",
    ],
    history: [
      "history",
      "renaissance",
      "ww2",
      "ancient",
      "medieval",
      "civilization",
      "revolution",
      "war",
    ],
    programming: [
      "programming",
      "code",
      "javascript",
      "python",
      "java",
      "c++",
      "algorithm",
      "software",
      "bug",
    ],
    literature: [
      "literature",
      "poem",
      "novel",
      "author",
      "shakespeare",
      "story",
      "drama",
    ],
    geography: [
      "geography",
      "earth",
      "continent",
      "ocean",
      "climate",
      "map",
      "country",
    ],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((word) => msg.includes(word))) {
      return topic;
    }
  }

  return "general studies"; // fallback if no match
};

// Send message to chatbot
// In your chatRoutes.js, add this at the beginning of the message endpoint
router.post("/message", async (req, res) => {
  try {
    const { message, userId = "anonymous", type = "general" } = req.body;

    console.log("🔍 Incoming request:");
    console.log("Message:", message);
    console.log("Type:", type);
    console.log("User ID:", userId);

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    let response;
    const cleanMessage = message.trim();

    // Log which path we're taking
    console.log(`🛣️ Route: ${type} mode`);

    switch (type) {
      case "explain":
        response = await chatbotService.explainConcept(cleanMessage);
        break;
      case "homework":
        const detectedTopic = detectTopic(cleanMessage);
        console.log(`🎯 Detected topic: ${detectedTopic}`);
        response = await chatbotService.helpWithHomework(
          detectedTopic,
          cleanMessage
        );
        break;
      default:
        response = await chatbotService.getAIResponse(cleanMessage);
    }

    console.log("✅ Response generated:", response.substring(0, 100) + "...");

    // Save to database
    const chatRecord = new Chat({
      userId: userId.toString(),
      message: cleanMessage,
      response: response,
      type,
    });

    await chatRecord.save();

    res.json({
      response,
      type: "ai",
    });
  } catch (error) {
    console.error("💥 Chat error:", error);
    res.status(500).json({
      error: "Internal server error",
      fallback:
        "I'm having some technical difficulties. Please try again in a moment.",
    });
  }
});

// Get specialized explanations
router.post("/explain", async (req, res) => {
  try {
    const { concept, userId = "anonymous" } = req.body;

    if (!concept || concept.trim() === "") {
      return res.status(400).json({ error: "Concept is required" });
    }

    const response = await chatbotService.explainConcept(concept.trim());

    const chatRecord = new Chat({
      userId: userId.toString(),
      message: `Explain: ${concept.trim()}`,
      response,
      type: "explanation",
    });

    await chatRecord.save();

    res.json({ response });
  } catch (error) {
    console.error("Explain error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Homework help endpoint
router.post("/homework-help", async (req, res) => {
  try {
    const { topic, problem, userId = "anonymous" } = req.body;

    if (!problem || problem.trim() === "") {
      return res.status(400).json({ error: "Problem is required" });
    }

    const cleanProblem = problem.trim();

    // If no topic provided, auto-detect it
    const finalTopic =
      topic && topic !== "general" ? topic : detectTopic(cleanProblem);

    const response = await chatbotService.helpWithHomework(
      finalTopic,
      cleanProblem
    );

    const chatRecord = new Chat({
      userId: userId.toString(),
      message: `Homework help: ${finalTopic} - ${cleanProblem}`,
      response,
      type: "homework",
      topic: finalTopic,
    });

    await chatRecord.save();

    res.json({
      response,
      detectedTopic: finalTopic,
    });
  } catch (error) {
    console.error("Homework help error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// New endpoint specifically for math problems
router.post("/solve-math", async (req, res) => {
  try {
    const { equation, userId = "anonymous" } = req.body;

    if (!equation || equation.trim() === "") {
      return res.status(400).json({ error: "Equation is required" });
    }

    const response = (await chatbotService.solveMathProblem)
      ? await chatbotService.solveMathProblem(equation.trim())
      : await chatbotService.helpWithHomework("mathematics", equation.trim());

    const chatRecord = new Chat({
      userId: userId.toString(),
      message: `Solve: ${equation.trim()}`,
      response,
      type: "math",
    });

    await chatRecord.save();

    res.json({ response });
  } catch (error) {
    console.error("Math solve error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get chat history for user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const chats = await Chat.find({ userId: userId.toString() })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    res.json(chats);
  } catch (error) {
    console.error("History error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    res.json({
      status: "ok",
      geminiAvailable: chatbotService.isGeminiAvailable,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

// Test endpoint for debugging
router.post("/test", async (req, res) => {
  try {
    const { message } = req.body;
    const topic = detectTopic(message);

    res.json({
      message,
      detectedTopic: topic,
      geminiAvailable: chatbotService.isGeminiAvailable,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
