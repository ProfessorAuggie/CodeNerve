import type { Quiz } from '../types';

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-cpp-oop-basics',
    title: 'C++ Object-Oriented Fundamentals Quiz',
    topicId: 'cse202-u1-t1',
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What is the default access specifier for members of a C++ class if none is specified?',
        options: ['public', 'private', 'protected', 'package-private'],
        correctAnswer: 'private',
        explanation: 'In C++, members of a class are private by default, whereas members of a struct are public by default.',
        difficulty: 'easy',
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        question: 'What does the `this` pointer represent inside a non-static member function?',
        options: [
          'A reference to the base class',
          'A pointer to the object instance invoking the function',
          'A copy of all member variables',
          'A pointer to the class virtual table',
        ],
        correctAnswer: 'A pointer to the object instance invoking the function',
        explanation: '`this` is a const pointer passed implicitly to non-static member functions, storing the address of the invoking object.',
        difficulty: 'easy',
      },
      {
        id: 'q3',
        type: 'code_trace',
        question: 'What is the output of the following C++ snippet?',
        codeSnippet: `#include <iostream>
class Counter {
    static int count;
public:
    Counter() { count++; }
    static int get() { return count; }
};
int Counter::count = 0;
int main() {
    Counter c1, c2, c3;
    std::cout << Counter::get();
}`,
        options: ['0', '1', '2', '3'],
        correctAnswer: '3',
        explanation: 'Static data members are shared across all instances of a class. Creating three instances invokes the constructor 3 times, incrementing count to 3.',
        difficulty: 'medium',
      },
      {
        id: 'q4',
        type: 'multiple_choice',
        question: 'Which of the following can access private members of a class?',
        options: [
          'Any derived class method',
          'A friend function declared inside the class',
          'Any function in the same namespace',
          'External non-member functions',
        ],
        correctAnswer: 'A friend function declared inside the class',
        explanation: 'A friend function is granted explicit access to private and protected members of the class where it is declared as a friend.',
        difficulty: 'medium',
      },
      {
        id: 'q5',
        type: 'multiple_choice',
        question: 'Why should a base class destructor almost always be declared `virtual` when polymorphism is used?',
        options: [
          'To speed up memory deallocation',
          'To ensure the derived class destructor is invoked when deleting via a base pointer',
          'To allow pure virtual functions in derived classes',
          'To prevent memory allocation on the stack',
        ],
        correctAnswer: 'To ensure the derived class destructor is invoked when deleting via a base pointer',
        explanation: 'Deleting a derived object through a pointer to a base class without a virtual destructor results in undefined behavior (usually derived destructor is never called, causing memory leaks).',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'quiz-dsa-arrays-sorting',
    title: 'DSA: Arrays & Sorting Complexity Quiz',
    topicId: 'cse205-u1-t1',
    timeLimit: 12,
    questions: [
      {
        id: 'q-dsa-1',
        type: 'multiple_choice',
        question: 'What is the worst-case time complexity of Quick Sort when selecting the first element as pivot on an already sorted array?',
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 'O(n²)',
        explanation: 'If the array is already sorted and the first element is picked, partitioning produces unbalanced subproblems of size 0 and n-1, leading to O(n²) worst-case performance.',
        difficulty: 'medium',
      },
      {
        id: 'q-dsa-2',
        type: 'multiple_choice',
        question: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n) and is stable?',
        options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
        correctAnswer: 'Merge Sort',
        explanation: 'Merge sort always splits arrays evenly into halves and preserves relative order of equivalent elements, guaranteeing stable O(n log n) in all cases.',
        difficulty: 'easy',
      },
      {
        id: 'q-dsa-3',
        type: 'multiple_choice',
        question: 'Why does calculating midpoint in binary search with `low + (high - low) / 2` avoid bugs?',
        options: [
          'It is faster by bit-shifting',
          'It prevents 32-bit signed integer overflow when low + high exceeds 2,147,483,647',
          'It works on non-monotonic lists',
          'It handles negative indices correctly',
        ],
        correctAnswer: 'It prevents 32-bit signed integer overflow when low + high exceeds 2,147,483,647',
        explanation: 'If low and high are large positive integers, `low + high` can overflow into negative values, causing an IndexOutOfBounds error.',
        difficulty: 'easy',
      },
      {
        id: 'q-dsa-4',
        type: 'multiple_choice',
        question: 'What is the primary advantage of Breadth-First Search (BFS) over Depth-First Search (DFS) in an unweighted graph?',
        options: [
          'BFS uses O(1) memory',
          'BFS is guaranteed to find the shortest path in terms of number of edges',
          'BFS works without a visited set',
          'BFS is faster to compute on trees',
        ],
        correctAnswer: 'BFS is guaranteed to find the shortest path in terms of number of edges',
        explanation: 'Because BFS explores nodes in concentric layers ordered by distance from the source, the first time target is popped, it is on the shortest path.',
        difficulty: 'medium',
      },
    ],
  },
];

export function getQuizById(id: string): Quiz | undefined {
  return QUIZZES.find((q) => q.id === id);
}
