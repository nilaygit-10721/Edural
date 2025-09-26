// src/pages/Home.jsx
import React, { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";
import DiscussionForm from "../components/DiscussionForm";
import Quiz from "../components/Quiz";
import gravity from "../assets/gravity.png";
import thermal from "../assets/thermal.jpg";
import save from "../assets/save.png";
import tank from "../assets/tank.png";
const gamesData = [


  { id: 1, title: "Gravity Voyager", minutes: 5, grade: 8, subject: "Physics",image:gravity },
  { id: 2, title: "Thermal City Builder", minutes: 8, grade: 9, subject: "Physics",image:thermal,description:"Bulid your city and learn about conductors" },
  { id: 3, title: "Build Water Tank", minutes: 10, grade: 10, subject: "Maths",description:"Build water tank and learn about area",image:tank },
  { id: 4, title: "Save the patient vision", minutes: 7, grade: 8, subject: "Biology",description:"Use different lens and save the patient’s vision",image:save },
  // { id: 5, title: "Orbital Mechanics", minutes: 6, grade: 11, subject: "Physics" },
  // { id: 6, title: "Stoichiometry Challenge", minutes: 9, grade: 12, subject: "Chemistry" },
  // add more mock items as needed
];

const SUBJECTS = ["All Subjects", "Physics", "Chemistry", "Maths", "Biology"];
const GRADES = ["All Grades", 8, 9, 10, 11, 12];

const Home = () => {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [grade, setGrade] = useState("All Grades");

  // Memoize filtered results for performance
  const filteredGames = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gamesData.filter((g) => {
      const matchesQuery = q === "" || g.title.toLowerCase().includes(q);
      const matchesSubject = subject === "All Subjects" || g.subject === subject;
      const matchesGrade = grade === "All Grades" || g.grade === Number(grade);
      return matchesQuery && matchesSubject && matchesGrade;
    });
  }, [query, subject, grade]);

  return (
    <div className="min-h-screen bg-gray-100">
    
      <Sidebar />

      <main className="ml-0 sm:ml-52 p-8">
        <header className="text-center my-8">
          <h1 className="text-3xl font-bold">Interactive Stem Games</h1>
        </header>

        {/* Search + Filters */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-4xl bg-white p-4 rounded-md border border-gray-400 outline-none">
            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border border-gray-400 rounded p-2 outline-none"
                              placeholder="Search Games by title..."
                              
              />

              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border border-gray-400 rounded p-2"
                aria-label="Filter by subject"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="border border-gray-400 rounded p-2"
                aria-label="Filter by grade"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {typeof g === "number" ? `Grade ${g}` : g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <section>
          {filteredGames.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No games found for your search/filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {filteredGames.map((g) => (
                <GameCard
                  key={g.id}
                  title={g.title}
                  minutes={g.minutes}
                  grade={`Grade ${g.grade}`}
                  tag={g.subject}
                  image={g.image}
                  description={g.description}
                  cta="Start Game"
  
                />
              ))}
            </div>
          )}
        </section>

        {/* Discussion & Quiz */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DiscussionForm />
       
        </div>
      </main>
    </div>
  );
};

export default Home;
