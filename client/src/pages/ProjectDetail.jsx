import { Link, useNavigate, useParams } from "react-router-dom";
import { getProjectById, updateProject } from "../data/projectStore";

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div style={pageWrap}>
        <div style={emptyCard}>
          <h1 style={{ margin: "0 0 8px", fontSize: "28px" }}>Project not found</h1>
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            This project does not exist or was removed.
          </p>
          <button onClick={() => navigate("/projects")} style={primaryBtn}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const highlights = project.highlights?.length
    ? project.highlights
    : ["Add feature highlights to explain what this project does."];

  const outcomes = project.outcomes?.length
    ? project.outcomes
    : ["Add outcome notes to quantify project impact."];

  return (
    <div style={pageWrap}>
      <section style={heroCard}>
        <div>
          <div style={breadcrumbRow}>
            <Link to="/projects" style={linkBtn}>
              <iconify-icon icon="lucide:arrow-left"></iconify-icon>
              Back to My Projects
            </Link>
            {project.isLocked && <Badge tone="locked">Starter Project</Badge>}
            {project.featured && <Badge tone="feature">Featured</Badge>}
          </div>

          <h1 style={titleStyle}>{project.title}</h1>
          <p style={subtitleStyle}>{project.description || "No description provided."}</p>

          <div style={metaStrip}>
            <Meta label="Role" value={project.role || "Not specified"} />
            <Meta label="Status" value={project.status || "Draft"} />
            <Meta label="Start" value={project.startDate || "-"} />
            <Meta label="End" value={project.endDate || "-"} />
            <Meta
              label="Updated"
              value={new Date(project.updatedAt).toLocaleDateString()}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => {
              updateProject(project.id, { featured: !project.featured });
              navigate(0);
            }}
            style={secondaryBtn}
          >
            <iconify-icon icon="lucide:star"></iconify-icon>
            {project.featured ? "Unfeature" : "Feature"}
          </button>
          <button onClick={() => navigate("/projects")} style={primaryBtn}>
            Open Projects Board
          </button>
        </div>
      </section>

      <section style={gridWrap}>
        <article style={card}>
          <h2 style={sectionTitle}>Key Features</h2>
          <ul style={listStyle}>
            {highlights.map((item) => (
              <li key={item} style={listItem}>
                <iconify-icon icon="lucide:check-circle-2"></iconify-icon>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article style={card}>
          <h2 style={sectionTitle}>Outcomes & Impact</h2>
          <ul style={listStyle}>
            {outcomes.map((item) => (
              <li key={item} style={listItem}>
                <iconify-icon icon="lucide:trending-up"></iconify-icon>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Tech & Skills</h2>
        <div style={chipWrap}>
          {(project.techStack || []).map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
          {(project.manualSkills || []).map((skill) => (
            <Badge key={skill} tone="skill">
              {skill}
            </Badge>
          ))}
          {!project.techStack?.length && !project.manualSkills?.length && (
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
              Add technologies and skills from the projects board.
            </p>
          )}
        </div>
      </section>

      <section style={card}>
        <h2 style={sectionTitle}>Repository</h2>
        {project.linkedRepoUrl ? (
          <a href={project.linkedRepoUrl} target="_blank" rel="noopener noreferrer" style={repoLink}>
            {project.linkedRepoName || "Open linked repository"}
          </a>
        ) : (
          <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
            No linked repository for this project.
          </p>
        )}
      </section>
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div style={metaItem}>
      <div style={metaLabel}>{label}</div>
      <div style={metaValue}>{value}</div>
    </div>
  );
}

function Badge({ children, tone = "default" }) {
  const toneStyles = {
    default: { background: "var(--muted)", color: "var(--foreground)" },
    skill: { background: "rgba(59,130,246,0.12)", color: "#1d4ed8" },
    feature: { background: "rgba(245,158,11,0.15)", color: "#b45309" },
    locked: { background: "rgba(20,184,166,0.15)", color: "#0f766e" },
  };

  return (
    <span
      style={{
        padding: "5px 9px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
        ...toneStyles[tone],
      }}
    >
      {children}
    </span>
  );
}

const pageWrap = {
  flex: 1,
  overflowY: "auto",
  padding: "28px",
  display: "grid",
  gap: "16px",
};

const heroCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "22px",
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const breadcrumbRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  flexWrap: "wrap",
};

const linkBtn = {
  color: "var(--primary)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 700,
};

const titleStyle = {
  margin: "10px 0 6px",
  fontSize: "34px",
  fontWeight: 800,
};

const subtitleStyle = {
  margin: 0,
  color: "var(--muted-foreground)",
  lineHeight: 1.5,
  maxWidth: "900px",
};

const metaStrip = {
  marginTop: "14px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "10px",
};

const metaItem = {
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "8px 10px",
  background: "var(--background)",
};

const metaLabel = {
  fontSize: "12px",
  color: "var(--muted-foreground)",
};

const metaValue = {
  fontSize: "14px",
  fontWeight: 700,
  marginTop: "2px",
};

const gridWrap = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "12px",
};

const card = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "18px",
};

const sectionTitle = {
  margin: "0 0 10px",
  fontSize: "20px",
  fontWeight: 800,
};

const listStyle = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: "8px",
};

const listItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  color: "var(--foreground)",
  fontSize: "14px",
};

const chipWrap = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const repoLink = {
  color: "var(--primary)",
  textDecoration: "none",
  fontWeight: 700,
};

const primaryBtn = {
  border: "none",
  background: "var(--primary)",
  color: "white",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryBtn = {
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};

const emptyCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "24px",
  display: "grid",
  gap: "12px",
};
