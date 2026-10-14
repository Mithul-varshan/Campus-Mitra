import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  Award,
  Users,
  CheckCircle,
  Save,
  ChevronRight,
  Trophy,
  AlertCircle,
} from "lucide-react";

// Default judging criteria (should match AdminMyEvents)
const DEFAULT_JUDGING_CRITERIA = [
  {
    id: "innovation",
    name: "Innovation & Creativity",
    maxScore: 25,
    description: "Originality and uniqueness of the solution",
  },
  {
    id: "technical",
    name: "Technical Implementation",
    maxScore: 25,
    description: "Quality of code, architecture, and technical approach",
  },
  {
    id: "presentation",
    name: "Presentation & Demo",
    maxScore: 20,
    description: "Clarity of presentation and effective demonstration",
  },
  {
    id: "impact",
    name: "Impact & Feasibility",
    maxScore: 15,
    description: "Real-world applicability and potential impact",
  },
  {
    id: "teamwork",
    name: "Teamwork & Collaboration",
    maxScore: 15,
    description: "Evidence of effective team collaboration",
  },
];

// Storage keys
const TEAMS_STORAGE_KEY = "campusmitra_event_teams";
const JUDGE_SCORES_KEY = "campusmitra_judge_scores";

export default function JudgeDashboard() {
  const { user, logout, saveJudgeScores, getJudgeScores } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scores, setScores] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [allScores, setAllScores] = useState({});

  // Load teams for this event
  useEffect(() => {
    if (!user || user.role !== "judge") {
      navigate("/judge/login");
      return;
    }

    // Load teams from localStorage (simulating API)
    const storedTeams = JSON.parse(
      localStorage.getItem(TEAMS_STORAGE_KEY) || "{}",
    );
    const eventTeams = storedTeams[user.eventId] || [];
    // Filter only approved teams
    const approvedTeams = eventTeams.filter(
      (t) => t.status === "approved" || t.status === "winner",
    );
    setTeams(approvedTeams);

    // Load existing scores for this judge
    const existingScores = getJudgeScores(user.eventId);
    setAllScores(existingScores);

    // Load this judge's scores
    const roundScores = existingScores[user.roundId] || {};
    const judgeScores = {};
    Object.keys(roundScores).forEach((teamId) => {
      if (roundScores[teamId][user.judgeIndex]) {
        judgeScores[teamId] = roundScores[teamId][user.judgeIndex];
      }
    });
    setScores(judgeScores);
  }, [user, navigate, getJudgeScores]);

  const handleScoreChange = (teamId, criterionId, value) => {
    const criterion = DEFAULT_JUDGING_CRITERIA.find(
      (c) => c.id === criterionId,
    );
    const maxScore = criterion?.maxScore || 100;

    let validValue = value;
    if (value !== "") {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        validValue = Math.min(Math.max(0, numValue), maxScore);
      }
    }

    setScores((prev) => ({
      ...prev,
      [teamId]: {
        ...(prev[teamId] || {}),
        [criterionId]: validValue,
      },
    }));
  };

  const getTeamTotal = (teamId) => {
    const teamScores = scores[teamId] || {};
    return DEFAULT_JUDGING_CRITERIA.reduce((sum, c) => {
      const score = parseInt(teamScores[c.id], 10);
      return sum + (isNaN(score) ? 0 : score);
    }, 0);
  };

  const getMaxTotal = () => {
    return DEFAULT_JUDGING_CRITERIA.reduce((sum, c) => sum + c.maxScore, 0);
  };

  const isTeamScored = (teamId) => {
    const teamScores = scores[teamId] || {};
    return DEFAULT_JUDGING_CRITERIA.every(
      (c) => teamScores[c.id] !== undefined && teamScores[c.id] !== "",
    );
  };

  const handleSaveScores = (teamId) => {
    const teamScores = scores[teamId] || {};

    // Save to localStorage via AuthContext
    saveJudgeScores(
      user.eventId,
      user.roundId,
      teamId,
      user.judgeIndex,
      teamScores,
    );

    setSavedMessage(
      `Scores saved for ${teams.find((t) => t.id === teamId)?.teamName}`,
    );
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleSaveAllScores = () => {
    teams.forEach((team) => {
      const teamScores = scores[team.id] || {};
      saveJudgeScores(
        user.eventId,
        user.roundId,
        team.id,
        user.judgeIndex,
        teamScores,
      );
    });

    setSavedMessage("All scores saved successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/judge/login");
  };

  const scoredCount = teams.filter((t) => isTeamScored(t.id)).length;

  if (!user || user.role !== "judge") {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          padding: "20px 32px",
          color: "white",
          boxShadow: "0 4px 20px rgba(245, 158, 11, 0.3)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>
                Judge Scoring Panel
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.9 }}>
                {user.eventTitle} • {user.roundName}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                {user.judgeName}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                Event: {user.eventId}
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "32px",
            padding: "12px 20px",
            background: "#10b981",
            color: "white",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckCircle size={18} />
          {savedMessage}
        </div>
      )}

      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px 32px" }}
      >
        {/* Stats Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Teams to Score
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a" }}
            >
              {teams.length}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Scored
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#10b981" }}
            >
              {scoredCount}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Remaining
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#f59e0b" }}
            >
              {teams.length - scoredCount}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginBottom: "8px",
              }}
            >
              Max Score per Team
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: "#6366f1" }}
            >
              {getMaxTotal()}
            </div>
          </div>
        </div>

        {/* Criteria Reference */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 600 }}>
            Judging Criteria
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {DEFAULT_JUDGING_CRITERIA.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  flex: "1 1 200px",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  {c.description}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#f59e0b",
                    marginTop: "8px",
                  }}
                >
                  Max: {c.maxScore} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teams List & Scoring */}
        {teams.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "60px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <AlertCircle
              size={48}
              style={{ color: "#94a3b8", marginBottom: "16px" }}
            />
            <h3
              style={{ margin: "0 0 8px", fontSize: "18px", color: "#374151" }}
            >
              No Teams Available
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
              There are no approved teams to score for this event yet.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {teams.map((team) => (
              <div
                key={team.id}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: isTeamScored(team.id)
                    ? "2px solid #10b981"
                    : "2px solid transparent",
                }}
              >
                {/* Team Header */}
                <div
                  onClick={() =>
                    setSelectedTeam(selectedTeam === team.id ? null : team.id)
                  }
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    background:
                      selectedTeam === team.id ? "#f8fafc" : "transparent",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        background: isTeamScored(team.id)
                          ? "linear-gradient(135deg, #10b981, #059669)"
                          : "linear-gradient(135deg, #6366f1, #4f46e5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      {isTeamScored(team.id) ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Users size={20} />
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#0f172a",
                        }}
                      >
                        {team.teamName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#64748b" }}>
                        {team.projectTitle || "No project title"} •{" "}
                        {team.members?.length || 0} members
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {getTeamTotal(team.id)}
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        / {getMaxTotal()} pts
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      style={{
                        color: "#94a3b8",
                        transform:
                          selectedTeam === team.id
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Scoring Panel */}
                {selectedTeam === team.id && (
                  <div
                    style={{
                      padding: "0 24px 24px",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    {/* Team Members */}
                    <div style={{ padding: "16px 0" }}>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#64748b",
                          marginBottom: "8px",
                        }}
                      >
                        Team Members
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {team.members?.map((member, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: "6px 12px",
                              background: "#f1f5f9",
                              borderRadius: "6px",
                              fontSize: "12px",
                              color: "#374151",
                            }}
                          >
                            {member.name} ({member.department})
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Project Description */}
                    {team.projectDescription && (
                      <div style={{ marginBottom: "16px" }}>
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#64748b",
                            marginBottom: "6px",
                          }}
                        >
                          Project Description
                        </div>
                        <div style={{ fontSize: "13px", color: "#374151" }}>
                          {team.projectDescription}
                        </div>
                      </div>
                    )}

                    {/* Scoring Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {DEFAULT_JUDGING_CRITERIA.map((criterion) => (
                        <div
                          key={criterion.id}
                          style={{
                            padding: "16px",
                            background: "#f8fafc",
                            borderRadius: "10px",
                          }}
                        >
                          <label
                            style={{
                              display: "block",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#374151",
                              marginBottom: "8px",
                            }}
                          >
                            {criterion.name}
                          </label>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <input
                              type="number"
                              min="0"
                              max={criterion.maxScore}
                              value={scores[team.id]?.[criterion.id] ?? ""}
                              onChange={(e) =>
                                handleScoreChange(
                                  team.id,
                                  criterion.id,
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                              style={{
                                width: "70px",
                                padding: "10px 12px",
                                fontSize: "16px",
                                fontWeight: 600,
                                border: "1.5px solid #e2e8f0",
                                borderRadius: "8px",
                                textAlign: "center",
                                outline: "none",
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = "#f59e0b")
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = "#e2e8f0")
                              }
                            />
                            <span
                              style={{ fontSize: "13px", color: "#64748b" }}
                            >
                              / {criterion.maxScore}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Save Button for this team */}
                    <button
                      onClick={() => handleSaveScores(team.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 20px",
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      <Save size={16} />
                      Save Scores for {team.teamName}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Save All Button */}
        {teams.length > 0 && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={handleSaveAllScores}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.3)",
              }}
            >
              <Save size={18} />
              Save All Scores
            </button>
            <p
              style={{ marginTop: "12px", fontSize: "13px", color: "#64748b" }}
            >
              {scoredCount} of {teams.length} teams scored
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
