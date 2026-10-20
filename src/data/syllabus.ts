import type { Subject, Unit, Topic } from '../types';

// ══════════════════════════════════════════════════════════════════
// Official LPU B.Tech CSE Syllabi Metadata
// Aligned with Syllabus_CSE202_26271.pdf, Syllabys_CSE205_26271.pdf,
// and OOP_DSA_Topic_Checklist.xlsx
// ══════════════════════════════════════════════════════════════════

export const CSE202_COURSE_OUTCOMES = [
  'CO1 :: Identify basic programming constructs and use the newly acquired skills to solve extensive programming problems.',
  'CO2 :: Discuss the mechanism of code reusability by creating own libraries of functions.',
  'CO3 :: Analyze the logic by designing code capable of passing various test cases.',
  'CO4 :: Interpret the principles of the object-oriented model and apply it in the implementation in C++ language.',
  'CO5 :: Categorize the theoretical knowledge and insights gained thus far to formulate working code.',
  'CO6 :: Apply various programming constructs to build software applications.'
];

export const CSE202_TEXTBOOKS = [
  'OBJECT ORIENTED PROGRAMMING IN C++ by ROBERT LAFORE, PEARSON'
];

export const CSE202_REFERENCES = [
  'PROGRAMMING WITH C++ by D RAVICHANDRAN, MCGRAW HILL EDUCATION',
  'OBJECT ORIENTED PROGRAMMING IN C++ by E BALAGURUSAMY, MCGRAW HILL EDUCATION'
];

export const CSE202_PRACTICALS = [
  {
    title: 'Concepts and Basics of C++ Programming',
    description: 'Programs to define classes and structures; Program to demonstrate inline, non-inline member functions and static functions.'
  },
  {
    title: 'Functions & Parameter Passing',
    description: 'Program to implement function overloading, friend function and friend class; Program to demonstrate the difference between call by value, call by address and call by reference.'
  },
  {
    title: 'Pointers, Reference Variables, Arrays and String Concepts',
    description: 'Program to demonstrate the type of pointers; Program to process multidimensional arrays and array of objects.'
  },
  {
    title: 'Constructors, Destructors and Memory Initialization',
    description: 'Program to demonstrate constructor, destructor, and type of constructors (default, parameterized, copy, initializer lists).'
  },
  {
    title: 'Data File Operations',
    description: 'Program to demonstrate the modes of file, sequential and random access, binary object file streams.'
  },
  {
    title: 'Operator Overloading and Type Conversion',
    description: 'Program to demonstrate unary/binary operator overloading and basic-to-class / class-to-basic type conversions.'
  },
  {
    title: 'Inheritance & Ambiguity Resolution',
    description: 'Program to demonstrate the types of inheritance and ambiguities resolution with virtual base classes.'
  },
  {
    title: 'Dynamic Memory Management and Polymorphism',
    description: 'Program to use new and delete for dynamic memory management, compile-time and run-time polymorphism, abstract classes and dynamic constructors.'
  },
  {
    title: 'Exception Handling, Templates and STL',
    description: 'Program to demonstrate exception handling, function and class templates, and STL Containers, Algorithms, and Iterators.'
  }
];

export const CSE205_COURSE_OUTCOMES = [
  'CO1 :: Understand the time and space complexity of programs and data-structures.',
  'CO2 :: Illustrate the importance of Linked List in context of real world problems.',
  'CO3 :: Differentiate the Stack and Queue data structures for problem solving.',
  'CO4 :: Use recursion in iteration process and tree data structure.',
  'CO5 :: Apply heap operations and hashing techniques for efficient data storage, retrieval, and collision resolution.',
  'CO6 :: Identify and integrate emerging data structures and algorithmic concepts ensuring ability to stay with technological advancements.'
];

export const CSE205_TEXTBOOKS = [
  'DATA STRUCTURES by SEYMOUR LIPSCHUTZ, MCGRAW HILL EDUCATION'
];

export const CSE205_REFERENCES = [
  'DATA STRUCTURES AND ALGORITHMS by ALFRED V. AHO, JEFFREY D. ULLMAN AND JOHN E. HOPCROFT, PEARSON'
];

export const CSE205_PRACTICALS = [
  {
    title: 'Arrays & Sorting/Searching',
    description: 'Program to implement linear and binary search, traversal, insertion, deletion, and sorting operations in linear arrays.'
  },
  {
    title: 'Doubly Linked List & Circular Lists',
    description: 'Program to implement searching, insertion and deletion operations in singly, doubly, and circular linked lists.'
  },
  {
    title: 'Stacks (Array & Linked List)',
    description: 'Program to implement push and pop operations in stacks using both arrays and linked list; arithmetic polish expression conversion.'
  },
  {
    title: 'Queues & Circular Queues',
    description: 'Program to implement enqueue and dequeue operations in queues using both arrays and linked list; priority queues and deques.'
  },
  {
    title: 'Recursion & Tower of Hanoi',
    description: 'Program to demonstrate concept of recursion with the problem of Tower of Hanoi.'
  },
  {
    title: 'Recursive Sorting (Merge & Quick Sort)',
    description: 'Program to implement recursive sorting techniques - merge sort and quick sort.'
  },
  {
    title: 'Binary Tree Traversals',
    description: 'Program to create and traverse a binary tree recursively (inorder, preorder, postorder).'
  },
  {
    title: 'Binary Search Tree (BST)',
    description: 'Program to implement insertion and deletion operations in BST.'
  },
  {
    title: 'Heaps & Heap Sort',
    description: 'Program to implement insertion and deletion operations in Heaps and Heap Sort.'
  },
  {
    title: 'Graph Traversals (BFS & DFS)',
    description: 'Program to represent graphs with adjacency lists and perform Breadth-First Search and Depth-First Search.'
  }
];

export interface ChecklistItem {
  sno: number;
  subjectCode: 'CSE202' | 'CSE205';
  unitNumber: number;
  unitTitle: string;
  topicGroup: string;
  subtopic: string;
}

export const LPU_CHECKLIST_DATA: ChecklistItem[] = [
  {
    "sno": 1,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Introduction to concepts of OOP and OOP Languages"
  },
  {
    "sno": 2,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Differences between procedural and object oriented programming paradigms"
  },
  {
    "sno": 3,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Reading and writing data using cin and cout"
  },
  {
    "sno": 4,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Features of Input/output Streams"
  },
  {
    "sno": 5,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Creating classes, Class objects, Accessing class members"
  },
  {
    "sno": 6,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Differences between Structures, Unions, Enumerations and Classes"
  },
  {
    "sno": 7,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Inline and Non-inline member functions"
  },
  {
    "sno": 8,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Concepts and Basics of C++ Programming",
    "subtopic": "Static data members and static member functions"
  },
  {
    "sno": 9,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Functions with Default parameters/arguments"
  },
  {
    "sno": 10,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Inline Functions"
  },
  {
    "sno": 11,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Manipulator Functions"
  },
  {
    "sno": 12,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Function overloading and Scope rules"
  },
  {
    "sno": 13,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Friend of a class (friend function and friend class)"
  },
  {
    "sno": 14,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Reference variables"
  },
  {
    "sno": 15,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Differences between Call by value, Call by address and call by reference"
  },
  {
    "sno": 16,
    "subjectCode": "CSE202",
    "unitNumber": 1,
    "unitTitle": "Concepts and Basics of C++ Programming, and Functions",
    "topicGroup": "Functions",
    "subtopic": "Recursion (Function, Member Function)"
  },
  {
    "sno": 17,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Void pointer, Pointer arithmetic, Pointer to pointer"
  },
  {
    "sno": 18,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Possible problems with pointers – Dangling pointer, Wild pointer, Null pointer assignment"
  },
  {
    "sno": 19,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Classes containing pointers, Pointer to objects, this pointer"
  },
  {
    "sno": 20,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Array of objects"
  },
  {
    "sno": 21,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "The Standard C++ string class – defining and assigning string objects"
  },
  {
    "sno": 22,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Member functions, Modifiers of string class"
  },
  {
    "sno": 23,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Differences between pointer and reference variables"
  },
  {
    "sno": 24,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Array declaration and processing of multidimensional arrays (inside main and inside class)"
  },
  {
    "sno": 25,
    "subjectCode": "CSE202",
    "unitNumber": 2,
    "unitTitle": "Pointers, Reference Variables, Arrays and String Concepts",
    "topicGroup": "Pointers, Reference Variables, Arrays and String Concepts",
    "subtopic": "Pointer to data member"
  },
  {
    "sno": 26,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Opening and closing of files"
  },
  {
    "sno": 27,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Modes of file"
  },
  {
    "sno": 28,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "File stream functions"
  },
  {
    "sno": 29,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Reading/Writing of files"
  },
  {
    "sno": 30,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Sequential access and random access file processing"
  },
  {
    "sno": 31,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Binary file operations"
  },
  {
    "sno": 32,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Classes and file operations"
  },
  {
    "sno": 33,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Data File Operations",
    "subtopic": "Structures and file operation"
  },
  {
    "sno": 34,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Manager functions (constructors and destructor)"
  },
  {
    "sno": 35,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Default constructor"
  },
  {
    "sno": 36,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Constructor with default arguments"
  },
  {
    "sno": 37,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Destructors"
  },
  {
    "sno": 38,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Parameterized constructor"
  },
  {
    "sno": 39,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Copy constructor"
  },
  {
    "sno": 40,
    "subjectCode": "CSE202",
    "unitNumber": 3,
    "unitTitle": "Data File Operations, and Constructors/Destructors and File Handling",
    "topicGroup": "Constructors, Destructors and File Handling",
    "subtopic": "Initializer lists"
  },
  {
    "sno": 41,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Operator Overloading and Type Conversion",
    "subtopic": "Operator Overloading (unary operator, binary operator overloading)"
  },
  {
    "sno": 42,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Operator Overloading and Type Conversion",
    "subtopic": "Type conversions – basic type to class type, class type to basic type"
  },
  {
    "sno": 43,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Inheritance Basics – derived class and base class"
  },
  {
    "sno": 44,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Types (simple, multi-level, multiple and hierarchical)"
  },
  {
    "sno": 45,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Modes (private, protected, public inheritance)"
  },
  {
    "sno": 46,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Overriding member functions"
  },
  {
    "sno": 47,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Order of execution of constructors and destructors"
  },
  {
    "sno": 48,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Resolving ambiguities in inheritance, Virtual base class"
  },
  {
    "sno": 49,
    "subjectCode": "CSE202",
    "unitNumber": 4,
    "unitTitle": "Operator Overloading and Type Conversion, and Inheritance",
    "topicGroup": "Inheritance",
    "subtopic": "Aggregation and Composition"
  },
  {
    "sno": 50,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Dynamic memory allocation using new and delete operators"
  },
  {
    "sno": 51,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Virtual destructors"
  },
  {
    "sno": 52,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Compile and run time polymorphism"
  },
  {
    "sno": 53,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Virtual functions"
  },
  {
    "sno": 54,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Dynamic constructors"
  },
  {
    "sno": 55,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Abstract classes and concrete class"
  },
  {
    "sno": 56,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Introduction to Self-Referential class"
  },
  {
    "sno": 57,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Pure virtual functions"
  },
  {
    "sno": 58,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Early binding and late binding"
  },
  {
    "sno": 59,
    "subjectCode": "CSE202",
    "unitNumber": 5,
    "unitTitle": "Dynamic Memory Management and Polymorphism",
    "topicGroup": "Dynamic Memory Management and Polymorphism",
    "subtopic": "Memory leak and allocation failures"
  },
  {
    "sno": 60,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Basics of exception handling"
  },
  {
    "sno": 61,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Exception handling mechanism"
  },
  {
    "sno": 62,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Throwing mechanism"
  },
  {
    "sno": 63,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Catching mechanism"
  },
  {
    "sno": 64,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Rethrowing an exception"
  },
  {
    "sno": 65,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Function template and class template"
  },
  {
    "sno": 66,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Class template with inheritance"
  },
  {
    "sno": 67,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Introduction to STL – Containers, Algorithms and iterators"
  },
  {
    "sno": 68,
    "subjectCode": "CSE202",
    "unitNumber": 6,
    "unitTitle": "Exception Handling, Templates and Standard Template Library (STL)",
    "topicGroup": "Exception Handling, Templates and STL",
    "subtopic": "Container – Vector and List"
  },
  {
    "sno": 1,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Introduction",
    "subtopic": "Basic Concepts and Notations"
  },
  {
    "sno": 2,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Introduction",
    "subtopic": "Complexity analysis: time, space and trade off"
  },
  {
    "sno": 3,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Introduction",
    "subtopic": "Omega Notation"
  },
  {
    "sno": 4,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Introduction",
    "subtopic": "Theta Notation"
  },
  {
    "sno": 5,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Introduction",
    "subtopic": "Big O notation"
  },
  {
    "sno": 6,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Introduction",
    "subtopic": "Basic Data Structures"
  },
  {
    "sno": 7,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Arrays",
    "subtopic": "Linear arrays: memory representation"
  },
  {
    "sno": 8,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Arrays",
    "subtopic": "Array operations: traversal, insertion, deletion, sorting, searching and merging and their complexity analysis"
  },
  {
    "sno": 9,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Sorting and Searching",
    "subtopic": "Bubble sort"
  },
  {
    "sno": 10,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Sorting and Searching",
    "subtopic": "Insertion sort"
  },
  {
    "sno": 11,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Sorting and Searching",
    "subtopic": "Selection sort"
  },
  {
    "sno": 12,
    "subjectCode": "CSE205",
    "unitNumber": 1,
    "unitTitle": "Introduction, Arrays, and Sorting and Searching",
    "topicGroup": "Sorting and Searching",
    "subtopic": "Searching: Linear Search and Binary Search"
  },
  {
    "sno": 13,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Introduction"
  },
  {
    "sno": 14,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Memory representation"
  },
  {
    "sno": 15,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Allocation"
  },
  {
    "sno": 16,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Traversal"
  },
  {
    "sno": 17,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Insertion"
  },
  {
    "sno": 18,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Deletion"
  },
  {
    "sno": 19,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Header linked lists: Grounded and Circular"
  },
  {
    "sno": 20,
    "subjectCode": "CSE205",
    "unitNumber": 2,
    "unitTitle": "Linked Lists",
    "topicGroup": "Linked Lists",
    "subtopic": "Two-way lists: operations on two way linked lists"
  },
  {
    "sno": 21,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Stacks",
    "subtopic": "Introduction: List and Array representations"
  },
  {
    "sno": 22,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Stacks",
    "subtopic": "Operations on stack (traversal, push and pop)"
  },
  {
    "sno": 23,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Stacks",
    "subtopic": "Arithmetic expressions: polish notation, evaluation and transformation of expressions"
  },
  {
    "sno": 24,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Queue",
    "subtopic": "Array and list representation"
  },
  {
    "sno": 25,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Queue",
    "subtopic": "Operations (traversal, insertion and deletion)"
  },
  {
    "sno": 26,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Queue",
    "subtopic": "Priority Queues"
  },
  {
    "sno": 27,
    "subjectCode": "CSE205",
    "unitNumber": 3,
    "unitTitle": "Stacks, and Queue",
    "topicGroup": "Queue",
    "subtopic": "Deques"
  },
  {
    "sno": 28,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Introduction to Recursion"
  },
  {
    "sno": 29,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Binary trees: introduction (complete and extended binary trees)"
  },
  {
    "sno": 30,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Memory representation (linked, sequential)"
  },
  {
    "sno": 31,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Binary Search Tree: introduction, searching, insertion and deletion"
  },
  {
    "sno": 32,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "In-order traversal"
  },
  {
    "sno": 33,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Pre-order traversal"
  },
  {
    "sno": 34,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Post-order traversal using recursion"
  },
  {
    "sno": 35,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Recursive implementation of Towers of Hanoi"
  },
  {
    "sno": 36,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Merge sort"
  },
  {
    "sno": 37,
    "subjectCode": "CSE205",
    "unitNumber": 4,
    "unitTitle": "Recursion and Trees",
    "topicGroup": "Recursion and Trees",
    "subtopic": "Quick sort"
  },
  {
    "sno": 38,
    "subjectCode": "CSE205",
    "unitNumber": 5,
    "unitTitle": "Heaps and Hashing",
    "topicGroup": "Heaps and Hashing",
    "subtopic": "Heaps: Introduction, Insertion, Deletion"
  },
  {
    "sno": 39,
    "subjectCode": "CSE205",
    "unitNumber": 5,
    "unitTitle": "Heaps and Hashing",
    "topicGroup": "Heaps and Hashing",
    "subtopic": "HeapSort"
  },
  {
    "sno": 40,
    "subjectCode": "CSE205",
    "unitNumber": 5,
    "unitTitle": "Heaps and Hashing",
    "topicGroup": "Heaps and Hashing",
    "subtopic": "Hashing introduction: hash functions, hash table"
  },
  {
    "sno": 41,
    "subjectCode": "CSE205",
    "unitNumber": 5,
    "unitTitle": "Heaps and Hashing",
    "topicGroup": "Heaps and Hashing",
    "subtopic": "Open hashing (separate chaining)"
  },
  {
    "sno": 42,
    "subjectCode": "CSE205",
    "unitNumber": 5,
    "unitTitle": "Heaps and Hashing",
    "topicGroup": "Heaps and Hashing",
    "subtopic": "Closed hashing (open addressing): linear probing, quadratic probing and double hashing"
  },
  {
    "sno": 43,
    "subjectCode": "CSE205",
    "unitNumber": 6,
    "unitTitle": "Graphs",
    "topicGroup": "Graphs",
    "subtopic": "Graph Traversal: BFS, DFS"
  },
  {
    "sno": 44,
    "subjectCode": "CSE205",
    "unitNumber": 6,
    "unitTitle": "Graphs",
    "topicGroup": "Graphs",
    "subtopic": "Shortest path algorithm: Dijkstra's Algorithm"
  },
  {
    "sno": 45,
    "subjectCode": "CSE205",
    "unitNumber": 6,
    "unitTitle": "Graphs",
    "topicGroup": "Graphs",
    "subtopic": "Bellman-Ford Algorithm"
  },
  {
    "sno": 46,
    "subjectCode": "CSE205",
    "unitNumber": 6,
    "unitTitle": "Graphs",
    "topicGroup": "Graphs",
    "subtopic": "Floyd Warshall Algorithm"
  }
];



// ───── CSE202: Object Oriented Programming ─────

const cse202Units: Unit[] = [
  {
    id: 'cse202-u1',
    number: 1,
    title: 'Concepts and Basics of C++ Programming; Functions',
    subjectId: 'cse202',
    topics: [
      {
        id: 'cse202-u1-t1',
        title: 'Introduction to OOP Concepts and Paradigm',
        unitId: 'cse202-u1',
        description: 'Overview of object-oriented programming: encapsulation, abstraction, inheritance, polymorphism, and contrast with procedural C.',
        prerequisites: ['Basic computer programming logic', 'Variables and conditional branching'],
        order: 1,
        subtopics: [
          "Introduction to concepts of OOP and OOP Languages",
          "Differences between procedural and object oriented programming paradigms"
],
        problemIds: ['p-cpp-classes-1', 'p-cpp-structs-1', 'p-cpp-const-member-functions-1'],
      },
      {
        id: 'cse202-u1-t2',
        title: 'Input/Output Using cin and cout Streams',
        unitId: 'cse202-u1',
        description: 'C++ I/O streams, features of iostream, stream extraction (>>) and insertion (<<) operators, formatted and unformatted I/O operations.',
        prerequisites: ['Standard C printf/scanf basics', 'Header files and namespaces'],
        order: 2,
        subtopics: [
          "Reading and writing data using cin and cout",
          "Features of Input/output Streams"
],
        problemIds: ['p-cpp-io-1', 'p-cpp-stringstream-1'],
      },
      {
        id: 'cse202-u1-t3',
        title: 'Creating Classes, Objects, and Member Functions',
        unitId: 'cse202-u1',
        description: 'Class definition, object instantiation, accessing class members, public vs private access specifiers.',
        prerequisites: ['C Structures (struct)', 'Functions and parameter passing'],
        order: 3,
        subtopics: [
          "Creating classes, Class objects, Accessing class members"
],
        problemIds: ['p-cpp-classes-1', 'p-cpp-encapsulation-1', 'p-cpp-const-member-functions-1'],
      },
      {
        id: 'cse202-u1-t4',
        title: 'Structures, Unions, and Enumerations vs Classes',
        unitId: 'cse202-u1',
        description: 'Differences between struct, union, enum, and class in C++. Default access specifiers and memory layout comparisons.',
        prerequisites: ['C data types', 'Memory alignment principles'],
        order: 4,
        subtopics: [
          "Differences between Structures, Unions, Enumerations and Classes"
],
        problemIds: ['p-cpp-structs-1'],
      },
      {
        id: 'cse202-u1-t5',
        title: 'Inline Member Functions & Optimization',
        unitId: 'cse202-u1',
        description: 'Inline function substitution, compiler hints, defining member functions inside vs outside class body with :: operator.',
        prerequisites: ['Function calls and stack frames', 'Class definitions'],
        order: 5,
        subtopics: [
          "Inline and Non-inline member functions"
],
        problemIds: ['p-cpp-classes-1'],
      },
      {
        id: 'cse202-u1-t6',
        title: 'Static Data Members and Static Member Functions',
        unitId: 'cse202-u1',
        description: 'Class-level vs instance-level data, static member access rules, static initialization outside class body.',
        prerequisites: ['Classes and Objects', 'Global vs local variable lifetimes'],
        order: 6,
        subtopics: [
          "Static data members and static member functions"
],
        problemIds: ['p-cpp-static-1', 'p-cpp-static-counter-1'],
      },
      {
        id: 'cse202-u1-t7',
        title: 'Functions with Default Arguments',
        unitId: 'cse202-u1',
        description: 'Default argument rules, trailing parameter requirements, preventing ambiguous function calls.',
        prerequisites: ['Function prototypes and signatures'],
        order: 7,
        subtopics: [
          "Functions with Default parameters/arguments"
],
        problemIds: ['p-cpp-func-overload-1', 'p-cpp-constructor-overload-1'],
      },
      {
        id: 'cse202-u1-t8',
        title: 'Manipulator Functions & Formatted I/O',
        unitId: 'cse202-u1',
        description: 'endl, setw, setprecision, setfill from <iomanip> and custom stream manipulators.',
        prerequisites: ['cin and cout streams', 'Include directives'],
        order: 8,
        subtopics: [
          "Manipulator Functions"
],
        problemIds: ['p-cpp-io-1', 'p-cpp-stringstream-1'],
      },
      {
        id: 'cse202-u1-t9',
        title: 'Compile-Time Function Overloading',
        unitId: 'cse202-u1',
        description: 'Static compile-time polymorphism through function overloading, overload resolution rules and type promotion.',
        prerequisites: ['Functions in C++', 'Data types and casting rules'],
        order: 9,
        subtopics: [
          "Function overloading and Scope rules"
],
        problemIds: ['p-cpp-func-overload-1'],
      },
      {
        id: 'cse202-u1-t10',
        title: 'Scope Rules & Scope Resolution Operator (::)',
        unitId: 'cse202-u1',
        description: 'Block scope, function scope, class scope, namespace scope, and the :: operator.',
        prerequisites: ['Block scoping in C/C++', 'Local vs global variables'],
        order: 10,
        subtopics: [
          "Scope rules & Scope Resolution Operator (::)"
],
        problemIds: ['p-cpp-classes-1', 'p-cpp-static-1', 'p-cpp-static-counter-1'],
      },
      {
        id: 'cse202-u1-t11',
        title: 'Friend Functions and Friend Classes',
        unitId: 'cse202-u1',
        description: 'Granting non-member functions or external classes access to private members, friendship rules and security considerations.',
        prerequisites: ['Private access specifier', 'Class encapsulation'],
        order: 11,
        subtopics: [
          "Friend of a class (friend function and friend class)"
],
        problemIds: ['p-cpp-friend-1', 'p-cpp-stream-overloading-1'],
      },
      {
        id: 'cse202-u1-t12',
        title: 'Reference Variables & Call by Value vs Reference',
        unitId: 'cse202-u1',
        description: 'Reference variable semantics as aliases, pass-by-value vs pass-by-reference vs pass-by-address.',
        prerequisites: ['Memory addresses', 'Pointers introduction'],
        order: 12,
        subtopics: [
          "Reference variables",
          "Differences between Call by value, Call by address and call by reference"
],
        problemIds: ['p-cpp-references-1', 'p-cpp-call-by-reference-1'],
      },
      {
        id: 'cse202-u1-t13',
        title: 'Function and Member-Function Recursion',
        unitId: 'cse202-u1',
        description: 'Recursive functions, activation records, call stack unwinding, base conditions.',
        prerequisites: ['Function execution stack', 'Mathematical induction'],
        order: 13,
        subtopics: [
          "Recursion (Function, Member Function)"
],
        visualizerId: 'factorial',
        problemIds: ['p-cpp-recursion-1', 'p-dsa-powx-n-1'],
      },
    ],
  },
  {
    id: 'cse202-u2',
    number: 2,
    title: 'Pointers, Reference Variables, Arrays and Strings',
    subjectId: 'cse202',
    topics: [
      {
        id: 'cse202-u2-t1',
        title: 'Void Pointers, Pointer Arithmetic, Pointer to Pointer',
        unitId: 'cse202-u2',
        description: 'Generic void* casting, arithmetic offsets on typed pointers, multi-level indirection (**ptr).',
        prerequisites: ['Memory address model', 'Data type sizes in bytes'],
        order: 1,
        subtopics: [
          "Void pointer, Pointer arithmetic, Pointer to pointer",
          "Differences between pointer and reference variables"
],
        problemIds: ['p-cpp-pointers-1', 'p-cpp-dynamic-arr-1', 'p-cpp-matrix-dynamic-2d-1'],
      },
      {
        id: 'cse202-u2-t2',
        title: 'Dangling, Wild, and Null Pointers',
        unitId: 'cse202-u2',
        description: 'Common pointer pitfalls: dangling pointers to deallocated heap or expired stack frames, uninitialized wild pointers, nullptr dereferencing.',
        prerequisites: ['Pointers in C++', 'Dynamic memory (new/delete)'],
        order: 2,
        subtopics: [
          "Possible problems with pointers - Dangling pointer, Wild pointer, Null pointer assignment"
],
        problemIds: ['p-cpp-pointers-1', 'p-cpp-unique-ptr-1'],
      },
      {
        id: 'cse202-u2-t3',
        title: 'Classes Containing Pointers & the this Pointer',
        unitId: 'cse202-u2',
        description: 'Dynamic data members in classes, the implicit this pointer, returning *this for method chaining.',
        prerequisites: ['Classes and Objects', 'Pointers in C++'],
        order: 3,
        subtopics: [
          "Classes containing pointers, Pointer to objects, this pointer"
],
        problemIds: ['p-cpp-this-pointer-1', 'p-cpp-copy-constructor-deep-1'],
      },
      {
        id: 'cse202-u2-t4',
        title: 'Arrays of Objects & Dynamic Allocation',
        unitId: 'cse202-u2',
        description: 'Creating and manipulating arrays of class objects, invoking constructors for each array element.',
        prerequisites: ['Classes', '1D Arrays'],
        order: 4,
        subtopics: [
          "Array of objects"
],
        problemIds: ['p-cpp-classes-1', 'p-cpp-matrix-dynamic-2d-1', 'p-dsa-array-traversal-1'],
      },
      {
        id: 'cse202-u2-t5',
        title: 'Standard C++ String Class (std::string)',
        unitId: 'cse202-u2',
        description: 'std::string member functions, substring, find, concatenation, and comparison vs C-style null-terminated char arrays.',
        prerequisites: ['Character arrays', 'Standard library basics'],
        order: 5,
        subtopics: [
          "The Standard C++ string class - defining and assigning string objects",
          "Member functions, Modifiers of string class"
],
        problemIds: ['p-cpp-strings-1', 'p-cpp-string-pointers-reverse-1', 'p-cpp-stringstream-1'],
      },
      {
        id: 'cse202-u2-t6',
        title: 'Multidimensional Arrays and Pointers to Members',
        unitId: 'cse202-u2',
        description: '2D array memory layout (row-major), pointer-to-member syntax (.* and ->* operators).',
        prerequisites: ['1D Arrays', 'Pointer arithmetic'],
        order: 6,
        subtopics: [
          "Array declaration and processing of multidimensional arrays (inside main and inside class)",
          "Pointer to data member"
],
        problemIds: ['p-cpp-pointers-1', 'p-cpp-matrix-dynamic-2d-1', 'p-dsa-rotate-image-1'],
      },
    ],
  },
  {
    id: 'cse202-u3',
    number: 3,
    title: 'Data File Operations; Constructors and Destructors',
    subjectId: 'cse202',
    topics: [
      {
        id: 'cse202-u3-t1',
        title: 'File Streams: Opening, Closing, Modes',
        unitId: 'cse202-u3',
        description: 'ifstream, ofstream, fstream; file open modes (ios::in, ios::out, ios::app, ios::binary), checking file open status.',
        prerequisites: ['I/O Streams (cin/cout)', 'Strings in C++'],
        order: 1,
        subtopics: [
          "Opening and closing of files",
          "Modes of file",
          "File stream functions"
],
        problemIds: ['p-cpp-filestreams-1', 'p-cpp-file-stream-operations-1'],
      },
      {
        id: 'cse202-u3-t2',
        title: 'Sequential and Random Access File Operations',
        unitId: 'cse202-u3',
        description: 'seekg, seekp, tellg, tellp for file pointer navigation, relative positioning (ios::beg, ios::cur, ios::end).',
        prerequisites: ['File Streams', 'Pointer offsets'],
        order: 2,
        subtopics: [
          "Reading/Writing of files",
          "Sequential access and random access file processing"
],
        problemIds: ['p-cpp-constructors-1', 'p-cpp-constructor-overload-1'],
      },
      {
        id: 'cse202-u3-t3',
        title: 'Binary File Operations with Objects',
        unitId: 'cse202-u3',
        description: 'read() and write() for binary I/O, writing struct and class instances directly to disk.',
        prerequisites: ['File Streams', 'Type casting (reinterpret_cast)'],
        order: 3,
        subtopics: [
          "Binary file operations",
          "Classes and file operations",
          "Structures and file operations"
],
        problemIds: ['p-cpp-constructors-1', 'p-cpp-copy-constructor-deep-1'],
      },
      {
        id: 'cse202-u3-t4',
        title: 'Constructors: Default, Parameterized, Copy',
        unitId: 'cse202-u3',
        description: 'Constructor types, member initialization lists, shallow copy vs deep copy, copy constructor invocation syntax.',
        prerequisites: ['Classes and Objects', 'Dynamic memory (new/delete)'],
        order: 4,
        subtopics: [
          "Manager functions (constructors and destructor)",
          "Default constructor",
          "Constructor with default arguments",
          "Parameterized constructor",
          "Copy constructor",
          "Initializer lists"
],
        problemIds: ['p-cpp-destructors-1', 'p-cpp-virtual-destructor-1', 'p-cpp-unique-ptr-1'],
      },
      {
        id: 'cse202-u3-t5',
        title: 'Destructors and Resource Cleanup (RAII)',
        unitId: 'cse202-u3',
        description: 'Object lifetime cleanup, destructor execution order in reverse of construction, RAII pattern.',
        prerequisites: ['Constructors', 'Scope and lifetime of variables'],
        order: 5,
        subtopics: [
          "Destructors"
],
        problemIds: ['p-cpp-destructors-1'],
      },
    ],
  },
  {
    id: 'cse202-u4',
    number: 4,
    title: 'Operator Overloading and Type Conversion; Inheritance',
    subjectId: 'cse202',
    topics: [
      {
        id: 'cse202-u4-t1',
        title: 'Unary and Binary Operator Overloading',
        unitId: 'cse202-u4',
        description: 'Overloading ++, --, +, -, ==, and stream operators (<<, >>) for user-defined classes.',
        prerequisites: ['Classes and Objects', 'Function Overloading', 'Friend Functions'],
        order: 1,
        subtopics: [
          "Operator Overloading (unary operator, binary operator overloading)"
],
        problemIds: ['p-cpp-operator-overload-1', 'p-cpp-stream-overloading-1', 'p-cpp-subscript-operator-1'],
      },
      {
        id: 'cse202-u4-t2',
        title: 'Type Conversion Between Basic and Class Types',
        unitId: 'cse202-u4',
        description: 'Conversion constructor (basic to class), conversion operator (class to basic), and class to class conversions.',
        prerequisites: ['Operator overloading', 'Constructors'],
        order: 2,
        subtopics: [
          "Type conversions - basic type to class type, class type to basic type"
],
        problemIds: ['p-cpp-inheritance-1', 'p-cpp-hierarchical-inheritance-1'],
      },
      {
        id: 'cse202-u4-t3',
        title: 'Inheritance Types: Single, Multiple, Multilevel',
        unitId: 'cse202-u4',
        description: 'Base and derived class syntax, public vs protected vs private inheritance modes, constructor chaining.',
        prerequisites: ['Classes and Objects', 'Access specifiers'],
        order: 3,
        subtopics: [
          "Inheritance Basics - derived class and base class",
          "Types (simple, multi-level, multiple and hierarchical)",
          "Modes (private, protected, public inheritance)"
],
        problemIds: ['p-cpp-multiple-inheritance-order-1', 'p-cpp-diamond-problem-1'],
      },
      {
        id: 'cse202-u4-t4',
        title: 'Hierarchical & Hybrid Inheritance; Diamond Problem',
        unitId: 'cse202-u4',
        description: 'Multi-path inheritance, ambiguity in duplicate base class instances, and solution using virtual base classes.',
        prerequisites: ['Multiple inheritance', 'Constructors in inheritance'],
        order: 4,
        subtopics: [
          "Overriding member functions",
          "Order of execution of constructors and destructors",
          "Resolving ambiguities in inheritance, Virtual base class",
          "Aggregation and Composition"
],
        problemIds: ['p-cpp-diamond-problem-1'],
      },
    ],
  },
  {
    id: 'cse202-u5',
    number: 5,
    title: 'Polymorphism and Virtual Functions',
    subjectId: 'cse202',
    topics: [
      {
        id: 'cse202-u5-t1',
        title: 'Pointers to Derived Class Objects',
        unitId: 'cse202-u5',
        description: 'Base class pointers holding derived class addresses, object slicing, early static binding limitations.',
        prerequisites: ['Pointers in C++', 'Inheritance'],
        order: 1,
        subtopics: [
          "Dynamic memory allocation using new and delete operators",
          "Dynamic constructors",
          "Introduction to Self-Referential class"
],
        problemIds: ['p-cpp-polymorphism-1', 'p-cpp-dynamic-cast-rtti-1'],
      },
      {
        id: 'cse202-u5-t2',
        title: 'Virtual Functions & Runtime Dynamic Dispatch',
        unitId: 'cse202-u5',
        description: 'The virtual keyword, vtable and vptr internal mechanics, dynamic dispatch at runtime.',
        prerequisites: ['Base class pointers', 'Function overriding'],
        order: 2,
        subtopics: [
          "Compile and run time polymorphism",
          "Virtual functions",
          "Early binding and late binding"
],
        problemIds: ['p-cpp-abstract-class-1', 'p-cpp-pure-virtual-interface-1', 'p-cpp-virtual-destructor-1'],
      },
      {
        id: 'cse202-u5-t3',
        title: 'Pure Virtual Functions and Abstract Classes',
        unitId: 'cse202-u5',
        description: 'Pure virtual syntax (= 0), creating abstract interface classes that cannot be instantiated directly.',
        prerequisites: ['Virtual functions', 'Inheritance'],
        order: 3,
        subtopics: [
          "Abstract classes and concrete class",
          "Pure virtual functions"
],
        problemIds: ['p-cpp-abstract-class-1'],
      },
      {
        id: 'cse202-u5-t4',
        title: 'Virtual Destructors',
        unitId: 'cse202-u5',
        description: 'Why polymorphic base class destructors must be declared virtual to ensure proper derived cleanup.',
        prerequisites: ['Destructors', 'Virtual functions'],
        order: 4,
        subtopics: [
          "Virtual destructors",
          "Memory leak and allocation failures"
],
        problemIds: ['p-cpp-virtual-destructor-1'],
      },
    ],
  },
  {
    id: 'cse202-u6',
    number: 6,
    title: 'Exception Handling, Templates, and Standard Template Library',
    subjectId: 'cse202',
    topics: [
      {
        id: 'cse202-u6-t1',
        title: 'Exception Handling: try, catch, and throw',
        unitId: 'cse202-u6',
        description: 'Synchronous exception mechanisms, catching standard exceptions, catch-all (...) handler, rethrowing.',
        prerequisites: ['Control flow', 'Functions', 'Stack unwinding'],
        order: 1,
        subtopics: [
          "Basics of exception handling",
          "Exception handling mechanism",
          "Throwing mechanism",
          "Catching mechanism",
          "Rethrowing an exception"
],
        problemIds: ['p-cpp-exceptions-1', 'p-cpp-custom-exception-1'],
      },
      {
        id: 'cse202-u6-t2',
        title: 'Function Templates and Class Templates',
        unitId: 'cse202-u6',
        description: 'Generic programming, template specialization, non-type template parameters, compiler code generation.',
        prerequisites: ['Function overloading', 'Classes in C++'],
        order: 2,
        subtopics: [
          "Function template and class template",
          "Class template with inheritance"
],
        problemIds: ['p-cpp-templates-1', 'p-cpp-fn-template-max-1', 'p-cpp-class-templates-multi-1'],
      },
      {
        id: 'cse202-u6-t3',
        title: 'STL Containers: vector, list, deque, map, set',
        unitId: 'cse202-u6',
        description: 'Sequential vs associative containers, memory representations, time complexities of insert and find.',
        prerequisites: ['Class templates', 'Pointers and references'],
        order: 3,
        subtopics: [
          "Introduction to STL - Containers, Algorithms and iterators"
],
        problemIds: ['p-cpp-stl-vector-1', 'p-cpp-stl-map-1', 'p-cpp-stl-unordered-map-1', 'p-cpp-stl-priority-queue-1', 'p-cpp-stl-algorithms-lambda-1'],
      },
      {
        id: 'cse202-u6-t4',
        title: 'STL Algorithms and Iterators',
        unitId: 'cse202-u6',
        description: 'Input, output, forward, bidirectional, and random access iterators; <algorithm> functions (sort, find, binary_search).',
        prerequisites: ['STL Containers', 'Function pointers / lambdas'],
        order: 4,
        subtopics: [
          "Container - Vector and List"
],
        problemIds: ['p-cpp-stl-vector-1', 'p-dsa-binary-search-1'],
      },
    ],
  },
];

// ───── CSE205: Data Structures and Algorithms ─────

const cse205Units: Unit[] = [
  {
    id: 'cse205-u1',
    number: 1,
    title: 'Introduction to Data Structures, Arrays, and Sorting',
    subjectId: 'cse205',
    topics: [
      {
        id: 'cse205-u1-t1',
        title: 'Introduction to Data Structures & Big-O Notation',
        unitId: 'cse205-u1',
        description: 'Linear vs non-linear structures, primitive vs non-primitive, asymptotic analysis (Big-O, Omega, Theta), time-space tradeoffs.',
        prerequisites: ['Basic programming', 'Mathematical functions and limits'],
        order: 1,
        subtopics: [
          "Basic Concepts and Notations",
          "Complexity analysis: time, space and trade off",
          "Omega Notation",
          "Theta Notation",
          "Big O notation",
          "Basic Data Structures"
],
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
      {
        id: 'cse205-u1-t2',
        title: 'Arrays: Traversal, Insertion, and Deletion',
        unitId: 'cse205-u1',
        description: 'Contiguous 1D and 2D memory addressing, element shifting costs for insertions and deletions at arbitrary indices.',
        prerequisites: ['Array memory model', 'Loop constructs'],
        order: 2,
        subtopics: [
          "Linear arrays: memory representation",
          "Array operations: traversal, insertion, deletion, sorting, searching and merging and their complexity analysis"
],
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
      {
        id: 'cse205-u1-t3',
        title: 'Bubble Sort Algorithm & Optimization',
        unitId: 'cse205-u1',
        description: 'Adjacent element comparisons and swaps, pass-by-pass bubbling of maximum element, early termination flag.',
        prerequisites: ['Arrays', 'Swapping values'],
        order: 3,
        subtopics: [
          "Bubble sort"
],
        visualizerId: 'bubble-sort',
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
      {
        id: 'cse205-u1-t4',
        title: 'Insertion Sort Algorithm',
        unitId: 'cse205-u1',
        description: 'Incrementally inserting unsorted elements into their correct position in the sorted sublist, best case O(n).',
        prerequisites: ['Arrays', 'Nested loops'],
        order: 4,
        subtopics: [
          "Insertion sort"
],
        visualizerId: 'insertion-sort',
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
      {
        id: 'cse205-u1-t5',
        title: 'Selection Sort Algorithm',
        unitId: 'cse205-u1',
        description: 'Finding the minimum element in unsorted suffix and swapping it into place, quadratic comparison cost.',
        prerequisites: ['Arrays', 'Minimum element finding'],
        order: 5,
        subtopics: [
          "Selection sort"
],
        visualizerId: 'selection-sort',
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
      {
        id: 'cse205-u1-t6',
        title: 'Linear Search Algorithm',
        unitId: 'cse205-u1',
        description: 'Sequential iteration checking target matching on unsorted or sorted sequences, O(n) worst-case.',
        prerequisites: ['Array traversal'],
        order: 6,
        subtopics: [
          "Searching: Linear Search"
],
        visualizerId: 'linear-search',
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
      {
        id: 'cse205-u1-t7',
        title: 'Binary Search Algorithm',
        unitId: 'cse205-u1',
        description: 'Divide-and-conquer searching on sorted sequences with logarithmic O(log n) time, preventing integer overflow.',
        prerequisites: ['Sorted arrays', 'Divide-and-conquer concept'],
        order: 7,
        subtopics: [
          "Searching: Binary Search"
],
        visualizerId: 'binary-search',
        problemIds: ['p-lpu-array-traversal-1', 'p-lpu-array-insert-1', 'p-lpu-linear-search-1'],
      },
    ],
  },
  {
    id: 'cse205-u2',
    number: 2,
    title: 'Linked Lists (Singly, Doubly, Circular)',
    subjectId: 'cse205',
    topics: [
      {
        id: 'cse205-u2-t1',
        title: 'Singly Linked List: Nodes, Traversal, Insertion',
        unitId: 'cse205-u2',
        description: 'Dynamic node allocation, head pointer, inserting at beginning, middle, and end with pointer manipulation.',
        prerequisites: ['Pointers in C++', 'Dynamic memory (new/delete)'],
        order: 1,
        subtopics: [
          "Introduction",
          "Memory representation",
          "Allocation",
          "Traversal",
          "Insertion"
],
        visualizerId: 'singly-linked-list',
        problemIds: ['p-lpu-merge-sort-1', 'p-lpu-quick-sort-1', 'p-lpu-kadane-1'],
      },
      {
        id: 'cse205-u2-t2',
        title: 'Singly Linked List Deletion and Reversal',
        unitId: 'cse205-u2',
        description: 'Node deletion by value or position, avoiding memory leaks, in-place reversal using 3 pointers.',
        prerequisites: ['Singly Linked List basics', 'Pointer reassignment'],
        order: 2,
        subtopics: [
          "Deletion"
],
        visualizerId: 'singly-linked-list',
        problemIds: ['p-lpu-merge-sort-1', 'p-lpu-quick-sort-1', 'p-lpu-kadane-1'],
      },
      {
        id: 'cse205-u2-t3',
        title: 'Doubly Linked List Structure and Operations',
        unitId: 'cse205-u2',
        description: 'Bidirectional next and prev pointers, insertion and deletion operations, advantages and memory overhead.',
        prerequisites: ['Singly Linked List', 'Pointer arithmetic'],
        order: 3,
        subtopics: [
          "Two-way lists: operations on two way linked lists"
],
        problemIds: ['p-lpu-merge-sort-1', 'p-lpu-quick-sort-1', 'p-lpu-kadane-1'],
      },
      {
        id: 'cse205-u2-t4',
        title: 'Circular Linked List: Singly and Doubly',
        unitId: 'cse205-u2',
        description: 'Tail node linking back to head node, circular traversal loop termination, round-robin applications.',
        prerequisites: ['Linked list traversal'],
        order: 4,
        subtopics: [
          "Header linked lists: Grounded and Circular"
],
        problemIds: ['p-lpu-merge-sort-1', 'p-lpu-quick-sort-1', 'p-lpu-kadane-1'],
      },
    ],
  },
  {
    id: 'cse205-u3',
    number: 3,
    title: 'Stacks and Queues',
    subjectId: 'cse205',
    topics: [
      {
        id: 'cse205-u3-t1',
        title: 'Stack ADT: Array and Linked List Implementations',
        unitId: 'cse205-u3',
        description: 'LIFO principle, push, pop, peek, overflow and underflow conditions using arrays vs linked lists.',
        prerequisites: ['Arrays', 'Singly Linked Lists'],
        order: 1,
        subtopics: [
          "Introduction: List and Array representations",
          "Operations on stack (traversal, push and pop)"
],
        visualizerId: 'stack-operations',
        problemIds: ['p-lpu-ll-middle-1', 'p-lpu-ll-reverse-1', 'p-lpu-dll-1'],
      },
      {
        id: 'cse205-u3-t2',
        title: 'Stack Applications: Infix, Postfix, and Prefix',
        unitId: 'cse205-u3',
        description: 'Operator precedence parsing, Infix to Postfix conversion via Shunting-Yard algorithm, Postfix evaluation.',
        prerequisites: ['Stack ADT', 'Operator precedence and associativity'],
        order: 2,
        subtopics: [
          "Arithmetic expressions: polish notation, evaluation and transformation of expressions"
],
        visualizerId: 'stack-operations',
        problemIds: ['p-lpu-ll-middle-1', 'p-lpu-ll-reverse-1', 'p-lpu-dll-1'],
      },
      {
        id: 'cse205-u3-t3',
        title: 'Queue ADT: Linear and Circular Queue',
        unitId: 'cse205-u3',
        description: 'FIFO principle, front and rear pointers, circular queue modulo indexing to prevent false overflow.',
        prerequisites: ['Arrays', 'Modulo arithmetic'],
        order: 3,
        subtopics: [
          "Array and list representation",
          "Operations (traversal, insertion and deletion)"
],
        visualizerId: 'queue-operations',
        problemIds: ['p-lpu-ll-middle-1', 'p-lpu-ll-reverse-1', 'p-lpu-dll-1'],
      },
      {
        id: 'cse205-u3-t4',
        title: 'Double-Ended Queue (Deque) and Priority Queue',
        unitId: 'cse205-u3',
        description: 'Insertions and deletions at both ends (Deque), priority-based removal order.',
        prerequisites: ['Linear Queue ADT'],
        order: 4,
        subtopics: [
          "Priority Queues",
          "Deques"
],
        problemIds: ['p-lpu-ll-middle-1', 'p-lpu-ll-reverse-1', 'p-lpu-dll-1'],
      },
    ],
  },
  {
    id: 'cse205-u4',
    number: 4,
    title: 'Recursion, Trees, and Advanced Sorting',
    subjectId: 'cse205',
    topics: [
      {
        id: 'cse205-u4-t1',
        title: 'Recursion and Tower of Hanoi',
        unitId: 'cse205-u4',
        description: 'Recursive problem breakdown, call stack mechanics, solving Tower of Hanoi in 2^n - 1 moves.',
        prerequisites: ['Stack ADT', 'Functions and recursion'],
        order: 1,
        subtopics: [
          "Introduction to Recursion",
          "Recursive implementation of Towers of Hanoi"
],
        visualizerId: 'hanoi',
        problemIds: ['p-lpu-stack-valid-parens-1', 'p-lpu-queue-1', 'p-lpu-circular-queue-1'],
      },
      {
        id: 'cse205-u4-t2',
        title: 'Binary Trees: Terminology and Traversals',
        unitId: 'cse205-u4',
        description: 'Root, leaf, height, depth, full vs complete binary trees; Inorder, Preorder, Postorder, and Level-Order traversals.',
        prerequisites: ['Linked list node structures', 'Recursion'],
        order: 2,
        subtopics: [
          "Binary trees: introduction (complete and extended binary trees)",
          "Memory representation (linked, sequential)"
],
        problemIds: ['p-lpu-stack-valid-parens-1', 'p-lpu-queue-1', 'p-lpu-circular-queue-1'],
      },
      {
        id: 'cse205-u4-t3',
        title: 'Binary Search Trees (BST): Search, Insert, Delete',
        unitId: 'cse205-u4',
        description: 'BST property (left < root < right), searching, insertion, and 3 deletion cases (leaf, one child, two children with inorder successor).',
        prerequisites: ['Binary Trees', 'Binary Search'],
        order: 3,
        subtopics: [
          "Binary Search Tree: introduction, searching, insertion and deletion",
          "In-order traversal",
          "Pre-order traversal",
          "Post-order traversal using recursion"
],
        visualizerId: 'bst-insert',
        problemIds: ['p-lpu-stack-valid-parens-1', 'p-lpu-queue-1', 'p-lpu-circular-queue-1'],
      },
      {
        id: 'cse205-u4-t4',
        title: 'Merge Sort Algorithm',
        unitId: 'cse205-u4',
        description: 'Divide and conquer sorting, array splitting, linear merge process, recurrence T(n) = 2T(n/2) + O(n).',
        prerequisites: ['Recursion', 'Array manipulation'],
        order: 4,
        subtopics: [
          "Merge sort"
],
        visualizerId: 'merge-sort',
        problemIds: ['p-lpu-stack-valid-parens-1', 'p-lpu-queue-1', 'p-lpu-circular-queue-1'],
      },
      {
        id: 'cse205-u4-t5',
        title: 'Quick Sort Algorithm and Partitioning',
        unitId: 'cse205-u4',
        description: 'Pivot selection, Lomuto vs Hoare partitioning schemes, best case O(n log n) vs worst case O(n^2).',
        prerequisites: ['Recursion', 'Array in-place swapping'],
        order: 5,
        subtopics: [
          "Quick sort"
],
        visualizerId: 'quick-sort',
        problemIds: ['p-lpu-stack-valid-parens-1', 'p-lpu-queue-1', 'p-lpu-circular-queue-1'],
      },
    ],
  },
  {
    id: 'cse205-u5',
    number: 5,
    title: 'Heaps, AVL Trees, and Hashing',
    subjectId: 'cse205',
    topics: [
      {
        id: 'cse205-u5-t1',
        title: 'Binary Heaps, Priority Queues, and Heap Sort',
        unitId: 'cse205-u5',
        description: 'Min-Heap and Max-Heap properties, array representation (2i+1, 2i+2), heapify procedure, Heap Sort in O(n log n).',
        prerequisites: ['Complete binary trees', 'Array representations of trees'],
        order: 1,
        subtopics: [
          "Heaps: Introduction, Insertion, Deletion",
          "HeapSort"
],
        visualizerId: 'heap-sort',
        problemIds: ['p-lpu-tree-traversal-1', 'p-lpu-bst-insert-1', 'p-lpu-bst-validate-1'],
      },
      {
        id: 'cse205-u5-t2',
        title: 'AVL Trees and Height Balancing Rotations',
        unitId: 'cse205-u5',
        description: 'Balance factor calculation (height(left) - height(right)), single (LL, RR) and double (LR, RL) rotations.',
        prerequisites: ['Binary Search Trees (BST)', 'Tree height calculation'],
        order: 2,
        subtopics: [
          "AVL Trees & Height Balancing"
],
        visualizerId: 'avl-balancing',
        problemIds: ['p-lpu-tree-traversal-1', 'p-lpu-bst-insert-1', 'p-lpu-bst-validate-1'],
      },
      {
        id: 'cse205-u5-t3',
        title: 'Hashing: Hash Functions and Collision Resolution',
        unitId: 'cse205-u5',
        description: 'Division, multiplication, and folding hash methods; collision resolution via Separate Chaining vs Open Addressing (linear probing, quadratic probing, double hashing).',
        prerequisites: ['Arrays', 'Linked Lists', 'Modulo arithmetic'],
        order: 3,
        subtopics: [
          "Hashing introduction: hash functions, hash table",
          "Open hashing (separate chaining)",
          "Closed hashing (open addressing): linear probing, quadratic probing and double hashing"
],
        problemIds: ['p-lpu-tree-traversal-1', 'p-lpu-bst-insert-1', 'p-lpu-bst-validate-1'],
      },
    ],
  },
  {
    id: 'cse205-u6',
    number: 6,
    title: 'Graphs and Graph Algorithms',
    subjectId: 'cse205',
    topics: [
      {
        id: 'cse205-u6-t1',
        title: 'Graph Representations & Breadth-First Search (BFS)',
        unitId: 'cse205-u6',
        description: 'Adjacency matrix vs adjacency list representations, BFS queue traversal, shortest paths in unweighted graphs.',
        prerequisites: ['Queue ADT', '2D Arrays and Linked Lists'],
        order: 1,
        subtopics: [
          "Graph Traversal: BFS"
],
        visualizerId: 'bfs',
        problemIds: ['p-lpu-heap-kth-1', 'p-lpu-heap-sort-1', 'p-lpu-bfs-1'],
      },
      {
        id: 'cse205-u6-t2',
        title: 'Depth-First Search (DFS) & Cycle Detection',
        unitId: 'cse205-u6',
        description: 'Stack-based or recursive graph exploration, back-edges, cycle detection in directed and undirected graphs.',
        prerequisites: ['Graph representations', 'Recursion and Call Stacks'],
        order: 2,
        subtopics: [
          "Graph Traversal: DFS"
],
        visualizerId: 'dfs',
        problemIds: ['p-lpu-heap-kth-1', 'p-lpu-heap-sort-1', 'p-lpu-bfs-1'],
      },
      {
        id: 'cse205-u6-t3',
        title: "Dijkstra's Shortest Path Algorithm",
        unitId: 'cse205-u6',
        description: 'Single-source shortest path for non-negative weighted graphs using greedy edge relaxation and min-priority queues.',
        prerequisites: ['Weighted Graphs', 'Priority Queues (Min-Heap)'],
        order: 3,
        subtopics: [
          "Shortest path algorithm: Dijkstra's Algorithm"
],
        visualizerId: 'dijkstra',
        problemIds: ['p-lpu-heap-kth-1', 'p-lpu-heap-sort-1', 'p-lpu-bfs-1'],
      },
      {
        id: 'cse205-u6-t4',
        title: 'Bellman-Ford Algorithm & Negative Cycle Detection',
        unitId: 'cse205-u6',
        description: 'Single-source shortest path supporting negative edge weights, relaxing all edges |V|-1 times, detecting negative cycles.',
        prerequisites: ['Weighted graphs', "Dijkstra's Algorithm"],
        order: 4,
        subtopics: [
          "Bellman-Ford Algorithm"
],
        problemIds: ['p-lpu-heap-kth-1', 'p-lpu-heap-sort-1', 'p-lpu-bfs-1'],
      },
      {
        id: 'cse205-u6-t5',
        title: 'Floyd-Warshall All-Pairs Shortest Path & Minimum Spanning Trees',
        unitId: 'cse205-u6',
        description: 'All-pairs shortest paths via dynamic programming (Floyd-Warshall), Prim and Kruskal MST algorithms.',
        prerequisites: ['Graph representations', '2D arrays', 'Greedy algorithms'],
        order: 5,
        subtopics: [
          "Floyd Warshall Algorithm",
          "Minimum Spanning Trees"
],
        visualizerId: 'prim',
        problemIds: ['p-lpu-heap-kth-1', 'p-lpu-heap-sort-1', 'p-lpu-bfs-1'],
      },
    ],
  },
];

// ───── Subject Definitions ─────

export const SUBJECTS: Subject[] = [
  {
    id: 'cse202',
    code: 'CSE202',
    name: 'Object Oriented Programming',
    universityId: 'lpu',
    semester: 3,
    description: 'Comprehensive study of OOP concepts using C++ including classes, inheritance, polymorphism, templates, file streams, and STL.',
    units: cse202Units,
  },
  {
    id: 'cse205',
    code: 'CSE205',
    name: 'Data Structures and Algorithms',
    universityId: 'lpu',
    semester: 3,
    description: 'Fundamental data structures and algorithms including arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and hashing.',
    units: cse205Units,
  },
];

// ───── Helper Functions ─────

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getUnitById(subjectId: string, unitId: string): Unit | undefined {
  const subject = getSubjectById(subjectId);
  return subject?.units.find((u) => u.id === unitId);
}

export function getTopicById(topicId: string): Topic | undefined {
  for (const subject of SUBJECTS) {
    for (const unit of subject.units) {
      const topic = unit.topics.find((t) => t.id === topicId);
      if (topic) return topic;
    }
  }
  return undefined;
}

export function getAllTopics(): Topic[] {
  return SUBJECTS.flatMap((s) => s.units.flatMap((u) => u.topics));
}
