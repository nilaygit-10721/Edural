import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    response: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "general",
        "explain",
        "explanation",
        "homework",
        "math", // Added this new type
        "science",
        "history",
        "programming",
      ],
      default: "general",
    },
    topic: {
      type: String,
      enum: [
        "general",
        "general studies",
        "mathematics",
        "science",
        "physics",
        "chemistry",
        "biology",
        "history",
        "programming",
        "javascript",
        "python",
        "web development",
      ],
      default: "general",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Optional: Add metadata for better analytics
    metadata: {
      responseTime: Number, // Time taken to generate response
      apiUsed: String, // 'gemini' or 'fallback'
      detectedLanguage: String,
      confidence: Number,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for efficient queries
chatSchema.index({ userId: 1, timestamp: -1 });
chatSchema.index({ type: 1, timestamp: -1 });
chatSchema.index({ topic: 1, timestamp: -1 });

// Virtual for formatted timestamp
chatSchema.virtual("formattedTime").get(function () {
  return this.timestamp.toLocaleString();
});

// Method to get chat statistics
chatSchema.statics.getStats = async function (userId) {
  return await this.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        lastUsed: { $max: "$timestamp" },
      },
    },
  ]);
};

// Method to get recent chats by type
chatSchema.statics.getRecentByType = async function (userId, type, limit = 10) {
  return await this.find({
    userId: userId,
    type: type,
  })
    .sort({ timestamp: -1 })
    .limit(limit);
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
