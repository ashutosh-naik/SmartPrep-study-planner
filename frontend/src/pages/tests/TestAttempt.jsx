import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Flag,
  X,
  ArrowRight
} from "lucide-react";
import AnimatedPage from "../../components/AnimatedPage";
import Skeleton from "../../components/Skeleton";
import { testService } from "../../services/testService";
import toast from "react-hot-toast";

const SUBJECT_POOLS = {
  "Data Structures": [
    { id: "ds1", type: "MCQ", questionText: "What is the time complexity of binary search on a sorted array?", optionA: "O(n)", optionB: "O(log n)", optionC: "O(n log n)", optionD: "O(1)", correctOption: "B" },
    { id: "ds2", type: "MCQ", questionText: "Which data structure uses LIFO ordering?", optionA: "Queue", optionB: "Stack", optionC: "Linked List", optionD: "Tree", correctOption: "B" },
    { id: "ds3", type: "MCQ", questionText: "What is the average time complexity of searching in a Hash Table?", optionA: "O(1)", optionB: "O(log n)", optionC: "O(n)", optionD: "O(n^2)", correctOption: "A" },
    { id: "ds4", type: "MCQ", questionText: "Which traversal of a BST gives elements in sorted order?", optionA: "Pre-order", optionB: "Post-order", optionC: "In-order", optionD: "Level-order", correctOption: "C" },
    { id: "ds5", type: "MCQ", questionText: "What is the worst-case time complexity of QuickSort?", optionA: "O(n log n)", optionB: "O(n^2)", optionC: "O(n)", optionD: "O(2^n)", correctOption: "B" },
    { id: "ds6", type: "MCQ", questionText: "Which data structure is best for implementing a priority queue?", optionA: "Stack", optionB: "Queue", optionC: "Heap", optionD: "Linked List", correctOption: "C" },
    { id: "ds7", type: "MCQ", questionText: "In a Doubly Linked List, how many pointers are in each node?", optionA: "1", optionB: "2", optionC: "3", optionD: "4", correctOption: "B" },
    { id: "ds8", type: "MCQ", questionText: "What is the height of a balanced binary tree with n nodes?", optionA: "O(n)", optionB: "O(log n)", optionC: "O(n log n)", optionD: "O(1)", correctOption: "B" },
    { id: "ds9", type: "MCQ", questionText: "Which algorithm is used for finding the shortest path in a graph?", optionA: "Dijkstra's", optionB: "Kruskal's", optionC: "Prim's", optionD: "Huffman", correctOption: "A" },
    { id: "ds10", type: "MCQ", questionText: "What is the time complexity to insert an element at the end of an array (amortized)?", optionA: "O(1)", optionB: "O(n)", optionC: "O(log n)", optionD: "O(n log n)", correctOption: "A" },
    { id: "ds11", type: "MCQ", questionText: "Which data structure is used in a Breadth-First Search (BFS)?", optionA: "Stack", optionB: "Queue", optionC: "Priority Queue", optionD: "Tree", correctOption: "B" },
    { id: "ds12", type: "MCQ", questionText: "What is the space complexity of an adjacency matrix for a graph with V vertices?", optionA: "O(V)", optionB: "O(V^2)", optionC: "O(E)", optionD: "O(V+E)", correctOption: "B" },
    { id: "ds13", type: "MCQ", questionText: "Which sorting algorithm is 'Stable'?", optionA: "QuickSort", optionB: "MergeSort", optionC: "HeapSort", optionD: "SelectionSort", correctOption: "B" },
    { id: "ds14", type: "MCQ", questionText: "What is the time complexity of building a heap from n elements?", optionA: "O(n)", optionB: "O(n log n)", optionC: "O(log n)", optionD: "O(1)", correctOption: "A" },
    { id: "ds15", type: "MCQ", questionText: "Which data structure is typically used to handle recursion?", optionA: "Queue", optionB: "Stack", optionC: "Tree", optionD: "Linked List", correctOption: "B" },
    { id: "ds16", type: "MCQ", questionText: "What is the maximum number of nodes at level 'L' in a binary tree?", optionA: "2L", optionB: "2^L", optionC: "L^2", optionD: "2^(L-1)", correctOption: "B" },
    { id: "ds17", type: "MCQ", questionText: "Which of these is not a non-linear data structure?", optionA: "Stack", optionB: "Graph", optionC: "Tree", optionD: "Trie", correctOption: "A" },
    { id: "ds18", type: "MCQ", questionText: "What is the time complexity of merging two sorted lists of size m and n?", optionA: "O(m*n)", optionB: "O(m+n)", optionC: "O(log(m+n))", optionD: "O(max(m,n))", correctOption: "B" },
    { id: "ds19", type: "MCQ", questionText: "Which data structure is used for dictionary implementations?", optionA: "AVL Tree", optionB: "Trie", optionC: "Hash Map", optionD: "B-Tree", correctOption: "C" },
    { id: "ds20", type: "MCQ", questionText: "What is the load factor in a Hash Table?", optionA: "n/m", optionB: "m/n", optionC: "n*m", optionD: "n+m", correctOption: "A" },
    { id: "ds21", type: "MCQ", questionText: "Which graph algorithm is used for finding Minimum Spanning Trees?", optionA: "Dijkstra's", optionB: "Kruskal's", optionC: "Bellman-Ford", optionD: "Floyd-Warshall", correctOption: "B" },
    { id: "ds22", type: "MCQ", questionText: "What is the time complexity of deleting a node in a Singly Linked List (with pointer to head)?", optionA: "O(1)", optionB: "O(n)", optionC: "O(log n)", optionD: "O(1) if pointer to node given", correctOption: "B" },
    { id: "ds23", type: "MCQ", questionText: "Which sorting algorithm has the best worst-case time complexity?", optionA: "QuickSort", optionB: "MergeSort", optionC: "BubbleSort", optionD: "InsertionSort", correctOption: "B" },
    { id: "ds24", type: "MCQ", questionText: "What is a 'Full Binary Tree'?", optionA: "Every node has 0 or 2 children", optionB: "All levels are completely filled", optionC: "All leaf nodes at same level", optionD: "Every node has exactly 2 children", correctOption: "A" },
    { id: "ds25", type: "MCQ", questionText: "Which data structure is best for reversing a string?", optionA: "Queue", optionB: "Stack", optionC: "Linked List", optionD: "Graph", correctOption: "B" },
  ],
  "Operating Systems": [
    { id: "os1", type: "MCQ", questionText: "What is the main purpose of an Operating System?", optionA: "Compile Code", optionB: "Manage Hardware Resources", optionC: "Browse the Internet", optionD: "Play Videos", correctOption: "B" },
    { id: "os2", type: "MCQ", questionText: "Which of the following is a condition for Deadlock?", optionA: "Mutual Exclusion", optionB: "Hold and Wait", optionC: "No Preemption", optionD: "All of the above", correctOption: "D" },
    { id: "os3", type: "MCQ", questionText: "What is Virtual Memory?", optionA: "Extra RAM", optionB: "Abstraction of Main Memory", optionC: "CPU Cache", optionD: "Storage on Cloud", correctOption: "B" },
    { id: "os4", type: "MCQ", questionText: "Which scheduling algorithm can cause 'Starvation'?", optionA: "Round Robin", optionB: "Priority Scheduling", optionC: "FCFS", optionD: "None", correctOption: "B" },
    { id: "os5", type: "MCQ", questionText: "What is a 'System Call'?", optionA: "Hardware interrupt", optionB: "Programmatic interface to Kernel", optionC: "User mode function", optionD: "Network request", correctOption: "B" },
    { id: "os6", type: "MCQ", questionText: "Which component handles Context Switching?", optionA: "User Program", optionB: "OS Kernel", optionC: "Compiler", optionD: "Linker", correctOption: "B" },
    { id: "os7", type: "MCQ", questionText: "What is 'Thrashing' in OS?", optionA: "High CPU usage", optionB: "High Paging activity", optionC: "Disk failure", optionD: "Memory leak", correctOption: "B" },
    { id: "os8", type: "MCQ", questionText: "What is the size of an IP address (IPv4)?", optionA: "16 bits", optionB: "32 bits", optionC: "64 bits", optionD: "128 bits", correctOption: "B" },
    { id: "os9", type: "MCQ", questionText: "Which data structure is used to manage Process Control Blocks?", optionA: "Stack", optionB: "Linked List/Process Table", optionC: "Tree", optionD: "Graph", correctOption: "B" },
    { id: "os10", type: "MCQ", questionText: "What is a 'Semaphore' used for?", optionA: "Memory allocation", optionB: "Process Synchronization", optionC: "CPU Scheduling", optionD: "File Management", correctOption: "B" },
    { id: "os11", type: "MCQ", questionText: "Which of these is not a Page Replacement Algorithm?", optionA: "FIFO", optionB: "LRU", optionC: "Optimal", optionD: "Round Robin", correctOption: "D" },
    { id: "os12", type: "MCQ", questionText: "What is 'Internal Fragmentation'?", optionA: "Unused space within a partition", optionB: "Unused space between partitions", optionC: "Disk data corruption", optionD: "Broken pointers", correctOption: "A" },
    { id: "os13", type: "MCQ", questionText: "What is the 'Critical Section'?", optionA: "Code that accesses shared resources", optionB: "Operating System Kernel", optionC: "Main entry point of a program", optionD: "Error handling block", correctOption: "A" },
    { id: "os14", type: "MCQ", questionText: "Which of these is a Preemptive scheduling algorithm?", optionA: "Shortest Job First (SJF)", optionB: "Round Robin", optionC: "Priority (Non-preemptive)", optionD: "FCFS", correctOption: "B" },
    { id: "os15", type: "MCQ", questionText: "What is 'Spooling'?", optionA: "Scheduling process", optionB: "Overlapping I/O and Processing", optionC: "Disk formatting", optionD: "Memory swapping", correctOption: "B" },
    { id: "os16", type: "MCQ", questionText: "The Banker's Algorithm is used for?", optionA: "Deadlock Prevention", optionB: "Deadlock Avoidance", optionC: "Memory Management", optionD: "CPU Scheduling", correctOption: "B" },
    { id: "os17", type: "MCQ", questionText: "What is 'Paging'?", optionA: "Memory management scheme", optionB: "Disk partition method", optionC: "Inter-process communication", optionD: "Interrupt handling", correctOption: "A" },
    { id: "os18", type: "MCQ", questionText: "A process that has finished execution but remains in the process table is called?", optionA: "Orphan", optionB: "Zombie", optionC: "Daemon", optionD: "Daemon", correctOption: "B" },
    { id: "os19", type: "MCQ", questionText: "Which of these is a Kernel Mode privilege?", optionA: "Accessing private user data", optionB: "Direct Hardware Access", optionC: "Running browser", optionD: "Creating a folder", correctOption: "B" },
    { id: "os20", type: "MCQ", questionText: "What is the 'Belady's Anomaly' related to?", optionA: "CPU Scheduling", optionB: "Page Replacement (FIFO)", optionC: "Deadlock Avoidance", optionD: "Disk Partitioning", correctOption: "B" },
    { id: "os21", type: "MCQ", questionText: "Which of these is a distributed file system?", optionA: "NTFS", optionB: "NFS", optionC: "FAT32", optionD: "EXT4", correctOption: "B" },
    { id: "os22", type: "MCQ", questionText: "What is a 'Thread'?", optionA: "Heavy-weight process", optionB: "Light-weight process", optionC: "Memory pointer", optionD: "Network connection", correctOption: "B" },
    { id: "os23", type: "MCQ", questionText: "What is 'Segmentation'?", optionA: "Fixed-size memory allocation", optionB: "Variable-size memory allocation", optionC: "Disk block division", optionD: "CPU register mapping", correctOption: "B" },
    { id: "os24", type: "MCQ", questionText: "The 'Bootstrapping' program is stored in?", optionA: "RAM", optionB: "ROM", optionC: "Hard Disk", optionD: "SSD", correctOption: "B" },
    { id: "os25", type: "MCQ", questionText: "Which signal is used to terminate a process in Unix?", optionA: "SIGINT", optionB: "SIGKILL", optionC: "SIGSTOP", optionD: "SIGCONT", correctOption: "B" },
  ],
  "Networking": [
    { id: "nw1", type: "MCQ", questionText: "Which layer of the OSI model is responsible for reliable delivery of data?", optionA: "Network", optionB: "Data Link", optionC: "Transport", optionD: "Session", correctOption: "C" },
    { id: "nw2", type: "MCQ", questionText: "What is the size of an IPv6 address?", optionA: "32 bits", optionB: "64 bits", optionC: "128 bits", optionD: "256 bits", correctOption: "C" },
    { id: "nw3", type: "MCQ", questionText: "Which protocol is used to resolve a domain name to an IP address?", optionA: "HTTP", optionB: "DNS", optionC: "FTP", optionD: "SMTP", correctOption: "B" },
    { id: "nw4", type: "MCQ", questionText: "What is the range of port numbers in TCP/UDP?", optionA: "0-255", optionB: "0-1023", optionC: "0-65535", optionD: "0-4095", correctOption: "C" },
    { id: "nw5", type: "MCQ", questionText: "Which device operates at Layer 2 of the OSI model?", optionA: "Hub", optionB: "Switch", optionC: "Router", optionD: "Firewall", correctOption: "B" },
    { id: "nw6", type: "MCQ", questionText: "What does DHCP stand for?", optionA: "Dynamic Host Configuration Protocol", optionB: "Digital Hypertext Control Protocol", optionC: "Domain Host Connection Port", optionD: "Data Handling Control Protocol", correctOption: "A" },
    { id: "nw7", type: "MCQ", questionText: "Which protocol is 'connectionless'?", optionA: "TCP", optionB: "HTTP", optionC: "UDP", optionD: "SSH", correctOption: "C" },
    { id: "nw8", type: "MCQ", questionText: "What is the standard port for HTTPS?", optionA: "80", optionB: "22", optionC: "443", optionD: "8080", correctOption: "C" },
    { id: "nw9", type: "MCQ", questionText: "Which layer is responsible for routing?", optionA: "Physical", optionB: "Network", optionC: "Transport", optionD: "Application", correctOption: "B" },
    { id: "nw10", type: "MCQ", questionText: "What is the MAC address length?", optionA: "32 bits", optionB: "48 bits", optionC: "64 bits", optionD: "128 bits", correctOption: "B" },
  ],
  "Databases (DBMS)": [
    { id: "db1", type: "MCQ", questionText: "What does ACID stand for in DBMS?", optionA: "Atomicity, Consistency, Isolation, Durability", optionB: "Access, Control, Index, Data", optionC: "Algorithm, Code, Integrity, Design", optionD: "Array, Class, Instance, Database", correctOption: "A" },
    { id: "db2", type: "MCQ", questionText: "Which SQL clause is used to filter records?", optionA: "ORDER BY", optionB: "GROUP BY", optionC: "WHERE", optionD: "SELECT", correctOption: "C" },
    { id: "db3", type: "MCQ", questionText: "A 'Primary Key' must be?", optionA: "Unique", optionB: "Not Null", optionC: "Both A and B", optionD: "Auto-increment only", correctOption: "C" },
    { id: "db4", type: "MCQ", questionText: "Which join returns all records when there is a match in either left or right table?", optionA: "Inner Join", optionB: "Left Join", optionC: "Full Outer Join", optionD: "Right Join", correctOption: "C" },
    { id: "db5", type: "MCQ", questionText: "What is 'Normalization'?", optionA: "Increasing data redundancy", optionB: "Reducing data redundancy", optionC: "Deleting data", optionD: "Sorting data", correctOption: "B" },
    { id: "db6", type: "MCQ", questionText: "Which SQL command is used to remove all records from a table without deleting the table structure?", optionA: "DELETE", optionB: "DROP", optionC: "TRUNCATE", optionD: "REMOVE", correctOption: "C" },
    { id: "db7", type: "MCQ", questionText: "In relational model, what is a 'Tuple'?", optionA: "A Column", optionB: "A Row", optionC: "A Table", optionD: "A Database", correctOption: "B" },
    { id: "db8", type: "MCQ", questionText: "What is the default isolation level in MySQL (InnoDB)?", optionA: "Read Uncommitted", optionB: "Read Committed", optionC: "Repeatable Read", optionD: "Serializable", correctOption: "C" },
    { id: "db9", type: "MCQ", questionText: "Which key is used to establish relationship between two tables?", optionA: "Primary Key", optionB: "Candidate Key", optionC: "Foreign Key", optionD: "Super Key", correctOption: "C" },
    { id: "db10", type: "MCQ", questionText: "What does 'R' stand for in RDBMS?", optionA: "Record", optionB: "Relational", optionC: "Retrieval", optionD: "Remote", correctOption: "B" },
  ],
  "Coding": [
    { 
      id: "code1", 
      type: "Coding", 
      title: "Sum of Array",
      questionText: "Write a function that returns the sum of all elements in an integer array.",
      inputDesc: "An array of integers `arr`.",
      outputDesc: "The integer sum of the array.",
      sampleInput: "[1, 2, 3, 4]",
      sampleOutput: "10",
      testCases: [
        { input: "[1, 2, 3]", output: "6" },
        { input: "[-1, 1, 0]", output: "0" },
        { input: "[10, 20]", output: "30" }
      ],
      initialCode: {
        java: "class Solution {\n    public int sum(int[] arr) {\n        // Your code here\n        return 0;\n    }\n}",
        python: "def sum_array(arr):\n    # Your code here\n    return 0",
        cpp: "int sumArray(vector<int> arr) {\n    // Your code here\n    return 0;\n}"
      }
    },
    { 
      id: "code2", 
      type: "Coding", 
      title: "Find Maximum",
      questionText: "Write a function to find the maximum element in an array.",
      inputDesc: "An array of integers `arr`.",
      outputDesc: "The maximum integer in the array.",
      sampleInput: "[5, 2, 9, 1]",
      sampleOutput: "9",
      testCases: [
        { input: "[1, 2, 3]", output: "3" },
        { input: "[-1, -5, -2]", output: "-1" }
      ],
      initialCode: {
        java: "class Solution {\n    public int findMax(int[] arr) {\n        // Your code here\n        return 0;\n    }\n}",
        python: "def find_max(arr):\n    # Your code here\n    return 0",
        cpp: "int findMax(vector<int> arr) {\n    // Your code here\n    return 0;\n}"
      }
    },
    { 
      id: "code3", 
      type: "Coding", 
      title: "Reverse String",
      questionText: "Write a function to reverse a given string.",
      inputDesc: "A string `s`.",
      outputDesc: "The reversed string.",
      sampleInput: "'hello'",
      sampleOutput: "'olleh'",
      testCases: [
        { input: "'abc'", output: "'cba'" },
        { input: "'racecar'", output: "'racecar'" }
      ],
      initialCode: {
        java: "class Solution {\n    public String reverse(String s) {\n        // Your code here\n        return \"\";\n    }\n}",
        python: "def reverse_string(s):\n    # Your code here\n    return \"\"",
        cpp: "string reverseString(string s) {\n    // Your code here\n    return \"\";\n}"
      }
    }
  ]
};

const MOCK_TESTS = {
  default: {
    id: "adaptive",
    title: "Adaptive Simulation — Phase I",
    subjectName: "Adaptive Mastery",
    durationMinutes: 45,
    maxQuestions: 10
  }
};

const TestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAdaptive, setIsAdaptive] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const initTest = () => {
      const stateTest = location.state?.test;
      
      // 1. Check for Full Mock First
      if (id === 'full-mock' || stateTest?.id === 'full-mock') {
        const mix = [
          ...SUBJECT_POOLS["Data Structures"].slice(0, 12),
          ...SUBJECT_POOLS["Operating Systems"].slice(0, 12),
          ...SUBJECT_POOLS["Networking"].slice(0, 10),
          ...SUBJECT_POOLS["Databases (DBMS)"].slice(0, 10),
          ...SUBJECT_POOLS["Coding"].slice(0, 6)
        ];
        setQuestions(mix);
        setTest(stateTest || { id: 'full-mock', title: 'Full Mock Examination', subjectName: 'Full Mock', durationMinutes: 90 });
        setTimeLeft(90 * 60);
        setIsAdaptive(false);
        setLoading(false);
        return;
      }

      // 2. Try to get test from state (Subject specific)
      if (stateTest) {
        setTest(stateTest);
        setTimeLeft(stateTest.durationMinutes * 60);
        
        // Find subject pool
        const pool = SUBJECT_POOLS[stateTest.subjectName] || SUBJECT_POOLS["Data Structures"];
        setQuestions(pool.slice(0, 25));
        setIsAdaptive(false);
        setLoading(false);
        return;
      }

      // 3. Fallback to adaptive or default
      const mock = MOCK_TESTS.default;
      setTest(mock);
      setTimeLeft(mock.durationMinutes * 60);
      
      if (id.startsWith("mock-")) {
         const pool = SUBJECT_POOLS["Data Structures"];
         setQuestions(pool.slice(0, 25));
         setIsAdaptive(false);
      } else {
         const pool = SUBJECT_POOLS["Data Structures"];
         setQuestions(pool.slice(0, 10));
         setIsAdaptive(true);
      }
      setLoading(false);
    };
    initTest();
    return () => clearInterval(timerRef.current);
  }, [id, location.state]);

  useEffect(() => {
    if (!test || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [test]);

  const handleSubmit = useCallback(async () => {
    clearInterval(timerRef.current);
    const timeTakenMinutes = Math.max(1, Math.round(((test?.durationMinutes || 45) * 60 - timeLeft) / 60));
    
    // Scoring logic (Handling MCQs vs Coding)
    const score = questions.reduce((acc, q) => {
      if (q.type === "MCQ") {
        return acc + (answers[q.id] === q.correctOption ? 1 : 0);
      } else if (q.type === "Coding") {
        // Simple heuristic for demo: if user code is longer than 50 chars, give point
        // In real app, this would be based on test case passes
        const code = answers[q.id]?.code || "";
        return acc + (code.length > 50 ? 1 : 0);
      }
      return acc;
    }, 0);

    try {
      await testService.submitTest(id, { 
        score, 
        totalQuestions: questions.length,
        timeTakenMinutes 
      });
      toast.success("Test results saved");
    } catch (e) {
      console.error("Failed to save test score", e);
    }

    navigate(`/tests/${id}/result`, { 
      state: { 
        demo: true, 
        result: { 
          testTitle: test.title, 
          subjectName: test.subjectName, 
          score, 
          totalMarks: questions.length, 
          percentage: Math.round((score/questions.length)*100), 
          questions: questions.map(q => ({...q, userAnswer: answers[q.id]})), 
          timeTakenMinutes 
        } 
      } 
    });
  }, [answers, id, navigate, test, timeLeft, questions]);

  if (loading || !test) return (
    <div className="min-h-screen bg-[#F7F7F5] p-10 max-w-[1000px] mx-auto">
      <Skeleton className="h-[400px] rounded-xl" />
    </div>
  );

  const q = questions[currentQ];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const answered = Object.keys(answers).length;

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
        
        {/* Header HUD */}
        <div className="h-16 bg-white border-b border-[#E6E6E6] px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#4A3728] text-white rounded-[8px] flex items-center justify-center shadow-lg">
                 <BookOpen size={18} />
              </div>
              <div className="hidden sm:block">
                 <h1 className="text-[14px] font-bold text-[#4A3728] leading-none">{test.title}</h1>
                 <p className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider mt-1">{test.subjectName} · Question {currentQ + 1}</p>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-32 h-[6px] bg-[#F1F1F1] rounded-full overflow-hidden">
                    <div className="h-full bg-[#4A3728] transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                 </div>
                 <span className="text-[11px] font-bold text-[#6B6B6B] uppercase">{currentQ + 1}/{questions.length}</span>
              </div>
              <div className={`px-4 py-1.5 rounded-[6px] border flex items-center gap-2 font-mono text-[14px] font-bold ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-[#F9FAFB] border-[#E6E6E6] text-[#4A3728]'}`}>
                 <Clock size={16} /> {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
              </div>
              <button onClick={() => setShowConfirm(true)} className="btn-primary !w-auto !px-6 !py-2 text-[13px]">Finish Test</button>
           </div>
        </div>

        {/* Exam Body */}
        <div className="max-w-[1200px] mx-auto w-full p-6 lg:p-10 flex gap-10 flex-1">
           
           {/* Question Center */}
            <div className="flex-1 space-y-6">
               <div className="card border-[#E6E6E6] hover:shadow-xl transition-shadow duration-500 min-h-[600px] flex flex-col">
                  <div className="flex justify-between items-start mb-8 shrink-0">
                     <div className="flex items-center gap-2">
                       <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest bg-[#F1F1F1] px-3 py-1 rounded-full">
                          Question {currentQ + 1}
                       </span>
                       <span className="text-[11px] font-bold text-white uppercase tracking-widest bg-[#4A3728] px-3 py-1 rounded-full">
                          {q.type}
                       </span>
                     </div>
                     <button onClick={() => { const n = new Set(flagged); if(n.has(q.id)) n.delete(q.id); else n.add(q.id); setFlagged(n); }} className={`flex items-center gap-2 text-[11px] font-bold uppercase transition-all ${flagged.has(q.id) ? 'text-amber-600' : 'text-[#A3A3A3] hover:text-[#4A3728]'}`}>
                        <Flag size={14} /> {flagged.has(q.id) ? 'Flagged for Review' : 'Flag Question'}
                     </button>
                  </div>

                  {q.type === "MCQ" ? (
                    <div className="flex-1 overflow-y-auto">
                      <p className="text-[20px] font-bold text-[#4A3728] leading-relaxed mb-10">{q.questionText}</p>
                      <div className="space-y-4">
                        {["A", "B", "C", "D"].map(opt => {
                           const text = q[`option${opt}`];
                           if(!text) return null;
                           const selected = answers[q.id] === opt;
                           return (
                             <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})} className={`w-full text-left p-6 rounded-xl border-2 transition-all flex items-center gap-6 group ${selected ? 'border-[#4A3728] bg-[#F9FAFB] shadow-md' : 'border-[#F1F1F1] hover:border-[#4A3728] bg-white'}`}>
                                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[16px] transition-all ${selected ? 'bg-[#4A3728] text-white shadow-lg' : 'bg-[#F1F1F1] text-[#6B6B6B] group-hover:bg-[#4A3728] group-hover:text-white'}`}>{opt}</span>
                                <span className={`text-[16px] font-medium ${selected ? 'text-[#4A3728] font-bold' : 'text-[#6B6B6B]'}`}>{text}</span>
                                {selected && <CheckCircle2 size={20} className="text-[#4A3728] ml-auto" />}
                             </button>
                           );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                          {/* Problem Info */}
                          <div className="space-y-6 overflow-y-auto pr-4 border-r border-[#F1F1F1]">
                             <div>
                                <h3 className="text-[24px] font-bold text-[#4A3728] mb-4">{q.title}</h3>
                                <p className="text-[15px] text-[#6B6B6B] leading-relaxed whitespace-pre-wrap">{q.questionText}</p>
                             </div>
                             
                             <div className="space-y-4">
                                <div className="p-4 bg-[#FAF9F6] rounded-xl">
                                   <h4 className="text-[12px] font-bold uppercase text-[#4A3728] mb-2 flex items-center gap-2"><ArrowRight size={14} /> Input Description</h4>
                                   <p className="text-[13px] text-[#6B6B6B]">{q.inputDesc}</p>
                                </div>
                                <div className="p-4 bg-[#FAF9F6] rounded-xl">
                                   <h4 className="text-[12px] font-bold uppercase text-[#4A3728] mb-2 flex items-center gap-2"><ArrowRight size={14} /> Output Description</h4>
                                   <p className="text-[13px] text-[#6B6B6B]">{q.outputDesc}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="p-4 bg-[#F1F1F1] rounded-xl">
                                      <h4 className="text-[10px] font-bold uppercase text-[#6B6B6B] mb-2">Sample Input</h4>
                                      <code className="text-[12px] font-mono text-[#4A3728]">{q.sampleInput}</code>
                                   </div>
                                   <div className="p-4 bg-[#F1F1F1] rounded-xl">
                                      <h4 className="text-[10px] font-bold uppercase text-[#6B6B6B] mb-2">Sample Output</h4>
                                      <code className="text-[12px] font-mono text-[#4A3728]">{q.sampleOutput}</code>
                                   </div>
                                </div>
                             </div>
                          </div>

                          {/* Editor */}
                          <div className="flex flex-col h-full bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl border border-[#333]">
                             <div className="flex items-center justify-between px-4 py-2 bg-[#2D2D2D] border-b border-[#333]">
                                <select 
                                  value={answers[q.id]?.lang || "java"} 
                                  onChange={(e) => {
                                    const newLang = e.target.value;
                                    setAnswers({...answers, [q.id]: { lang: newLang, code: q.initialCode[newLang] }});
                                  }}
                                  className="bg-[#3C3C3C] text-white text-[11px] font-bold px-3 py-1 rounded border-none outline-none cursor-pointer"
                                >
                                   <option value="java">Java 17</option>
                                   <option value="python">Python 3.10</option>
                                   <option value="cpp">C++ 20</option>
                                </select>
                                <div className="flex gap-1.5">
                                   <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                </div>
                             </div>
                             <textarea 
                               value={answers[q.id]?.code !== undefined ? answers[q.id].code : (q.initialCode[answers[q.id]?.lang || "java"])}
                               onChange={(e) => setAnswers({...answers, [q.id]: { ...answers[q.id], code: e.target.value, lang: answers[q.id]?.lang || "java" }})}
                               className="flex-1 p-6 font-mono text-[14px] bg-transparent text-[#D4D4D4] outline-none resize-none leading-relaxed"
                               placeholder="// Type your code here..."
                               spellCheck="false"
                             />
                             <div className="p-4 bg-[#2D2D2D] flex items-center justify-between">
                                <button onClick={() => toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: 'Compiling...', success: 'Test cases passed!', error: 'Compile error' })} className="px-6 py-2 bg-green-600 text-white text-[11px] font-bold rounded-lg hover:bg-green-700 transition-all uppercase tracking-wider">Run Code</button>
                                <span className="text-[10px] text-[#A3A3A3] font-mono">UTF-8 · LF · Main.java</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="flex justify-between mt-12 pt-8 border-t border-[#F1F1F1] shrink-0">
                     <button onClick={() => setCurrentQ(v => Math.max(0, v-1))} disabled={currentQ === 0} className="btn-secondary !w-auto px-8 flex items-center gap-2 hover:scale-105 transition-transform"><ChevronLeft size={16} /> Previous</button>
                     {currentQ < questions.length - 1 ? (
                       <button onClick={() => setCurrentQ(v => v + 1)} className="btn-primary !w-auto px-10 flex items-center gap-2 hover:scale-105 transition-transform">Next Question <ChevronRight size={16} /></button>
                     ) : (
                       <button onClick={() => setShowConfirm(true)} className="btn-primary !w-auto px-10 flex items-center gap-2 hover:scale-105 transition-transform shadow-lg bg-[#4A3728]">Finish Test <ArrowRight size={16} /></button>
                     )}
                  </div>
               </div>
            </div>

           {/* Question Navigator */}
           <div className="w-64 hidden lg:block">
              <div className="card sticky top-28 border-[#E6E6E6]">
                 <h3 className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-widest mb-6 text-center">Question Navigator</h3>
                 <div className="grid grid-cols-4 gap-2 mb-8">
                    {questions.map((_, i) => {
                       const qId = questions[i].id;
                       const isAns = !!answers[qId];
                       const isFlg = flagged.has(qId);
                       const isCur = i === currentQ;
                       return (
                         <button key={i} onClick={() => setCurrentQ(i)} className={`h-10 rounded-[8px] text-[12px] font-bold transition-all border ${isCur ? 'bg-[#4A3728] text-white border-[#4A3728] shadow-md' : isFlg ? 'border-amber-400 text-amber-600 bg-amber-50' : isAns ? 'bg-[#F1F1F1] text-[#4A3728] border-[#E6E6E6]' : 'text-[#A3A3A3] border-[#E6E6E6] hover:border-[#4A3728]'}`}>
                            {i + 1}
                         </button>
                       );
                    })}
                 </div>
                 <div className="space-y-3 pt-6 border-t border-[#F1F1F1]">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase text-[#6B6B6B]">
                       <span>Attempted</span> <span>{answered}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Submit Modal */}
        {showConfirm && (
           <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
              <div className="card border-[#4A3728] border-2 max-w-md w-full p-10 text-center shadow-2xl">
                 <CheckCircle2 size={48} className="mx-auto mb-6 text-[#4A3728]" />
                 <h2 className="text-[24px] font-bold text-[#4A3728] mb-4">Assessment Complete</h2>
                 <p className="text-[14px] text-[#6B6B6B] font-medium leading-relaxed mb-8">
                    You have finished the adaptive simulation. Your results will determine your next mastery level.
                 </p>
                 <div className="flex flex-col gap-3">
                    <button onClick={handleSubmit} className="btn-primary py-4 hover:scale-105 transition-transform shadow-lg">View Detailed Results</button>
                    <button onClick={() => setShowConfirm(false)} className="btn-secondary py-4">Review Answers</button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </AnimatedPage>
  );
};

export default TestAttempt;
