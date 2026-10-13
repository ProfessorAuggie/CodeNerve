import type { Subject, Unit, Topic } from '../types';

// ───── CSE202: Object Oriented Programming ─────

const cse202Units: Unit[] = [
  {
    id: 'cse202-u1',
    number: 1,
    title: 'Concepts and Basics of C++ Programming; Functions',
    subjectId: 'cse202',
    topics: [
      { id: 'cse202-u1-t1', title: 'Introduction to OOP Concepts and OOP Languages', unitId: 'cse202-u1', description: 'Overview of object-oriented programming paradigm, encapsulation, abstraction, inheritance, polymorphism, and comparison with procedural programming.', order: 1, problemIds: [] },
      { id: 'cse202-u1-t2', title: 'Input/Output Using cin and cout', unitId: 'cse202-u1', description: 'C++ I/O streams, features of iostream, formatted and unformatted I/O operations.', order: 2, problemIds: [] },
      { id: 'cse202-u1-t3', title: 'Creating Classes and Objects', unitId: 'cse202-u1', description: 'Class definition, object instantiation, accessing class members, access specifiers.', order: 3, problemIds: ['p-cpp-classes-1'] },
      { id: 'cse202-u1-t4', title: 'Structures, Unions, Enumerations vs Classes', unitId: 'cse202-u1', description: 'Differences between struct, union, enum, and class in C++. Default access specifiers, memory layout.', order: 4, problemIds: [] },
      { id: 'cse202-u1-t5', title: 'Inline and Non-Inline Member Functions', unitId: 'cse202-u1', description: 'Inline function optimization, defining member functions inside and outside class body.', order: 5, problemIds: [] },
      { id: 'cse202-u1-t6', title: 'Static Data Members and Static Member Functions', unitId: 'cse202-u1', description: 'Class-level vs instance-level data, static member access rules and use cases.', order: 6, problemIds: [] },
      { id: 'cse202-u1-t7', title: 'Functions with Default Arguments and Inline Functions', unitId: 'cse202-u1', description: 'Default argument rules, inline keyword, compiler optimization hints.', order: 7, problemIds: [] },
      { id: 'cse202-u1-t8', title: 'Manipulator Functions', unitId: 'cse202-u1', description: 'endl, setw, setprecision, setfill and custom manipulators for I/O formatting.', order: 8, problemIds: [] },
      { id: 'cse202-u1-t9', title: 'Function Overloading', unitId: 'cse202-u1', description: 'Compile-time polymorphism through function overloading, overload resolution rules.', order: 9, problemIds: ['p-cpp-func-overload-1'] },
      { id: 'cse202-u1-t10', title: 'Scope Rules', unitId: 'cse202-u1', description: 'Block scope, function scope, class scope, namespace scope, and scope resolution operator.', order: 10, problemIds: [] },
      { id: 'cse202-u1-t11', title: 'Friend Functions and Friend Classes', unitId: 'cse202-u1', description: 'Granting external access to private members, friendship rules and design considerations.', order: 11, problemIds: ['p-cpp-friend-1'] },
      { id: 'cse202-u1-t12', title: 'Reference Variables, Call by Value/Address/Reference', unitId: 'cse202-u1', description: 'Reference semantics, parameter passing mechanisms, and their trade-offs.', order: 12, problemIds: [] },
      { id: 'cse202-u1-t13', title: 'Function and Member-Function Recursion', unitId: 'cse202-u1', description: 'Recursive functions in C++, base cases, recursive member functions.', order: 13, visualizerId: 'vis-recursion', problemIds: [] },
    ],
  },
  {
    id: 'cse202-u2',
    number: 2,
    title: 'Pointers, Reference Variables, Arrays and Strings',
    subjectId: 'cse202',
    topics: [
      { id: 'cse202-u2-t1', title: 'Void Pointers, Pointer Arithmetic, Pointer to Pointer', unitId: 'cse202-u2', description: 'Generic pointers, arithmetic on typed pointers, multilevel pointers.', order: 1, problemIds: [] },
      { id: 'cse202-u2-t2', title: 'Dangling, Wild, and Null Pointers', unitId: 'cse202-u2', description: 'Common pointer pitfalls: dangling references, uninitialized pointers, null pointer dereferencing.', order: 2, problemIds: [] },
      { id: 'cse202-u2-t3', title: 'Classes Containing Pointers and this Pointer', unitId: 'cse202-u2', description: 'Dynamic members in classes, the this pointer, returning *this for chaining.', order: 3, problemIds: [] },
      { id: 'cse202-u2-t4', title: 'Arrays of Objects', unitId: 'cse202-u2', description: 'Creating and manipulating arrays of class objects, constructors with arrays.', order: 4, problemIds: [] },
      { id: 'cse202-u2-t5', title: 'Standard C++ String Class', unitId: 'cse202-u2', description: 'std::string operations, member functions, modifiers, comparison, and concatenation.', order: 5, problemIds: ['p-cpp-strings-1'] },
      { id: 'cse202-u2-t6', title: 'Multidimensional Arrays and Pointers to Data Members', unitId: 'cse202-u2', description: '2D arrays inside main and classes, pointer-to-member syntax.', order: 6, problemIds: [] },
    ],
  },
  {
    id: 'cse202-u3',
    number: 3,
    title: 'Data File Operations; Constructors and Destructors',
    subjectId: 'cse202',
    topics: [
      { id: 'cse202-u3-t1', title: 'File Streams: Opening, Closing, Modes', unitId: 'cse202-u3', description: 'ifstream, ofstream, fstream; file open modes (ios::in, ios::out, ios::app, etc).', order: 1, problemIds: [] },
      { id: 'cse202-u3-t2', title: 'Sequential and Random Access File Operations', unitId: 'cse202-u3', description: 'Reading/writing sequentially, seekg, seekp, tellg, tellp for random access.', order: 2, problemIds: [] },
      { id: 'cse202-u3-t3', title: 'Binary File Operations', unitId: 'cse202-u3', description: 'read() and write() for binary I/O, file operations with structs and classes.', order: 3, problemIds: [] },
      { id: 'cse202-u3-t4', title: 'Constructors: Default, Parameterized, Copy', unitId: 'cse202-u3', description: 'Constructor types, initialization lists, shallow vs deep copy, constructor overloading.', order: 4, problemIds: ['p-cpp-constructors-1'] },
      { id: 'cse202-u3-t5', title: 'Destructors', unitId: 'cse202-u3', description: 'Resource cleanup, destructor invocation order, virtual destructors.', order: 5, problemIds: [] },
    ],
  },
  {
    id: 'cse202-u4',
    number: 4,
    title: 'Operator Overloading and Type Conversion; Inheritance',
    subjectId: 'cse202',
    topics: [
      { id: 'cse202-u4-t1', title: 'Unary and Binary Operator Overloading', unitId: 'cse202-u4', description: 'Overloading ++, --, +, -, ==, <<, >> operators for user-defined types.', order: 1, problemIds: ['p-cpp-operator-overload-1'] },
      { id: 'cse202-u4-t2', title: 'Type Conversion Between Basic and Class Types', unitId: 'cse202-u4', description: 'Conversion constructors, conversion functions (operator type()), explicit keyword.', order: 2, problemIds: [] },
      { id: 'cse202-u4-t3', title: 'Inheritance: Single, Multilevel, Multiple, Hierarchical', unitId: 'cse202-u4', description: 'Inheritance types, base/derived relationships, access control in inheritance.', order: 3, problemIds: ['p-cpp-inheritance-1'] },
      { id: 'cse202-u4-t4', title: 'Function Overriding and Virtual Base Classes', unitId: 'cse202-u4', description: 'Overriding base class functions, diamond problem, virtual inheritance resolution.', order: 4, problemIds: [] },
      { id: 'cse202-u4-t5', title: 'Aggregation and Composition', unitId: 'cse202-u4', description: '"Has-a" relationships, object composition vs aggregation, lifetime management.', order: 5, problemIds: [] },
    ],
  },
  {
    id: 'cse202-u5',
    number: 5,
    title: 'Dynamic Memory Management and Polymorphism',
    subjectId: 'cse202',
    topics: [
      { id: 'cse202-u5-t1', title: 'Dynamic Allocation Using new and delete', unitId: 'cse202-u5', description: 'Heap allocation for objects and arrays, deallocation, memory leaks.', order: 1, problemIds: [] },
      { id: 'cse202-u5-t2', title: 'Virtual Functions and Runtime Polymorphism', unitId: 'cse202-u5', description: 'vtable mechanism, virtual function dispatch, pure virtual functions.', order: 2, problemIds: ['p-cpp-polymorphism-1'] },
      { id: 'cse202-u5-t3', title: 'Abstract and Concrete Classes', unitId: 'cse202-u5', description: 'Abstract base classes, interface design with pure virtual functions.', order: 3, problemIds: [] },
      { id: 'cse202-u5-t4', title: 'Early vs Late Binding, Virtual Destructors', unitId: 'cse202-u5', description: 'Static vs dynamic binding, why virtual destructors are essential.', order: 4, problemIds: [] },
    ],
  },
  {
    id: 'cse202-u6',
    number: 6,
    title: 'Exception Handling, Templates and STL',
    subjectId: 'cse202',
    topics: [
      { id: 'cse202-u6-t1', title: 'Exception Handling: try, catch, throw', unitId: 'cse202-u6', description: 'Exception handling mechanism, multiple catch blocks, rethrowing exceptions.', order: 1, problemIds: [] },
      { id: 'cse202-u6-t2', title: 'Function Templates and Class Templates', unitId: 'cse202-u6', description: 'Generic programming with templates, template specialization, templates with inheritance.', order: 2, problemIds: ['p-cpp-templates-1'] },
      { id: 'cse202-u6-t3', title: 'STL: Containers, Algorithms, Iterators', unitId: 'cse202-u6', description: 'vector, list, map, set; sort, find, transform; iterator categories.', order: 3, problemIds: ['p-cpp-stl-1'] },
    ],
  },
];

// ───── CSE205: Data Structures and Algorithms ─────

const cse205Units: Unit[] = [
  {
    id: 'cse205-u1',
    number: 1,
    title: 'Introduction, Arrays, Sorting and Searching',
    subjectId: 'cse205',
    topics: [
      { id: 'cse205-u1-t1', title: 'Basic Concepts: Time and Space Complexity', unitId: 'cse205-u1', description: 'Big O, Omega, and Theta notations. Time-space trade-offs. Analyzing algorithm efficiency.', order: 1, problemIds: [] },
      { id: 'cse205-u1-t2', title: 'Linear Arrays: Traversal, Insertion, Deletion', unitId: 'cse205-u1', description: 'Array memory representation, basic operations and their complexity.', order: 2, problemIds: ['p-dsa-array-traversal-1', 'p-dsa-array-insert-1'] },
      { id: 'cse205-u1-t3', title: 'Bubble Sort', unitId: 'cse205-u1', description: 'Comparison-based sorting, adjacent swaps, optimization with early termination.', order: 3, visualizerId: 'bubble-sort', problemIds: ['p-dsa-bubble-sort-1'] },
      { id: 'cse205-u1-t4', title: 'Insertion Sort', unitId: 'cse205-u1', description: 'Building sorted portion by inserting elements in correct position.', order: 4, visualizerId: 'insertion-sort', problemIds: ['p-dsa-insertion-sort-1'] },
      { id: 'cse205-u1-t5', title: 'Selection Sort', unitId: 'cse205-u1', description: 'Finding minimum element and placing it at the beginning iteratively.', order: 5, visualizerId: 'selection-sort', problemIds: ['p-dsa-selection-sort-1'] },
      { id: 'cse205-u1-t6', title: 'Linear Search', unitId: 'cse205-u1', description: 'Sequential search through unsorted data.', order: 6, visualizerId: 'linear-search', problemIds: ['p-dsa-linear-search-1'] },
      { id: 'cse205-u1-t7', title: 'Binary Search', unitId: 'cse205-u1', description: 'Divide and conquer search on sorted arrays. O(log n) complexity.', order: 7, visualizerId: 'binary-search', problemIds: ['p-dsa-binary-search-1', 'p-dsa-binary-search-2'] },
    ],
  },
  {
    id: 'cse205-u2',
    number: 2,
    title: 'Linked Lists',
    subjectId: 'cse205',
    topics: [
      { id: 'cse205-u2-t1', title: 'Singly Linked List: Traversal, Insertion, Deletion', unitId: 'cse205-u2', description: 'Node structure, memory representation, dynamic allocation, basic operations.', order: 1, visualizerId: 'singly-linked-list', problemIds: ['p-dsa-ll-reverse-1', 'p-dsa-ll-middle-1'] },
      { id: 'cse205-u2-t2', title: 'Header Linked Lists', unitId: 'cse205-u2', description: 'Grounded header and circular header linked lists.', order: 2, problemIds: [] },
      { id: 'cse205-u2-t3', title: 'Doubly Linked Lists', unitId: 'cse205-u2', description: 'Two-way traversal, insertion and deletion in doubly linked lists.', order: 3, problemIds: ['p-dsa-dll-1'] },
      { id: 'cse205-u2-t4', title: 'Circular Linked Lists', unitId: 'cse205-u2', description: 'Circular singly and doubly linked list operations.', order: 4, problemIds: [] },
    ],
  },
  {
    id: 'cse205-u3',
    number: 3,
    title: 'Stacks and Queues',
    subjectId: 'cse205',
    topics: [
      { id: 'cse205-u3-t1', title: 'Stack: Array and Linked-List Representation', unitId: 'cse205-u3', description: 'LIFO principle, push, pop, peek operations using arrays and linked lists.', order: 1, visualizerId: 'stack-operations', problemIds: ['p-dsa-stack-valid-parens-1'] },
      { id: 'cse205-u3-t2', title: 'Polish Notation and Expression Evaluation', unitId: 'cse205-u3', description: 'Infix, prefix, postfix expressions; conversion algorithms; evaluation using stacks.', order: 2, problemIds: ['p-dsa-stack-postfix-1'] },
      { id: 'cse205-u3-t3', title: 'Queue: Array and Linked-List Representation', unitId: 'cse205-u3', description: 'FIFO principle, enqueue, dequeue operations, circular queue.', order: 3, visualizerId: 'queue-operations', problemIds: ['p-dsa-queue-1'] },
      { id: 'cse205-u3-t4', title: 'Priority Queues and Deques', unitId: 'cse205-u3', description: 'Priority-based ordering, double-ended queues, applications.', order: 4, problemIds: [] },
    ],
  },
  {
    id: 'cse205-u4',
    number: 4,
    title: 'Recursion and Trees',
    subjectId: 'cse205',
    topics: [
      { id: 'cse205-u4-t1', title: 'Recursion and Towers of Hanoi', unitId: 'cse205-u4', description: 'Recursive problem solving, base cases, Tower of Hanoi algorithm.', order: 1, visualizerId: 'hanoi', problemIds: [] },
      { id: 'cse205-u4-t2', title: 'Binary Trees: Representation and Traversals', unitId: 'cse205-u4', description: 'Complete and extended binary trees, linked and sequential representation, inorder, preorder, postorder traversals.', order: 2, problemIds: ['p-dsa-tree-traversal-1'] },
      { id: 'cse205-u4-t3', title: 'Binary Search Trees', unitId: 'cse205-u4', description: 'BST property, searching, insertion, deletion operations.', order: 3, visualizerId: 'bst-insert', problemIds: ['p-dsa-bst-validate-1', 'p-dsa-bst-insert-1'] },
      { id: 'cse205-u4-t4', title: 'Merge Sort', unitId: 'cse205-u4', description: 'Divide and conquer sorting, merging sorted halves, O(n log n).', order: 4, visualizerId: 'merge-sort', problemIds: ['p-dsa-merge-sort-1'] },
      { id: 'cse205-u4-t5', title: 'Quick Sort', unitId: 'cse205-u4', description: 'Partition-based sorting, pivot selection, average O(n log n).', order: 5, visualizerId: 'quick-sort', problemIds: ['p-dsa-quick-sort-1'] },
    ],
  },
  {
    id: 'cse205-u5',
    number: 5,
    title: 'Heaps and Hashing',
    subjectId: 'cse205',
    topics: [
      { id: 'cse205-u5-t1', title: 'Heap: Insertion, Deletion, Heap Sort', unitId: 'cse205-u5', description: 'Min-heap and max-heap properties, heapify, building heaps, heap sort.', order: 1, visualizerId: 'heap-sort', problemIds: ['p-dsa-heap-kth-1'] },
      { id: 'cse205-u5-t2', title: 'Hashing: Hash Functions and Hash Tables', unitId: 'cse205-u5', description: 'Hash function design, collision handling, load factor.', order: 2, problemIds: ['p-dsa-hash-two-sum-1'] },
      { id: 'cse205-u5-t3', title: 'Collision Resolution: Chaining and Open Addressing', unitId: 'cse205-u5', description: 'Separate chaining, linear probing, quadratic probing, double hashing.', order: 3, problemIds: [] },
    ],
  },
  {
    id: 'cse205-u6',
    number: 6,
    title: 'Graphs',
    subjectId: 'cse205',
    topics: [
      { id: 'cse205-u6-t1', title: 'Breadth-First Search (BFS)', unitId: 'cse205-u6', description: 'Level-order graph traversal using queue, shortest path in unweighted graphs.', order: 1, visualizerId: 'bfs', problemIds: ['p-dsa-bfs-1'] },
      { id: 'cse205-u6-t2', title: 'Depth-First Search (DFS)', unitId: 'cse205-u6', description: 'Stack-based or recursive graph traversal, connectivity checking.', order: 2, visualizerId: 'dfs', problemIds: ['p-dsa-dfs-1'] },
      { id: 'cse205-u6-t3', title: "Dijkstra's Algorithm", unitId: 'cse205-u6', description: 'Single-source shortest path for non-negative weighted graphs.', order: 3, visualizerId: 'dijkstra', problemIds: ['p-dsa-dijkstra-1'] },
      { id: 'cse205-u6-t4', title: 'Bellman-Ford Algorithm', unitId: 'cse205-u6', description: 'Single-source shortest path handling negative weights, negative cycle detection.', order: 4, problemIds: [] },
      { id: 'cse205-u6-t5', title: 'Floyd-Warshall Algorithm', unitId: 'cse205-u6', description: 'All-pairs shortest path using dynamic programming.', order: 5, problemIds: [] },
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
    description: 'Comprehensive study of OOP concepts using C++ including classes, inheritance, polymorphism, templates, and STL.',
    units: cse202Units,
  },
  {
    id: 'cse205',
    code: 'CSE205',
    name: 'Data Structures and Algorithms',
    universityId: 'lpu',
    semester: 3,
    description: 'Fundamental data structures and algorithms including arrays, linked lists, trees, graphs, sorting, searching, and hashing.',
    units: cse205Units,
  },
];

// ───── Helper Functions ─────

export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find(s => s.id === id);
}

export function getUnitById(subjectId: string, unitId: string): Unit | undefined {
  const subject = getSubjectById(subjectId);
  return subject?.units.find(u => u.id === unitId);
}

export function getTopicById(topicId: string): Topic | undefined {
  for (const subject of SUBJECTS) {
    for (const unit of subject.units) {
      const topic = unit.topics.find(t => t.id === topicId);
      if (topic) return topic;
    }
  }
  return undefined;
}

export function getAllTopics(): Topic[] {
  return SUBJECTS.flatMap(s => s.units.flatMap(u => u.topics));
}
