// FILE: src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PRIMARY = "#16a34a"; // green-600

// ✅ Helper to autogenerate username
const generateUsername = () => {
  const adjectives = [
    "Cool",
    "Smart",
    "Happy",
    "Fast",
    "Brave",
    "Clever",
    "Lucky",
    "Chill",
    "Mighty",
    "Calm",
    "Epic",
    "Swift",
    "Bright",
    "Wise",
    "Gentle",
    "Fierce",
    "Noble",
    "Vivid",
    "Zen",
    "Rapid",
  ];
  const nouns = [
    "Tiger",
    "Eagle",
    "Coder",
    "Wizard",
    "Ninja",
    "Lion",
    "Phoenix",
    "Knight",
    "Wolf",
    "Falcon",
    "Dragon",
    "Pioneer",
    "Voyager",
    "Explorer",
    "Genius",
    "Scholar",
    "Captain",
    "Hero",
    "Champion",
    "Warrior",
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${number}`;
};

// ✅ Improved storage loading with better email handling
const loadFromStorage = () => {
  let email = localStorage.getItem("userEmail");
  if (!email || email === "undefined") {
    email = "user@example.com";
    localStorage.setItem("userEmail", email);
  }

  let name = localStorage.getItem("userName");
  if (!name || name === "undefined" || name.trim() === "") {
    name = generateUsername();
    localStorage.setItem("userName", name);
  }

  const bio =
    localStorage.getItem("userBio") ||
    "I love learning and building things with code.";

  const stats = JSON.parse(localStorage.getItem("userStats") || null) || {
    games: 12,
    points: 1540,
    level: "Intermediate",
  };

  const progress = JSON.parse(localStorage.getItem("userProgress") || null) || {
    Physics: 70,
    Chemistry: 55,
    Maths: 80,
    Biology: 40,
  };

  return { email, name, bio, stats, progress };
};

const Profile = () => {
  const [userEmail, setUserEmail] = useState("user@example.com"); // Default email
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [stats, setStats] = useState({ games: 0, points: 0, level: "" });
  const [progress, setProgress] = useState({
    Physics: 0,
    Chemistry: 0,
    Maths: 0,
    Biology: 0,
  });
  const [editMode, setEditMode] = useState(false);
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
    // Persist name changes and ensure it's never undefined
    if (name && name !== "undefined") {
      localStorage.setItem("userName", name);
    } else if (!name || name === "undefined") {
      const newName = generateUsername();
      setName(newName);
      localStorage.setItem("userName", newName);
    }
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
    return `https://api.dicebear.com/6.x/${style}/svg?seed=${encodeURIComponent(
      seed
    )}`;
  }, [userEmail, avatarStyles]);

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
    // Ensure name is never undefined before saving
    if (!name || name === "undefined") {
      const newName = generateUsername();
      setName(newName);
      localStorage.setItem("userName", newName);
    } else {
      localStorage.setItem("userName", name);
    }

    localStorage.setItem("userBio", bio);
    localStorage.setItem("userStats", JSON.stringify(stats));
    setEditMode(false);
    setSnapshot(null);
    alert("Profile saved!");
  };

  const setStatValue = (key, val) => {
    if (key === "level") {
      setStats((s) => ({ ...s, [key]: val }));
    } else {
      const n = Math.max(0, Number(val) || 0);
      setStats((s) => ({ ...s, [key]: n }));
    }
  };

  const regenerateUsername = () => {
    const newName = generateUsername();
    setName(newName);
    localStorage.setItem("userName", newName);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <main className="ml-0 sm:ml-52 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-md shadow p-6 flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0">
              <img
                src={avatarSeed}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4"
                style={{ borderColor: PRIMARY }}
              />
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {!editMode ? (
                    <>
                      <h2 className="text-2xl font-bold truncate">
                        {name || generateUsername()}
                      </h2>
                      <div className="text-sm text-gray-500 truncate">
                        {userEmail && userEmail !== "undefined"
                          ? userEmail
                          : "user@example.com"}
                      </div>
                    </>
                  ) : (
                    <div>
                      <div className="flex gap-2 mb-2">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="flex-1 p-2 border rounded"
                          placeholder="Enter your name"
                        />
                        <button
                          type="button"
                          onClick={regenerateUsername}
                          className="px-3 py-2 text-xs border rounded"
                          style={{ borderColor: PRIMARY }}
                        >
                          Random
                        </button>
                      </div>
                      <div className="text-sm text-gray-500">
                        {userEmail && userEmail !== "undefined"
                          ? userEmail
                          : "user@example.com"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!editMode ? (
                    <>
                      <button
                        className="px-4 py-2 rounded-md font-medium border"
                        style={{ borderColor: PRIMARY }}
                        onClick={enterEdit}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: PRIMARY }}
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = "/login";
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-4 py-2 rounded-md font-medium border"
                        style={{ borderColor: PRIMARY }}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: PRIMARY }}
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>

              {!editMode ? (
                <p className="mt-3 text-gray-700">{bio}</p>
              ) : (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-3 w-full border rounded p-2"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              )}

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Games Played</div>
                  {editMode ? (
                    <input
                      type="number"
                      className="w-full mt-1 p-1 text-lg font-semibold text-center"
                      value={stats.games}
                      onChange={(e) => setStatValue("games", e.target.value)}
                    />
                  ) : (
                    <div className="text-lg font-semibold">{stats.games}</div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Points</div>
                  {editMode ? (
                    <input
                      type="number"
                      className="w-full mt-1 p-1 text-lg font-semibold text-center"
                      value={stats.points}
                      onChange={(e) => setStatValue("points", e.target.value)}
                    />
                  ) : (
                    <div className="text-lg font-semibold">{stats.points}</div>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">Level</div>
                  {editMode ? (
                    <select
                      className="w-full mt-1 p-1 text-lg font-semibold text-center"
                      value={stats.level}
                      onChange={(e) => setStatValue("level", e.target.value)}
                    >
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
              <p className="text-sm text-gray-500 mt-1">
                Progress across subjects (read-only)
              </p>

              <div className="mt-4 space-y-4">
                {Object.entries(progress).map(([subject, pct]) => (
                  <div key={subject}>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm font-medium text-gray-700">
                        {subject}
                      </div>
                      <div className="text-sm text-gray-500">{pct}%</div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: PRIMARY }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold">About</h4>
                {!editMode ? (
                  <p className="mt-2 text-gray-700">{bio}</p>
                ) : (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mt-2 w-full border rounded p-2"
                    rows={4}
                  />
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
