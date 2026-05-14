// ── SmartPrep Question Bank ─────────────────────────────────────────────────
// Real SPPU/MU-style exam questions for MCA & MBA subjects
// Each subject has 4 units × 3 sub-questions (attempt any 2)
// Year variants rotate question sets
// ────────────────────────────────────────────────────────────────────────────

const Q = (label, text, marks = 10) => ({ label, text, marks });
const UNIT = (topic, marks, attempt, ...subs) => ({ topic, marks, attempt, subquestions: subs });

// ── SUBJECT BANKS ────────────────────────────────────────────────────────────

const BANKS = {

  // ── MCA-101: Computer Organization & Architecture ──────────────────────────
  "MCA-101": {
    title: "Computer Organization & Architecture",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["Q1–Q4 all compulsory.", "Figures to the right indicate marks.", "Assume suitable data wherever necessary."],
    units: [
      UNIT("Digital Logic & Number Systems", 20, "Attempt any TWO",
        Q("a","Explain BCD, Gray code, and Excess-3 code with conversion examples. Convert (347)₁₀ to BCD and Gray code.",10),
        Q("b","Design a full adder using logic gates. Draw the truth table and derive the sum/carry expressions using K-map.",10),
        Q("c","Explain combinational vs. sequential circuits. Design a 2-bit synchronous up-counter using D flip-flops.",10)),
      UNIT("CPU Design & Instruction Set", 20, "Attempt any TWO",
        Q("a","Explain the phases of instruction execution cycle. What are micro-operations? Describe fetch and execute phases in detail.",10),
        Q("b","Compare RISC vs CISC architecture with examples. List 5 design principles of RISC processors.",10),
        Q("c","Explain pipelining hazards (structural, data, control) and their solutions with examples.",10)),
      UNIT("Memory Organization", 20, "Attempt any TWO",
        Q("a","Explain cache memory mapping techniques: direct, associative, and set-associative. Compare them with examples.",10),
        Q("b","What is virtual memory? Explain paging and segmentation mechanisms. How does page replacement algorithm work?",10),
        Q("c","Explain the memory hierarchy. Compare SRAM, DRAM, and ROM. What is the principle of locality?",10)),
      UNIT("I/O and Parallel Processing", 20, "Attempt any TWO",
        Q("a","Compare DMA, interrupt-driven, and programmed I/O with flowcharts. When is each method preferred?",10),
        Q("b","Explain Flynn's taxonomy of parallel computers (SISD, SIMD, MISD, MIMD) with examples.",10),
        Q("c","Describe the architecture of a multiprocessor system. Explain cache coherence and the MESI protocol.",10)),
    ]
  },

  // ── MCA-102: Mathematical Foundations for CS ───────────────────────────────
  "MCA-102": {
    title: "Mathematical Foundations for Computer Science",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions are compulsory.", "Figures to the right indicate marks."],
    units: [
      UNIT("Set Theory & Relations", 20, "Attempt any TWO",
        Q("a","Define equivalence relation and partial order relation. Give examples. Show that congruence mod n is an equivalence relation.",10),
        Q("b","Prove De Morgan's laws for sets. Define power set and Cartesian product with examples.",10),
        Q("c","Define function, injection, surjection, and bijection. Prove that the composition of two bijections is a bijection.",10)),
      UNIT("Graph Theory", 20, "Attempt any TWO",
        Q("a","Define Euler path and Hamiltonian path. State conditions for their existence. Give examples of each.",10),
        Q("b","Explain BFS and DFS with examples. State their time and space complexity.",10),
        Q("c","Define spanning tree. Explain Kruskal's and Prim's algorithms with an example graph.",10)),
      UNIT("Logic & Propositional Calculus", 20, "Attempt any TWO",
        Q("a","Define tautology, contradiction, and contingency. Prove that (p→q) ≡ (¬p∨q) using truth tables.",10),
        Q("b","Explain predicate logic. What is the difference between universal and existential quantifiers? Give examples.",10),
        Q("c","Convert (p→(q→r)) to conjunctive normal form (CNF). Verify using truth table.",10)),
      UNIT("Combinatorics & Probability", 20, "Attempt any TWO",
        Q("a","State and prove the Pigeonhole principle. Give 3 applications in computer science.",10),
        Q("b","What is Bayes' theorem? Apply it to solve a problem involving spam email classification.",10),
        Q("c","Explain generating functions. Find the generating function for the sequence 1, 1, 1, 1, …",10)),
    ]
  },

  // ── MCA-103: Programming Concepts using Python ─────────────────────────────
  "MCA-103": {
    title: "Programming Concepts using Python",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Write clean, well-commented programs.", "Marks in brackets indicate weightage."],
    units: [
      UNIT("Python Basics & Data Types", 20, "Attempt any TWO",
        Q("a","Explain Python's built-in data types. Differentiate between mutable and immutable types with examples. Write a program using all built-in data types.",10),
        Q("b","Explain list comprehensions and dictionary comprehensions with 4 examples each. Compare with equivalent loops.",10),
        Q("c","What are Python decorators? Write a decorator to (i) log function calls with arguments and (ii) measure execution time.",10)),
      UNIT("Control Structures & Functions", 20, "Attempt any TWO",
        Q("a","Explain *args and **kwargs with examples. Write a function that accepts any number of numbers and returns mean, median, and mode.",10),
        Q("b","Explain lambda, map(), filter(), and reduce() with practical examples. Rewrite each using a regular function.",10),
        Q("c","What is recursion? Write recursive programs for: (i) Tower of Hanoi, (ii) Binary Search, (iii) Fibonacci series.",10)),
      UNIT("OOP in Python", 20, "Attempt any TWO",
        Q("a","Explain inheritance types in Python (single, multiple, multilevel) with examples. What is MRO (Method Resolution Order)?",10),
        Q("b","Design a class 'LibrarySystem' with books, members, issue_book(), return_book(), and fine_calculation() methods using OOP concepts.",10),
        Q("c","Explain dunder (magic) methods in Python. Write a class 'Vector' with __add__, __sub__, __mul__, __str__, and __repr__ methods.",10)),
      UNIT("File Handling & Modules", 20, "Attempt any TWO",
        Q("a","Explain file handling modes in Python. Write a program that reads a CSV file, filters records, sorts them, and writes the result to a new file.",10),
        Q("b","Explain exception handling (try/except/else/finally). Write a program implementing a custom exception hierarchy for a banking system.",10),
        Q("c","Explain Python's os, sys, and re modules. Write a program that walks a directory tree and finds all Python files containing a search pattern.",10)),
    ]
  },

  // ── MCA-104: Data Structures using C ───────────────────────────────────────
  "MCA-104": {
    title: "Data Structures using C",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions are compulsory.", "Write programs in C language.", "Dry run / trace expected for program questions."],
    units: [
      UNIT("Arrays, Stacks & Queues", 20, "Attempt any TWO",
        Q("a","Explain stack operations (push, pop, peek) with C implementation. Write a program to check balanced parentheses using stack.",10),
        Q("b","Explain types of queues (linear, circular, priority, deque). Implement a circular queue with all operations in C.",10),
        Q("c","What is sparse matrix? Implement its representation using triplet form and perform addition of two sparse matrices.",10)),
      UNIT("Linked Lists", 20, "Attempt any TWO",
        Q("a","Compare singly, doubly, and circular linked lists. Write C functions to insert, delete, and search in a doubly linked list.",10),
        Q("b","Write a C program to reverse a singly linked list both iteratively and recursively. Compare their time complexity.",10),
        Q("c","Implement a linked list based stack and queue. Explain advantages over array-based implementations.",10)),
      UNIT("Trees", 20, "Attempt any TWO",
        Q("a","Define Binary Search Tree (BST). Write C functions for insertion, deletion, and all three traversals (preorder, inorder, postorder).",10),
        Q("b","What is AVL tree? Explain all four rotations (LL, RR, LR, RL) with diagrams and C implementation.",10),
        Q("c","Explain heap data structure. Write a C program to implement heap sort. Trace with example: [5, 3, 8, 1, 9, 2].",10)),
      UNIT("Graphs & Hashing", 20, "Attempt any TWO",
        Q("a","Implement graph using adjacency matrix and adjacency list. Write BFS and DFS traversal algorithms in C.",10),
        Q("b","Explain Dijkstra's shortest path algorithm. Trace it on a given weighted graph and write C implementation.",10),
        Q("c","Explain hashing techniques: division method, mid-square, folding. Explain open addressing and chaining for collision resolution.",10)),
    ]
  },

  // ── MCA-203: Database Management System ────────────────────────────────────
  "MCA-203": {
    title: "Database Management System",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions are compulsory.", "SQL queries must be written in standard SQL syntax.", "Draw clear ER diagrams where required."],
    units: [
      UNIT("Database Concepts & ER Model", 20, "Attempt any TWO",
        Q("a","Compare DBMS and RDBMS. Explain three-schema architecture (external, conceptual, internal). What is data independence?",10),
        Q("b","Design an ER diagram for a Hospital Management System with entities: Patient, Doctor, Ward, Treatment. Show all relationships and cardinalities.",10),
        Q("c","Explain Extended ER features: specialization, generalization, and aggregation with examples from a university database.",10)),
      UNIT("Relational Model & SQL", 20, "Attempt any TWO",
        Q("a","Write SQL queries for: (i) Find employees with salary > avg salary in their dept (ii) Find departments with more than 5 employees (iii) List 2nd highest salary (iv) Find employees who joined in the last 6 months.",10),
        Q("b","Explain joins with examples: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF JOIN. Write queries for each using Employee and Department tables.",10),
        Q("c","Explain aggregate functions (COUNT, SUM, AVG, MAX, MIN) with GROUP BY and HAVING clauses. Write complex queries using nested subqueries.",10)),
      UNIT("Normalization & Transactions", 20, "Attempt any TWO",
        Q("a","Explain 1NF, 2NF, 3NF, and BCNF with examples. Normalize the following relation: Order(OrderID, CustomerName, CustomerCity, ProductID, ProductName, Qty, UnitPrice).",10),
        Q("b","Explain ACID properties of transactions. Describe serializability, conflict serializability, and view serializability with examples.",10),
        Q("c","Compare two-phase locking (2PL) and timestamp-based concurrency control. Explain deadlock detection and prevention strategies.",10)),
      UNIT("Indexing & Advanced Topics", 20, "Attempt any TWO",
        Q("a","Explain B-tree and B+ tree with examples. Construct a B+ tree of order 3 for keys: 10, 20, 30, 40, 50, 60, 70.",10),
        Q("b","Explain query processing and optimization. What are query execution plans? How does cost-based optimization work?",10),
        Q("c","Compare relational, document, key-value, and graph databases. When should NoSQL be preferred over SQL?",10)),
    ]
  },

  // ── MCA-202: OOP using Java ────────────────────────────────────────────────
  "MCA-202": {
    title: "Object Oriented Programming using Java",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Write complete Java programs.", "Explain output wherever applicable."],
    units: [
      UNIT("Java Fundamentals & OOP", 20, "Attempt any TWO",
        Q("a","Explain OOP concepts: encapsulation, inheritance, polymorphism, and abstraction with Java programs for each.",10),
        Q("b","What is method overloading and method overriding? Explain with examples. How does dynamic dispatch work in Java?",10),
        Q("c","Explain constructor chaining using this() and super(). Write a Java program demonstrating multilevel inheritance and constructor execution order.",10)),
      UNIT("Interfaces & Packages", 20, "Attempt any TWO",
        Q("a","Differentiate abstract class and interface. Write a Java program implementing multiple interfaces. Explain default and static methods in interfaces (Java 8+).",10),
        Q("b","Explain Java packages and access modifiers (public, private, protected, default). Create a package hierarchy for a banking application.",10),
        Q("c","Explain the Comparable and Comparator interfaces. Write a Java program to sort a list of Student objects by name, roll number, and GPA using both interfaces.",10)),
      UNIT("Exception Handling & I/O", 20, "Attempt any TWO",
        Q("a","Explain Java exception hierarchy. Differentiate checked and unchecked exceptions. Write a program with custom exceptions for a student grading system.",10),
        Q("b","Explain Java I/O streams (Byte streams, Character streams, Buffered streams). Write a program to serialize and deserialize a Student object.",10),
        Q("c","Explain Java NIO (java.nio package). Write programs using Path, Files, and Channels for file operations. Compare with traditional I/O.",10)),
      UNIT("Collections & Generics", 20, "Attempt any TWO",
        Q("a","Explain Java Collections Framework hierarchy. Compare ArrayList vs LinkedList vs Vector. Write programs demonstrating each with time complexity analysis.",10),
        Q("b","Explain Java Generics with bounded type parameters. Write a generic Stack class and a generic Pair class.",10),
        Q("c","Explain HashMap vs TreeMap vs LinkedHashMap. Write a program to count word frequency in a text using Map. Handle collision and explain internal working of HashMap.",10)),
    ]
  },

  // ── MCA-205 / MCA-305: Software Engineering / STQA ─────────────────────────
  "MCA-205": {
    title: "Software Engineering",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Draw clear diagrams wherever required.", "Support answers with real-world examples."],
    units: [
      UNIT("SDLC & Process Models", 20, "Attempt any TWO",
        Q("a","Compare Waterfall, Spiral, Agile, and RAD models. When should each be used? Explain Scrum framework with roles and ceremonies.",10),
        Q("b","Explain software project planning. What is a Work Breakdown Structure (WBS)? How is COCOMO used for effort estimation?",10),
        Q("c","Explain risk management in software projects. Define risk identification, analysis, planning, and monitoring with examples.",10)),
      UNIT("Requirements & System Design", 20, "Attempt any TWO",
        Q("a","Differentiate functional and non-functional requirements. Write SRS document components for an online examination system.",10),
        Q("b","Explain UML diagrams: Use Case, Class, Sequence, Activity, and Component. Draw a sequence diagram for 'User Login' use case.",10),
        Q("c","Explain software architecture patterns: MVC, Microservices, Event-Driven, and Layered architecture with examples.",10)),
      UNIT("Software Testing (STQA)", 20, "Attempt any TWO",
        Q("a","Differentiate black-box and white-box testing. Explain equivalence partitioning and boundary value analysis with a login form example.",10),
        Q("b","Explain unit testing, integration testing, system testing, and acceptance testing. Write JUnit test cases for a BankAccount class.",10),
        Q("c","Explain cyclomatic complexity. Calculate it for a given flowchart. What are basis paths? Use this for test case design.",10)),
      UNIT("Software Quality & Maintenance", 20, "Attempt any TWO",
        Q("a","Explain software quality metrics: defect density, mean time to failure, code coverage. What is ISO 9001 and CMMI?",10),
        Q("b","Explain software maintenance types: corrective, adaptive, perfective, preventive. What are re-engineering and reverse engineering?",10),
        Q("c","Explain Configuration Management. What are version control, change control, and audit? How does Git support SCM?",10)),
    ]
  },

  // ── MCA-303: Web Technology ─────────────────────────────────────────────────
  "MCA-303": {
    title: "Web Technology & Development",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions are compulsory.", "Write valid HTML/CSS/JS code.", "Browser output description expected where applicable."],
    units: [
      UNIT("HTML5 & CSS3", 20, "Attempt any TWO",
        Q("a","Explain HTML5 semantic elements. Create a complete webpage for a college with header, nav, main, article, aside, and footer sections.",10),
        Q("b","Explain CSS3 Flexbox and Grid layouts. Write CSS to create a responsive 3-column card layout that collapses to 1 column on mobile.",10),
        Q("c","Explain CSS3 animations and transitions. Create an animated navigation menu with hover effects and smooth page transitions.",10)),
      UNIT("JavaScript & DOM", 20, "Attempt any TWO",
        Q("a","Explain JavaScript closures, hoisting, and the 'this' keyword with examples. How do arrow functions handle 'this' differently?",10),
        Q("b","Explain the JavaScript Event Loop, Call Stack, and Callback Queue. How do Promises and async/await improve asynchronous code?",10),
        Q("c","Explain DOM manipulation. Write a JavaScript program for a To-Do app with add, delete, edit, and mark-complete features without any library.",10)),
      UNIT("React / Frontend Frameworks", 20, "Attempt any TWO",
        Q("a","Explain React component lifecycle. What are hooks? Write a custom hook 'useLocalStorage' that syncs state with localStorage.",10),
        Q("b","Explain React state management. When to use useState, useReducer, useContext, and external libraries like Redux?",10),
        Q("c","What is the Virtual DOM? How does React's reconciliation algorithm work? Explain React.memo, useMemo, and useCallback for optimization.",10)),
      UNIT("Backend & REST APIs", 20, "Attempt any TWO",
        Q("a","Explain REST API design principles. Design RESTful endpoints for a Student Management System. What is the difference between REST and GraphQL?",10),
        Q("b","Explain Node.js event-driven, non-blocking architecture. Write an Express.js REST API with CRUD operations and middleware for authentication.",10),
        Q("c","Explain HTTP methods (GET, POST, PUT, PATCH, DELETE), status codes, and headers. What is CORS? How do JWT tokens work for API security?",10)),
    ]
  },

  // ── MBA-101: Business Analytics ───────────────────────────────────────────
  "MBA-101": {
    title: "Business Analytics",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions are compulsory.", "Support with examples where necessary."],
    units: [
      UNIT("Introduction to Business Analytics", 20, "Attempt any TWO",
        Q("a","Define Business Analytics. Explain its importance in modern decision making with real-world examples.",10),
        Q("b","Differentiate between Descriptive, Predictive, and Prescriptive analytics. Give one application for each.",10),
        Q("c","Explain the Business Analytics Process Lifecycle. What are the key challenges in implementing BA?",10)),
      UNIT("Data Visualization & Exploration", 20, "Attempt any TWO",
        Q("a","What is Data Visualization? Explain the role of dashboards in business reporting. Mention 5 common visualization types.",10),
        Q("b","Explain the concepts of Data Cleaning and Data Preparation. Why is it 80% of an analyst's job?",10),
        Q("c","Describe various data types (nominal, ordinal, interval, ratio) and their implications for analytical methods.",10)),
      UNIT("Descriptive Analytics & Statistics", 20, "Attempt any TWO",
        Q("a","Explain measures of central tendency and dispersion. How do they help in understanding business data distributions?",10),
        Q("b","What is correlation and regression analysis? Explain their use in predicting business trends.",10),
        Q("c","Explain probability distributions (Normal, Binomial, Poisson) and their applications in quality control.",10)),
      UNIT("Predictive Analytics Modeling", 20, "Attempt any TWO",
        Q("a","Explain the concept of Linear Regression. How do we evaluate the performance of a regression model?",10),
        Q("b","What is Time Series Analysis? Explain components like trend, seasonality, and cyclical variations.",10),
        Q("c","Describe Decision Trees and their application in customer churn prediction. What is overfitting?",10)),
    ]
  },

  // ── MBA-104: Decision Science ──────────────────────────────────────────────
  "MBA-104": {
    title: "Decision Science",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Use of calculator is permitted.", "Graph paper will be provided."],
    units: [
      UNIT("Linear Programming Problems", 20, "Attempt any TWO",
        Q("a","Explain the assumptions of LPP. Formulate a mathematical model for a product-mix problem.",10),
        Q("b","Solve the following LPP using Graphical Method: Max Z = 3x + 5y subject to x + 2y <= 20, x + y <= 15, x,y >= 0.",10),
        Q("c","What is Duality in LPP? State the relationship between Primal and Dual problems.",10)),
      UNIT("Transportation & Assignment", 20, "Attempt any TWO",
        Q("a","Find initial basic feasible solution using VAM (Vogel's Approximation Method) for the given transportation matrix.",10),
        Q("b","Explain the Hungarian Method for solving Assignment problems. Solve a 4x4 matrix minimization problem.",10),
        Q("c","Differentiate between balanced and unbalanced Transportation problems. How do we handle degeneracy?",10)),
      UNIT("Network Analysis & Queuing", 20, "Attempt any TWO",
        Q("a","Differentiate between PERT and CPM. Explain the concepts of Earliest Start, Latest Finish, and Slack.",10),
        Q("b","Construct a network diagram and find the Critical Path for a project with 8 activities and given durations.",10),
        Q("c","Explain the Single Server Queuing Model (M/M/1). Define arrival rate, service rate, and traffic intensity.",10)),
      UNIT("Decision Theory & Games", 20, "Attempt any TWO",
        Q("a","Explain decision making under risk (EMV) and uncertainty (Maximin, Maximax, Laplace).",10),
        Q("b","Define Two-person Zero-sum game. Solve a game using the principle of dominance and find the value of game.",10),
        Q("c","What is a Decision Tree? How is it useful in sequential decision making? Explain with a small example.",10)),
    ]
  },

  // ── MBA-107: Managerial Accounting ─────────────────────────────────────────
  "MBA-107": {
    title: "Managerial Accounting",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Working notes should form part of the answer."],
    units: [
      UNIT("Introduction to Accounting", 20, "Attempt any TWO",
        Q("a","Differentiate between Financial Accounting, Cost Accounting, and Management Accounting.",10),
        Q("b","Explain Accounting Principles: Entity, Going Concern, Money Measurement, and Dual Aspect.",10),
        Q("c","Explain the Accounting Cycle. What are the objectives of preparing Final Accounts?",10)),
      UNIT("Marginal Costing & BVP", 20, "Attempt any TWO",
        Q("a","Define Marginal Costing. Explain the concept of P/V Ratio, Break-Even Point, and Margin of Safety.",10),
        Q("b","Given: Sales Rs.10 Lakh, Variable Cost 60%, Fixed Cost Rs.2 Lakh. Calculate BEP and Sales required for profit of Rs.3 Lakh.",10),
        Q("c","Explain the applications of Marginal Costing in decision making (Make vs Buy, Profit Planning).",10)),
      UNIT("Budgetary Control", 20, "Attempt any TWO",
        Q("a","Define Budget. Explain types of budgets: Functional, Fixed vs Flexible, and Zero-Based Budgeting.",10),
        Q("b","Prepare a Cash Budget for 3 months based on given collection and payment schedules.",10),
        Q("c","What is Standard Costing? Explain Material and Labour variances with formulas.",10)),
      UNIT("Financial Statement Analysis", 20, "Attempt any TWO",
        Q("a","Explain Ratio Analysis. Define Liquidity, Solvency, Profitability, and Turnover ratios.",10),
        Q("b","What is a Fund Flow Statement? Differentiate it from Cash Flow Statement (AS-3).",10),
        Q("c","Explain the significance of Comparative and Common-size statements in analyzing firm performance.",10)),
    ]
  },

  // ── MBA-204: Financial Management ──────────────────────────────────────────
  "MBA-204": {
    title: "Financial Management",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions are compulsory.", "Show calculations clearly.", "Use appropriate formulas."],
    units: [
      UNIT("Scope of Financial Management", 20, "Attempt any TWO",
        Q("a","Explain the Profit vs Wealth Maximization objectives. Discuss the role of a modern Finance Manager.",10),
        Q("b","Explain Time Value of Money. Calculate PV of an annuity of Rs.5000 for 10 years at 8%.",10),
        Q("c","What are the sources of long-term finance? Compare Equity vs Debt from the firm's perspective.",10)),
      UNIT("Capital Budgeting", 20, "Attempt any TWO",
        Q("a","Explain NPV, IRR, and Payback Period. Compare their advantages and disadvantages.",10),
        Q("b","Evaluate a project with initial investment Rs.2 Lakh and inflows: 60k, 70k, 80k, 90k over 4 years at 10% WACC.",10),
        Q("c","What is Capital Rationing? How do we use the Profitability Index in such cases?",10)),
      UNIT("Capital Structure & Cost", 20, "Attempt any TWO",
        Q("a","Define WACC. How is it calculated? Explain the importance of marginal cost of capital.",10),
        Q("b","Explain Leverages: Operating, Financial, and Combined. How do they affect the risk of the firm?",10),
        Q("c","Explain MM Hypothesis on capital structure (with and without taxes). What is the 'Tax Shield'?",10)),
      UNIT("Working Capital & Dividend", 20, "Attempt any TWO",
        Q("a","Explain Operating Cycle concept. What are the factors determining working capital requirements?",10),
        Q("b","Discuss Dividend Policies: Walter's and Gordon's models. How does growth rate affect dividend payouts?",10),
        Q("c","Explain various cash management models (Baumol and Miller-Orr). Why do firms hold cash?",10)),
    ]
  },

  // ── MBA-307: Strategic Management ──────────────────────────────────────────
  "MBA-307": {
    title: "Strategic Management",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Case study analysis carries 20 marks."],
    units: [
      UNIT("Strategic Intent & Analysis", 20, "Attempt any TWO",
        Q("a","Explain the hierarchy of strategy: Corporate, Business, and Functional. Define Mission vs Vision.",10),
        Q("b","Conduct a PESTEL analysis for the E-commerce industry in India. How does it affect strategic choices?",10),
        Q("c","Explain Porter's Five Forces model of industry competition. Apply it to the Airline industry.",10)),
      UNIT("Internal Analysis & SWOT", 20, "Attempt any TWO",
        Q("a","What is VRIO framework? How does it help in identifying sustainable competitive advantage?",10),
        Q("b","Explain Value Chain Analysis (Porter). Differentiate between primary and support activities.",10),
        Q("c","Perform a SWOT analysis for a well-known tech company (e.g., Apple or Google).",10)),
      UNIT("Strategic Choices", 20, "Attempt any TWO",
        Q("a","Explain Ansoff's Product-Market Expansion Grid. What are the risks of diversification?",10),
        Q("b","Explain BCG Matrix and GE Nine-Cell matrix. How do they help in portfolio management?",10),
        Q("c","Compare Generic Strategies: Cost Leadership, Differentiation, and Focus. Give examples for each.",10)),
      UNIT("Implementation & Control", 20, "Attempt any TWO",
        Q("a","Explain the 7-S Framework (McKinsey). Why is strategy implementation harder than formulation?",10),
        Q("b","What is Balanced Scorecard? Explain its four perspectives with examples.",10),
        Q("c","Discuss types of Strategic Control: Premise, Implementation, Surveillance, and Special Alert.",10)),
    ]
  },

  // ── MBA-404: Enterprise Performance Management ─────────────────────────────
  "MBA-404": {
    title: "Enterprise Performance Management",
    maxMarks: 80, duration: "3 Hours",
    instructions: ["All questions compulsory.", "Use charts/diagrams where applicable."],
    units: [
      UNIT("Performance Management Systems", 20, "Attempt any TWO",
        Q("a","Define EPM. Explain its components and the link between strategy and performance measurement.",10),
        Q("b","Differentiate between traditional and modern performance management systems. Mention 5 differences.",10),
        Q("c","Explain the role of IT in Enterprise Performance Management. What are EPM software suites?",10)),
      UNIT("Financial Performance Measurement", 20, "Attempt any TWO",
        Q("a","What is EVA (Economic Value Added)? How is it calculated and why is it superior to ROI?",10),
        Q("b","Explain Responsibility Accounting. Define Cost centers, Profit centers, and Investment centers.",10),
        Q("c","Discuss Transfer Pricing methods and their impact on divisional performance evaluation.",10)),
      UNIT("Non-Financial Performance", 20, "Attempt any TWO",
        Q("a","Explain Customer Satisfaction metrics (NPS, CSAT). How do they drive long-term business performance?",10),
        Q("b","Discuss Employee Performance Metrics. How do we measure 'Human Capital' value?",10),
        Q("c","Explain Quality Management tools: Six Sigma, TQM, and Benchmarking as performance drivers.",10)),
      UNIT("Reporting & Review", 20, "Attempt any TWO",
        Q("a","What is Management Reporting? Explain the characteristics of an effective MIS report.",10),
        Q("b","Discuss the role of Budgetary Reviews and Variance Analysis in performance management.",10),
        Q("c","Explain Corporate Performance Dashboards. How do they assist senior management in monitoring KPIs?",10)),
    ]
  },
};

// ─── Year-specific question selector ──────────────────────────────────────────
// Rotates sub-questions slightly per year to simulate different exams
export const getQuestionsForYear = (subjectCode, year) => {
  const bank = BANKS[subjectCode];
  if (!bank) return null;

  // For years 2019-2024, rotate which sub-questions appear "first" in each unit
  const rotation = (year - 2019) % 3;

  return {
    ...bank,
    year,
    units: bank.units.map((unit) => {
      const rotated = [...unit.subquestions];
      // Rotate the order so different questions appear highlighted per year
      for (let i = 0; i < rotation; i++) rotated.push(rotated.shift());
      return { ...unit, subquestions: rotated };
    }),
  };
};

// Fallback for subjects not in the bank
const GENERIC_UNIT = (topic, idx) =>
  UNIT(`${topic} - Unit ${idx + 1}`, 20, "Attempt any TWO",
    Q("a", `Explain the fundamental concepts of Unit ${idx + 1} with suitable examples and diagrams.`, 10),
    Q("b", `Write a detailed note on advanced topics covered in Unit ${idx + 1} with real-world applications.`, 10),
    Q("c", `Compare and contrast the key methods/techniques of Unit ${idx + 1}. Discuss their advantages and limitations.`, 10));

export const getFallbackPaper = (subjectName, subjectCode, course, semester, year) => ({
  title: subjectName,
  code: subjectCode,
  maxMarks: 80,
  duration: "3 Hours",
  year,
  course,
  semester,
  instructions: ["All questions are compulsory.", "Figures to the right indicate marks.", "Assume suitable data wherever necessary."],
  units: [1, 2, 3, 4].map((_, i) => GENERIC_UNIT(subjectName, i)),
});

export default BANKS;
