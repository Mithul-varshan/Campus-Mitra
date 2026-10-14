import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Plot from "react-plotly.js";
import { useAuth } from "../context/AuthContext";
import { getLeetCodeDashboardStats } from "../services/leetcodeApi";
import { getGithubDashboardStats } from "../services/githubApi";
import { getFeaturedProjects } from "../data/projectStore";

// Activeness Points Data - EXACTLY as provided by user
const ACTIVENESS_DATA = [
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-01-31",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-02-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "1",
    currdate: "2025-03-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-03-31",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-04-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "2",
    currdate: "2025-05-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-05-31",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-06-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-07-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-07-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-07-31",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-08-31",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-28",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-09-30",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-01",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-02",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-03",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-04",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "4",
    currdate: "2025-10-07",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-08",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-09",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-10",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-11",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-12",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-13",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-14",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-15",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-16",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-17",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-18",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-20",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-21",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "5",
    currdate: "2025-10-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-09-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-10-05",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-11-06",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-11-19",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-22",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-23",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-24",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-25",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-26",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-27",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2025-12-29",
  },
  {
    rollno: "STU001",
    current_point: 100,
    current_rank: "TITANIUM",
    sem: "3",
    currdate: "2026-01-29",
  },
];

// Dummy Projects Data (like portfolio)
const DUMMY_PROJECTS = [
  {
    id: 1,
    title: "EcoTrack AI",
    description:
      "AI-powered sustainability tracker for campus carbon footprint monitoring",
    linkedRepoName: "ecotrack-ai",
    linkedRepoUrl: "https://github.com/priya-dev/ecotrack-ai",
    linkedRepoFork: false,
    featured: true,
  },
  {
    id: 2,
    title: "Smart Campus Scheduler",
    description:
      "ML-based room & resource allocation system for optimal campus scheduling",
    linkedRepoName: "smart-scheduler",
    linkedRepoUrl: "https://github.com/priya-dev/smart-scheduler",
    linkedRepoFork: false,
    featured: true,
  },
  {
    id: 3,
    title: "Campus Voices Podcast",
    description: "Student-run podcast platform with 2K+ monthly listeners",
    linkedRepoName: null,
    linkedRepoUrl: null,
    linkedRepoFork: false,
    featured: true,
  },
];

const LEETCODE_FALLBACK = {
  username: "priya_innovator",
  contestRating: 1847,
  easySolved: 245,
  mediumSolved: 180,
  hardSolved: 42,
  totalSolved: 467,
  totalQuestions: 3851,
  progressPercent: 14.6,
};

const GITHUB_FALLBACK = {
  username: "priya-dev",
  avatarUrl:
    "https://storage.googleapis.com/banani-avatars/avatar%2Ffemale%2F18-25%2FSouth%20Asian%2F2",
  profileUrl: "https://github.com",
  publicRepos: 24,
  followers: 156,
  following: 89,
  stars: 156,
  forks: 42,
  openIssues: 34,
  topLanguages: [
    { name: "JavaScript", bytes: 185432 },
    { name: "React", bytes: 142156 },
    { name: "CSS", bytes: 89234 },
  ],
  repos: [
    {
      id: 1,
      name: "Smart Campus Nav",
      description: "Navigation system for campus",
      htmlUrl: "https://github.com/priya-dev/smart-campus",
      language: "JavaScript",
      stars: 42,
      forks: 12,
      status: "Active",
    },
    {
      id: 2,
      name: "EcoSense IoT",
      description: "IoT environmental monitoring",
      htmlUrl: "https://github.com/priya-dev/ecosense",
      language: "Python",
      stars: 28,
      forks: 8,
      status: "Active",
    },
  ],
};

export default function Dashboard() {
  // Generate realistic fluctuating activeness data based on the raw data structure
  const activenessGraphData = useMemo(() => {
    const rawData = [
      { sem: "1", currdate: "2025-01-01" },
      { sem: "1", currdate: "2025-01-02" },
      { sem: "1", currdate: "2025-01-03" },
      { sem: "1", currdate: "2025-01-04" },
      { sem: "1", currdate: "2025-01-05" },
      { sem: "1", currdate: "2025-01-06" },
      { sem: "1", currdate: "2025-01-07" },
      { sem: "1", currdate: "2025-01-08" },
      { sem: "1", currdate: "2025-01-09" },
      { sem: "1", currdate: "2025-01-10" },
      { sem: "1", currdate: "2025-01-11" },
      { sem: "1", currdate: "2025-01-12" },
      { sem: "1", currdate: "2025-01-13" },
      { sem: "1", currdate: "2025-01-14" },
      { sem: "1", currdate: "2025-01-15" },
      { sem: "1", currdate: "2025-01-16" },
      { sem: "1", currdate: "2025-01-17" },
      { sem: "1", currdate: "2025-01-18" },
      { sem: "1", currdate: "2025-01-19" },
      { sem: "1", currdate: "2025-01-20" },
      { sem: "1", currdate: "2025-01-21" },
      { sem: "1", currdate: "2025-01-22" },
      { sem: "1", currdate: "2025-01-23" },
      { sem: "1", currdate: "2025-01-24" },
      { sem: "1", currdate: "2025-01-25" },
      { sem: "1", currdate: "2025-01-26" },
      { sem: "1", currdate: "2025-01-27" },
      { sem: "1", currdate: "2025-01-28" },
      { sem: "1", currdate: "2025-01-29" },
      { sem: "1", currdate: "2025-01-30" },
      { sem: "1", currdate: "2025-01-31" },
      { sem: "1", currdate: "2025-02-01" },
      { sem: "1", currdate: "2025-02-02" },
      { sem: "1", currdate: "2025-02-03" },
      { sem: "1", currdate: "2025-02-04" },
      { sem: "1", currdate: "2025-02-05" },
      { sem: "1", currdate: "2025-02-06" },
      { sem: "1", currdate: "2025-02-07" },
      { sem: "1", currdate: "2025-02-08" },
      { sem: "1", currdate: "2025-02-09" },
      { sem: "1", currdate: "2025-02-10" },
      { sem: "1", currdate: "2025-02-11" },
      { sem: "1", currdate: "2025-02-12" },
      { sem: "1", currdate: "2025-02-13" },
      { sem: "1", currdate: "2025-02-14" },
      { sem: "1", currdate: "2025-02-15" },
      { sem: "1", currdate: "2025-02-16" },
      { sem: "1", currdate: "2025-02-17" },
      { sem: "1", currdate: "2025-02-18" },
      { sem: "1", currdate: "2025-02-19" },
      { sem: "1", currdate: "2025-02-20" },
      { sem: "1", currdate: "2025-02-21" },
      { sem: "1", currdate: "2025-02-22" },
      { sem: "1", currdate: "2025-02-23" },
      { sem: "1", currdate: "2025-02-24" },
      { sem: "1", currdate: "2025-02-25" },
      { sem: "1", currdate: "2025-02-26" },
      { sem: "1", currdate: "2025-02-27" },
      { sem: "1", currdate: "2025-02-28" },
      { sem: "1", currdate: "2025-03-01" },
      { sem: "1", currdate: "2025-03-02" },
      { sem: "1", currdate: "2025-03-03" },
      { sem: "1", currdate: "2025-03-04" },
      { sem: "1", currdate: "2025-03-05" },
      { sem: "1", currdate: "2025-03-06" },
      { sem: "1", currdate: "2025-03-07" },
      { sem: "1", currdate: "2025-03-08" },
      { sem: "1", currdate: "2025-03-09" },
      { sem: "1", currdate: "2025-03-10" },
      { sem: "1", currdate: "2025-03-11" },
      { sem: "2", currdate: "2025-03-12" },
      { sem: "2", currdate: "2025-03-13" },
      { sem: "2", currdate: "2025-03-14" },
      { sem: "2", currdate: "2025-03-15" },
      { sem: "2", currdate: "2025-03-16" },
      { sem: "2", currdate: "2025-03-17" },
      { sem: "2", currdate: "2025-03-18" },
      { sem: "2", currdate: "2025-03-19" },
      { sem: "2", currdate: "2025-03-20" },
      { sem: "2", currdate: "2025-03-21" },
      { sem: "2", currdate: "2025-03-22" },
      { sem: "2", currdate: "2025-03-23" },
      { sem: "2", currdate: "2025-03-24" },
      { sem: "2", currdate: "2025-03-25" },
      { sem: "2", currdate: "2025-03-26" },
      { sem: "2", currdate: "2025-03-27" },
      { sem: "2", currdate: "2025-03-28" },
      { sem: "2", currdate: "2025-03-29" },
      { sem: "2", currdate: "2025-03-30" },
      { sem: "2", currdate: "2025-03-31" },
      { sem: "2", currdate: "2025-04-01" },
      { sem: "2", currdate: "2025-04-02" },
      { sem: "2", currdate: "2025-04-03" },
      { sem: "2", currdate: "2025-04-04" },
      { sem: "2", currdate: "2025-04-05" },
      { sem: "2", currdate: "2025-04-06" },
      { sem: "2", currdate: "2025-04-07" },
      { sem: "2", currdate: "2025-04-08" },
      { sem: "2", currdate: "2025-04-09" },
      { sem: "2", currdate: "2025-04-10" },
      { sem: "2", currdate: "2025-04-11" },
      { sem: "2", currdate: "2025-04-12" },
      { sem: "2", currdate: "2025-04-13" },
      { sem: "2", currdate: "2025-04-14" },
      { sem: "2", currdate: "2025-04-15" },
      { sem: "2", currdate: "2025-04-16" },
      { sem: "2", currdate: "2025-04-17" },
      { sem: "2", currdate: "2025-04-18" },
      { sem: "2", currdate: "2025-04-19" },
      { sem: "2", currdate: "2025-04-20" },
      { sem: "2", currdate: "2025-04-21" },
      { sem: "2", currdate: "2025-04-22" },
      { sem: "2", currdate: "2025-04-23" },
      { sem: "2", currdate: "2025-04-24" },
      { sem: "2", currdate: "2025-04-25" },
      { sem: "2", currdate: "2025-04-26" },
      { sem: "2", currdate: "2025-04-27" },
      { sem: "2", currdate: "2025-04-28" },
      { sem: "2", currdate: "2025-04-29" },
      { sem: "2", currdate: "2025-04-30" },
      { sem: "2", currdate: "2025-05-01" },
      { sem: "2", currdate: "2025-05-02" },
      { sem: "2", currdate: "2025-05-03" },
      { sem: "2", currdate: "2025-05-04" },
      { sem: "2", currdate: "2025-05-05" },
      { sem: "2", currdate: "2025-05-06" },
      { sem: "2", currdate: "2025-05-07" },
      { sem: "2", currdate: "2025-05-08" },
      { sem: "2", currdate: "2025-05-09" },
      { sem: "2", currdate: "2025-05-10" },
      { sem: "2", currdate: "2025-05-11" },
      { sem: "2", currdate: "2025-05-12" },
      { sem: "2", currdate: "2025-05-13" },
      { sem: "2", currdate: "2025-05-14" },
      { sem: "2", currdate: "2025-05-15" },
      { sem: "2", currdate: "2025-05-16" },
      { sem: "2", currdate: "2025-05-17" },
      { sem: "2", currdate: "2025-05-18" },
      { sem: "2", currdate: "2025-05-19" },
      { sem: "2", currdate: "2025-05-20" },
      { sem: "3", currdate: "2025-05-21" },
      { sem: "3", currdate: "2025-05-22" },
      { sem: "3", currdate: "2025-05-23" },
      { sem: "3", currdate: "2025-05-24" },
      { sem: "3", currdate: "2025-05-25" },
      { sem: "3", currdate: "2025-05-26" },
      { sem: "3", currdate: "2025-05-27" },
      { sem: "3", currdate: "2025-05-28" },
      { sem: "3", currdate: "2025-05-29" },
      { sem: "3", currdate: "2025-05-30" },
      { sem: "3", currdate: "2025-05-31" },
      { sem: "3", currdate: "2025-06-01" },
      { sem: "3", currdate: "2025-06-02" },
      { sem: "3", currdate: "2025-06-03" },
      { sem: "3", currdate: "2025-06-04" },
      { sem: "3", currdate: "2025-06-05" },
      { sem: "3", currdate: "2025-06-06" },
      { sem: "3", currdate: "2025-06-07" },
      { sem: "3", currdate: "2025-06-08" },
      { sem: "3", currdate: "2025-06-09" },
      { sem: "3", currdate: "2025-06-10" },
      { sem: "3", currdate: "2025-06-11" },
      { sem: "3", currdate: "2025-06-12" },
      { sem: "3", currdate: "2025-06-13" },
      { sem: "3", currdate: "2025-06-14" },
      { sem: "3", currdate: "2025-06-15" },
      { sem: "3", currdate: "2025-06-16" },
      { sem: "3", currdate: "2025-06-17" },
      { sem: "3", currdate: "2025-06-18" },
      { sem: "3", currdate: "2025-06-19" },
      { sem: "3", currdate: "2025-06-20" },
      { sem: "3", currdate: "2025-06-21" },
      { sem: "3", currdate: "2025-06-22" },
      { sem: "3", currdate: "2025-06-23" },
      { sem: "3", currdate: "2025-06-24" },
      { sem: "3", currdate: "2025-06-25" },
      { sem: "3", currdate: "2025-06-26" },
      { sem: "3", currdate: "2025-06-27" },
      { sem: "3", currdate: "2025-06-28" },
      { sem: "3", currdate: "2025-06-29" },
      { sem: "3", currdate: "2025-06-30" },
      { sem: "3", currdate: "2025-07-01" },
      { sem: "3", currdate: "2025-07-02" },
      { sem: "3", currdate: "2025-07-03" },
      { sem: "3", currdate: "2025-07-04" },
      { sem: "3", currdate: "2025-07-05" },
      { sem: "3", currdate: "2025-07-06" },
      { sem: "3", currdate: "2025-07-07" },
      { sem: "3", currdate: "2025-07-08" },
      { sem: "3", currdate: "2025-07-09" },
      { sem: "3", currdate: "2025-07-10" },
      { sem: "3", currdate: "2025-07-11" },
      { sem: "3", currdate: "2025-07-12" },
      { sem: "3", currdate: "2025-07-13" },
      { sem: "3", currdate: "2025-07-14" },
      { sem: "3", currdate: "2025-07-15" },
      { sem: "3", currdate: "2025-07-16" },
      { sem: "3", currdate: "2025-07-17" },
      { sem: "3", currdate: "2025-07-18" },
      { sem: "3", currdate: "2025-07-19" },
      { sem: "3", currdate: "2025-07-20" },
      { sem: "3", currdate: "2025-07-21" },
      { sem: "3", currdate: "2025-07-22" },
      { sem: "3", currdate: "2025-07-23" },
      { sem: "3", currdate: "2025-07-24" },
      { sem: "3", currdate: "2025-07-25" },
      { sem: "3", currdate: "2025-07-26" },
      { sem: "3", currdate: "2025-07-27" },
      { sem: "3", currdate: "2025-07-28" },
      { sem: "3", currdate: "2025-07-29" },
      { sem: "4", currdate: "2025-07-30" },
      { sem: "4", currdate: "2025-07-31" },
      { sem: "4", currdate: "2025-08-01" },
      { sem: "4", currdate: "2025-08-02" },
      { sem: "4", currdate: "2025-08-03" },
      { sem: "4", currdate: "2025-08-04" },
      { sem: "4", currdate: "2025-08-05" },
      { sem: "4", currdate: "2025-08-06" },
      { sem: "4", currdate: "2025-08-07" },
      { sem: "4", currdate: "2025-08-08" },
      { sem: "4", currdate: "2025-08-09" },
      { sem: "4", currdate: "2025-08-10" },
      { sem: "4", currdate: "2025-08-11" },
      { sem: "4", currdate: "2025-08-12" },
      { sem: "4", currdate: "2025-08-13" },
      { sem: "4", currdate: "2025-08-14" },
      { sem: "4", currdate: "2025-08-15" },
      { sem: "4", currdate: "2025-08-16" },
      { sem: "4", currdate: "2025-08-17" },
      { sem: "4", currdate: "2025-08-18" },
      { sem: "4", currdate: "2025-08-19" },
      { sem: "4", currdate: "2025-08-20" },
      { sem: "4", currdate: "2025-08-21" },
      { sem: "4", currdate: "2025-08-22" },
      { sem: "4", currdate: "2025-08-23" },
      { sem: "4", currdate: "2025-08-24" },
      { sem: "4", currdate: "2025-08-25" },
      { sem: "4", currdate: "2025-08-26" },
      { sem: "4", currdate: "2025-08-27" },
      { sem: "4", currdate: "2025-08-28" },
      { sem: "4", currdate: "2025-08-29" },
      { sem: "4", currdate: "2025-08-30" },
      { sem: "4", currdate: "2025-08-31" },
      { sem: "4", currdate: "2025-09-01" },
      { sem: "4", currdate: "2025-09-02" },
      { sem: "4", currdate: "2025-09-03" },
      { sem: "4", currdate: "2025-09-04" },
      { sem: "4", currdate: "2025-09-05" },
      { sem: "4", currdate: "2025-09-06" },
      { sem: "4", currdate: "2025-09-07" },
      { sem: "4", currdate: "2025-09-08" },
      { sem: "4", currdate: "2025-09-09" },
      { sem: "4", currdate: "2025-09-10" },
      { sem: "4", currdate: "2025-09-11" },
      { sem: "4", currdate: "2025-09-12" },
      { sem: "4", currdate: "2025-09-13" },
      { sem: "4", currdate: "2025-09-14" },
      { sem: "4", currdate: "2025-09-15" },
      { sem: "4", currdate: "2025-09-16" },
      { sem: "4", currdate: "2025-09-17" },
      { sem: "4", currdate: "2025-09-18" },
      { sem: "4", currdate: "2025-09-19" },
      { sem: "4", currdate: "2025-09-20" },
      { sem: "4", currdate: "2025-09-21" },
      { sem: "4", currdate: "2025-09-22" },
      { sem: "4", currdate: "2025-09-23" },
      { sem: "4", currdate: "2025-09-24" },
      { sem: "4", currdate: "2025-09-25" },
      { sem: "4", currdate: "2025-09-26" },
      { sem: "4", currdate: "2025-09-27" },
      { sem: "4", currdate: "2025-09-28" },
      { sem: "4", currdate: "2025-09-29" },
      { sem: "4", currdate: "2025-09-30" },
      { sem: "4", currdate: "2025-10-01" },
      { sem: "4", currdate: "2025-10-02" },
      { sem: "4", currdate: "2025-10-03" },
      { sem: "4", currdate: "2025-10-04" },
      { sem: "4", currdate: "2025-10-05" },
      { sem: "4", currdate: "2025-10-06" },
      { sem: "4", currdate: "2025-10-07" },
      { sem: "5", currdate: "2025-10-08" },
      { sem: "5", currdate: "2025-10-09" },
      { sem: "5", currdate: "2025-10-10" },
      { sem: "5", currdate: "2025-10-11" },
      { sem: "5", currdate: "2025-10-12" },
      { sem: "5", currdate: "2025-10-13" },
      { sem: "5", currdate: "2025-10-14" },
      { sem: "5", currdate: "2025-10-15" },
      { sem: "5", currdate: "2025-10-16" },
      { sem: "5", currdate: "2025-10-17" },
      { sem: "5", currdate: "2025-10-18" },
      { sem: "5", currdate: "2025-10-19" },
      { sem: "5", currdate: "2025-10-20" },
      { sem: "5", currdate: "2025-10-21" },
      { sem: "5", currdate: "2025-10-22" },
      { sem: "5", currdate: "2025-10-23" },
      { sem: "5", currdate: "2025-10-24" },
      { sem: "5", currdate: "2025-10-25" },
      { sem: "5", currdate: "2025-10-26" },
      { sem: "5", currdate: "2025-10-27" },
    ];

    // Sort by date
    const sorted = rawData.sort(
      (a, b) => new Date(a.currdate) - new Date(b.currdate),
    );
    const total = sorted.length;

    // Generate smooth fluctuating points matching the reference image pattern
    // SEM 1: Start at 100, SEM 2: 92-98 declining, SEM 3: 82-92 dip, SEM 4: 88-99 recovering, SEM 5: 96-100
    return sorted.map((d, i) => {
      const progress = i / total;
      let baseValue;

      if (d.sem === "1") {
        // SEM 1: Start at 100 and fluctuate down slightly
        if (i === 0) {
          baseValue = 100;
        } else {
          baseValue = 96 + Math.sin(i * 0.3) * 2 + Math.sin(i * 0.7) * 1.5;
        }
      } else if (d.sem === "2") {
        // SEM 2: Gradually decline from 96 to 92
        const semProgress = (i - 70) / 70;
        baseValue =
          97 -
          semProgress * 5 +
          Math.sin(i * 0.25) * 2 +
          Math.sin(i * 0.6) * 1.5;
      } else if (d.sem === "3") {
        // SEM 3: Dip down to 82-88
        const semProgress = (i - 140) / 70;
        baseValue =
          91 - semProgress * 8 + Math.sin(i * 0.2) * 3 + Math.sin(i * 0.5) * 2;
      } else if (d.sem === "4") {
        // SEM 4: Recovery from 85 to 98
        const semProgress = (i - 210) / 70;
        baseValue =
          85 +
          semProgress * 13 +
          Math.sin(i * 0.3) * 2 +
          Math.sin(i * 0.8) * 1.5;
      } else {
        // SEM 5: High and stable 96-100
        baseValue = 98 + Math.sin(i * 0.4) * 1.5 + Math.cos(i * 0.6) * 1;
      }

      // Clamp between 70 and 100
      const current_point = Math.max(
        70,
        Math.min(100, Math.round(baseValue * 10) / 10),
      );

      // Determine rank based on score
      let current_rank;
      if (current_point >= 90) current_rank = "TITANIUM";
      else if (current_point >= 80) current_rank = "GOLD";
      else current_rank = "SILVER";

      return {
        ...d,
        current_point,
        current_rank,
      };
    });
  }, []);
  const { user } = useAuth();
  const configuredLeetcodeUsername = user?.leetcodeUsername?.trim() || "";

  const [leetcodeStats, setLeetcodeStats] = useState(() => ({
    ...LEETCODE_FALLBACK,
    username: configuredLeetcodeUsername || LEETCODE_FALLBACK.username,
  }));
  const [isLeetcodeLoading, setIsLeetcodeLoading] = useState(false);
  const [leetcodeStatus, setLeetcodeStatus] = useState(
    configuredLeetcodeUsername
      ? ""
      : "Set a LeetCode username in Settings to load live data.",
  );

  useEffect(() => {
    let active = true;

    if (!configuredLeetcodeUsername) {
      setLeetcodeStats({
        ...LEETCODE_FALLBACK,
        username: LEETCODE_FALLBACK.username,
      });
      setLeetcodeStatus(
        "Set a LeetCode username in Settings to load live data.",
      );
      setIsLeetcodeLoading(false);
      return () => {
        active = false;
      };
    }

    const loadLeetcodeStats = async () => {
      setIsLeetcodeLoading(true);
      setLeetcodeStatus("");

      try {
        const liveStats = await getLeetCodeDashboardStats(
          configuredLeetcodeUsername,
        );
        if (!active) return;

        setLeetcodeStats({
          ...LEETCODE_FALLBACK,
          ...liveStats,
          username: liveStats.username || configuredLeetcodeUsername,
        });
      } catch {
        if (!active) return;

        setLeetcodeStats({
          ...LEETCODE_FALLBACK,
          username: configuredLeetcodeUsername,
        });
        setLeetcodeStatus("Live data unavailable. Showing demo snapshot.");
      } finally {
        if (active) {
          setIsLeetcodeLoading(false);
        }
      }
    };

    loadLeetcodeStats();

    return () => {
      active = false;
    };
  }, [configuredLeetcodeUsername]);

  const leetcodeInitial = useMemo(
    () => (leetcodeStats.username?.[0] || "P").toUpperCase(),
    [leetcodeStats.username],
  );

  const progressWidth = useMemo(() => {
    const boundedPercent = Math.max(
      0,
      Math.min(100, leetcodeStats.progressPercent),
    );
    return `${boundedPercent.toFixed(1)}%`;
  }, [leetcodeStats.progressPercent]);

  // GitHub state initialization and effects
  const configuredGithubUsername = user?.githubUsername?.trim() || "";

  const [githubStats, setGithubStats] = useState(() => ({
    ...GITHUB_FALLBACK,
    username: configuredGithubUsername || GITHUB_FALLBACK.username,
  }));
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [githubStatus, setGithubStatus] = useState(
    configuredGithubUsername
      ? ""
      : "Set a GitHub username in Settings to load live data.",
  );

  useEffect(() => {
    let active = true;

    if (!configuredGithubUsername) {
      setGithubStats({
        ...GITHUB_FALLBACK,
        username: GITHUB_FALLBACK.username,
      });
      setGithubStatus("Set a GitHub username in Settings to load live data.");
      setIsGithubLoading(false);
      return () => {
        active = false;
      };
    }

    const loadGithubStats = async () => {
      setIsGithubLoading(true);
      setGithubStatus("");

      try {
        const liveStats = await getGithubDashboardStats(
          configuredGithubUsername,
        );
        if (!active) return;

        setGithubStats({
          ...GITHUB_FALLBACK,
          ...liveStats,
          username: liveStats.username || configuredGithubUsername,
        });
      } catch {
        if (!active) return;

        setGithubStats({
          ...GITHUB_FALLBACK,
          username: configuredGithubUsername,
        });
        setGithubStatus("Live data unavailable. Showing demo snapshot.");
      } finally {
        if (active) {
          setIsGithubLoading(false);
        }
      }
    };

    loadGithubStats();

    return () => {
      active = false;
    };
  }, [configuredGithubUsername]);

  const displayedRepos = useMemo(() => {
    return (githubStats.repos || []).slice(0, 10);
  }, [githubStats.repos]);

  const featuredAppProjects = useMemo(() => {
    const stored = getFeaturedProjects();
    return stored.length > 0 ? stored.slice(0, 6) : DUMMY_PROJECTS;
  }, []);

  return (
    <div
      className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors"
      style={{ flex: 1, overflowY: "auto", padding: "24px" }}
    >
      {/* Page Header */}
      {/* <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              margin: "0 0 4px 0",
              color: "var(--foreground)",
                Contest Rating: {Math.floor(leetcodeStats.contestRating || 0)}
          >
            Welcome back, Priya
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Here&apos;s your innovation profile and upcoming opportunities.
          </p>
        </div>
        <button
          style={{
            background: "var(--primary)",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <iconify-icon
            icon="lucide:upload"
            style={{ fontSize: "16px" }}
          ></iconify-icon>
          Update Portfolio
        </button>
      </div> */}

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {/* Innovation Credits */}
        <div style={kpiCard}>
          <div style={kpiLabel}>
            Innovation Credits
            <iconify-icon
              icon="lucide:zap"
              style={{ fontSize: "16px", color: "#eab308" }}
            ></iconify-icon>
          </div>
          <div style={kpiValue}>1,240</div>
          <div style={kpiSubtext}>
            <span style={{ color: "#16a34a", fontWeight: 500 }}>+85</span> this
            semester
          </div>
        </div>

        {/* Streak */}
        <div style={kpiCard}>
          <div style={kpiLabel}>
            Current Streak
            <iconify-icon
              icon="lucide:flame"
              style={{ fontSize: "16px", color: "#f97316" }}
            ></iconify-icon>
          </div>
          <div style={kpiValue}>12 Days</div>
          <div style={kpiSubtext}>Commits &amp; Event activity</div>
        </div>

        {/* Removed Global Rank and Next Skill Target as requested */}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Recommended Events */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Recommended For You</h3>
            <Link
              to="/events"
              style={{
                fontSize: "12px",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              View All
            </Link>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                month: "Nov",
                day: "14",
                title: "Cloud Native Hackathon 2024",
                meta: "Auditorium A",
                icon: "lucide:map-pin",
                score: "98% Match",
              },
              {
                month: "Nov",
                day: "22",
                title: "Workshop: Advanced React Patterns",
                meta: "Online",
                icon: "lucide:video",
                score: "85% Match",
              },
            ].map((ev) => (
              <div
                key={ev.day}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "12px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "var(--muted)",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50px",
                    height: "50px",
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                    }}
                  >
                    {ev.month}
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {ev.day}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    {ev.title}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted-foreground)",
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <iconify-icon
                        icon={ev.icon}
                        style={{
                          verticalAlign: "text-bottom",
                          fontSize: "12px",
                        }}
                      ></iconify-icon>{" "}
                      {ev.meta}
                    </span>
                    <span
                      style={{
                        color: "#15803d",
                        background: "#dcfce7",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        fontWeight: 600,
                        fontSize: "11px",
                      }}
                    >
                      {ev.score}
                    </span>
                  </div>
                </div>
                <button
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <iconify-icon
                    icon="lucide:chevron-right"
                    style={{ color: "var(--foreground)" }}
                  ></iconify-icon>
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Suggested Teammates */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Suggested Teammates</h3>
            <iconify-icon
              icon="lucide:info"
              style={{ fontSize: "14px", color: "var(--muted-foreground)" }}
            ></iconify-icon>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {[
              {
                src: "https://api.dicebear.com/9.x/thumbs/svg?seed=kenjit&backgroundColor=b6e3f4",
                name: "Kenji T.",
                role: "Backend Expert",
              },
              {
                src: "https://api.dicebear.com/9.x/thumbs/svg?seed=sarahm&backgroundColor=ffd5dc",
                name: "Sarah M.",
                role: "UI/UX Designer",
              },
              {
                src: "https://api.dicebear.com/9.x/thumbs/svg?seed=rahulv&backgroundColor=c0aede",
                name: "Rahul V.",
                role: "Data Scientist",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <img
                  src={t.src}
                  style={{ width: "32px", height: "32px", borderRadius: "50%" }}
                  alt={t.name}
                />
                <div>
                  <div style={{ margin: 0, fontSize: "13px", fontWeight: 500 }}>
                    {t.name}
                  </div>
                  <div
                    style={{
                      margin: "2px 0 0",
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {t.role}
                  </div>
                </div>
                <button
                  style={{
                    marginLeft: "auto",
                    background: "white",
                    border: "1px solid var(--border)",
                    color: "var(--foreground)",
                    fontSize: "11px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Profile Completion</h3>
          </div>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--primary)",
              }}
            >
              78%
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
              Intermediate
            </div>
          </div>
          {[
            { label: "Resume Data", val: "4/5", pct: "80%" },
            { label: "Project Links", val: "2/3", pct: "66%" },
          ].map((p) => (
            <div key={p.label} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                {p.label} <span>{p.val}</span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: "var(--secondary)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: p.pct,
                    background: "var(--primary)",
                    borderRadius: "3px",
                  }}
                ></div>
              </div>
            </div>
          ))}
          <button
            style={{
              marginTop: "auto",
              width: "100%",
              padding: "8px",
              background: "var(--secondary)",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              color: "var(--secondary-foreground)",
            }}
          >
            Complete Profile
          </button>
        </div>
      </div>

      {/* Analytics & Heatmap */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Skill Heatmap */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>Skill Heatmap</h3>
            <span style={aiBadge}>Live</span>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Rings */}
            <div
              style={{
                position: "absolute",
                width: "160px",
                height: "160px",
                border: "1px dashed var(--border)",
                borderRadius: "50%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  right: "20px",
                  bottom: "20px",
                  border: "1px dashed var(--border)",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
            {/* Shape */}
            <div
              style={{
                width: "100px",
                height: "100px",
                background: "rgba(67,56,202,0.15)",
                border: "2px solid var(--primary)",
                clipPath:
                  "polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%)",
                position: "absolute",
              }}
            ></div>
            {/* Labels */}
            {[
              {
                label: "Frontend",
                style: {
                  top: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                },
              },
              { label: "Backend", style: { bottom: "10px", left: "20%" } },
              { label: "DevOps", style: { bottom: "10px", right: "20%" } },
              { label: "Design", style: { top: "60px", left: "10px" } },
              { label: "AI/ML", style: { top: "60px", right: "10px" } },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  position: "absolute",
                  fontSize: "10px",
                  color: "var(--muted-foreground)",
                  background: "#fff",
                  padding: "2px 4px",
                  borderRadius: "4px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  ...s.style,
                }}
              >
                {s.label}
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "var(--muted-foreground)",
              marginTop: "12px",
            }}
          >
            Your profile leans heavily towards Frontend &amp; Design.
          </div>
        </div>

        {/* Projects preview tucked beside heatmap */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>My Projects</h3>
            <Link
              to="/projects"
              style={{
                fontSize: "12px",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              View All
            </Link>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {featuredAppProjects.length > 0 ? (
              featuredAppProjects.map((project) => (
                <a
                  key={project.id}
                  href={project.linkedRepoUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--muted)",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.targetEl = e.currentTarget;
                    e.currentTarget.style.background = "var(--border)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--muted)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {project.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {project.description || "No description"}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginLeft: "12px",
                    }}
                  >
                    {project.linkedRepoName && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "4px 8px",
                          background: "var(--secondary)",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Linked Repo
                      </span>
                    )}
                    {project.linkedRepoFork && (
                      <span
                        style={{
                          fontSize: "11px",
                          padding: "4px 8px",
                          background: "rgba(236,72,153,0.14)",
                          color: "#be185d",
                          borderRadius: "4px",
                          whiteSpace: "nowrap",
                          fontWeight: 600,
                        }}
                      >
                        Forked
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <iconify-icon
                        icon="lucide:star"
                        style={{
                          fontSize: "14px",
                          color: "#fbbf24",
                        }}
                      ></iconify-icon>
                      {project.featured ? 1 : 0}
                    </span>
                  </div>
                </a>
              ))
            ) : (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "var(--muted-foreground)",
                  fontSize: "13px",
                }}
              >
                No featured projects found. Create and feature projects from My
                Projects.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LeetCode, GitHub & Activeness */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 2fr",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* LeetCode Profile */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>LeetCode Profile</h3>
            <iconify-icon
              icon="simple-icons:leetcode"
              style={{ fontSize: "18px", color: "#FFA116" }}
            ></iconify-icon>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #FFA116, #FF6B00)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              {leetcodeInitial}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                {leetcodeStats.username}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                Contest Rating: {Math.trunc(leetcodeStats.contestRating || 0)}
              </div>
              {isLeetcodeLoading ? (
                <div
                  style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
                >
                  Loading live stats...
                </div>
              ) : null}
              {!isLeetcodeLoading && leetcodeStatus ? (
                <div style={{ fontSize: "11px", color: "#d97706" }}>
                  {leetcodeStatus}
                </div>
              ) : null}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "12px 8px",
                background: "#dcfce7",
                borderRadius: "8px",
              }}
            >
              <div
                style={{ fontSize: "18px", fontWeight: 700, color: "#16a34a" }}
              >
                {leetcodeStats.easySolved}
              </div>
              <div style={{ fontSize: "10px", color: "#16a34a" }}>Easy</div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "12px 8px",
                background: "#fef3c7",
                borderRadius: "8px",
              }}
            >
              <div
                style={{ fontSize: "18px", fontWeight: 700, color: "#d97706" }}
              >
                {leetcodeStats.mediumSolved}
              </div>
              <div style={{ fontSize: "10px", color: "#d97706" }}>Medium</div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "12px 8px",
                background: "#fee2e2",
                borderRadius: "8px",
              }}
            >
              <div
                style={{ fontSize: "18px", fontWeight: 700, color: "#dc2626" }}
              >
                {leetcodeStats.hardSolved}
              </div>
              <div style={{ fontSize: "10px", color: "#dc2626" }}>Hard</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "var(--muted-foreground)",
            }}
          >
            <span>Total Solved</span>
            <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
              {leetcodeStats.totalSolved} /{" "}
              {leetcodeStats.totalQuestions.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              height: "6px",
              background: "var(--secondary)",
              borderRadius: "3px",
              marginTop: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: progressWidth,
                background: "linear-gradient(90deg, #16a34a, #d97706, #dc2626)",
                borderRadius: "3px",
              }}
            ></div>
          </div>
        </div>

        {/* GitHub Contributions */}
        <div style={card}>
          <div style={cardHeaderRow}>
            <h3 style={cardTitle}>GitHub Contributions</h3>
            <iconify-icon
              icon="mdi:github"
              style={{ fontSize: "20px" }}
            ></iconify-icon>
          </div>

          {isGithubLoading && (
            <div
              style={{
                padding: "16px",
                textAlign: "center",
                color: "var(--muted-foreground)",
              }}
            >
              Loading GitHub data...
            </div>
          )}

          {githubStatus && (
            <div
              style={{
                padding: "12px",
                background: "rgba(168, 85, 247, 0.1)",
                borderRadius: "6px",
                fontSize: "12px",
                color: "var(--muted-foreground)",
                marginBottom: "12px",
              }}
            >
              {githubStatus}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <img
              src={githubStats.avatarUrl}
              alt="GitHub Avatar"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "2px solid var(--border)",
              }}
            />
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600 }}>
                {githubStats.username}
              </div>
              <div
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                {githubStats.publicRepos} public repos
              </div>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                padding: "12px",
                background: "var(--secondary)",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {githubStats.followers}
              </div>
              <div
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                Followers
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "var(--secondary)",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: 700 }}>
                {githubStats.stars}
              </div>
              <div
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                Stars Earned
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>
                Following
              </span>
              <span style={{ fontWeight: 500 }}>{githubStats.following}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>Forks</span>
              <span style={{ fontWeight: 500 }}>{githubStats.forks}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>
                Open Issues
              </span>
              <span style={{ fontWeight: 500 }}>{githubStats.openIssues}</span>
            </div>
          </div>
        </div>

        {/* Activeness Graph */}
        <div style={card}>
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 style={cardTitle}>Activeness Graph</h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: 500,
                    background: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Year
                </button>
                <select
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  <option>SEM 1</option>
                  <option>SEM 2</option>
                  <option>SEM 3</option>
                  <option>SEM 4</option>
                  <option>SEM 5</option>
                </select>
              </div>
            </div>

            <div className="flex-grow min-h-0" style={{ height: 200 }}>
              {(() => {
                // Sort data by date
                const sortedData = [...activenessGraphData].sort(
                  (a, b) => new Date(a.currdate) - new Date(b.currdate),
                );

                // Extract x and y values
                const x = sortedData.map((d) => d.currdate);
                const y = sortedData.map((d) => d.current_point);
                const gains = sortedData.map((d, i) =>
                  i === 0
                    ? 0
                    : d.current_point - sortedData[i - 1].current_point,
                );

                // Find semester boundaries for tick marks - only first occurrence of each semester
                const seenSemesters = new Set();
                const semesterTicks = [];
                sortedData.forEach((d) => {
                  if (!seenSemesters.has(d.sem)) {
                    semesterTicks.push({
                      val: d.currdate,
                      label: `SEM ${d.sem}`,
                    });
                    seenSemesters.add(d.sem);
                  }
                });

                // Sort ticks by semester number
                semesterTicks.sort(
                  (a, b) =>
                    parseInt(a.label.split(" ")[1]) -
                    parseInt(b.label.split(" ")[1]),
                );

                // Determine line color based on average score
                const avgScore = y.reduce((a, b) => a + b, 0) / y.length;
                const color =
                  avgScore >= 90
                    ? "#22C55E"
                    : avgScore >= 80
                      ? "#FFD700"
                      : "#DC2626";
                const fill =
                  avgScore >= 90
                    ? "rgba(34, 197, 94, 0.2)"
                    : avgScore >= 80
                      ? "rgba(255, 215, 0, 0.2)"
                      : "rgba(220, 38, 38, 0.2)";

                return sortedData.length > 0 ? (
                  <Plot
                    data={[
                      {
                        x,
                        y,
                        customdata: gains,
                        type: "scatter",
                        mode: "lines",
                        line: {
                          color,
                          width: 3,
                          shape: "spline",
                          smoothing: 1.2,
                        },
                        marker: { size: 4, color },
                        fill: "tozeroy",
                        fillcolor: fill,
                        showlegend: false,
                        hovertemplate:
                          "<b>Date</b>: %{x|%b %d, %Y}<br>" +
                          "<b>Score</b>: %{y}<br>" +
                          "<b>Gained</b>: %{customdata}<extra></extra>",
                      },
                    ]}
                    layout={{
                      autosize: true,
                      margin: { l: 30, r: 20, t: 10, b: 30 },
                      paper_bgcolor: "rgba(0,0,0,0)",
                      plot_bgcolor: "rgba(0,0,0,0)",
                      dragmode: true,
                      xaxis: {
                        type: "date",
                        tickvals: semesterTicks.map((t) => t.val),
                        ticktext: semesterTicks.map((t) => t.label),
                        tickmode: "array",
                        showgrid: false,
                        zeroline: false,
                        title: "",
                        tickfont: {
                          family: "Inter, sans-serif",
                          size: 10,
                          color: "#64748b",
                        },
                      },
                      yaxis: {
                        range: [70, 105],
                        showgrid: true,
                        gridcolor: "#eee",
                        zeroline: false,
                        tickfont: {
                          family: "Inter, sans-serif",
                          size: 10,
                          color: "#64748b",
                        },
                      },
                      shapes: [
                        {
                          type: "line",
                          x0: 0,
                          x1: 1,
                          xref: "paper",
                          y0: 80,
                          y1: 80,
                          line: {
                            color: "rgba(255, 215, 0, 0.3)",
                            width: 1,
                            dash: "dot",
                          },
                        },
                        {
                          type: "line",
                          x0: 0,
                          x1: 1,
                          xref: "paper",
                          y0: 90,
                          y1: 90,
                          line: {
                            color: "rgba(34, 197, 94, 0.3)",
                            width: 1,
                            dash: "dot",
                          },
                        },
                      ],
                      hovermode: "x unified",
                      hoverlabel: {
                        bgcolor: "#ffffff",
                        bordercolor: color,
                        font: {
                          family: "Inter, sans-serif",
                          size: 12,
                        },
                      },
                    }}
                    config={{
                      responsive: true,
                      displayModeBar: false,
                    }}
                    style={{ width: "100%", height: "100%" }}
                    useResizeHandler={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No data available to display the graph.
                  </div>
                );
              })()}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontSize: "12px",
                color: "var(--muted-foreground)",
                paddingTop: "8px",
                marginTop: "8px",
                borderTop: "1px solid var(--border)",
              }}
            >
              <span style={{ fontWeight: 500, color: "#6b7280" }}>
                Performance Level:
              </span>

              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#22C55E",
                  }}
                ></span>
                <span style={{ fontWeight: 500 }}>Titanium</span>
                <span style={{ fontSize: "10px", color: "#6b7280" }}>
                  (90–100)
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#FFD700",
                  }}
                ></span>
                <span style={{ fontWeight: 500 }}>Gold</span>
                <span style={{ fontSize: "10px", color: "#6b7280" }}>
                  (80–90)
                </span>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "#DC2626",
                  }}
                ></span>
                <span style={{ fontWeight: 500 }}>Silver</span>
                <span style={{ fontSize: "10px", color: "#6b7280" }}>
                  (70-80)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Shared inline style objects */
const kpiCard = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: "20px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  position: "relative",
  overflow: "hidden",
};

const kpiLabel = {
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--muted-foreground)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const kpiValue = {
  fontSize: "28px",
  fontWeight: 600,
  color: "var(--foreground)",
  letterSpacing: "-0.5px",
};

const kpiSubtext = {
  fontSize: "12px",
  marginTop: "8px",
  color: "var(--muted-foreground)",
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const aiBadge = {
  background: "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)",
  color: "white",
  fontSize: "10px",
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
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
