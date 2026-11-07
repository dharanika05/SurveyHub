const express = require("express");
const router = express.Router();

const Question = require("../models/Question");
const Response = require("../models/Response");

// Get random 5 questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.aggregate([
      { $sample: { size: 5 } }
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch questions" });
  }
});

// Submit exactly 5 answers
router.post("/submit", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length !== 5) {
      return res.status(400).json({
        message: "Please submit exactly 5 answers"
      });
    }

    const ids = answers.map(a => a.questionId);

    if (ids.some(id => !id) || new Set(ids.map(String)).size !== 5) {
      return res.status(400).json({
        message: "Five different valid questions are required"
      });
    }

    for (const answer of answers) {
      if (typeof answer.selectedOption !== "string" ||
          !answer.selectedOption.trim()) {
        return res.status(400).json({
          message: "All 5 questions must be answered"
        });
      }
    }

    const questions = await Question.find({
      _id: { $in: ids }
    });

    if (questions.length !== 5) {
      return res.status(400).json({
        message: "Invalid question selection"
      });
    }

    for (const answer of answers) {
      const question = questions.find(
        q => q._id.toString() === answer.questionId.toString()
      );

      if (!question || !question.options.includes(answer.selectedOption)) {
        return res.status(400).json({
          message: "Invalid answer option"
        });
      }
    }

    const response = await Response.create({ answers });

    res.status(201).json({
      message: "Survey submitted successfully!",
      responseId: response._id
    });

  } catch (error) {
    res.status(500).json({ message: "Survey submission failed" });
  }
});

module.exports = router;
