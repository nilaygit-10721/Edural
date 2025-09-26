// FILE: src/components/ProgressPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";

const POINTS_KEY = "edural_points_v1";
const STREAK_KEY = "edural_streak_v1";
const LAST_CLAIM_KEY = "edural_last_claim_v1";
const ACTIVITIES_KEY = "edural_activities_v1";

const PRIMARY = "#16a34a";

// weekly is now hardcoded keys and not read from / written to localStorage
const defaultWeekly = {
  Mon: 1,
  Tue: 2,
  Wed: 0,
  Thu: 3,
  Fri: 2,
  Sat: 0,
  Sun: 1,
};

const nowISO = () => new Date().toISOString().split("T")[0];

export default function ProgressPanel() {
  const [points, setPoints] = useState(() => Number(localStorage.getItem(POINTS_KEY) || 1540));
  const [streak, setStreak] = useState(() => Number(localStorage.getItem(STREAK_KEY) || 3));
  const [lastClaim, setLastClaim] = useState(() => localStorage.getItem(LAST_CLAIM_KEY) || null);
  const [activities, setActivities] = useState(() => JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || "[]"));

  // weekly is purely hardcoded state — not read from or written to localStorage
  const [weekly, setWeekly] = useState(() => ({ ...defaultWeekly }));

  const [loadingSim, setLoadingSim] = useState(false);

  // Derived values
  const level = useMemo(() => {
    if (points < 500) return "Beginner";
    if (points < 1500) return "Intermediate";
    return "Advanced";
  }, [points]);

  const nextLevelPoints = useMemo(() => {
    if (level === "Beginner") return 500;
    if (level === "Intermediate") return 1500;
    return 3000;
  }, [level]);

  const progressPct = Math.min(100, Math.round((points / nextLevelPoints) * 100));

  useEffect(() => {
    localStorage.setItem(POINTS_KEY, String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem(STREAK_KEY, String(streak));
  }, [streak]);

  useEffect(() => {
    if (lastClaim) localStorage.setItem(LAST_CLAIM_KEY, lastClaim);
  }, [lastClaim]);

  useEffect(() => {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }, [activities]);

  const canClaimToday = lastClaim !== nowISO();

  const pushActivity = (text) => {
    const item = { id: Date.now(), text, time: new Date().toISOString() };
    setActivities((a) => [item, ...a].slice(0, 20));
  };

  const claimDailyBonus = () => {
    if (!canClaimToday) return;
    const reward = 25 + Math.min(75, streak * 5); // small scaling
    setPoints((p) => p + reward);
    setStreak((s) => s + 1);
    const today = nowISO();
    setLastClaim(today);
    pushActivity(`Daily streak claimed (+${reward} pts)`);

    // update hardcoded-weekly state (still not persisted elsewhere)
    const day = new Date().toLocaleDateString(undefined, { weekday: "short" });
    setWeekly((w) => ({ ...w, [day]: (w[day] || 0) + 1 }));
  };

  // simulate finishing a game (adds points and activity)
  const simulateActivity = async (title = "Finished a game") => {
    setLoadingSim(true);
    await new Promise((r) => setTimeout(r, 450));
    const reward = Math.floor(Math.random() * 50) + 10;
    setPoints((p) => p + reward);
    pushActivity(`${title} (+${reward} pts)`);
    const day = new Date().toLocaleDateString(undefined, { weekday: "short" });
    setWeekly((w) => ({ ...w, [day]: (w[day] || 0) + 1 }));
    setLoadingSim(false);
  };

  const resetProgress = () => {
    if (!confirm("Reset progress and local data? This cannot be undone.")) return;
    setPoints(0);
    setStreak(0);
    setLastClaim(null);
    setActivities([]);
    setWeekly({ ...defaultWeekly }); // reset weekly to hardcoded default
    localStorage.removeItem(POINTS_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(LAST_CLAIM_KEY);
    localStorage.removeItem(ACTIVITIES_KEY);
  };

  const weeksMax = Math.max(...Object.values(weekly), 1);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar included as requested */}
      <Sidebar />

      <main className="ml-0 sm:ml-52 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-4 rounded-md shadow mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Your Progress</h3>
                <p className="text-sm text-gray-500">Points, streaks & recent activity</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Level</div>
                <div className="font-semibold text-lg">{level}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Points card */}
              <div className="col-span-1 bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Total Points</div>
                    <div className="text-2xl font-bold">{points}</div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">Next: {nextLevelPoints} pts</div>
                </div>

                <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-3 rounded-full" style={{ width: `${progressPct}%`, backgroundColor: PRIMARY }} />
                </div>
              </div>

              {/* Streak card */}
              <div className="col-span-1 bg-gray-50 p-3 rounded flex flex-col justify-between">
                <div>
                  <div className="text-sm text-gray-500">Daily Streak</div>
                  <div className="text-2xl font-bold">{streak} 🔥</div>
                  <div className="text-xs text-gray-500 mt-1">Last claimed: {lastClaim || "never"}</div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={claimDailyBonus}
                    disabled={!canClaimToday}
                    className={`flex-1 px-3 py-2 rounded text-white font-medium ${canClaimToday ? "" : "opacity-60 cursor-not-allowed"}`}
                    style={{ backgroundColor: PRIMARY }}
                  >
                    {canClaimToday ? "Claim Today" : "Already Claimed"}
                  </button>
                  <button onClick={() => { setStreak(0); pushActivity("Streak reset"); }} className="px-3 py-2 rounded border" style={{ borderColor: PRIMARY }}>
                    Reset
                  </button>
                </div>
              </div>

              {/* Weekly chart (hardcoded keys, not persisted) */}
              <div className="col-span-1 bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Weekly Activity</div>
                    <div className="text-xs text-gray-400">Sessions per day</div>
                  </div>
                  <div className="text-sm font-medium">{Object.values(weekly).reduce((a, b) => a + b, 0)} sessions</div>
                </div>

                <div className="mt-3 flex items-end gap-2 h-20">
                  {Object.entries(weekly).map(([day, val]) => (
                    <div key={day} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex items-end" title={`${day}: ${val}`}>
                        <div
                          className="w-full rounded-t"
                          style={{ height: `${(val / weeksMax) * 100}%`, background: "linear-gradient(180deg, #34D399, #059669)" }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">Recent Activity</div>
              <div className="flex gap-2">
                <button onClick={() => simulateActivity("Played: Quick Quiz")} className="px-3 py-1.5 rounded border" style={{ borderColor: PRIMARY }}>
                  {loadingSim ? "Adding..." : "Simulate"}
                </button>
                <button onClick={resetProgress} className="px-3 py-1.5 rounded text-white" style={{ backgroundColor: PRIMARY }}>
                  Reset
                </button>
              </div>
            </div>

            <ul className="mt-3 space-y-2 max-h-44 overflow-auto">
              {activities.length === 0 ? (
                <li className="text-gray-500 text-sm">No recent activity — play a game to get started.</li>
              ) : (
                activities.map((a) => (
                  <li key={a.id} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-gray-400">{new Date(a.time).toLocaleString()}</div>
                  </li>
                ))
              )}
            </ul>

            <div className="mt-4 text-xs text-gray-500">Data stored locally in your browser (localStorage), except weekly which is hardcoded.</div>
          </div>
        </div>
      </main>
    </div>
  );
}
