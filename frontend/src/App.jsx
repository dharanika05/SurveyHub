import { useEffect, useState } from "react";
import "./App.css";

const API = "https://surveyhub-4.onrender.com/api/survey";

function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadQuestions() {
    setLoading(true);
    setError("");
    setMessage("");
    setAnswers({});

    try {
      const response = await fetch(`${API}/questions`);
      if (!response.ok) throw new Error("Could not load questions");

      const data = await response.json();
      if (data.length !== 5) throw new Error("Five questions are not available");

      setQuestions(data);
    } catch (err) {
      setError(err.message + ". Please check your backend server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, []);

  function selectAnswer(questionId, option) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  }

  async function submitSurvey() {
    if (Object.keys(answers).length !== 5) {
      setError("Please answer all 5 questions.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: questions.map((q) => ({
            questionId: q._id,
            selectedOption: answers[q._id]
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setMessage("Your survey has been submitted successfully!");
      setQuestions([]);
    } catch (err) {
      setError(err.message || "Submission failed.");
    }
  }

  const answered = Object.keys(answers).length;

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">Survey<span>Hub.</span></div>
        <div className="nav-tag">ONLINE SURVEY</div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="eyebrow">YOUR OPINION MATTERS</div>
          <h1>Share your thoughts.<br /><span>Make a difference.</span></h1>
          <p>Answer 5 randomly selected questions and let your voice be heard.</p>
        </section>

        <section className="survey-card">
          <div className="survey-top">
            <div>
              <h2>Quick Survey</h2>
              <p>Choose one answer for each question.</p>
            </div>
            <div className="count">{answered}/5 <small>ANSWERED</small></div>
          </div>

          <div className="progress">
            <div style={{ width: `${answered * 20}%` }} />
          </div>

          {loading && <p className="info">Loading your questions...</p>}

          {error && <div className="error">{error}</div>}

          {message && (
            <div className="success">
              <div className="success-icon">?</div>
              <h2>Thank you!</h2>
              <p>{message}</p>
              <button onClick={loadQuestions}>Take Another Survey</button>
            </div>
          )}

          {!loading && questions.map((q, index) => (
            <div className="question" key={q._id}>
              <div className="question-heading">
                <span className="number">0{index + 1}</span>
                <h3>{q.question}</h3>
              </div>

              <div className="options">
                {q.options.map((option) => (
                  <button
                    key={option}
                    className={`option ${answers[q._id] === option ? "selected" : ""}`}
                    onClick={() => selectAnswer(q._id, option)}
                  >
                    <span className="radio">
                      {answers[q._id] === option && <span />}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {!loading && questions.length > 0 && (
            <div className="submit-area">
              <button className="submit-btn" onClick={submitSurvey}>
                Submit Survey <span>?</span>
              </button>
              <p>{5 - answered} questions remaining</p>
            </div>
          )}
        </section>

        <footer>© 2026 SurveyHub. Your opinions make an impact.</footer>
      </main>
    </div>
  );
}

export default App;
