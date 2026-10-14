import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";

/* ─── Fixed 10 Questions with Data ─────────────────────────────────── */
const FIXED_QUESTIONS = [
  {
    id: 1,
    question: "What is the department-wise student enrollment?",
    chartType: "bar",
    data: {
      labels: ["CSE", "ECE", "MECH", "CIVIL", "EEE", "IT"],
      values: [654, 432, 389, 312, 287, 473],
      colors: [
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
        "#f43f5e",
      ],
    },
    analysis: {
      title: "Department Enrollment Analysis",
      insights: [
        "Computer Science has the highest enrollment with 654 students (25.7%)",
        "IT department shows strong growth at 473 students",
        "Total student strength: 2,547 across all departments",
        "Engineering departments account for 78% of total enrollment",
      ],
      trend: "up",
      summary: "Overall enrollment increased by 12.3% compared to last year",
    },
  },
  {
    id: 2,
    question: "Show monthly event participation trends",
    chartType: "line",
    data: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [245, 312, 478, 523, 389, 234, 156, 289, 567, 623, 534, 412],
      color: "#22c55e",
    },
    analysis: {
      title: "Event Participation Trends",
      insights: [
        "Peak participation observed in October (623 participants)",
        "Summer months (Jun-Jul) show expected decline",
        "Technical events attract 45% more participants than cultural",
        "Average monthly participation: 397 students",
      ],
      trend: "up",
      summary: "Year-over-year participation increased by 23.5%",
    },
  },
  {
    id: 3,
    question: "What is the project domain distribution?",
    chartType: "pie",
    data: {
      labels: ["AI/ML", "Web Dev", "IoT", "Mobile", "Blockchain", "Cloud"],
      values: [234, 189, 156, 134, 78, 56],
      colors: [
        "#6366f1",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
      ],
    },
    analysis: {
      title: "Project Domain Analysis",
      insights: [
        "AI/ML projects dominate with 27.6% share",
        "Web Development remains popular at 22.3%",
        "Emerging tech (Blockchain, IoT) growing at 34% YoY",
        "Total active projects: 847",
      ],
      trend: "up",
      summary: "Innovation in AI/ML projects increased by 45% this semester",
    },
  },
  {
    id: 4,
    question: "Show top 10 students by innovation score",
    chartType: "horizontal-bar",
    data: {
      labels: [
        "Arun Kumar",
        "Priya Sharma",
        "Rahul Singh",
        "Sneha Patel",
        "Vikram Joshi",
        "Ananya Reddy",
        "Karthik M",
        "Deepa S",
        "Rohan Verma",
        "Meera K",
      ],
      values: [956, 923, 891, 867, 845, 823, 801, 789, 776, 754],
      departments: [
        "CSE",
        "ECE",
        "CSE",
        "IT",
        "MECH",
        "CSE",
        "ECE",
        "IT",
        "CSE",
        "EEE",
      ],
      colors: [
        "#ffd700",
        "#c0c0c0",
        "#cd7f32",
        "#6366f1",
        "#6366f1",
        "#6366f1",
        "#6366f1",
        "#6366f1",
        "#6366f1",
        "#6366f1",
      ],
    },
    analysis: {
      title: "Top Performers Analysis",
      insights: [
        "Arun Kumar leads with 956 points (CSE Department)",
        "CSE department has 5 students in top 10",
        "Average score of top 10: 843 points",
        "Score gap between #1 and #10: 202 points",
      ],
      trend: "up",
      summary: "Top performers showed 18% improvement from last semester",
    },
  },
  {
    id: 5,
    question: "What is the certificate distribution by type?",
    chartType: "donut",
    data: {
      labels: [
        "Technical",
        "Leadership",
        "Sports",
        "Cultural",
        "Academic",
        "Workshop",
      ],
      values: [456, 234, 189, 167, 312, 278],
      colors: [
        "#6366f1",
        "#22c55e",
        "#f59e0b",
        "#ec4899",
        "#8b5cf6",
        "#06b6d4",
      ],
    },
    analysis: {
      title: "Certificate Distribution Analysis",
      insights: [
        "Technical certificates lead at 27.9% of total",
        "Academic achievements account for 19.1%",
        "Total certificates awarded: 1,636",
        "Workshop participation certificates increased by 34%",
      ],
      trend: "up",
      summary: "Certificate issuance up 28% compared to previous year",
    },
  },
  {
    id: 6,
    question: "Show NAAC criteria-wise scores",
    chartType: "radar",
    data: {
      labels: [
        "Curricular",
        "Teaching",
        "Research",
        "Infrastructure",
        "Student Support",
        "Governance",
        "Innovation",
      ],
      values: [3.8, 3.6, 3.4, 3.7, 3.9, 3.5, 3.8],
      maxValue: 4,
      color: "#6366f1",
    },
    analysis: {
      title: "NAAC Performance Analysis",
      insights: [
        "Student Support scores highest at 3.9/4.0",
        "Research criterion needs improvement (3.4/4.0)",
        "Overall CGPA equivalent: 3.67 (A+ Grade)",
        "All criteria above 3.4 threshold",
      ],
      trend: "stable",
      summary: "Institution maintains A+ accreditation status",
    },
  },
  {
    id: 7,
    question: "What is the placement statistics by package?",
    chartType: "bar",
    data: {
      labels: [
        "<5 LPA",
        "5-10 LPA",
        "10-15 LPA",
        "15-20 LPA",
        "20-30 LPA",
        ">30 LPA",
      ],
      values: [123, 234, 189, 98, 45, 23],
      colors: [
        "#94a3b8",
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#22c55e",
        "#ffd700",
      ],
    },
    analysis: {
      title: "Placement Package Analysis",
      insights: [
        "5-10 LPA range has highest placements (32.9%)",
        "23 students placed above 30 LPA (3.2%)",
        "Average package: 12.4 LPA",
        "Highest package: 54 LPA (Google)",
      ],
      trend: "up",
      summary: "Average package increased by 18% from last year",
    },
  },
  {
    id: 8,
    question: "Show faculty qualification distribution",
    chartType: "pie",
    data: {
      labels: ["PhD", "M.Tech/ME", "MBA", "M.Sc", "Others"],
      values: [78, 112, 34, 23, 12],
      colors: ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#94a3b8"],
    },
    analysis: {
      title: "Faculty Qualification Analysis",
      insights: [
        "30.1% faculty hold PhD degrees",
        "PhD + M.Tech holders: 73.4% of faculty",
        "Student-Faculty ratio: 18:1",
        "12 faculty pursuing PhD currently",
      ],
      trend: "up",
      summary: "Faculty with PhD increased by 8% this year",
    },
  },
  {
    id: 9,
    question: "What are the research publication trends?",
    chartType: "area",
    data: {
      labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
      values: [45, 67, 89, 123, 178, 234],
      color: "#8b5cf6",
    },
    analysis: {
      title: "Research Publication Analysis",
      insights: [
        "234 publications in 2025 (highest ever)",
        "420% growth over 5 years",
        "SCI indexed papers: 89 (38%)",
        "Patents filed: 12, granted: 7",
      ],
      trend: "up",
      summary: "Publication rate growing at 31% annually",
    },
  },
  {
    id: 10,
    question: "Show infrastructure utilization rates",
    chartType: "horizontal-bar",
    data: {
      labels: [
        "Computer Labs",
        "Library",
        "Sports Complex",
        "Auditorium",
        "Seminar Halls",
        "Workshop Labs",
      ],
      values: [92, 78, 65, 45, 82, 88],
      colors: [
        "#22c55e",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#22c55e",
        "#22c55e",
      ],
    },
    analysis: {
      title: "Infrastructure Utilization Analysis",
      insights: [
        "Computer Labs have highest utilization (92%)",
        "Auditorium underutilized at 45%",
        "Average utilization across facilities: 75%",
        "Workshop labs show 15% increase in usage",
      ],
      trend: "stable",
      summary: "Overall infrastructure utilization improved by 8%",
    },
  },
];

/* ─── Chart Components ─────────────────────────────────────────────── */

function BarChart({ data, height = 200 }) {
  const maxValue = Math.max(...data.values);
  const barWidth = 100 / data.labels.length;

  return (
    <div style={chartStyles.container}>
      <svg width="100%" height={height} style={{ overflow: "visible" }}>
        {data.values.map((value, idx) => {
          const barHeight = (value / maxValue) * (height - 40);
          const x = idx * barWidth + barWidth * 0.1;
          const y = height - barHeight - 25;

          return (
            <g key={idx}>
              <rect
                x={`${x}%`}
                y={y}
                width={`${barWidth * 0.8}%`}
                height={barHeight}
                fill={data.colors?.[idx] || "#6366f1"}
                rx="4"
              />
              <text
                x={`${x + barWidth * 0.4}%`}
                y={y - 5}
                textAnchor="middle"
                fontSize="11"
                fill="var(--foreground)"
                fontWeight="600"
              >
                {value}
              </text>
              <text
                x={`${x + barWidth * 0.4}%`}
                y={height - 8}
                textAnchor="middle"
                fontSize="10"
                fill="var(--muted-foreground)"
              >
                {data.labels[idx]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function HorizontalBarChart({ data, height = 280 }) {
  const maxValue = Math.max(...data.values);
  const barHeight = height / data.labels.length;

  return (
    <div style={chartStyles.container}>
      <svg width="100%" height={height} style={{ overflow: "visible" }}>
        {data.values.map((value, idx) => {
          const barWidth = (value / maxValue) * 60;
          const y = idx * barHeight + 5;

          return (
            <g key={idx}>
              <text
                x="0"
                y={y + barHeight / 2}
                fontSize="11"
                fill="var(--foreground)"
                dominantBaseline="middle"
              >
                {data.labels[idx]}
              </text>
              <rect
                x="95"
                y={y + 2}
                width={`${barWidth}%`}
                height={barHeight - 8}
                fill={data.colors?.[idx] || "#6366f1"}
                rx="4"
              />
              <text
                x={`calc(95px + ${barWidth}% + 8px)`}
                y={y + barHeight / 2}
                fontSize="11"
                fill="var(--foreground)"
                dominantBaseline="middle"
                fontWeight="600"
              >
                {value}
                {data.departments && ` (${data.departments[idx]})`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LineChart({ data, height = 180 }) {
  const maxValue = Math.max(...data.values);
  const points = data.values.map((value, idx) => {
    const x = (idx / (data.values.length - 1)) * 100;
    const y = height - 30 - (value / maxValue) * (height - 50);
    return { x, y, value };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}`)
    .join(" ");

  return (
    <div style={chartStyles.container}>
      <svg width="100%" height={height} style={{ overflow: "visible" }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => (
          <line
            key={pct}
            x1="0"
            y1={height - 30 - (pct / 100) * (height - 50)}
            x2="100%"
            y2={height - 30 - (pct / 100) * (height - 50)}
            stroke="var(--border)"
            strokeDasharray="4"
          />
        ))}
        {/* Line */}
        <path d={pathD} fill="none" stroke={data.color} strokeWidth="3" />
        {/* Points */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={`${p.x}%`} cy={p.y} r="4" fill={data.color} />
            <text
              x={`${p.x}%`}
              y={height - 10}
              textAnchor="middle"
              fontSize="9"
              fill="var(--muted-foreground)"
            >
              {data.labels[idx]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function AreaChart({ data, height = 180 }) {
  const maxValue = Math.max(...data.values);
  const points = data.values.map((value, idx) => {
    const x = (idx / (data.values.length - 1)) * 100;
    const y = height - 30 - (value / maxValue) * (height - 50);
    return { x, y, value };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x}% ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L 100% ${height - 30} L 0% ${height - 30} Z`;

  return (
    <div style={chartStyles.container}>
      <svg width="100%" height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={data.color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={data.color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke={data.color} strokeWidth="3" />
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={`${p.x}%`} cy={p.y} r="5" fill={data.color} />
            <text
              x={`${p.x}%`}
              y={p.y - 12}
              textAnchor="middle"
              fontSize="10"
              fill="var(--foreground)"
              fontWeight="600"
            >
              {p.value}
            </text>
            <text
              x={`${p.x}%`}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--muted-foreground)"
            >
              {data.labels[idx]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function PieChart({ data, height = 200, isDonut = false }) {
  const total = data.values.reduce((a, b) => a + b, 0);
  const centerX = 100;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 20;
  const innerRadius = isDonut ? radius * 0.6 : 0;

  let currentAngle = -90;

  const slices = data.values.map((value, idx) => {
    const percentage = value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const ix1 = centerX + innerRadius * Math.cos(startRad);
    const iy1 = centerY + innerRadius * Math.sin(startRad);
    const ix2 = centerX + innerRadius * Math.cos(endRad);
    const iy2 = centerY + innerRadius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathD = isDonut
      ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`
      : `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      pathD,
      color: data.colors[idx],
      label: data.labels[idx],
      value,
      percentage: (percentage * 100).toFixed(1),
    };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <svg width="200" height={height}>
        {slices.map((slice, idx) => (
          <path key={idx} d={slice.pathD} fill={slice.color} />
        ))}
        {isDonut && (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fontWeight="700"
            fill="var(--foreground)"
          >
            {total}
          </text>
        )}
      </svg>
      <div style={chartStyles.legend}>
        {slices.map((slice, idx) => (
          <div key={idx} style={chartStyles.legendItem}>
            <span
              style={{
                ...chartStyles.legendColor,
                backgroundColor: slice.color,
              }}
            />
            <span style={chartStyles.legendLabel}>{slice.label}</span>
            <span style={chartStyles.legendValue}>
              {slice.value} ({slice.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RadarChart({ data, height = 220 }) {
  const centerX = 110;
  const centerY = height / 2;
  const radius = 80;
  const sides = data.labels.length;

  const getPoint = (index, value) => {
    const angle = (index * 360) / sides - 90;
    const rad = (angle * Math.PI) / 180;
    const r = (value / data.maxValue) * radius;
    return {
      x: centerX + r * Math.cos(rad),
      y: centerY + r * Math.sin(rad),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.values.map((v, i) => getPoint(i, v));
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <svg width="220" height={height}>
        {/* Grid */}
        {gridLevels.map((level) => {
          const points = Array.from({ length: sides }, (_, i) => {
            const p = getPoint(i, level * data.maxValue);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="var(--border)"
              strokeDasharray="3"
            />
          );
        })}
        {/* Axes */}
        {data.labels.map((_, i) => {
          const p = getPoint(i, data.maxValue);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={p.x}
              y2={p.y}
              stroke="var(--border)"
            />
          );
        })}
        {/* Data */}
        <polygon
          points={dataPath.replace(/[MLZ]/g, "").trim()}
          fill={`${data.color}33`}
          stroke={data.color}
          strokeWidth="2"
        />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={data.color} />
        ))}
        {/* Labels */}
        {data.labels.map((label, i) => {
          const p = getPoint(i, data.maxValue * 1.2);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="var(--foreground)"
            >
              {label}
            </text>
          );
        })}
      </svg>
      <div style={chartStyles.legend}>
        {data.labels.map((label, idx) => (
          <div key={idx} style={chartStyles.legendItem}>
            <span style={chartStyles.legendLabel}>{label}:</span>
            <span
              style={{
                ...chartStyles.legendValue,
                color: data.color,
                fontWeight: "600",
              }}
            >
              {data.values[idx]}/{data.maxValue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Analysis Component ───────────────────────────────────────────── */

function AnalysisCard({ analysis }) {
  const trendIcon =
    analysis.trend === "up"
      ? "lucide:trending-up"
      : analysis.trend === "down"
        ? "lucide:trending-down"
        : "lucide:minus";
  const trendColor =
    analysis.trend === "up"
      ? "#22c55e"
      : analysis.trend === "down"
        ? "#ef4444"
        : "#f59e0b";

  return (
    <div style={analysisStyles.card}>
      <div style={analysisStyles.header}>
        <Icon
          icon="lucide:bar-chart-2"
          style={{ color: "#6366f1", fontSize: "18px" }}
        />
        <h4 style={analysisStyles.title}>{analysis.title}</h4>
        <div
          style={{
            ...analysisStyles.trendBadge,
            backgroundColor: `${trendColor}20`,
            color: trendColor,
          }}
        >
          <Icon icon={trendIcon} style={{ fontSize: "14px" }} />
          {analysis.trend.toUpperCase()}
        </div>
      </div>
      <ul style={analysisStyles.insights}>
        {analysis.insights.map((insight, idx) => (
          <li key={idx} style={analysisStyles.insight}>
            <Icon
              icon="lucide:check-circle"
              style={{ color: "#22c55e", flexShrink: 0 }}
            />
            {insight}
          </li>
        ))}
      </ul>
      <div style={analysisStyles.summary}>
        <Icon icon="lucide:lightbulb" style={{ color: "#f59e0b" }} />
        <span>{analysis.summary}</span>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */

export default function DBAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your DB Assistant. Select a question below or type your own query to get data analysis with visualizations:",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuestionClick = (question) => {
    if (isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: question.question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Here's the analysis based on your query:",
        questionData: question,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 800);
  };

  const findMatchingQuestion = (query) => {
    const lowerQuery = query.toLowerCase();
    return FIXED_QUESTIONS.find((q) => {
      const keywords = q.question.toLowerCase().split(/\s+/);
      return keywords.some(
        (keyword) => keyword.length > 3 && lowerQuery.includes(keyword),
      );
    });
  };

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue.trim();
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const matchedQuestion = findMatchingQuestion(query);

      if (matchedQuestion) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: "Here's the analysis based on your query:",
          questionData: matchedQuestion,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content:
            "I couldn't find a specific analysis for your query. Please try selecting one of the predefined questions from the panel, or try keywords like: students, events, projects, placement, NAAC, faculty, research, or infrastructure.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderChart = (questionData) => {
    const { chartType, data } = questionData;

    switch (chartType) {
      case "bar":
        return <BarChart data={data} />;
      case "horizontal-bar":
        return <HorizontalBarChart data={data} />;
      case "line":
        return <LineChart data={data} />;
      case "area":
        return <AreaChart data={data} />;
      case "pie":
        return <PieChart data={data} />;
      case "donut":
        return <PieChart data={data} isDonut />;
      case "radar":
        return <RadarChart data={data} />;
      default:
        return <BarChart data={data} />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconWrapper}>
            <Icon icon="lucide:bot" style={styles.headerIcon} />
          </div>
          <div>
            <h1 style={styles.title}>DB Assistant</h1>
            <p style={styles.subtitle}>
              Query your institutional database with visual analytics
            </p>
          </div>
        </div>
        <div style={styles.statusBadge}>
          <span style={styles.statusDot}></span>
          Connected to Database
        </div>
      </div>

      <div style={styles.mainContent}>
        {/* Questions Panel */}
        <div style={styles.questionsPanel}>
          <h3 style={styles.panelTitle}>
            <Icon icon="lucide:help-circle" style={{ marginRight: "8px" }} />
            Available Queries
          </h3>
          <div style={styles.questionsList}>
            {FIXED_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleQuestionClick(q)}
                style={styles.questionBtn}
                disabled={isLoading}
              >
                <span style={styles.questionNum}>{idx + 1}</span>
                {q.question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div style={styles.chatPanel}>
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageWrapper,
                  justifyContent:
                    message.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                {message.type === "bot" && (
                  <div style={styles.botAvatar}>
                    <Icon icon="lucide:bot" />
                  </div>
                )}
                <div
                  style={{
                    ...styles.message,
                    ...(message.type === "user"
                      ? styles.userMessage
                      : styles.botMessage),
                    ...(message.questionData && { maxWidth: "90%" }),
                  }}
                >
                  <p style={styles.messageContent}>{message.content}</p>
                  {message.questionData && (
                    <div style={styles.responseContent}>
                      <div style={styles.chartContainer}>
                        {renderChart(message.questionData)}
                      </div>
                      <AnalysisCard analysis={message.questionData.analysis} />
                    </div>
                  )}
                  <span style={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={styles.messageWrapper}>
                <div style={styles.botAvatar}>
                  <Icon icon="lucide:bot" />
                </div>
                <div style={{ ...styles.message, ...styles.botMessage }}>
                  <div style={styles.typingIndicator}>
                    <span style={styles.typingDot}></span>
                    <span
                      style={{ ...styles.typingDot, animationDelay: "0.2s" }}
                    ></span>
                    <span
                      style={{ ...styles.typingDot, animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <Icon icon="lucide:message-square" style={styles.inputIcon} />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your query here..."
                style={styles.input}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                style={{
                  ...styles.sendButton,
                  opacity: !inputValue.trim() || isLoading ? 0.5 : 1,
                }}
              >
                <Icon icon="lucide:send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ───────────────────────────────────────────────────────── */

const styles = {
  container: {
    padding: "24px",
    height: "calc(100vh - 60px)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--background)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "24px",
  },
  headerIcon: {},
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--foreground)",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--muted-foreground)",
    margin: "4px 0 0 0",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#22c55e",
    fontSize: "14px",
    fontWeight: "500",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    gap: "24px",
    overflow: "hidden",
  },
  questionsPanel: {
    width: "340px",
    backgroundColor: "var(--card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  panelTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--foreground)",
    margin: "0 0 16px 0",
    display: "flex",
    alignItems: "center",
  },
  questionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflowY: "auto",
  },
  questionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontSize: "13px",
    textAlign: "left",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  questionNum: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
    flexShrink: 0,
  },
  chatPanel: {
    flex: 1,
    backgroundColor: "var(--card)",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  messageWrapper: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  botAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "18px",
    flexShrink: 0,
  },
  message: {
    maxWidth: "70%",
    padding: "14px 18px",
    borderRadius: "16px",
  },
  userMessage: {
    backgroundColor: "#6366f1",
    color: "white",
    borderBottomRightRadius: "4px",
  },
  botMessage: {
    backgroundColor: "var(--muted)",
    color: "var(--foreground)",
    borderBottomLeftRadius: "4px",
  },
  messageContent: {
    margin: 0,
    lineHeight: "1.5",
  },
  responseContent: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  chartContainer: {
    padding: "20px",
    backgroundColor: "var(--background)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
  },
  timestamp: {
    fontSize: "11px",
    opacity: 0.7,
    marginTop: "12px",
    display: "block",
  },
  typingIndicator: {
    display: "flex",
    gap: "6px",
    padding: "8px 4px",
  },
  typingDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "var(--muted-foreground)",
    animation: "bounce 1.4s infinite ease-in-out",
  },
  inputContainer: {
    padding: "16px 24px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--background)",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "4px 4px 4px 16px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    transition: "border-color 0.2s",
  },
  inputIcon: {
    fontSize: "20px",
    color: "var(--muted-foreground)",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "15px",
    backgroundColor: "transparent",
    color: "var(--foreground)",
    padding: "12px 0",
  },
  sendButton: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s, opacity 0.2s",
  },
};

const chartStyles = {
  container: {
    width: "100%",
    padding: "10px 0",
  },
  legend: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
  },
  legendColor: {
    width: "12px",
    height: "12px",
    borderRadius: "3px",
  },
  legendLabel: {
    color: "var(--foreground)",
  },
  legendValue: {
    color: "var(--muted-foreground)",
    marginLeft: "auto",
  },
};

const analysisStyles = {
  card: {
    padding: "20px",
    backgroundColor: "var(--background)",
    borderRadius: "12px",
    border: "1px solid var(--border)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--foreground)",
    flex: 1,
  },
  trendBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  insights: {
    margin: "0 0 16px 0",
    padding: "0 0 0 8px",
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  insight: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13px",
    color: "var(--foreground)",
    lineHeight: "1.4",
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "var(--foreground)",
    fontWeight: "500",
  },
};

// Add keyframes for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-6px); }
  }
`;
document.head.appendChild(styleSheet);
