import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  PROJECT_STATUS_OPTIONS,
  createProject,
  deleteProject,
  getProjects,
  restoreDefaultProjects,
  updateProject,
} from "../data/projectStore";          
import { getGithubReposForLinking } from "../services/githubApi";
const EMPTY_FORM = {
  title: "",
  description: "",
  status: "Draft",
  role: "",
  techStack: "",
  manualSkills: "",
  highlights: "",
  outcomes: "",
  startDate: "",  
  endDate: "",
  featured: false,
  linkedRepoId: "",
};

const DUMMY_REPOS = [
  {
    id: 1001,
    name: "campus-mitra-frontend",
    fullName: "student/campus-mitra-frontend",
    description: "Campus platform frontend",
    language: "JavaScript",
    stars: 45,
    forks: 12,
    fork: false,
    htmlUrl: "https://github.com/student/campus-mitra-frontend",
  },
  {
    id: 1002,
    name: "event-scheduler-api",
    fullName: "student/event-scheduler-api",
    description: "REST API for event scheduling",
    language: "Python",
    stars: 32,
    forks: 8,
    fork: false,
    htmlUrl: "https://github.com/student/event-scheduler-api",
  },
  {
    id: 1006,
    name: "ml-placement-predictor",
    fullName: "student/ml-placement-predictor",
    description: "Placement prediction model",
    language: "Python",
    stars: 56,
    forks: 14,
    fork: false,
    htmlUrl: "https://github.com/student/ml-placement-predictor",
  },
  {
    id: 1007,
    name: "attendance-system",
    fullName: "student/attendance-system",
    description: "QR attendance backend",
    language: "Java",
    stars: 22,
    forks: 6,
    fork: false,
    htmlUrl: "https://github.com/student/attendance-system",
  },
];

const FILTERS = ["All", "Featured", "Starter", "Custom"];

export default function MyProjects() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState(() => getProjects());
  const [repos, setRepos] = useState(DUMMY_REPOS);
  const [isReposLoading, setIsReposLoading] = useState(false);
  const [repoStatus, setRepoStatus] = useState("Link a GitHub account to load repositories.");
  const [repoQuery, setRepoQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const configuredGithubUsername = user?.githubUsername?.trim() || "";
  const githubToken = user?.githubToken || localStorage.getItem("campusos_github_token") || "";

  useEffect(() => {
    let isCancelled = false;

    const loadRepos = async () => {
      if (!configuredGithubUsername) {
        setRepos(DUMMY_REPOS);
        setRepoStatus("Link a GitHub account to load repositories.");
        setIsReposLoading(false);
        return;
      }

      setIsReposLoading(true);
      setRepoStatus("");

      try {
        const linkedRepos = await getGithubReposForLinking(
          configuredGithubUsername,
          githubToken,
        );
        if (isCancelled) return;
        const mergedRepos = [...DUMMY_REPOS];
        const seenIds = new Set(DUMMY_REPOS.map((repo) => String(repo.id)));

        for (const repo of linkedRepos) {
          const repoId = String(repo.id);
          if (!seenIds.has(repoId)) {
            mergedRepos.push(repo);
            seenIds.add(repoId);
          }
        }

        setRepos(mergedRepos);
        setRepoStatus(
          mergedRepos.length
            ? ""
            : "No repositories found for your linked GitHub account.",
        );

        setForm((previous) => {
          if (!previous.linkedRepoId) return previous;
          const stillExists = linkedRepos.some(
            (repo) => String(repo.id) === previous.linkedRepoId,
          );
          return stillExists ? previous : { ...previous, linkedRepoId: "" };
        });
      } catch {
        if (isCancelled) return;
        setRepos(DUMMY_REPOS);
        setRepoStatus("Unable to load repositories from linked GitHub account.");
      } finally {
        if (!isCancelled) {
          setIsReposLoading(false);
        }
      }
    };

    loadRepos();

    return () => {
      isCancelled = true;
    };
  }, [configuredGithubUsername, githubToken]);

  const repoLookup = useMemo(() => {
    const lookup = {};
    for (const repo of repos) lookup[repo.id] = repo;
    return lookup;
  }, [repos]);

  const refreshProjects = () => setProjects(getProjects());

  const stats = useMemo(() => {
    const total = projects.length;
    const featured = projects.filter((project) => project.featured).length;
    const starter = projects.filter((project) => project.isLocked).length;
    const linked = projects.filter((project) => Boolean(project.linkedRepoUrl)).length;
    return { total, featured, starter, linked };
  }, [projects]);

  const selectedRepo = useMemo(
    () => (form.linkedRepoId ? repoLookup[Number(form.linkedRepoId)] : null),
    [form.linkedRepoId, repoLookup],
  );

  const filteredRepos = useMemo(() => {
    if (!repoQuery.trim()) return repos;
    const value = repoQuery.trim().toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(value) ||
        (repo.fullName || "").toLowerCase().includes(value) ||
        (repo.description || "").toLowerCase().includes(value) ||
        (repo.language || "").toLowerCase().includes(value),
    );
  }, [repoQuery, repos]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      if (activeFilter === "Featured" && !project.featured) return false;
      if (activeFilter === "Starter" && !project.isLocked) return false;
      if (activeFilter === "Custom" && project.isLocked) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        project.title,
        project.description,
        project.role,
        project.status,
        ...(project.techStack || []),
        ...(project.manualSkills || []),
        ...(project.highlights || []),
        ...(project.outcomes || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [projects, activeFilter, query]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingProjectId(null);
    setRepoQuery("");
    setShowForm(false);
  };

  const handleCreateOrUpdate = () => {
    if (!form.title.trim()) return;

    const linkedRepo = form.linkedRepoId
      ? repoLookup[Number(form.linkedRepoId)]
      : null;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      role: form.role.trim(),
      techStack: splitCsv(form.techStack),
      manualSkills: splitCsv(form.manualSkills),
      highlights: splitCsv(form.highlights),
      outcomes: splitCsv(form.outcomes),
      startDate: form.startDate,
      endDate: form.endDate,
      featured: form.featured,
      linkedRepoId: linkedRepo?.id || null,
      linkedRepoName: linkedRepo?.name || "",
      linkedRepoUrl: linkedRepo?.htmlUrl || "",
      linkedRepoFork: Boolean(linkedRepo?.fork),
    };

    if (editingProjectId) {
      updateProject(editingProjectId, payload);
    } else {
      createProject(payload);
    }

    refreshProjects();
    resetForm();
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setShowForm(true);
    setForm({
      title: project.title || "",
      description: project.description || "",
      status: project.status || "Draft",
      role: project.role || "",
      techStack: (project.techStack || []).join(", "),
      manualSkills: (project.manualSkills || []).join(", "),
      highlights: (project.highlights || []).join(", "),
      outcomes: (project.outcomes || []).join(", "),
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      featured: Boolean(project.featured),
      linkedRepoId: project.linkedRepoId ? String(project.linkedRepoId) : "",
    });
    setRepoQuery(project.linkedRepoName || "");
  };

  const handleDeleteProject = (project) => {
    if (project.isLocked) return;
    deleteProject(project.id);
    refreshProjects();
  };

  return (
    <div style={pageWrap}>
      <section style={heroCard}>
        <div>
          <h1 style={heroTitle}>My Projects</h1>
          <p style={heroText}>
            A card-first project board to present features, outcomes, and impact in
            a portfolio-quality format.
          </p>
        </div>
        <div style={heroActions}>
          <button onClick={() => setShowForm((prev) => !prev)} style={primaryBtn}>
            <iconify-icon icon={showForm ? "lucide:x" : "lucide:plus"}></iconify-icon>
            {showForm ? "Close" : "New Project"}
          </button>
          <button
            onClick={() => {
              restoreDefaultProjects();
              refreshProjects();
            }}
            style={secondaryBtn}
          >
            <iconify-icon icon="lucide:rotate-ccw"></iconify-icon>
            Restore Starter Projects
          </button>
        </div>
      </section>
      <section style={summaryGrid}>
        <SummaryCard
          label="Total Projects"
          value={stats.total}
          icon="lucide:layout-grid"
          hint="Across starter and custom"
        />
        <SummaryCard
          label="Featured"
          value={stats.featured}
          icon="lucide:star"
          hint="Shown in portfolio blocks"
        />
        <SummaryCard
          label="Starter"
          value={stats.starter}
          icon="lucide:shield-check"
          hint="Protected default projects"
        />
        <SummaryCard
          label="GitHub Linked"
          value={stats.linked}
          icon="mdi:github"
          hint="Projects with repo links"
        />
      </section>

      <section style={filterCard}>
        <div style={filterRow}>
          <div style={pillRow}>
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  ...pill,
                  ...(activeFilter === filter ? pillActive : {}),
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={searchWrap}>
            <iconify-icon icon="lucide:search"></iconify-icon>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, stack, feature, skill"
              style={searchInput}
            />
          </div>
        </div>
      </section>

      {showForm && (
        <div
          style={overlay}
          onClick={(event) => {
            if (event.target === event.currentTarget) resetForm();
          }}
        >
          <div style={formCard}>
            <div style={formHeader}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800 }}>
                {editingProjectId ? "Edit Project" : "Create New Project"}
              </h3>
              <button onClick={resetForm} style={iconBtn}>
                <iconify-icon icon="lucide:x"></iconify-icon>
              </button>
            </div>

            <div style={formGrid}>
              <Field label="Project title">
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, title: event.target.value }))
                  }
                  placeholder="e.g. Campus Placement Optimizer"
                  style={inputStyle}
                />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, status: event.target.value }))
                  }
                  style={inputStyle}
                >
                  {PROJECT_STATUS_OPTIONS().map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </Field>
              <Field label="Role">
                <input
                  value={form.role}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, role: event.target.value }))
                  }
                  placeholder="e.g. Backend Developer"
                  style={inputStyle}
                />
              </Field>
              <Field label="Tech stack (comma separated)">
                <input
                  value={form.techStack}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, techStack: event.target.value }))
                  }
                  placeholder="React, Node.js, PostgreSQL"
                  style={inputStyle}
                />
              </Field>
              <Field label="Highlights (comma separated)">
                <input
                  value={form.highlights}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, highlights: event.target.value }))
                  }
                  placeholder="Built role-based dashboards, Added analytics"
                  style={inputStyle}
                />
              </Field>
              <Field label="Outcomes (comma separated)">
                <input
                  value={form.outcomes}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, outcomes: event.target.value }))
                  }
                  placeholder="Improved engagement, Reduced manual effort"
                  style={inputStyle}
                />
              </Field>
              <Field label="Start date">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, startDate: event.target.value }))
                  }
                  style={inputStyle}
                />
              </Field>
              <Field label="End date">
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) =>
                    setForm((previous) => ({ ...previous, endDate: event.target.value }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, description: event.target.value }))
                }
                placeholder="What problem does this project solve?"
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Field>

            <Field label="Manual skills (comma separated)">
              <input
                value={form.manualSkills}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, manualSkills: event.target.value }))
                }
                placeholder="Problem Solving, Leadership, API Design"
                style={inputStyle}
              />
            </Field>

            <div style={{ marginTop: "12px", marginBottom: "12px" }}>
              <label style={fieldLabel}>Link repository (optional)</label>
              <input
                value={repoQuery}
                onChange={(event) => setRepoQuery(event.target.value)}
                placeholder={
                  configuredGithubUsername
                    ? "Search repositories"
                    : "Link GitHub account to load repositories"
                }
                disabled={!configuredGithubUsername || isReposLoading}
                style={{ ...inputStyle, marginBottom: "8px" }}
              />

              {selectedRepo && (
                <div style={selectedRepoCard}>
                  <span>
                    Linked: <strong>{selectedRepo.fullName}</strong>{" "}
                    {selectedRepo.fork ? "(Forked)" : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({ ...previous, linkedRepoId: "" }))
                    }
                    style={clearBtn}
                  >
                    Clear
                  </button>
                </div>
              )}

              <div style={repoListCard}>
                {isReposLoading ? (
                  <div style={emptyRepoText}>Loading repositories...</div>
                ) : filteredRepos.length === 0 ? (
                  <div style={emptyRepoText}>{repoStatus || "No repositories match your search."}</div>
                ) : (
                  filteredRepos.map((repo) => {
                    const isActive = String(repo.id) === form.linkedRepoId;
                    return (
                      <button
                        key={repo.id}
                        type="button"
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            linkedRepoId: String(repo.id),
                          }))
                        }
                        style={{
                          ...repoItemBtn,
                          ...(isActive ? repoItemActive : {}),
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          {repo.fullName} {repo.fork ? "(Forked)" : ""}
                        </div>
                        <div style={repoMetaText}>
                          {repo.language || "Unknown"} • ⭐ {repo.stars} • 🍴 {repo.forks}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <label style={checkboxLabel}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, featured: event.target.checked }))
                }
              />
              Feature this project in portfolio blocks
            </label>

            <div style={formActions}>
              <button onClick={resetForm} style={secondaryBtn}>
                Cancel
              </button>
              <button onClick={handleCreateOrUpdate} style={primaryBtn}>
                {editingProjectId ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {visibleProjects.length === 0 ? (
        <section style={emptyCard}>
          <iconify-icon icon="lucide:folder-search" style={{ fontSize: "26px" }}></iconify-icon>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 800 }}>
              No matching projects
            </h3>
            <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
              Try another filter or search term, or create a new project card.
            </p>
          </div>
        </section>
      ) : (
        <section style={projectGrid}>
          {visibleProjects.map((project) => {
            const linkedRepo = project.linkedRepoId ? repoLookup[project.linkedRepoId] : null;
            const topHighlight = project.highlights?.[0] || "Add a key feature highlight";
            const topOutcome = project.outcomes?.[0] || "Add an impact outcome";

            return (
              <article key={project.id} style={projectCard}>
                <div style={projectTopRow}>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {project.isLocked && <Badge tone="locked">Starter</Badge>}
                    {project.featured && <Badge tone="featured">Featured</Badge>}
                    <Badge tone="neutral">{project.status || "Draft"}</Badge>
                  </div>
                  <button
                    onClick={() => updateFeatured(project, refreshProjects)}
                    style={iconBtn}
                    title={project.featured ? "Unfeature project" : "Feature project"}
                  >
                    <iconify-icon
                      icon={project.featured ? "lucide:star-off" : "lucide:star"}
                    ></iconify-icon>
                  </button>
                </div>

                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={titleBtn}
                >
                  <h3 style={projectTitle}>{project.title}</h3>
                  <p style={projectRole}>
                    {project.role || "Role not specified"}
                  </p>
                </button>

                <p style={projectDescription}>
                  {project.description || "No description provided."}
                </p>

                <div style={chipWrap}>
                  {(project.techStack || []).slice(0, 5).map((tech) => (
                    <Badge key={`${project.id}-tech-${tech}`} tone="neutral">
                      {tech}
                    </Badge>
                  ))}
                  {(project.manualSkills || []).slice(0, 3).map((skill) => (
                    <Badge key={`${project.id}-skill-${skill}`} tone="skill">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div style={insightGrid}>
                  <CardMini label="Feature" value={topHighlight} />
                  <CardMini label="Outcome" value={topOutcome} />
                </div>

                <div style={metaGrid}>
                  <MetaPill label="Start" value={project.startDate || "-"} />
                  <MetaPill label="End" value={project.endDate || "-"} />
                  <MetaPill
                    label="Updated"
                    value={new Date(project.updatedAt).toLocaleDateString()}
                  />
                </div>

                <div style={projectActions}>
                  <button onClick={() => navigate(`/projects/${project.id}`)} style={primaryBtn}>
                    View Details
                  </button>
                  <button onClick={() => handleEditProject(project)} style={secondaryBtn}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
                    style={project.isLocked ? disabledBtn : dangerBtn}
                    disabled={project.isLocked}
                  >
                    Delete
                  </button>
                </div>

                <div style={repoRow}>
                  {linkedRepo || project.linkedRepoUrl ? (
                    <a
                      href={linkedRepo?.htmlUrl || project.linkedRepoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={repoLink}
                    >
                      <iconify-icon icon="mdi:github"></iconify-icon>
                      {linkedRepo?.fullName || project.linkedRepoName || "Repository"}
                    </a>
                  ) : (
                    <span style={repoTextMuted}>No linked repository</span>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

function updateFeatured(project, refreshProjects) {
  updateProject(project.id, { featured: !project.featured });
  refreshProjects();
}

function splitCsv(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: "10px" }}>
      <span style={fieldLabel}>{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({ label, value, icon, hint }) {
  return (
    <div style={summaryCard}>
      <div style={summaryHead}>
        <span style={summaryLabel}>{label}</span>
        <iconify-icon icon={icon}></iconify-icon>
      </div>
      <div style={summaryValue}>{value}</div>
      <div style={summaryHint}>{hint}</div>
    </div>
  );
}

function MetaPill({ label, value }) {
  return (
    <div style={metaPill}>
      <span style={metaLabel}>{label}</span>
      <span style={metaValue}>{value}</span>
    </div>
  );
}

function CardMini({ label, value }) {
  return (
    <div style={miniCard}>
      <div style={miniLabel}>{label}</div>
      <div style={miniValue}>{value}</div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: {
      background: "var(--muted)",
      color: "var(--foreground)",
    },
    skill: {
      background: "var(--secondary)",
      color: "var(--secondary-foreground)",
    },
    featured: {
      background: "var(--accent)",
      color: "var(--accent-foreground)",
    },
    locked: {
      background: "var(--secondary)",
      color: "var(--secondary-foreground)",
    },
  };

  return (
    <span style={{ ...badgeBase, ...tones[tone] }}>
      {children}
    </span>
  );
}

const pageWrap = {
  flex: 1,
  overflowY: "auto",
  padding: "28px",
  display: "grid",
  gap: "14px",
};

const heroCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "22px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  flexWrap: "wrap",
};

const heroTitle = {
  margin: 0,
  fontSize: "34px",
  fontWeight: 800,
};

const heroText = {
  margin: "8px 0 0",
  color: "var(--muted-foreground)",
  maxWidth: "780px",
  lineHeight: 1.45,
};

const heroActions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const summaryGrid = {
  display: "grid",
  gap: "10px",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
};

const summaryCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "14px",
};

const summaryHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
};

const summaryLabel = {
  fontSize: "12px",
  color: "var(--muted-foreground)",
};

const summaryValue = {
  fontSize: "28px",
  fontWeight: 800,
  lineHeight: 1,
};

const summaryHint = {
  marginTop: "6px",
  fontSize: "12px",
  color: "var(--muted-foreground)",
};

const filterCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "12px",
};

const filterRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const pillRow = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const pill = {
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "999px",
  padding: "8px 12px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "12px",
};

const pillActive = {
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  borderColor: "var(--primary)",
};

const searchWrap = {
  border: "1px solid var(--border)",
  background: "var(--background)",
  borderRadius: "10px",
  padding: "8px 10px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minWidth: "280px",
};

const searchInput = {
  border: "none",
  outline: "none",
  background: "transparent",
  color: "var(--foreground)",
  width: "100%",
  fontSize: "13px",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.16)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 120,
  padding: "20px",
};

const formCard = {
  width: "100%",
  maxWidth: "920px",
  maxHeight: "92vh",
  overflowY: "auto",
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "20px",
};

const formHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const fieldLabel = {
  display: "block",
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "var(--background)",
  color: "var(--foreground)",
  fontSize: "14px",
};

const selectedRepoCard = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "8px 10px",
  marginBottom: "8px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: "12px",
  background: "var(--muted)",
};

const clearBtn = {
  border: "none",
  background: "transparent",
  color: "var(--primary)",
  fontWeight: 700,
  cursor: "pointer",
};

const repoListCard = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  maxHeight: "180px",
  overflowY: "auto",
  background: "var(--background)",
};

const emptyRepoText = {
  padding: "10px",
  fontSize: "12px",
  color: "var(--muted-foreground)",
};

const repoItemBtn = {
  width: "100%",
  textAlign: "left",
  padding: "8px 10px",
  border: "none",
  borderBottom: "1px solid var(--border)",
  cursor: "pointer",
  fontSize: "12px",
  color: "var(--foreground)",
  background: "transparent",
};

const repoItemActive = {
  background: "var(--secondary)",
};

const repoMetaText = {
  color: "var(--muted-foreground)",
  marginTop: "2px",
};

const checkboxLabel = {
  display: "inline-flex",
  gap: "8px",
  alignItems: "center",
  fontSize: "13px",
  marginBottom: "14px",
};

const formActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const projectGrid = {
  display: "grid",
  gap: "12px",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
};

const projectCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "16px",
  display: "grid",
  gap: "12px",
};

const projectTopRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const titleBtn = {
  border: "none",
  background: "transparent",
  textAlign: "left",
  padding: 0,
  cursor: "pointer",
  color: "inherit",
};

const projectTitle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 800,
};

const projectRole = {
  margin: "4px 0 0",
  color: "var(--muted-foreground)",
  fontSize: "13px",
};

const projectDescription = {
  margin: 0,
  fontSize: "14px",
  lineHeight: 1.45,
  color: "var(--muted-foreground)",
};

const chipWrap = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
};

const insightGrid = {
  display: "grid",
  gap: "8px",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
};

const miniCard = {
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "10px",
};

const miniLabel = {
  fontSize: "11px",
  color: "var(--muted-foreground)",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const miniValue = {
  fontSize: "13px",
  lineHeight: 1.4,
};

const metaGrid = {
  display: "grid",
  gap: "8px",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
};

const metaPill = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "8px 10px",
  display: "grid",
  gap: "2px",
};

const metaLabel = {
  fontSize: "11px",
  color: "var(--muted-foreground)",
};

const metaValue = {
  fontSize: "12px",
  fontWeight: 700,
};

const projectActions = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const repoRow = {
  borderTop: "1px solid var(--border)",
  paddingTop: "10px",
};

const repoLink = {
  color: "var(--primary)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 700,
  fontSize: "13px",
};

const repoTextMuted = {
  color: "var(--muted-foreground)",
  fontSize: "13px",
};

const badgeBase = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
  padding: "4px 8px",
};

const emptyCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const primaryBtn = {
  border: "1px solid var(--primary)",
  background: "var(--primary)",
  color: "var(--primary-foreground)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
};

const secondaryBtn = {
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  cursor: "pointer",
};

const dangerBtn = {
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
};

const disabledBtn = {
  ...dangerBtn,
  opacity: 0.45,
  cursor: "not-allowed",
};

const iconBtn = {
  border: "1px solid var(--border)",
  background: "var(--background)",
  color: "var(--foreground)",
  borderRadius: "8px",
  width: "32px",
  height: "32px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
