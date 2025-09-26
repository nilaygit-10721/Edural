// FILE: src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PRIMARY = "#16a34a"; // green-600

const loadFromStorage = () => {
  const email = localStorage.getItem("userEmail") || "user@example.com";
  const name = localStorage.getItem("userName") || email.split("@")[0];
  const bio = localStorage.getItem("userBio") || "I love learning and building things with code.";
  const stats = JSON.parse(localStorage.getItem("userStats") || null) || { games: 12, points: 1540, level: "Intermediate" };
  const progress = JSON.parse(localStorage.getItem("userProgress") || null) || { Physics: 70, Chemistry: 55, Maths: 80, Biology: 40 };
  return { email, name, bio, stats, progress };
};

const Profile = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [stats, setStats] = useState({ games: 0, points: 0, level: "" });
  const [progress, setProgress] = useState({ Physics: 0, Chemistry: 0, Maths: 0, Biology: 0 });
  const [editMode, setEditMode] = useState(false);

  // Keep a snapshot for cancel
  const [snapshot, setSnapshot] = useState(null);

  const avatarStyles = useMemo(
    () => [
      "fun-emoji",
      "adventurer",
      "avataaars",
      "bottts",
      "lorelei",
      "micah",
      "miniavs",
      "open-peeps",
    ],
    []
  );

  useEffect(() => {
    const stored = loadFromStorage();
    setUserEmail(stored.email);
    setName(stored.name);
    setBio(stored.bio);
    setStats(stored.stats);
    setProgress(stored.progress);
  }, []);

  useEffect(() => {
    // persist quick fields so user sees changes across reloads
    localStorage.setItem("userName", name);
  }, [name]);

  const avatarSeed = useMemo(() => {
    const keySeed = `avatarSeed_${userEmail}`;
    const keyStyle = `avatarStyle_${userEmail}`;
    let seed = localStorage.getItem(keySeed);
    let styleIndex = localStorage.getItem(keyStyle);
    if (!styleIndex) {
      styleIndex = Math.floor(Math.random() * avatarStyles.length);
      localStorage.setItem(keyStyle, styleIndex);
    }
    if (!seed) {
      seed = Math.random().toString(36).substring(2, 12);
      localStorage.setItem(keySeed, seed);
    }
    const style = avatarStyles[styleIndex] || "adventurer";
    return `https://api.dicebear.com/6.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
  }, [userEmail, avatarStyles]);

  // Hardcoded Edit behavior: enter edit mode, allow changing name/bio/stats locally, Save writes to localStorage, Cancel reverts
  const enterEdit = () => {
    setSnapshot({ name, bio, stats: { ...stats } });
    setEditMode(true);
  };

  const cancelEdit = () => {
    if (snapshot) {
      setName(snapshot.name);
      setBio(snapshot.bio);
      setStats(snapshot.stats);
    }
    setEditMode(false);
  };

  const saveEdit = () => {
    // Persist everything to localStorage (hardcoded/save-only, no backend)
    localStorage.setItem("userName", name);
    localStorage.setItem("userBio", bio);
    localStorage.setItem("userStats", JSON.stringify(stats));
    // keep progress read-only (not editable by user)
    setEditMode(false);
    setSnapshot(null);
    alert("Profile saved (local only).");
  };

  // Small handlers for numeric fields
  const setStatValue = (key, val) => {
    if (key === "level") {
      setStats((s) => ({ ...s, [key]: val }));
    } else {
      const n = Math.max(0, Number(val) || 0);
      setStats((s) => ({ ...s, [key]: n }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
 
      <Sidebar />

      <main className="ml-0 sm:ml-52 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-md shadow p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <img src={avatarSeed} alt="avatar" className="w-28 h-28 rounded-full border-4" style={{ borderColor: PRIMARY }} />
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {!editMode ? (
                    <>
                      <h2 className="text-2xl font-bold truncate">{name}</h2>
                      <div className="text-sm text-gray-500 truncate">{userEmail}</div>
                    </>
                  ) : (
                    <div>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
                      <div className="text-sm text-gray-500">{userEmail}</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!editMode ? (
                    <>
                      <button className="px-4 py-2 rounded-md font-medium border" style={{ borderColor: PRIMARY }} onClick={enterEdit}>
                        Edit
                      </button>
                      <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: PRIMARY }} onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="px-4 py-2 rounded-md font-medium border" style={{ borderColor: PRIMARY }} onClick={cancelEdit}>
                        Cancel
                      </button>
                      <button className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: PRIMARY }} onClick={saveEdit}>
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!editMode ? (
                <p className="mt-3 text-gray-700">{bio}</p>
              ) : (
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-3 w-full border rounded p-2" rows={4} />
              )}

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Games Played</div>
                  {editMode ? (
                    <input className="w-full mt-1 p-1 text-lg font-semibold text-center" value={stats.games} onChange={(e) => setStatValue('games', e.target.value)} />
                  ) : (
                    <div className="text-lg font-semibold">{stats.games}</div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Points</div>
                  {editMode ? (
                    <input className="w-full mt-1 p-1 text-lg font-semibold text-center" value={stats.points} onChange={(e) => setStatValue('points', e.target.value)} />
                  ) : (
                    <div className="text-lg font-semibold">{stats.points}</div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Level</div>
                  {editMode ? (
                    <select className="w-full mt-1 p-1 text-lg font-semibold text-center" value={stats.level} onChange={(e) => setStatValue('level', e.target.value)}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  ) : (
                    <div className="text-lg font-semibold">{stats.level}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-md shadow p-6">
              <h3 className="text-lg font-semibold">Learning Progress</h3>
              <p className="text-sm text-gray-500 mt-1">Progress across subjects (read-only)</p>

              <div className="mt-4 space-y-4">
                {Object.entries(progress).map(([subject, pct]) => (
                  <div key={subject}>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium text-gray-700">{subject}</div>
                      <div className="text-sm text-gray-500">{pct}%</div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="h-3 rounded-full" style={{ width: `${pct}%`, backgroundColor: PRIMARY }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold">About</h4>
                {!editMode ? (
                  <p className="mt-2 text-gray-700">{bio}</p>
                ) : (
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-2 w-full border rounded p-2" rows={4} />
                )}
              </div>
            </div>

            <aside className="bg-white rounded-md shadow p-6">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex justify-between">
                  <div>Completed: Gravity Voyager</div>
                  <div className="text-gray-500">2d ago</div>
                </li>
                <li className="flex justify-between">
                  <div>Scored 80% in Quick Quiz</div>
                  <div className="text-gray-500">5d ago</div>
                </li>
                <li className="flex justify-between">
                  <div>Started: Stoichiometry Challenge</div>
                  <div className="text-gray-500">1w ago</div>
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
