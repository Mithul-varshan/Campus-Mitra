const PROJECTS_KEY = "campusos_projects_v1";
const LEGACY_SELECTED_REPOS_KEY = "campusos_portfolio_repos";

const DEFAULT_PROJECT_BLUEPRINTS = [
  {
    id: "starter-campus-mitra",
    title: "Campus Mitra Platform",
    description:
      "A comprehensive campus management platform for events, hackathons, certificates, and student innovation portfolios.",
    status: "Active",
    role: "Full Stack Developer",
    techStack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    manualSkills: ["System Design", "API Development", "Team Leadership"],
    highlights: [
      "Built role-based dashboard flows for student, teacher, admin, and recruiter personas",
      "Integrated portfolio management and featured-project visibility across the platform",
      "Shipped responsive interface with theme support and reusable UI primitives",
    ],
    outcomes: [
      "Improved project discovery and profile completeness for innovation scoring",
      "Reduced manual coordination between campus stakeholders",
    ],
    startDate: "2025-06-01",
    endDate: "",
    featured: true,
    linkedRepoId: 1001,
    linkedRepoName: "campus-mitra-frontend",
    linkedRepoUrl: "https://github.com/student/campus-mitra-frontend",
    linkedRepoFork: false,
    isLocked: true,
  },
  {
    id: "starter-ml-placement",
    title: "ML Placement Predictor",
    description:
      "A machine-learning pipeline that predicts placement readiness using project depth, skill evidence, and academic trends.",
    status: "Completed",
    role: "ML Engineer",
    techStack: ["Python", "TensorFlow", "Pandas", "Flask"],
    manualSkills: ["Machine Learning", "Data Analysis", "Model Evaluation"],
    highlights: [
      "Built feature engineering pipeline for skills and performance indicators",
      "Deployed lightweight inference API for dashboard consumption",
      "Created confidence bands for recruiter-facing insights",
    ],
    outcomes: [
      "Enabled early mentoring interventions for at-risk profiles",
      "Improved student readiness benchmarking in pilot cohorts",
    ],
    startDate: "2025-01-15",
    endDate: "2025-04-20",
    featured: true,
    linkedRepoId: 1006,
    linkedRepoName: "ml-placement-predictor",
    linkedRepoUrl: "https://github.com/student/ml-placement-predictor",
    linkedRepoFork: false,
    isLocked: true,
  },
  {
    id: "starter-smart-attendance",
    title: "Smart Attendance System",
    description:
      "A QR-based attendance workflow with real-time syncing, classroom analytics, and faculty-ready reporting.",
    status: "Completed",
    role: "Backend Developer",
    techStack: ["Java", "Spring Boot", "PostgreSQL", "React"],
    manualSkills: ["Database Design", "Authentication", "REST APIs"],
    highlights: [
      "Designed secure attendance APIs and teacher audit trails",
      "Implemented dashboard insights for absenteeism trends",
      "Added export-ready summaries for administrative review",
    ],
    outcomes: [
      "Reduced manual attendance effort for faculty teams",
      "Improved attendance transparency for students",
    ],
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    featured: false,
    linkedRepoId: 1007,
    linkedRepoName: "attendance-system",
    linkedRepoUrl: "https://github.com/student/attendance-system",
    linkedRepoFork: false,
    isLocked: true,
  },
];

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeProject(input = {}) {
  const now = new Date().toISOString();
  return {
    id: input.id || `proj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title: input.title || "Untitled Project",
    description: input.description || "",
    status: input.status || "Draft",
    role: input.role || "",
    techStack: Array.isArray(input.techStack) ? input.techStack : [],
    manualSkills: Array.isArray(input.manualSkills) ? input.manualSkills : [],
    highlights: Array.isArray(input.highlights) ? input.highlights : [],
    outcomes: Array.isArray(input.outcomes) ? input.outcomes : [],
    startDate: input.startDate || "",
    endDate: input.endDate || "",
    featured: Boolean(input.featured),
    isLocked: Boolean(input.isLocked),
    linkedRepoId: input.linkedRepoId || null,
    linkedRepoName: input.linkedRepoName || "",
    linkedRepoUrl: input.linkedRepoUrl || "",
    linkedRepoFork: Boolean(input.linkedRepoFork),
    createdAt: input.createdAt || now,
    updatedAt: now,
  };
}

function getDefaultProjects() {
  return DEFAULT_PROJECT_BLUEPRINTS.map((project) =>
    normalizeProject({
      ...project,
      createdAt: "2025-01-01T00:00:00.000Z",
    }),
  );
}

function mergeWithDefaults(inputProjects = []) {
  const projects = Array.isArray(inputProjects)
    ? inputProjects.map((project) => normalizeProject(project))
    : [];

  const byId = new Map(projects.map((project) => [project.id, project]));
  for (const starter of getDefaultProjects()) {
    if (!byId.has(starter.id)) {
      byId.set(starter.id, starter);
      continue;
    }
    const existing = byId.get(starter.id);
    byId.set(starter.id, normalizeProject({ ...existing, isLocked: true }));
  }

  return [...byId.values()].sort(
    (left, right) =>
      new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  );
}

export function getProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY);
  const items = safeParse(raw, []);
  const merged = mergeWithDefaults(items);
  if (JSON.stringify(items) !== JSON.stringify(merged)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(merged));
  }
  return merged;
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(mergeWithDefaults(projects)));
}

export function createProject(projectInput) {
  const projects = getProjects();
  const newProject = normalizeProject(projectInput);
  const updated = [newProject, ...projects];
  saveProjects(updated);
  return newProject;
}

export function updateProject(projectId, patch) {
  const projects = getProjects();
  const updated = projects.map((project) => {
    if (project.id !== projectId) return project;
    return normalizeProject({
      ...project,
      ...patch,
      id: project.id,
      createdAt: project.createdAt,
    });
  });
  saveProjects(updated);
  return updated.find((project) => project.id === projectId) || null;
}

export function deleteProject(projectId) {
  const projects = getProjects();
  const target = projects.find((project) => project.id === projectId);
  if (target?.isLocked) {
    return projects;
  }
  const updated = projects.filter((project) => project.id !== projectId);
  saveProjects(updated);
  return getProjects();
}

export function migrateLegacyRepoSelection(repoLookup = {}) {
  const existing = getProjects();
  if (existing.length > 0) return existing;

  const selectedRaw = localStorage.getItem(LEGACY_SELECTED_REPOS_KEY);
  const selectedRepoIds = safeParse(selectedRaw, []);
  if (!Array.isArray(selectedRepoIds) || selectedRepoIds.length === 0) {
    return existing;
  }

  const migrated = selectedRepoIds.map((repoId) => {
    const repo = repoLookup[repoId] || {};
    return normalizeProject({
      title: repo.name || `Project ${repoId}`,
      description: repo.description || "Migrated from previous portfolio selection",
      status: "Active",
      featured: true,
      linkedRepoId: repo.id || repoId,
      linkedRepoName: repo.name || "",
      linkedRepoUrl: repo.htmlUrl || "",
      linkedRepoFork: Boolean(repo.fork),
      techStack: repo.language ? [repo.language] : [],
      manualSkills: [],
      role: "",
    });
  });

  saveProjects(migrated);
  return migrated;
}

export function getFeaturedProjects() {
  return getProjects().filter((project) => project.featured);
}

export function getProjectById(projectId) {
  if (!projectId) return null;
  return getProjects().find((project) => project.id === projectId) || null;
}

export function canDeleteProject(projectId) {
  const project = getProjectById(projectId);
  return project ? !project.isLocked : false;
}

export function restoreDefaultProjects() {
  saveProjects(getDefaultProjects());
  return getProjects();
}

export function PROJECT_STATUS_OPTIONS() {
  return ["Draft", "Active", "Review", "Completed", "Archived"];
}
