import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../context/EventsContext";

/* ===== SAMPLE DATA ===== */
const SAMPLE_EVENTS = [
  {
    id: "evt-001",
    title: "Hackathon 2026",
    type: "Hackathon",
    domain: "AI/ML",
    status: "ongoing",
    prizes: [
      { position: "1st", amount: "25000" },
      { position: "2nd", amount: "15000" },
      { position: "3rd", amount: "10000" },
    ],
  },
  {
    id: "evt-003",
    title: "Web Dev Championship",
    type: "Competition",
    domain: "Web Development",
    status: "completed",
    prizes: [
      { position: "1st", amount: "15000" },
      { position: "2nd", amount: "10000" },
      { position: "3rd", amount: "5000" },
    ],
  },
  {
    id: "evt-004",
    title: "IoT Innovation Challenge",
    type: "Hackathon",
    domain: "IoT",
    status: "ongoing",
    prizes: [
      { position: "1st", amount: "30000" },
      { position: "2nd", amount: "20000" },
      { position: "3rd", amount: "10000" },
    ],
  },
];

const SAMPLE_TEAMS = {
  "evt-001": [
    {
      id: "t-001",
      teamName: "Code Warriors",
      status: "approved",
      projectTitle: "AI Campus Assistant",
      members: [
        { name: "Arun Kumar", department: "CSE" },
        { name: "Priya Sharma", department: "CSE" },
        { name: "Vikash J", department: "IT" },
      ],
    },
    {
      id: "t-003",
      teamName: "Neural Nexus",
      status: "approved",
      projectTitle: "Sentiment Analysis Tool",
      members: [
        { name: "Rohit Kumar", department: "AIML" },
        { name: "Sneha P", department: "CSE" },
      ],
    },
  ],
  "evt-003": [
    {
      id: "t-006",
      teamName: "Code Crusaders",
      status: "winner",
      position: "1st",
      projectTitle: "EcoTrack",
      members: [
        { name: "Rahul S", department: "CSE" },
        { name: "Anika M", department: "IT" },
      ],
    },
    {
      id: "t-007",
      teamName: "Pixel Perfect",
      status: "winner",
      position: "2nd",
      projectTitle: "MindSpace",
      members: [{ name: "Kiran J", department: "CSE" }],
    },
  ],
  "evt-004": [
    {
      id: "t-008",
      teamName: "IoT Innovators",
      status: "approved",
      projectTitle: "Smart Campus Sensors",
      members: [
        { name: "Arjun K", department: "ECE" },
        { name: "Meera R", department: "EEE" },
      ],
    },
    {
      id: "t-009",
      teamName: "Tech Pioneers",
      status: "approved",
      projectTitle: "Energy Monitor System",
      members: [
        { name: "Vijay S", department: "ECE" },
        { name: "Lakshmi P", department: "CSE" },
      ],
    },
  ],
};

/* ===== STYLES ===== */
const pageContainer = {
  padding: "24px",
  maxWidth: "1400px",
  margin: "0 auto",
};

const card = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
};

const cardHeaderRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
};

const cardTitle = {
  fontSize: "15px",
  fontWeight: 600,
  margin: 0,
};

export default function DeclareWinnersPage() {
  const navigate = useNavigate();
  const { events: contextEvents } = useEvents();

  const [rawEvents, setRawEvents] = useState(SAMPLE_EVENTS);
  const [teams, setTeams] = useState(SAMPLE_TEAMS);

  const events = useMemo(() => {
    const map = new Map();
    (contextEvents || []).forEach((e) => {
      map.set(e.id, {
        id: e.id,
        title: e.title,
        type: e.eventType || "Hackathon",
        domain: e.domain || e.skillDomains?.[0] || "AI/ML",
        status: e.status === "closed" ? "completed" : e.status || "ongoing",
        prizes: e.prizes?.length
          ? e.prizes
          : [
              { position: "1st", amount: "25000" },
              { position: "2nd", amount: "15000" },
              { position: "3rd", amount: "10000" },
            ],
      });
    });
    rawEvents.forEach((e) => {
      if (!map.has(e.id)) map.set(e.id, e);
    });
    return Array.from(map.values());
  }, [contextEvents, rawEvents]);

  const [selectedEventForWinners, setSelectedEventForWinners] = useState(
    () => events[0]?.id || SAMPLE_EVENTS[0]?.id || null,
  );
  const [winnerSelections, setWinnerSelections] = useState({});

  const declaredWinnersStorageKey = "campusMitra_declared_winners";

  const getTeamsForEvent = (eventId) => {
    if (teams[eventId] && teams[eventId].length > 0) {
      return teams[eventId];
    }
    return [
      {
        id: `t-${eventId}-1`,
        teamName: "Code Warriors",
        status: "approved",
        projectTitle: "AI Campus Assistant",
        members: [
          { name: "Arun Kumar", department: "CSE" },
          { name: "Priya Sharma", department: "CSE" },
          { name: "Vikash J", department: "IT" },
        ],
      },
      {
        id: `t-${eventId}-2`,
        teamName: "Neural Ninjas",
        status: "approved",
        projectTitle: "Smart Energy Grid",
        members: [
          { name: "Sneha Patel", department: "ECE" },
          { name: "Mithul Varshan", department: "CSE" },
        ],
      },
      {
        id: `t-${eventId}-3`,
        teamName: "Quantum Explorers",
        status: "approved",
        projectTitle: "Campus Blockchain Identity",
        members: [
          { name: "Rahul S.", department: "AI-DS" },
          { name: "Divya N.", department: "CSE" },
        ],
      },
    ];
  };

  const handleDeclareWinner = (eventId, teamId, position) => {
    setWinnerSelections((prev) => ({
      ...prev,
      [`${eventId}-${position}`]: teamId,
    }));
  };

  const handleSaveWinners = (eventId) => {
    const positions = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
    ];
    const event = events.find((e) => e.id === eventId);
    const eventTeams = getTeamsForEvent(eventId);

    // Calculate winners based on current selections
    const winnersData = positions
      .filter((pos) => winnerSelections[`${eventId}-${pos}`])
      .map((pos) => {
        const selectedTeamId = winnerSelections[`${eventId}-${pos}`];
        const team = eventTeams.find((t) => t.id === selectedTeamId);
        return {
          ...team,
          position: pos,
          members: team?.members || [],
        };
      });

    const participantsData = eventTeams.filter(
      (t) => !winnersData.find((w) => w.id === t.id),
    );

    // Update teams with winner status
    setTeams((prev) => ({
      ...prev,
      [eventId]: eventTeams.map((t) => {
        const pos = positions.find(
          (p) => winnerSelections[`${eventId}-${p}`] === t.id,
        );
        return pos ? { ...t, status: "winner", position: pos } : t;
      }),
    }));

    // Update event status
    setRawEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" } : e)),
    );

    const payload = {
      event: {
        id: event?.id,
        title: event?.title,
        type: event?.type,
        domain: event?.domain,
        status: "completed",
      },
      winners: winnersData,
      participants: participantsData,
      declaredAt: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem(declaredWinnersStorageKey) || "[]",
    );
    const updated = [
      ...existing.filter((item) => item?.event?.id !== eventId),
      payload,
    ];
    localStorage.setItem(declaredWinnersStorageKey, JSON.stringify(updated));

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("campusmitra:state-sync", {
          detail: { type: "WINNERS_DECLARED", payload },
        })
      );
    }

    alert(
      "Winners declared. You can now share certificates from Certificate Management.",
    );
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={() => navigate("/admin/my-events")}
          style={{
            padding: "10px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <iconify-icon
            icon="lucide:arrow-left"
            style={{ fontSize: "18px" }}
          ></iconify-icon>
        </button>
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              color: "var(--foreground)",
            }}
          >
            Declare Winners
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: "4px 0 0 0",
            }}
          >
            Select winners for your completed or ongoing events
          </p>
        </div>
      </div>

      {/* Event Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--foreground)",
            marginBottom: "8px",
          }}
        >
          Select Completed Event
        </label>
        <select
          value={selectedEventForWinners || ""}
          onChange={(e) => setSelectedEventForWinners(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--card)",
            color: "var(--foreground)",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="">Choose an event to declare winners</option>
          {events
            .filter((e) => e.status === "ongoing" || e.status === "completed" || e.status === "upcoming")
            .map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} ({e.status})
              </option>
            ))}
        </select>
      </div>

      {selectedEventForWinners &&
        (() => {
          const eventTeams = getTeamsForEvent(selectedEventForWinners);
          const approvedTeams = eventTeams.filter(
            (t) => t.status === "approved" || t.status === "winner",
          );
          const event = events.find((e) => e.id === selectedEventForWinners);
          const existingWinners = eventTeams.filter(
            (t) => t.status === "winner",
          );

          return (
            <div style={card}>
              <div style={cardHeaderRow}>
                <h3 style={cardTitle}>Declare Winners - {event?.title}</h3>
              </div>

              {existingWinners.length > 0 && (
                <div
                  style={{
                    marginBottom: "24px",
                    padding: "20px",
                    background: "var(--muted)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      marginBottom: "16px",
                    }}
                  >
                    🏆 Current Winners
                  </div>
                  <div
                    style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
                  >
                    {existingWinners
                      .sort((a, b) => a.position.localeCompare(b.position))
                      .map((team) => (
                        <div
                          key={team.id}
                          style={{
                            flex: "1 1 200px",
                            padding: "16px",
                            background: "var(--card)",
                            borderRadius: "var(--radius-md)",
                            border: "1px solid var(--border)",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{ fontSize: "32px", marginBottom: "8px" }}
                          >
                            {team.position === "1st"
                              ? "🥇"
                              : team.position === "2nd"
                                ? "🥈"
                                : "🥉"}
                          </div>
                          <div
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "var(--foreground)",
                            }}
                          >
                            {team.teamName}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "var(--primary)",
                            }}
                          >
                            {team.projectTitle}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {approvedTeams.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "48px",
                    gap: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <iconify-icon
                    icon="lucide:users-x"
                    style={{ fontSize: "48px" }}
                  ></iconify-icon>
                  <p style={{ margin: 0 }}>No approved teams available</p>
                </div>
              ) : (
                <>
                  {/* Flexible Winner Positions */}
                  <div style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--foreground)",
                        }}
                      >
                        Winner Positions
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentPositions = Object.keys(
                            winnerSelections,
                          ).filter((k) =>
                            k.startsWith(selectedEventForWinners),
                          ).length;
                          const nextPos = currentPositions + 1;
                          const posLabel =
                            nextPos === 1
                              ? "1st"
                              : nextPos === 2
                                ? "2nd"
                                : nextPos === 3
                                  ? "3rd"
                                  : `${nextPos}th`;
                          setWinnerSelections((prev) => ({
                            ...prev,
                            [`${selectedEventForWinners}-${posLabel}`]: "",
                          }));
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "none",
                          background: "var(--primary)",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <iconify-icon icon="lucide:plus"></iconify-icon>
                        Add Position
                      </button>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      {[
                        "1st",
                        "2nd",
                        "3rd",
                        "4th",
                        "5th",
                        "6th",
                        "7th",
                        "8th",
                        "9th",
                        "10th",
                      ]
                        .filter((pos) => {
                          const posIdx = [
                            "1st",
                            "2nd",
                            "3rd",
                            "4th",
                            "5th",
                            "6th",
                            "7th",
                            "8th",
                            "9th",
                            "10th",
                          ].indexOf(pos);
                          if (posIdx < 3) return true;
                          return (
                            winnerSelections[
                              `${selectedEventForWinners}-${pos}`
                            ] !== undefined
                          );
                        })
                        .map((position, posIdx) => (
                          <div
                            key={position}
                            style={{
                              padding: "20px",
                              background: "var(--muted)",
                              borderRadius: "var(--radius-md)",
                              border: "1px solid var(--border)",
                              position: "relative",
                            }}
                          >
                            {posIdx >= 3 && (
                              <button
                                onClick={() => {
                                  const newSelections = { ...winnerSelections };
                                  delete newSelections[
                                    `${selectedEventForWinners}-${position}`
                                  ];
                                  setWinnerSelections(newSelections);
                                }}
                                style={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  padding: "4px",
                                  borderRadius: "4px",
                                  border: "none",
                                  background: "transparent",
                                  color: "var(--muted-foreground)",
                                  cursor: "pointer",
                                }}
                              >
                                <iconify-icon
                                  icon="lucide:x"
                                  style={{ fontSize: "14px" }}
                                ></iconify-icon>
                              </button>
                            )}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "16px",
                              }}
                            >
                              <span style={{ fontSize: "28px" }}>
                                {posIdx === 0
                                  ? "🥇"
                                  : posIdx === 1
                                    ? "🥈"
                                    : posIdx === 2
                                      ? "🥉"
                                      : "🏅"}
                              </span>
                              <div>
                                <div
                                  style={{
                                    fontSize: "15px",
                                    fontWeight: 600,
                                    color: "var(--foreground)",
                                  }}
                                >
                                  {position} Place
                                </div>
                                {event?.prizes?.[posIdx]?.amount && (
                                  <div
                                    style={{
                                      fontSize: "13px",
                                      color: "var(--primary)",
                                    }}
                                  >
                                    ₹
                                    {Number(
                                      event.prizes[posIdx].amount,
                                    ).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <select
                              value={
                                winnerSelections[
                                  `${selectedEventForWinners}-${position}`
                                ] || ""
                              }
                              onChange={(e) =>
                                handleDeclareWinner(
                                  selectedEventForWinners,
                                  e.target.value,
                                  position,
                                )
                              }
                              style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--border)",
                                background: "var(--card)",
                                color: "var(--foreground)",
                                fontSize: "14px",
                                cursor: "pointer",
                              }}
                            >
                              <option value="">Select team</option>
                              {approvedTeams
                                .filter(
                                  (t) =>
                                    !Object.values(winnerSelections).includes(
                                      t.id,
                                    ) ||
                                    winnerSelections[
                                      `${selectedEventForWinners}-${position}`
                                    ] === t.id,
                                )
                                .map((team) => (
                                  <option key={team.id} value={team.id}>
                                    {team.teamName} -{" "}
                                    {team.projectTitle || "N/A"}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Special Categories */}
                  <div style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--foreground)",
                          }}
                        >
                          Special Categories
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-foreground)",
                          }}
                        >
                          e.g., Best UI/UX, Most Innovative, People's Choice
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setWinnerSelections((prev) => ({
                            ...prev,
                            [`${selectedEventForWinners}-special-${Date.now()}`]:
                              { name: "", teamId: "" },
                          }));
                        }}
                        style={{
                          padding: "8px 14px",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid var(--border)",
                          background: "var(--background)",
                          color: "var(--foreground)",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <iconify-icon icon="lucide:award"></iconify-icon>
                        Add Special Award
                      </button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {Object.entries(winnerSelections)
                        .filter(([key]) =>
                          key.startsWith(`${selectedEventForWinners}-special-`),
                        )
                        .map(([key, value]) => (
                          <div
                            key={key}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr auto",
                              gap: "12px",
                              padding: "16px",
                              background: "var(--muted)",
                              borderRadius: "var(--radius-md)",
                              alignItems: "center",
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Award name (e.g., Best Design)"
                              value={
                                typeof value === "object" ? value.name : ""
                              }
                              onChange={(e) =>
                                setWinnerSelections((prev) => ({
                                  ...prev,
                                  [key]: { ...prev[key], name: e.target.value },
                                }))
                              }
                              style={{
                                padding: "12px",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--border)",
                                background: "var(--card)",
                                color: "var(--foreground)",
                                fontSize: "14px",
                              }}
                            />
                            <select
                              value={
                                typeof value === "object" ? value.teamId : ""
                              }
                              onChange={(e) =>
                                setWinnerSelections((prev) => ({
                                  ...prev,
                                  [key]: {
                                    ...prev[key],
                                    teamId: e.target.value,
                                  },
                                }))
                              }
                              style={{
                                padding: "12px",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--border)",
                                background: "var(--card)",
                                color: "var(--foreground)",
                                fontSize: "14px",
                                cursor: "pointer",
                              }}
                            >
                              <option value="">Select team</option>
                              {approvedTeams.map((team) => (
                                <option key={team.id} value={team.id}>
                                  {team.teamName} - {team.projectTitle || "N/A"}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const newSelections = { ...winnerSelections };
                                delete newSelections[key];
                                setWinnerSelections(newSelections);
                              }}
                              style={{
                                padding: "8px",
                                borderRadius: "var(--radius-md)",
                                border: "1px solid #ef4444",
                                background: "transparent",
                                color: "#ef4444",
                                cursor: "pointer",
                              }}
                            >
                              <iconify-icon
                                icon="lucide:trash-2"
                                style={{ fontSize: "16px" }}
                              ></iconify-icon>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "12px",
                    }}
                  >
                    <button
                      onClick={() => handleSaveWinners(selectedEventForWinners)}
                      disabled={
                        !winnerSelections[`${selectedEventForWinners}-1st`]
                      }
                      style={{
                        padding: "12px 24px",
                        borderRadius: "var(--radius-md)",
                        border: "none",
                        background: winnerSelections[
                          `${selectedEventForWinners}-1st`
                        ]
                          ? "var(--primary)"
                          : "var(--muted)",
                        color: winnerSelections[
                          `${selectedEventForWinners}-1st`
                        ]
                          ? "white"
                          : "var(--muted-foreground)",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: winnerSelections[
                          `${selectedEventForWinners}-1st`
                        ]
                          ? "pointer"
                          : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <iconify-icon icon="lucide:trophy"></iconify-icon> Confirm
                      Winners
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })()}

      {!selectedEventForWinners && (
        <div
          style={{
            ...card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px",
            gap: "12px",
            color: "var(--muted-foreground)",
          }}
        >
          <iconify-icon
            icon="lucide:trophy"
            style={{ fontSize: "56px" }}
          ></iconify-icon>
          <p style={{ margin: 0, fontSize: "16px" }}>
            Select an event to declare winners
          </p>
        </div>
      )}
    </div>
  );
}
