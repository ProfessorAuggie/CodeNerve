import type { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-cpp-classes',
    title: 'Classes and Objects in C++',
    slug: 'cpp-classes-and-objects',
    objectives: [
      'Understand encapsulation and how classes bundle data and methods together',
      'Master private, public, and protected access specifiers',
      'Write member functions inside and outside the class scope using ::',
      'Understand constructors, destructors, and memory layout',
    ],
    prerequisites: ['Basic C++ syntax, functions, and control flow'],
    content: `
### What is an Object-Oriented Class?
In C++, a class is a user-defined blueprint from which individual objects are instantiated. Unlike procedural C, C++ bundles data (attributes) and operations (methods) inside an encapsulated unit.

### Access Specifiers
* **private**: Accessible only by member functions of the class and friend functions/classes. Default for \`class\`.
* **public**: Accessible from anywhere the object is in scope. Default for \`struct\`.
* **protected**: Accessible within the class and its derived (inherited) classes.

### Constructors & The \`this\` Pointer
Constructors initialize object state upon instantiation. The implicit pointer \`this\` holds the memory address of the current instance, allowing unambiguous reference to member attributes.
    `.trim(),
    codeExamples: [
      {
        language: 'cpp',
        title: 'Defining a Class with Constructor and Member Functions',
        code: `#include <iostream>
#include <string>

class Student {
private:
    std::string name;
    int rollNumber;
    double gpa;

public:
    // Parameterized constructor with member initialization list
    Student(std::string name, int rollNumber, double gpa)
        : name(std::move(name)), rollNumber(rollNumber), gpa(gpa) {}

    // Member function defined inside class
    void display() const {
        std::cout << "Student: " << name 
                  << " | Roll: " << rollNumber 
                  << " | GPA: " << gpa << std::endl;
    }

    // Setter with input validation
    void setGpa(double newGpa) {
        if (newGpa >= 0.0 && newGpa <= 10.0) {
            this->gpa = newGpa;
        }
    }
};

int main() {
    Student s1("Alex Rivera", 1024, 9.4);
    s1.display();
    s1.setGpa(9.8);
    s1.display();
    return 0;
}`,
        explanation: 'Shows encapsulation with private member variables and public member methods, utilizing member initializer list for optimal efficiency.',
      },
    ],
    complexity: { time: 'O(1) instantiation', space: 'O(sizeof(attributes))' },
    relatedProblemIds: ['p-cpp-classes-1', 'p-cpp-constructors-1'],
    topicIds: ['cse202-u1-t1', 'cse202-u1-t3'],
  },
  {
    id: 'lesson-dsa-arrays',
    title: 'Arrays & Two-Pointer Techniques',
    slug: 'arrays-and-two-pointers',
    objectives: [
      'Understand contiguous memory allocation and cache locality',
      'Analyze O(1) random access vs O(n) insertions and deletions',
      'Master the Two-Pointer and Sliding Window paradigms',
    ],
    prerequisites: ['Basic programming', 'Time and space complexity (Big O)'],
    content: `
### Arrays in Memory
An array is a collection of homogeneous elements stored in contiguous memory locations. Because memory addresses are consecutive:
\`Address(A[i]) = BaseAddress + (i * sizeof(Element))\`
This calculation allows true **O(1) random access**.

### Two-Pointer Strategy
The two-pointer technique uses two references traversing a sequence concurrently (often from both ends towards the center, or fast/slow). This commonly reduces an $O(n^2)$ nested loop to an optimal $O(n)$ linear sweep.
    `.trim(),
    codeExamples: [
      {
        language: 'cpp',
        title: 'Two Pointers: Reversing an Array in-place',
        code: `#include <iostream>
#include <vector>

void reverseArray(std::vector<int>& arr) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        std::swap(arr[left], arr[right]);
        left++;
        right--;
    }
}

int main() {
    std::vector<int> nums = {1, 2, 3, 4, 5, 6};
    reverseArray(nums);
    for (int n : nums) std::cout << n << " ";
    return 0;
}`,
        explanation: 'Operates in O(n) time and O(1) auxiliary space by moving pointers inward.',
      },
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    relatedProblemIds: ['p-dsa-array-traversal-1', 'p-dsa-two-sum-1'],
    topicIds: ['cse205-u1-t1', 'cse205-u1-t2'],
  },
  {
    id: 'lesson-dsa-binary-search',
    title: 'Binary Search & Monotonic Search Spaces',
    slug: 'binary-search-mastery',
    objectives: [
      'Master the divide-and-conquer strategy on sorted collections',
      'Avoid classic integer overflow bugs in midpoint calculation',
      'Apply binary search to answer spaces (Binary Search on Answer)',
    ],
    prerequisites: ['Arrays', 'Logarithmic complexity O(log n)'],
    content: `
### The Halving Principle
Binary search reduces the problem space by half in each iteration:
\`N -> N/2 -> N/4 -> ... -> 1\`
This guarantees an execution time bounded by $O(\\log_2 N)$.

### Critical Edge Cases
1. **Overflow**: Calculating \`(low + high) / 2\` can overflow 32-bit signed integers if the sum exceeds $2^{31}-1$. Always use \`low + (high - low) / 2\`.
2. **Loop Condition**: Use \`low <= high\` when searching for an exact target, or \`low < high\` when finding bounds.
    `.trim(),
    codeExamples: [
      {
        language: 'cpp',
        title: 'Robust Iterative Binary Search',
        code: `#include <vector>
#include <iostream>

int binarySearch(const std::vector<int>& arr, int target) {
    int low = 0;
    int high = static_cast<int>(arr.size()) - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2; // Prevents arithmetic overflow
        
        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            low = mid + 1; // Discard left half
        } else {
            high = mid - 1; // Discard right half
        }
    }
    return -1; // Target absent
}`,
        explanation: 'Standard divide-and-conquer binary search with safe midpoint arithmetic.',
      },
    ],
    complexity: { time: 'O(log n)', space: 'O(1)' },
    relatedVisualizerId: 'binary-search',
    relatedProblemIds: ['p-dsa-binary-search-1'],
    topicIds: ['cse205-u1-t7'],
  },
  {
    id: 'lesson-dsa-linked-lists',
    title: 'Linked Lists: Singly, Doubly & Circular',
    slug: 'linked-lists-data-structures',
    objectives: [
      'Contrast dynamic heap allocation with contiguous array buffers',
      'Understand pointer manipulation without losing head references',
      'Implement in-place reversal and fast/slow pointer cycle detection (Floyd\'s algorithm)',
    ],
    prerequisites: ['Pointers in C++', 'Dynamic memory allocation (new/delete)'],
    content: `
### Structure of a Node
Each node in a singly linked list contains data and a pointer to the successor node. Because elements are non-contiguous, insertions and deletions at known positions require only $O(1)$ pointer rewiring, but random access drops to $O(n)$.

### Floyd's Tortoise and Hare
By advancing one pointer at 1 step/iteration and a second pointer at 2 steps/iteration, we can detect cycles in $O(n)$ time and $O(1)$ extra space.
    `.trim(),
    codeExamples: [
      {
        language: 'cpp',
        title: 'In-Place Reversal of a Singly Linked List',
        code: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;

    while (curr != nullptr) {
        ListNode* nextTemp = curr->next; // Save next node
        curr->next = prev;               // Reverse pointer
        prev = curr;                     // Move prev forward
        curr = nextTemp;                 // Move curr forward
    }
    return prev; // New head of reversed list
}`,
        explanation: 'Reverses the list in a single pass using three pointers (prev, curr, nextTemp).',
      },
    ],
    complexity: { time: 'O(n)', space: 'O(1)' },
    relatedVisualizerId: 'singly-linked-list',
    relatedProblemIds: ['p-dsa-ll-reverse-1'],
    topicIds: ['cse205-u2-t1', 'cse205-u2-t2'],
  },
  {
    id: 'lesson-dsa-sorting',
    title: 'Sorting Algorithms: From O(n²) to O(n log n)',
    slug: 'sorting-algorithms-comparisons',
    objectives: [
      'Compare Bubble, Insertion, Selection, Merge, and Quick Sort',
      'Analyze stability and in-place vs out-of-place memory requirements',
      'Understand the mathematical lower bound of comparison-based sorting Ω(n log n)',
    ],
    prerequisites: ['Arrays', 'Recursion', 'Time complexity analysis'],
    content: `
### Overview of Comparison Sorts
* **Bubble Sort**: Repeatedly swaps adjacent out-of-order elements. Simple, stable, $O(n^2)$.
* **Insertion Sort**: Builds sorted prefix incrementally. Excellent for nearly-sorted data ($O(n)$ best case).
* **Merge Sort**: Divide and conquer, splits into halves, sorts recursively, merges in linear time. Stable, always $O(n \\log n)$, uses $O(n)$ memory.
* **Quick Sort**: Partitions array around a pivot. In-place, average $O(n \\log n)$, worst case $O(n^2)$ if pivot choice is adversarial.
    `.trim(),
    codeExamples: [
      {
        language: 'cpp',
        title: 'Merge Sort Implementation',
        code: `#include <vector>

void merge(std::vector<int>& arr, int left, int mid, int right) {
    std::vector<int> temp;
    int i = left, j = mid + 1;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);

    for (int k = 0; k < temp.size(); k++) {
        arr[left + k] = temp[k];
    }
}

void mergeSort(std::vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
        explanation: 'Canonical recursive Merge Sort guaranteeing O(n log n) comparisons.',
      },
    ],
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    relatedVisualizerId: 'merge-sort',
    relatedProblemIds: ['p-dsa-bubble-sort-1', 'p-dsa-insertion-sort-1'],
    topicIds: ['cse205-u1-t3', 'cse205-u4-t4'],
  },
  {
    id: 'lesson-dsa-graphs',
    title: 'Graph Traversals: Breadth-First & Depth-First Search',
    slug: 'graph-traversals-bfs-dfs',
    objectives: [
      'Represent graphs via Adjacency Matrix vs Adjacency List',
      'Traverse graphs using FIFO Queue (BFS) for shortest unweighted path',
      'Traverse graphs using LIFO Call Stack (DFS) for connectivity, cycles, and topological sorting',
    ],
    prerequisites: ['Queues', 'Recursion', 'Hash Sets / Visited Arrays'],
    content: `
### Graph Representations
* **Adjacency Matrix**: $V \\times V$ grid. $O(1)$ edge query, but $O(V^2)$ space. Inefficient for sparse graphs.
* **Adjacency List**: Array of vectors \`vector<int> adj[V]\`. $O(V + E)$ space, ideal for sparse practical graphs.

### Traversal Comparison
* **BFS**: Explores neighbors layer by layer. Guarantees the shortest path in unweighted graphs.
* **DFS**: Plunges as deep as possible before backtracking. Used for cycle detection, topological sorting, and connected components.
    `.trim(),
    codeExamples: [
      {
        language: 'cpp',
        title: 'Breadth-First Search (BFS)',
        code: `#include <vector>
#include <queue>
#include <iostream>

void bfs(int start, const std::vector<std::vector<int>>& adj, int V) {
    std::vector<bool> visited(V, false);
    std::queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        std::cout << u << " ";

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
        explanation: 'Linear time O(V + E) BFS traversal using a queue to explore level by level.',
      },
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    relatedVisualizerId: 'bfs',
    relatedProblemIds: ['p-dsa-bfs-1', 'p-dsa-dfs-1'],
    topicIds: ['cse205-u6-t1', 'cse205-u6-t2'],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByTopic(topicId: string): Lesson[] {
  return LESSONS.filter((l) => l.topicIds.includes(topicId));
}
