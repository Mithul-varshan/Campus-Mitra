-- ==============================================================================
-- CampusMithra - TiDB Cloud / MySQL Database Schema & Seed Data
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS campusmithra;
USE campusmithra;

-- ------------------------------------------------------------------------------
-- 1. Departments Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    code VARCHAR(16) NOT NULL UNIQUE,
    hod_name VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. Students Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    department_id VARCHAR(32),
    year INT DEFAULT 1,
    section VARCHAR(8),
    roll_number VARCHAR(32) UNIQUE,
    github_username VARCHAR(64),
    leetcode_username VARCHAR(64),
    cgpa DECIMAL(3, 2) DEFAULT 0.00,
    status ENUM('Active', 'Alumni', 'Suspended') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department_id),
    INDEX idx_github (github_username),
    INDEX idx_leetcode (leetcode_username),
    CONSTRAINT fk_student_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. Faculty Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faculty (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    department_id VARCHAR(32),
    designation VARCHAR(64),
    specialization VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_faculty_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. Events Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(64) DEFAULT 'Hackathon',
    start_date DATETIME,
    end_date DATETIME,
    venue VARCHAR(128),
    organizer_id VARCHAR(64),
    status ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. Event Registrations & Winners Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_registrations (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL,
    student_id VARCHAR(64) NOT NULL,
    team_name VARCHAR(128),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE,
    winner_rank INT DEFAULT NULL,
    UNIQUE KEY uniq_event_student (event_id, student_id),
    CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
    CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. Certificates Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
    id VARCHAR(64) PRIMARY KEY,
    certificate_number VARCHAR(64) UNIQUE,
    event_id VARCHAR(64),
    student_id VARCHAR(64) NOT NULL,
    type ENUM('Winner', 'Participation', 'Appreciation', 'Merit') DEFAULT 'Participation',
    issued_date DATE,
    template_config JSON,
    verification_hash VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cert_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE,
    CONSTRAINT fk_cert_event FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. Student Projects Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    student_id VARCHAR(64) NOT NULL,
    repo_url VARCHAR(255),
    live_demo_url VARCHAR(255),
    tech_stack JSON,
    stars INT DEFAULT 0,
    forks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proj_student FOREIGN KEY (student_id) REFERENCES students (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. NAAC & Institutional Metrics Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS naac_metrics (
    id VARCHAR(32) PRIMARY KEY,
    criterion VARCHAR(16) NOT NULL,
    sub_criterion VARCHAR(32) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(16) NOT NULL,
    target_value DECIMAL(10, 2),
    achieved_value DECIMAL(10, 2),
    score DECIMAL(4, 2),
    documentation_status ENUM('Pending', 'Verified', 'Audited') DEFAULT 'Verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- Initial Seed Data
-- ==============================================================================

INSERT IGNORE INTO departments (id, name, code, hod_name) VALUES
('dept-cse', 'Computer Science and Engineering', 'CSE', 'Dr. Ramesh Sundaram'),
('dept-ece', 'Electronics and Communication Engineering', 'ECE', 'Dr. Priya Narayanan'),
('dept-it', 'Information Technology', 'IT', 'Dr. Anand Kumar'),
('dept-ai', 'Artificial Intelligence & Data Science', 'AI-DS', 'Dr. S. K. Venkatesh');

INSERT IGNORE INTO students (id, name, email, department_id, year, section, roll_number, github_username, leetcode_username, cgpa, status) VALUES
('stu-1', 'Arundhathidevi', 'arundhathi@campusmithra.edu', 'dept-cse', 3, 'A', '22CS101', 'Arundhathidevi', 'Arundhathi_D', 9.24, 'Active'),
('stu-2', 'Mithul Varshan', 'mithul@campusmithra.edu', 'dept-cse', 3, 'A', '22CS102', 'Mithul-varshan', 'mithul_v', 9.15, 'Active'),
('stu-3', 'Rohit Sharma', 'rohit.s@campusmithra.edu', 'dept-ai', 2, 'B', '23AI045', 'rohit-sharma-dev', 'rohit_code', 8.85, 'Active'),
('stu-4', 'Sneha Patel', 'sneha.p@campusmithra.edu', 'dept-ece', 4, 'A', '21EC089', 'snehapatel', 'sneha_p', 8.92, 'Active');

INSERT IGNORE INTO events (id, title, description, category, start_date, end_date, venue, status) VALUES
('evt-hack-2026', 'Smart Campus Hackathon 2026', 'Annual 36-hour flagship software engineering and IoT hackathon.', 'Hackathon', '2026-03-15 09:00:00', '2026-03-16 21:00:00', 'Tech Auditorium', 'Completed'),
('evt-code-clash', 'Campus CodeClash 2026', 'Inter-department algorithmic speedrun coding competition.', 'Coding Contest', '2026-04-10 14:00:00', '2026-04-10 18:00:00', 'Lab 4 & 5', 'Completed'),
('evt-ai-summit', 'GenAI Innovation Summit', 'Hands-on symposium and demo day for LLM application architectures.', 'Workshop', '2026-05-20 10:00:00', '2026-05-20 17:00:00', 'Main Seminar Hall', 'Upcoming');

INSERT IGNORE INTO naac_metrics (id, criterion, sub_criterion, metric_name, academic_year, target_value, achieved_value, score, documentation_status) VALUES
('naac-c1-1', 'Criterion 1', '1.1.2', 'Curriculum revision based on industry stakeholder feedback', '2025-26', 100.0, 96.5, 3.86, 'Audited'),
('naac-c2-2', 'Criterion 2', '2.3.1', 'Student-centric learning paradigms and experiential project labs', '2025-26', 95.0, 94.2, 3.77, 'Audited'),
('naac-c3-3', 'Criterion 3', '3.2.1', 'Research paper publications, grants, and innovation patents', '2025-26', 50.0, 58.0, 3.92, 'Audited'),
('naac-c5-1', 'Criterion 5', '5.1.3', 'Capability enhancement and competitive coding development', '2025-26', 80.0, 88.0, 3.80, 'Audited'),
('naac-c5-2', 'Criterion 5', '5.2.1', 'Placement percentage and median student package tiering', '2025-26', 85.0, 89.4, 3.88, 'Audited');
