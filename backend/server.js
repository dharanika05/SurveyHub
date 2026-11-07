const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Question = require("./models/Question");
const surveyRoutes = require("./routes/surveyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/survey", surveyRoutes);

const sampleQuestions = [
  { question: "Which technology do you prefer?", options: ["React", "Angular", "Vue", "Svelte"] },
  { question: "Which programming language do you like?", options: ["Python", "Java", "C++", "JavaScript"] },
  { question: "How often do you use the internet?", options: ["Daily", "Weekly", "Monthly", "Rarely"] },
  { question: "Which database do you prefer?", options: ["MongoDB", "MySQL", "Oracle", "PostgreSQL"] },
  { question: "What is your favorite operating system?", options: ["Windows", "Linux", "macOS", "Android"] },
  { question: "Which field interests you most?", options: ["AI", "Cloud Computing", "Cybersecurity", "Web Development"] },
  { question: "How do you learn new technologies?", options: ["Online Courses", "Books", "Videos", "Practice"] },
  { question: "Which device do you use most?", options: ["Laptop", "Mobile", "Tablet", "Desktop"] },
  { question: "Do you prefer online learning?", options: ["Yes", "No", "Sometimes", "Not Sure"] },
  { question: "Which social platform do you use most?", options: ["Instagram", "YouTube", "LinkedIn", "Facebook"] },
  { question: "How many hours do you study daily?", options: ["1-2 Hours", "3-4 Hours", "5-6 Hours", "Above 6 Hours"] },
  { question: "Which development area do you prefer?", options: ["Frontend", "Backend", "Full Stack", "Mobile Apps"] },
  { question: "Do you enjoy working in teams?", options: ["Yes", "No", "Sometimes", "Not Sure"] },
  { question: "Which cloud platform interests you?", options: ["AWS", "Azure", "Google Cloud", "IBM Cloud"] },
  { question: "What is your main career goal?", options: ["Software Developer", "Data Analyst", "UI/UX Designer", "Cloud Engineer"] }
];

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");

    const count = await Question.countDocuments();

    if (count === 0) {
      await Question.insertMany(sampleQuestions);
      console.log("15 Survey Questions Added!");
    }

    app.listen(process.env.PORT || 5000, () => {
      console.log("SurveyHub Server running on port 5000");
    });

  } catch (error) {
    console.error("Server Error:", error.message);
    process.exit(1);
  }
}

startServer();
