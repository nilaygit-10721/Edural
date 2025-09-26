import React, { useState } from "react";


const QUIZ = [
{
id: 1,
q: "What force keeps planets in orbit around the sun?",
options: ["Magnetic force", "Gravitational force", "Friction", "Nuclear force"],
answer: 1,
explanation: "Gravity is the attractive force that keeps planets in orbit."
},
{
id: 2,
q: "What is the SI unit of force?",
options: ["Joule", "Newton", "Pascal", "Watt"],
answer: 1,
explanation: "Newton (N) is the SI unit of force."
}
];


const Quiz = () => {
const [answers, setAnswers] = useState({});
const [submitted, setSubmitted] = useState(false);


const select = (qid, idx) => setAnswers(prev => ({ ...prev, [qid]: idx }));


const handleSubmit = () => {
if (Object.keys(answers).length !== QUIZ.length) return alert("Please answer all questions");
setSubmitted(true);
};


const score = QUIZ.reduce((s, q) => s + (answers[q.id] === q.answer ? 1 : 0), 0);


return (
<section className="mt-8 max-w-2xl">
<h3 className="text-lg font-semibold">Quick Quiz</h3>
<div className="mt-3 space-y-6">
{QUIZ.map((q) => (
<div key={q.id} className="p-4 border rounded">
<div className="font-medium">{q.q}</div>
<div className="mt-3 grid grid-cols-1 gap-2">
{q.options.map((opt, idx) => (
<button key={idx} onClick={() => select(q.id, idx)} className={`text-left p-2 rounded border ${answers[q.id] === idx ? 'bg-green-50 border-green-300' : ''}`}>
{opt}
</button>
))}
</div>
{submitted && (
<div className="mt-2 text-sm">
<strong>Explanation:</strong> {q.explanation}
</div>
)}
</div>
))}


<div>
{!submitted ? (
<button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-md">Submit Quiz</button>
) : (
<div className="p-3 bg-green-50 rounded border">You scored {score} / {QUIZ.length}</div>
)}
</div>
</div>
</section>
);
};


export default Quiz;