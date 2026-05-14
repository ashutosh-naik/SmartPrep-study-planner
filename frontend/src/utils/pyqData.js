// ─── SmartPrep PYQ Static Data ────────────────────────────────────────────
// Universities: SPPU, MU, RTMNU
// Courses: MCA (4 sems), MBA (4 sems), B.E. (8 sems), M.Tech (4 sems)
// Papers: real subject names, years 2019–2024, official portal links
// ──────────────────────────────────────────────────────────────────────────

export const UNIVERSITIES = [
  {
    id: "sppu",
    name: "SPPU – Savitribai Phule Pune University",
    shortName: "SPPU",
    website: "https://unipune.ac.in/",
    paperPortal: "https://unipune.ac.in/",
    location: "Pune, Maharashtra",
    color: "#7C3AED",
  },
  {
    id: "mu",
    name: "MU – University of Mumbai",
    shortName: "MU",
    website: "https://mu.ac.in/",
    paperPortal: "https://mu.ac.in/",
    location: "Mumbai, Maharashtra",
    color: "#0284C7",
  },
];

export const COURSES = {
  MCA: { semesters: 4, fullName: "Master of Computer Applications" },
  MBA: { semesters: 4, fullName: "Master of Business Administration" },
};

// ─── SPPU MCA Papers (New Syllabus 2021-22) ───────────────────────────────
const SPPU_MCA = {
  1: [
    { subject: "Computer Organization & Architecture",        code: "MCA-101" },
    { subject: "Mathematical Foundations for CS",             code: "MCA-102" },
    { subject: "Programming Concepts using Python",           code: "MCA-103" },
    { subject: "Data Structures using C",                     code: "MCA-104" },
    { subject: "Communicative English & Soft Skills",         code: "MCA-105" },
  ],
  2: [
    { subject: "Advanced Data Structures & File Processing",  code: "MCA-201" },
    { subject: "Object Oriented Programming using Java",      code: "MCA-202" },
    { subject: "Database Management System",                  code: "MCA-203" },
    { subject: "Operating Systems",                           code: "MCA-204" },
    { subject: "Software Engineering",                        code: "MCA-205" },
  ],
  3: [
    { subject: "Design & Analysis of Algorithms",             code: "MCA-301" },
    { subject: "Advanced Java & Frameworks",                  code: "MCA-302" },
    { subject: "Web Technology & Development",                code: "MCA-303" },
    { subject: "Machine Learning Fundamentals",               code: "MCA-304" },
    { subject: "Software Project Management",                 code: "MCA-305" },
  ],
  4: [
    { subject: "Cloud Computing & DevOps",                    code: "MCA-401" },
    { subject: "Cyber Security & Digital Forensics",          code: "MCA-402" },
    { subject: "Advanced Database Systems (NoSQL)",           code: "MCA-403" },
    { subject: "Artificial Intelligence",                     code: "MCA-404" },
  ],
};

// ─── SPPU MBA Papers (CBCS 2019) ──────────────────────────────────────────
const SPPU_MBA = {
  1: [
    { subject: "BUSINESS ANALYTICS",                          code: "MBA-101" },
    { subject: "BUSINESS COMMUNICATION-I",                    code: "MBA-102" },
    { subject: "BASICS OF MARKETING",                         code: "MBA-103" },
    { subject: "DECISION SCIENCE",                            code: "MBA-104" },
    { subject: "ECONOMIC ANALYSIS FOR BUSINESS DECISIONS",    code: "MBA-105" },
    { subject: "INDIAN KNOWLEDGE SYSTEMS",                    code: "MBA-106" },
    { subject: "MANAGERIAL ACCOUNTING",                       code: "MBA-107" },
    { subject: "MANAGEMENT FUNDAMENTALS",                     code: "MBA-108" },
    { subject: "ORGANIZATIONAL BEHAVIOUR",                    code: "MBA-109" },
    { subject: "TECHNOLOGY TOOLS IN BUSINESS MANAGEMENT -I",  code: "MBA-110" },
    { subject: "HUMAN RIGHTS - I",                            code: "MBA-111" },
    { subject: "INFORMATION SECURITY",                        code: "MBA-112" },
  ],
  2: [
    { subject: "BUSINESS COMMUNICATION-II",                   code: "MBA-201" },
    { subject: "BRM",                                         code: "MBA-202" },
    { subject: "DESK RESEARCH",                               code: "MBA-203" },
    { subject: "FINANCIAL MANAGEMENT",                        code: "MBA-204" },
    { subject: "FIELD PROJECT",                               code: "MBA-205" },
    { subject: "HUMAN RESOURCES MANAGEMENT",                  code: "MBA-206" },
    { subject: "LEGAL ASPECTS OF BUSINESS",                   code: "MBA-207" },
    { subject: "MARKETING MANAGEMENT",                        code: "MBA-208" },
    { subject: "OPERATIONS & SUPPLY CHAIN MANAGEMENT",        code: "MBA-209" },
    { subject: "TECHNOLOGY TOOLS IN BUSINESS MANAGEMENT -II", code: "MBA-210" },
    { subject: "HUMAN RIGHTS - II",                           code: "MBA-211" },
    { subject: "INFORMATION SECURITY",                        code: "MBA-212" },
  ],
  3: [
    { subject: "STRATEGIC HUMAN RESOURCE MANAGEMENT",         code: "MBA-301" },
    { subject: "COMPETENCY BASED HRM",                        code: "MBA-302" },
    { subject: "HR ANALYTICS",                                code: "MBA-303" },
    { subject: "ORGANIZATION DIAGNOSIS AND DEVELOPMENT",      code: "MBA-304" },
    { subject: "HR OPERATIONS",                               code: "MBA-305" },
    { subject: "ON THE JOB TRAINING",                         code: "MBA-306" },
    { subject: "STRATEGIC MANAGEMENT",                        code: "MBA-307" },
    { subject: "SKILL DEVELOPMENT - I",                       code: "MBA-308" },
    { subject: "INTRODUCTION TO CONSTITUTION",                code: "MBA-309" },
  ],
  4: [
    { subject: "INFORMATION SECURITY",                        code: "MBA-401" },
    { subject: "SKILL DEVELOPMENT - II",                      code: "MBA-402" },
    { subject: "ENTREPRENEURSHIP, INNOVATION AND DESIGN THINKING", code: "MBA-403" },
    { subject: "ENTERPRISE PERFORMANCE MANAGEMENT",           code: "MBA-404" },
    { subject: "EMPLOYEE RELATIONS & LABOUR LEGISLATION",     code: "MBA-405" },
    { subject: "EMPLOYEE ENGAGEMENT",                         code: "MBA-406" },
    { subject: "DESIGNING HR POLICIES",                       code: "MBA-407" },
    { subject: "PERFORMANCE MANAGEMENT SYSTEM",               code: "MBA-408" },
    { subject: "LABOUR WELFARE",                              code: "MBA-409" },
    { subject: "RESEARCH PROJECT",                            code: "MBA-410" },
  ],
};

// ─── MU MCA Papers (New 2021 Pattern) ────────────────────────────────────
const MU_MCA = {
  1: [
    { subject: "Problem Solving Using C",                     code: "MUMCA-11" },
    { subject: "Digital Electronics & Logic Design",          code: "MUMCA-12" },
    { subject: "Discrete Mathematics",                        code: "MUMCA-13" },
    { subject: "Principles of Communication",                 code: "MUMCA-14" },
    { subject: "Statistical Methods for CS",                  code: "MUMCA-15" },
  ],
  2: [
    { subject: "Data Structures & Algorithms",                code: "MUMCA-21" },
    { subject: "Object Oriented Programming Java",            code: "MUMCA-22" },
    { subject: "Operating Systems",                           code: "MUMCA-23" },
    { subject: "Computer Networks",                           code: "MUMCA-24" },
    { subject: "Software Engineering & Project Mgmt",         code: "MUMCA-25" },
  ],
  3: [
    { subject: "Big Data Analytics",                          code: "MUMCA-31" },
    { subject: "Machine Learning",                            code: "MUMCA-32" },
    { subject: "Cloud Computing",                             code: "MUMCA-33" },
    { subject: "Blockchain Technology",                       code: "MUMCA-34" },
    { subject: "Cyber Security",                              code: "MUMCA-35" },
  ],
  4: [
    { subject: "Deep Learning",                               code: "MUMCA-41" },
    { subject: "Internet of Things",                          code: "MUMCA-42" },
    { subject: "Natural Language Processing",                 code: "MUMCA-43" },
    { subject: "DevOps",                                      code: "MUMCA-44" },
  ],
};

// ─── MU MBA Papers ────────────────────────────────────────────────────────
const MU_MBA = {
  1: [
    { subject: "Perspective Management",                      code: "MUMBA-11" },
    { subject: "Financial Accounting",                        code: "MUMBA-12" },
    { subject: "Business Statistics",                         code: "MUMBA-13" },
    { subject: "Operations Management",                       code: "MUMBA-14" },
    { subject: "Marketing Management",                        code: "MUMBA-15" },
  ],
  2: [
    { subject: "Marketing Management",                        code: "MUMBA-21" },
    { subject: "Financial Management",                        code: "MUMBA-22" },
    { subject: "Financial Management",                        code: "MUMBA-23" },
    { subject: "Research Methodology",                        code: "MUMBA-24" },
    { subject: "Operations Research",                         code: "MUMBA-25" },
  ],
  3: [
    { subject: "Strategic Management",                        code: "MUMBA-31" },
    { subject: "Corporate Finance",                           code: "MUMBA-32" },
    { subject: "International Marketing",                     code: "MUMBA-33" },
    { subject: "Entrepreneurship & Innovation",               code: "MUMBA-34" },
  ],
  4: [
    { subject: "Project Management & Six Sigma",              code: "MUMBA-41" },
    { subject: "Business Intelligence",                       code: "MUMBA-42" },
    { subject: "Supply Chain Analytics",                      code: "MUMBA-43" },
    { subject: "Mergers, Acquisitions & Corporate Restructuring", code: "MUMBA-44" },
  ],
};
// ─── Paper URL builder ────────────────────────────────────────────────────
// Returns years 2019–2024 for each subject with official university portal link
const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];

const buildPapers = (subjectList, uniId, course, semester) => {
  const portals = {
    sppu: "https://unipune.ac.in/",
    mu:   "https://mu.ac.in/",
  };
  const portal = portals[uniId] || "#";

  const papers = [];
  subjectList.forEach(({ subject, code }) => {
    YEARS.forEach((year) => {
      papers.push({
        id: `${uniId}-${code}-${year}`,
        subjectName: subject,
        subjectCode: code,
        course,
        semester,
        year,
        universityId: uniId,
        // For real papers, link to the university portal
        downloadUrl: portal,
        viewUrl: portal,
      });
    });
  });
  return papers;
};

// ─── Master papers lookup ─────────────────────────────────────────────────
const ALL_PAPERS = {
  sppu: {
    MCA:   { 1: buildPapers(SPPU_MCA[1], "sppu","MCA",1), 2: buildPapers(SPPU_MCA[2], "sppu","MCA",2), 3: buildPapers(SPPU_MCA[3], "sppu","MCA",3), 4: buildPapers(SPPU_MCA[4], "sppu","MCA",4) },
    MBA:   { 1: buildPapers(SPPU_MBA[1], "sppu","MBA",1), 2: buildPapers(SPPU_MBA[2], "sppu","MBA",2), 3: buildPapers(SPPU_MBA[3], "sppu","MBA",3), 4: buildPapers(SPPU_MBA[4], "sppu","MBA",4) },
  },
  mu: {
    MCA:   { 1: buildPapers(MU_MCA[1], "mu","MCA",1), 2: buildPapers(MU_MCA[2], "mu","MCA",2), 3: buildPapers(MU_MCA[3], "mu","MCA",3), 4: buildPapers(MU_MCA[4], "mu","MCA",4) },
    MBA:   { 1: buildPapers(MU_MBA[1], "mu","MBA",1), 2: buildPapers(MU_MBA[2], "mu","MBA",2), 3: buildPapers(MU_MBA[3], "mu","MBA",3), 4: buildPapers(MU_MBA[4], "mu","MBA",4) },
  },
};

/**
 * Get papers for the given filter combination
 * @param {string} universityId  - "sppu" | "mu" | "rtmnu"
 * @param {string} course        - "MCA" | "MBA" | ...
 * @param {number} semester      - 1-4
 * @returns {Array}
 */
export const getPapers = (universityId, course, semester) => {
  try {
    return ALL_PAPERS[universityId]?.[course]?.[semester] || [];
  } catch {
    return [];
  }
};
