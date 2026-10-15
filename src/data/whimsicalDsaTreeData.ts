// CodeNerve - Official DSA Patterns Concept Mind Map Tree Data
// Replicates the complete hierarchical branching tree with 16 categories, subtopics, and leaf problem sets.
// Zero external attributions or third-party links.

export interface WhimsicalTreeNode {
  id: string;
  title: string;
  color: string;
  count?: number;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  problemIds?: string[];
  keyRule?: string;
  children?: WhimsicalTreeNode[];
}

export const WHIMSICAL_DSA_TREE: WhimsicalTreeNode[] = [
  {
    "id": "cat-array",
    "title": "Array",
    "count": 20,
    "color": "#6366f1",
    "children": [
      {
        "id": "array-two-pointer",
        "title": "Two Pointer",
        "children": [
          {
            "id": "pat-two-pointer-opposite",
            "title": "Opposite ends (left + right)",
            "color": "#6366f1",
            "description": "Two pointers moving inward from both ends (left -> <- right) for sorted pairs or palindromes.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-two-sum-1",
              "p-dsa-three-sum-1"
            ],
            "keyRule": "Sorted arrays + Target Sum or Palindrome checks"
          },
          {
            "id": "pat-two-pointer-same-dir",
            "title": "Same direction (fast & slow pointers)",
            "color": "#6366f1",
            "description": "Read and write pointers moving in the same direction for in-place removal or compaction.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-array-insert-1",
              "p-lpu-array-insert-1"
            ],
            "keyRule": "In-place removal, duplicate filtering, compacting array elements"
          },
          {
            "id": "pat-two-pointer-merge",
            "title": "Partition / Dutch flag",
            "color": "#6366f1",
            "description": "Traverse two sorted arrays simultaneously using independent pointers.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-array-traversal-1",
              "p-lpu-array-traversal-1"
            ],
            "keyRule": "Merging or finding intersection of two ordered lists"
          }
        ],
        "color": "#6366f1",
        "problemIds": [],
        "description": "Two Pointer pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "array-sliding-window",
        "title": "Sliding Window",
        "children": [
          {
            "id": "pat-sw-fixed",
            "title": "Fixed Size",
            "color": "#6366f1",
            "description": "Subarray of fixed size K. Slide window by adding incoming element and subtracting outgoing.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-stock-buy-sell-1"
            ],
            "keyRule": "Contiguous subarray with explicit fixed length K"
          },
          {
            "id": "array-sw-variable",
            "title": "Variable Size",
            "children": [
              {
                "id": "pat-sw-expand-shrink",
                "title": "Expand-Shrink",
                "color": "#6366f1",
                "problemIds": [],
                "description": "Expand-Shrink pattern and problem set.",
                "difficulty": "medium"
              },
              {
                "id": "pat-sw-monotonic",
                "title": "Monotonic Window",
                "color": "#6366f1",
                "problemIds": [],
                "description": "Monotonic Window pattern and problem set.",
                "difficulty": "medium"
              }
            ],
            "color": "#6366f1",
            "problemIds": [],
            "description": "Variable Size pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#6366f1",
        "problemIds": [],
        "description": "Sliding Window pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "array-prefix-based",
        "title": "Prefix Based",
        "children": [
          {
            "id": "pat-prefix-sum",
            "title": "Prefix Sum",
            "color": "#6366f1",
            "description": "Range sum query in O(1): sum(L..R) = prefix[R] - prefix[L-1].",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-array-traversal-1",
              "p-lpu-array-traversal-1"
            ],
            "keyRule": "Multiple subarray sum queries on immutable arrays"
          },
          {
            "id": "pat-prefix-xor",
            "title": "Prefix XOR",
            "color": "#6366f1",
            "description": "(n > 0) && (n & (n - 1)) == 0 verifies power of 2. Iterate mask 0..(1<<N)-1 for subsets.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-subsets-bitmask-1"
            ],
            "keyRule": "Powers of two testing and binary combinatorial masks"
          },
          {
            "id": "pat-prefix-2d",
            "title": "2D Prefix",
            "color": "#6366f1",
            "description": "Track seen prefix sums in a HashMap to find subarrays summing to exact target in O(N).",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-two-sum-1"
            ],
            "keyRule": "Contiguous subarrays with exact sum K containing negative numbers"
          }
        ],
        "color": "#6366f1",
        "problemIds": [],
        "description": "Prefix Based pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "array-kadane",
        "title": "Kadane's / Subarray",
        "children": [
          {
            "id": "pat-kadane-max-sum",
            "title": "Max subarray sum (Kadane's)",
            "color": "#6366f1",
            "problemIds": [],
            "description": "Max subarray sum (Kadane's) pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-kadane-product",
            "title": "Max product subarray",
            "color": "#6366f1",
            "description": "Track both maximum and minimum running products to handle negative sign reversals.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-kadane-1"
            ],
            "keyRule": "Multiplicative subarray optimization with negative integers"
          },
          {
            "id": "pat-kadane-xor",
            "title": "Subarray with given XOR / sum",
            "color": "#6366f1",
            "description": "max(standard_kadane, total_sum - min_kadane) to handle circular wrapping.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-kadane-1",
              "p-lpu-kadane-1"
            ],
            "keyRule": "Arrays that wrap around from end to beginning"
          }
        ],
        "color": "#6366f1",
        "problemIds": [],
        "description": "Kadane's / Subarray pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "array-binary-search",
        "title": "Binary Search",
        "children": [
          {
            "id": "pat-bs-index",
            "title": "on index",
            "color": "#6366f1",
            "problemIds": [],
            "description": "on index pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-bs-answer",
            "title": "on answer",
            "color": "#6366f1",
            "description": "Define monotonic boolean predicate isPossible(mid) and binary search on possible output values.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-koko-bananas-1",
              "p-dsa-find-min-rotated-1"
            ],
            "keyRule": "Minimizing maximum or maximizing minimum allocation / capacity"
          }
        ],
        "color": "#6366f1",
        "problemIds": [],
        "description": "Binary Search pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-string",
    "title": "String",
    "count": 12,
    "color": "#d946ef",
    "children": [
      {
        "id": "string-sliding-window",
        "title": "Sliding Window",
        "children": [
          {
            "id": "pat-str-sw-repeat",
            "title": "Longest substring without repeat",
            "color": "#d946ef",
            "description": "Dynamic window using last seen character index map to advance left boundary.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-longest-substring-no-repeat-1"
            ],
            "keyRule": "Substring with strictly unique characters"
          },
          {
            "id": "pat-str-sw-min-window",
            "title": "Minimum window substring",
            "color": "#d946ef",
            "description": "Two pointer expansion/shrink tracking required character count frequencies.",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa130-minimum-window-substring"
            ],
            "keyRule": "Smallest substring covering all characters of a pattern"
          },
          {
            "id": "pat-str-sw-anagram",
            "title": "Anagram / permutation in string",
            "color": "#d946ef",
            "description": "Fixed size window of size length(pattern) with frequency delta tracking.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa130-find-all-anagrams-in-a-string"
            ],
            "keyRule": "Fixed sliding window matching target character frequency hash"
          }
        ],
        "color": "#d946ef",
        "problemIds": [],
        "description": "Sliding Window pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "string-two-pointers",
        "title": "Two Pointers",
        "children": [
          {
            "id": "pat-str-palindrome",
            "title": "Palindrome check",
            "color": "#d946ef",
            "description": "Inward pointers ignoring non-alphanumeric symbols and case differences.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa130-longest-palindromic-substring",
              "p-dsa-palindrome-partitioning-1"
            ],
            "keyRule": "Symmetry checks across characters from ends"
          },
          {
            "id": "pat-str-reverse-words",
            "title": "Reverse words / characters",
            "color": "#d946ef",
            "description": "Two pointer character swap followed by individual word boundary swaps.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-reverse-bits-1",
              "p-cpp-strings-1"
            ],
            "keyRule": "Word tokenization and in-place reversal"
          },
          {
            "id": "pat-str-compress",
            "title": "String compression",
            "color": "#d946ef",
            "description": "Fast and slow pointer write indexing for run-length encoding.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-char-replacement-1"
            ],
            "keyRule": "In-place consecutive character run encoding"
          }
        ],
        "color": "#d946ef",
        "problemIds": [],
        "description": "Two Pointers pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "string-pattern-matching",
        "title": "Pattern Matching",
        "children": [
          {
            "id": "pat-str-kmp",
            "title": "KMP (failure function)",
            "color": "#d946ef",
            "description": "Precompute LPS array to avoid backtracking text pointer upon mismatch. O(N+M).",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa-word-ladder-1"
            ],
            "keyRule": "Exact pattern matching without rewinding input text"
          },
          {
            "id": "pat-str-rabin-karp",
            "title": "Rabin-Karp (rolling hash)",
            "color": "#d946ef",
            "description": "Rolling polynomial hash with modular arithmetic for fast O(1) window hash updates.",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa130-longest-common-prefix"
            ],
            "keyRule": "Multiple pattern search or large string rolling comparisons"
          },
          {
            "id": "pat-str-z-algo",
            "title": "Z-algorithm",
            "color": "#d946ef",
            "description": "Construct Z-array where Z[i] is the length of longest prefix match starting at index i.",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa130-longest-common-prefix"
            ],
            "keyRule": "Linear time prefix matching and string period detection"
          }
        ],
        "color": "#d946ef",
        "problemIds": [],
        "description": "Pattern Matching pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-hashmap",
    "title": "Hash map",
    "count": 5,
    "color": "#0ea5e9",
    "children": [
      {
        "id": "pat-hm-freq",
        "title": "Frequency Based",
        "color": "#0ea5e9",
        "problemIds": [],
        "description": "Frequency Based pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-hm-lookup",
        "title": "Lookup Based",
        "color": "#0ea5e9",
        "problemIds": [],
        "description": "Lookup Based pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-hm-set",
        "title": "Set Based",
        "color": "#0ea5e9",
        "problemIds": [],
        "description": "Set Based pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-hm-index",
        "title": "Index Mapping",
        "color": "#0ea5e9",
        "problemIds": [],
        "description": "Index Mapping pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-hm-grouping",
        "title": "Grouping Pattern",
        "color": "#0ea5e9",
        "problemIds": [],
        "description": "Grouping Pattern pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-stack",
    "title": "Stack",
    "count": 11,
    "color": "#14b8a6",
    "children": [
      {
        "id": "stack-monotonic",
        "title": "Monotonic Stack",
        "children": [
          {
            "id": "pat-stack-mono-inc",
            "title": "Increasing",
            "color": "#14b8a6",
            "description": "Pushes elements while maintaining ascending order; pops larger elements to identify previous bounds.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-daily-temperatures-1"
            ],
            "keyRule": "Finding next warmer temperature or smaller element ahead"
          },
          {
            "id": "pat-stack-mono-dec",
            "title": "Decreasing",
            "color": "#14b8a6",
            "description": "Pushes elements maintaining descending order; pops smaller elements to find bounds.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-next-greater-1"
            ],
            "keyRule": "Finding next greater element or boundary limits"
          }
        ],
        "color": "#14b8a6",
        "problemIds": [],
        "description": "Monotonic Stack pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "stack-nearest",
        "title": "Nearest Element",
        "children": [
          {
            "id": "pat-stack-nge",
            "title": "Next Greater",
            "color": "#14b8a6",
            "description": "Traverse array maintaining monotonic stack of candidates.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-next-greater-1"
            ],
            "keyRule": "Nearest element to right strictly greater than current"
          },
          {
            "id": "pat-stack-nse",
            "title": "Next Smaller",
            "color": "#14b8a6",
            "description": "Traverse array from left to right to capture closest smaller boundary to left.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-largest-rect-histogram-1"
            ],
            "keyRule": "Nearest left boundary for histogram and span calculations"
          },
          {
            "id": "pat-stack-pve",
            "title": "Previous Variants",
            "color": "#14b8a6",
            "description": "Traverse array capturing closest smaller boundary to right.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-largest-rect-histogram-1"
            ],
            "keyRule": "Nearest right boundary for histogram width determination"
          }
        ],
        "color": "#14b8a6",
        "problemIds": [],
        "description": "Nearest Element pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-stack-range-span",
        "title": "Range / Span",
        "color": "#14b8a6",
        "problemIds": [],
        "description": "Range / Span pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-stack-min-max",
        "title": "min/Max Stack",
        "color": "#14b8a6",
        "problemIds": [],
        "description": "min/Max Stack pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-stack-expression",
        "title": "Expression Handling",
        "color": "#14b8a6",
        "problemIds": [],
        "description": "Expression Handling pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-stack-histogram",
        "title": "Histogram Pattern",
        "color": "#14b8a6",
        "problemIds": [],
        "description": "Histogram Pattern pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-queue",
    "title": "QUEUE / DEQUE",
    "count": 4,
    "color": "#f97316",
    "children": [
      {
        "id": "pat-queue-fifo",
        "title": "FIFO Processing",
        "color": "#f97316",
        "problemIds": [],
        "description": "FIFO Processing pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-queue-level",
        "title": "Level-wise Processing",
        "color": "#f97316",
        "problemIds": [],
        "description": "Level-wise Processing pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-queue-circular",
        "title": "Circular Queue Pattern",
        "color": "#f97316",
        "problemIds": [],
        "description": "Circular Queue Pattern pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-queue-deque",
        "title": "Deque Based",
        "color": "#f97316",
        "problemIds": [],
        "description": "Deque Based pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-linkedlist",
    "title": "LINKED LIST",
    "count": 8,
    "color": "#eab308",
    "children": [
      {
        "id": "ll-pointer-tech",
        "title": "Pointer Techniques",
        "children": [
          {
            "id": "pat-ll-fast-slow",
            "title": "Fast-Slow",
            "color": "#eab308",
            "description": "Slow advances 1 step, fast advances 2 steps. If they collide, a cycle exists.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-ll-cycle-1",
              "p-lpu-ll-cycle-1"
            ],
            "keyRule": "Detecting cycles in O(N) time with O(1) space"
          },
          {
            "id": "pat-ll-cycle",
            "title": "Cycle Detection",
            "color": "#eab308",
            "description": "When fast pointer reaches end of list, slow pointer resides at exact midpoint.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-ll-middle-1",
              "p-lpu-ll-middle-1"
            ],
            "keyRule": "Midpoint determination for merge sort and palindrome checks"
          },
          {
            "id": "pat-ll-middle",
            "title": "Finding Middle",
            "color": "#eab308",
            "description": "Advance first pointer by N steps; then advance both until first reaches end.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-remove-nth-from-end-1"
            ],
            "keyRule": "Single pass removal relative to list tail"
          }
        ],
        "color": "#eab308",
        "problemIds": [],
        "description": "Pointer Techniques pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "ll-reversal",
        "title": "Reversal",
        "children": [
          {
            "id": "pat-ll-full-reverse",
            "title": "Full Reverse",
            "color": "#eab308",
            "problemIds": [],
            "description": "Full Reverse pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-ll-k-group",
            "title": "Partial (k-group)",
            "color": "#eab308",
            "description": "Segment and reorder linked lists in-place.",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa-reorder-list-1"
            ],
            "keyRule": "Segmented reversal in chunks of fixed size K"
          }
        ],
        "color": "#eab308",
        "problemIds": [],
        "description": "Reversal pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-ll-merge",
        "title": "Merge Lists",
        "color": "#eab308",
        "problemIds": [],
        "description": "Merge Lists pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-trees",
    "title": "TREES",
    "count": 10,
    "color": "#ef4444",
    "children": [
      {
        "id": "tree-traversal",
        "title": "Traversal",
        "children": [
          {
            "id": "pat-tree-dfs",
            "title": "DFS (Pre / In / Post order)",
            "color": "#ef4444",
            "description": "Recursive and iterative traversals using stack. Inorder on BST yields sorted order.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-tree-traversal-1",
              "p-lpu-tree-traversal-1"
            ],
            "keyRule": "Depth-first hierarchical visit order"
          },
          {
            "id": "pat-tree-bfs",
            "title": "BFS (Level Order/ zigzag/ right side view)",
            "color": "#ef4444",
            "description": "Process current queue length in a batch to separate tree/graph elements by depth level.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-tree-level-order-1",
              "p-lpu-tree-level-order-1"
            ],
            "keyRule": "Tree level order or shortest path in unweighted graphs"
          }
        ],
        "color": "#ef4444",
        "problemIds": [],
        "description": "Traversal pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "tree-recursion",
        "title": "Recursion Patterns",
        "children": [
          {
            "id": "pat-tree-top-down",
            "title": "Top Down approach",
            "color": "#ef4444",
            "description": "1 + max(maxDepth(root.left), maxDepth(root.right)). Base case: null node returns 0.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-tree-max-depth-1",
              "p-dsa-invert-tree-1"
            ],
            "keyRule": "Height and depth calculation through subtree aggregation"
          },
          {
            "id": "pat-tree-bottom-up",
            "title": "Bottom Up approach",
            "color": "#ef4444",
            "description": "Calculate left height + right height at each node while returning 1 + max height upwards.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-diameter-tree-1",
              "p-dsa-balanced-tree-1"
            ],
            "keyRule": "Longest path between any two nodes in a tree"
          }
        ],
        "color": "#ef4444",
        "problemIds": [],
        "description": "Recursion Patterns pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "tree-path-based",
        "title": "Path Based",
        "children": [
          {
            "id": "pat-tree-max-path",
            "title": "Max path sum",
            "color": "#ef4444",
            "description": "Recursively verify structural equivalence and subtree matches.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-same-tree-1",
              "p-dsa-subtree-of-tree-1"
            ],
            "keyRule": "Verifying path existence and subtree equivalence"
          },
          {
            "id": "pat-tree-diameter",
            "title": "Diameter/Height / depth",
            "color": "#ef4444",
            "problemIds": [],
            "description": "Diameter/Height / depth pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#ef4444",
        "problemIds": [],
        "description": "Path Based pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-tree-bst",
        "title": "BST (Binary Search Tree)",
        "color": "#ef4444",
        "problemIds": [],
        "description": "BST (Binary Search Tree) pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-recursion",
    "title": "Recursion",
    "count": 13,
    "color": "#8b5cf6",
    "children": [
      {
        "id": "rec-backtracking",
        "title": "BACKTRACKING",
        "children": [
          {
            "id": "rec-bt-exploration",
            "title": "Exploration",
            "children": [
              {
                "id": "pat-bt-decision-tree",
                "title": "Decision Tree",
                "color": "#8b5cf6",
                "problemIds": [],
                "description": "Decision Tree pattern and problem set.",
                "difficulty": "medium"
              },
              {
                "id": "pat-bt-choose-explore",
                "title": "Choose-Explore-Unchoose",
                "color": "#8b5cf6",
                "problemIds": [],
                "description": "Choose-Explore-Unchoose pattern and problem set.",
                "difficulty": "medium"
              },
              {
                "id": "pat-bt-subsets",
                "title": "Subsets (power set)",
                "color": "#8b5cf6",
                "problemIds": [],
                "description": "Subsets (power set) pattern and problem set.",
                "difficulty": "medium"
              },
              {
                "id": "pat-bt-permutations",
                "title": "PermutationsCombinations (nCr)",
                "color": "#8b5cf6",
                "problemIds": [],
                "description": "PermutationsCombinations (nCr) pattern and problem set.",
                "difficulty": "medium"
              },
              {
                "id": "pat-bt-word-search",
                "title": "Word search on grid",
                "color": "#8b5cf6",
                "problemIds": [],
                "description": "Word search on grid pattern and problem set.",
                "difficulty": "medium"
              },
              {
                "id": "pat-bt-palindrome-part",
                "title": "Palindrome partitioning",
                "color": "#8b5cf6",
                "problemIds": [],
                "description": "Palindrome partitioning pattern and problem set.",
                "difficulty": "medium"
              }
            ],
            "color": "#8b5cf6",
            "problemIds": [],
            "description": "Exploration pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-bt-pruning",
            "title": "Pruning / State Tracking",
            "color": "#8b5cf6",
            "problemIds": [],
            "description": "Pruning / State Tracking pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#8b5cf6",
        "problemIds": [],
        "description": "BACKTRACKING pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "rec-divide-conquer",
        "title": "Divide & Conquer",
        "children": [
          {
            "id": "pat-dc-mergesort",
            "title": "Merge sort pattern",
            "color": "#8b5cf6",
            "problemIds": [],
            "description": "Merge sort pattern pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dc-quickselect",
            "title": "Quick select (Kth largest)",
            "color": "#8b5cf6",
            "problemIds": [],
            "description": "Quick select (Kth largest) pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dc-inversions",
            "title": "Count inversions",
            "color": "#8b5cf6",
            "description": "Compute x^n by squaring x^(n/2) in O(log n) time.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-powx-n-1"
            ],
            "keyRule": "Logarithmic modular exponentiation"
          }
        ],
        "color": "#8b5cf6",
        "problemIds": [],
        "description": "Divide & Conquer pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-heap",
    "title": "Heap",
    "count": 7,
    "color": "#0d9488",
    "children": [
      {
        "id": "pat-heap-top-k",
        "title": "Top K/ Kth Element/ k closest points",
        "color": "#0d9488",
        "problemIds": [],
        "description": "Top K/ Kth Element/ k closest points pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "heap-greedy-heap",
        "title": "Greedy+ Heap",
        "children": [
          {
            "id": "pat-heap-task-scheduler",
            "title": "Task scheduler",
            "color": "#0d9488",
            "description": "Max-heap of task frequencies + waiting queue tracking when tasks become eligible.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-task-scheduler-1",
              "p-dsa-median-data-stream-1"
            ],
            "keyRule": "CPU task scheduling with cooling intervals"
          },
          {
            "id": "pat-heap-meeting-rooms",
            "title": "Meeting rooms",
            "color": "#0d9488",
            "description": "Sort meetings by start time; min-heap stores end times of active meetings.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-meeting-rooms-ii-1"
            ],
            "keyRule": "Concurrent interval overlap tracking"
          },
          {
            "id": "pat-heap-reorganize-str",
            "title": "Reorganize string",
            "color": "#0d9488",
            "problemIds": [],
            "description": "Reorganize string pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-heap-huffman",
            "title": "Huffman encoding",
            "color": "#0d9488",
            "problemIds": [],
            "description": "Huffman encoding pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#0d9488",
        "problemIds": [],
        "description": "Greedy+ Heap pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-heap-k-way-merge",
        "title": "K-way Merge",
        "color": "#0d9488",
        "problemIds": [],
        "description": "K-way Merge pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-graphs",
    "title": "GRAPHS",
    "count": 19,
    "color": "#854d0e",
    "children": [
      {
        "id": "graph-traversal",
        "title": "Traversal",
        "children": [
          {
            "id": "pat-graph-bfs",
            "title": "BFS",
            "color": "#854d0e",
            "problemIds": [],
            "description": "BFS pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-graph-dfs",
            "title": "DFS",
            "color": "#854d0e",
            "problemIds": [],
            "description": "DFS pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#854d0e",
        "problemIds": [],
        "description": "Traversal pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "graph-cycle-detection",
        "title": "Cycle Detection",
        "children": [
          {
            "id": "pat-graph-cycle-dir",
            "title": "Directed",
            "color": "#854d0e",
            "problemIds": [],
            "description": "Directed pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-graph-cycle-undir",
            "title": "Undirected",
            "color": "#854d0e",
            "problemIds": [],
            "description": "Undirected pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#854d0e",
        "description": "When fast pointer reaches end of list, slow pointer resides at exact midpoint.",
        "difficulty": "easy",
        "problemIds": [
          "p-dsa-ll-middle-1",
          "p-lpu-ll-middle-1"
        ],
        "keyRule": "Midpoint determination for merge sort and palindrome checks"
      },
      {
        "id": "graph-topo-sort",
        "title": "Topological Sort",
        "children": [
          {
            "id": "pat-graph-topo-bfs-dfs",
            "title": "Topological Sort (BFS / DFS)",
            "color": "#854d0e",
            "description": "Compute in-degrees. Push 0 in-degree nodes into queue. Remove, decrement neighbors, repeat.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-course-schedule-1",
              "p-dsa-course-schedule-ii-1"
            ],
            "keyRule": "Dependency resolution, task scheduling in DAGs"
          },
          {
            "id": "pat-graph-kahn",
            "title": "Kahn's algorithm (BFS in-degree)",
            "color": "#854d0e",
            "problemIds": [],
            "description": "Kahn's algorithm (BFS in-degree) pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-graph-topo-dfs",
            "title": "DFS-based topo sort",
            "color": "#854d0e",
            "problemIds": [],
            "description": "DFS-based topo sort pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#854d0e",
        "problemIds": [],
        "description": "Topological Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "graph-shortest-path",
        "title": "Shortest Path",
        "children": [
          {
            "id": "pat-graph-dijkstra",
            "title": "Dijkstra",
            "color": "#854d0e",
            "problemIds": [],
            "description": "Dijkstra pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-graph-bellman",
            "title": "Bellman-Ford",
            "color": "#854d0e",
            "description": "Relax all edges V-1 times. A V-th relaxation improvement indicates negative weight cycle.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-bellman-ford-1"
            ],
            "keyRule": "Shortest path with negative edge weights and cycle detection"
          },
          {
            "id": "pat-graph-floyd",
            "title": "Floyd-Warshall (all pairs)",
            "color": "#854d0e",
            "description": "Dynamic programming matrix update: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa-floyd-warshall-1"
            ],
            "keyRule": "All-pairs shortest path in dense graphs"
          }
        ],
        "color": "#854d0e",
        "problemIds": [],
        "description": "Shortest Path pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "graph-spanning-tree",
        "title": "Spanning Tree",
        "children": [
          {
            "id": "pat-graph-kruskal",
            "title": "Kruskal",
            "color": "#854d0e",
            "description": "Sort edges ascending by weight. Greedily add edge if it connects two disconnected components.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-mst-kruskal-1",
              "p-lpu-mst-kruskal-1"
            ],
            "keyRule": "Minimum spanning tree using Disjoint Set Union"
          },
          {
            "id": "pat-graph-prims",
            "title": "Prims",
            "color": "#854d0e",
            "description": "Start at arbitrary node. Priority queue greedily pulls lightest edge crossing cut boundary.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-mst-prim-1"
            ],
            "keyRule": "MST generation in dense networks"
          }
        ],
        "color": "#854d0e",
        "problemIds": [],
        "description": "Spanning Tree pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-graph-dsu",
        "title": "Union-Find (DSU) Detect cycle in undirected",
        "color": "#854d0e",
        "problemIds": [],
        "description": "Union-Find (DSU) Detect cycle in undirected pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-graph-bipartite",
        "title": "Bipartite/ Multi-source BFS/ 0-1 BFS",
        "color": "#854d0e",
        "problemIds": [],
        "description": "Bipartite/ Multi-source BFS/ 0-1 BFS pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-trie",
    "title": "TRIE",
    "count": 4,
    "color": "#991b1b",
    "children": [
      {
        "id": "trie-prefix-based",
        "title": "Prefix Based",
        "children": [
          {
            "id": "pat-trie-insert-search",
            "title": "Insert/Search",
            "color": "#991b1b",
            "description": "Insert words character by character; mark isEndOfWord flag. O(L) insert and lookup.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-implement-trie-1",
              "p-dsa-word-dictionary-trie-1"
            ],
            "keyRule": "Fast prefix lookups, dictionary autocomplete"
          },
          {
            "id": "pat-trie-prefix-match",
            "title": "Prefix Match",
            "color": "#991b1b",
            "description": "Insert dictionary words into Trie; DFS on 2D board guided by Trie prefix existence.",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa-word-search-ii-trie-1"
            ],
            "keyRule": "Searching multiple dictionary words simultaneously on a board"
          }
        ],
        "color": "#991b1b",
        "problemIds": [],
        "description": "Prefix Based pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-trie-bitwise",
        "title": "Bitwise Trie",
        "color": "#991b1b",
        "problemIds": [],
        "description": "Bitwise Trie pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-dp",
    "title": "DYNAMIC PROGRAMMING",
    "count": 19,
    "color": "#64748b",
    "children": [
      {
        "id": "dp-core",
        "title": "Core",
        "children": [
          {
            "id": "pat-dp-1d",
            "title": "1D",
            "color": "#64748b",
            "problemIds": [],
            "description": "1D pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dp-2d",
            "title": "2D",
            "color": "#64748b",
            "description": "Solve base cases first, then iteratively build DP table towards final target.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-coin-change-1"
            ],
            "keyRule": "Bottom-up DP table filling without recursion call stack overhead"
          }
        ],
        "color": "#64748b",
        "problemIds": [],
        "description": "Core pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "dp-transition-type",
        "title": "Transition Type",
        "children": [
          {
            "id": "pat-dp-linear",
            "title": "Linear DP",
            "color": "#64748b",
            "description": "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Depends on immediate prior states.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-house-robber-1"
            ],
            "keyRule": "Single index linear state progression"
          },
          {
            "id": "pat-dp-grid",
            "title": "Grid DP",
            "color": "#64748b",
            "description": "dp[r][c] = dp[r-1][c] + dp[r][c-1]. Bounded path traversal across grid coordinates.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-unique-paths-1"
            ],
            "keyRule": "Grid paths, minimum cost path, matrix transformations"
          },
          {
            "id": "pat-dp-decision",
            "title": "Decision DP",
            "color": "#64748b",
            "problemIds": [],
            "description": "Decision DP pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#64748b",
        "problemIds": [],
        "description": "Transition Type pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "dp-pattern-types",
        "title": "Pattern Types",
        "children": [
          {
            "id": "pat-dp-knapsack",
            "title": "Knapsack",
            "color": "#64748b",
            "description": "Include or exclude item at index i. For 0/1 knapsack, iterate capacity backwards.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-target-sum-1"
            ],
            "keyRule": "Resource constraint selection with item weights and values"
          },
          {
            "id": "pat-dp-sequence",
            "title": "Sequence DP",
            "color": "#64748b",
            "problemIds": [],
            "description": "Sequence DP pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dp-partition",
            "title": "Partition DP",
            "color": "#64748b",
            "description": "dp[i] = 1 + max(dp[j]) or Patience Sort with Binary Search in tails array.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-lis-1"
            ],
            "keyRule": "Monotonically ascending subsequence identification"
          },
          {
            "id": "pat-dp-interval",
            "title": "Interval DP",
            "color": "#64748b",
            "description": "Try all partition points k between i and j.",
            "difficulty": "hard",
            "problemIds": [
              "p-dsa-word-break-1"
            ],
            "keyRule": "Optimal parenthesization and interval partitioning"
          }
        ],
        "color": "#64748b",
        "problemIds": [],
        "description": "Pattern Types pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "dp-advanced",
        "title": "Advanced",
        "children": [
          {
            "id": "pat-dp-bitmask",
            "title": "Bitmask DP",
            "color": "#64748b",
            "problemIds": [],
            "description": "Bitmask DP pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dp-digit",
            "title": "Digit DP",
            "color": "#64748b",
            "problemIds": [],
            "description": "Digit DP pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dp-tree",
            "title": "DP on Trees",
            "color": "#64748b",
            "problemIds": [],
            "description": "DP on Trees pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#64748b",
        "problemIds": [],
        "description": "Advanced pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "dp-optimization",
        "title": "Optimization",
        "children": [
          {
            "id": "pat-dp-memo",
            "title": "Memoization",
            "color": "#64748b",
            "problemIds": [],
            "description": "Memoization pattern and problem set.",
            "difficulty": "medium"
          },
          {
            "id": "pat-dp-tab",
            "title": "Tabulation",
            "color": "#64748b",
            "problemIds": [],
            "description": "Tabulation pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#64748b",
        "problemIds": [],
        "description": "Optimization pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-greedy",
    "title": "GREEDY",
    "count": 12,
    "color": "#c026d3",
    "children": [
      {
        "id": "greedy-interval",
        "title": "Interval Greedy",
        "children": [
          {
            "id": "pat-greedy-activity",
            "title": "Activity Selection",
            "color": "#c026d3",
            "description": "Sort by start time. If current.start <= prev.end, merge (prev.end = max(prev.end, current.end)).",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-merge-intervals-1"
            ],
            "keyRule": "Consolidating overlapping time ranges into contiguous blocks"
          },
          {
            "id": "pat-greedy-non-overlap",
            "title": "Non-overlapping Intervals",
            "color": "#c026d3",
            "description": "Sort by end time. Greedily keep interval with earliest finish time to maximize room for others.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-non-overlapping-intervals-1"
            ],
            "keyRule": "Minimizing interval removals by prioritizing early completion"
          },
          {
            "id": "pat-greedy-min-removals",
            "title": "Minimum Removals",
            "color": "#c026d3",
            "description": "Add preceding intervals; merge all overlapping intervals into newInterval; add remaining.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-insert-interval-1"
            ],
            "keyRule": "Single pass interval insertion and expansion"
          }
        ],
        "color": "#c026d3",
        "problemIds": [],
        "description": "Interval Greedy pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "greedy-scheduling",
        "title": "Scheduling Greedy",
        "children": [
          {
            "id": "pat-greedy-deadline",
            "title": "Deadline Based Scheduling",
            "color": "#c026d3",
            "description": "Greedily select intervals and partition indices based on last seen bounds.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-meeting-rooms-ii-1",
              "p-dsa-partition-labels-1"
            ],
            "keyRule": "Optimal unweighted job scheduling on single machine"
          },
          {
            "id": "pat-greedy-profit",
            "title": "Profit Based Selection",
            "color": "#c026d3",
            "problemIds": [],
            "description": "Profit Based Selection pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#c026d3",
        "problemIds": [],
        "description": "Scheduling Greedy pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "greedy-resource",
        "title": "Resource Allocation",
        "children": [
          {
            "id": "pat-greedy-min-platforms",
            "title": "Minimum Platforms / Rooms",
            "color": "#c026d3",
            "description": "If total gas < total cost, return -1. Else if running tank < 0, start must be at next station i+1.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-gas-station-1"
            ],
            "keyRule": "Feasibility check and starting index identification in circular loops"
          },
          {
            "id": "pat-greedy-meeting-rooms",
            "title": "Meeting Rooms",
            "color": "#c026d3",
            "description": "Sort meetings by start time; min-heap stores end times of active meetings.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-meeting-rooms-ii-1"
            ],
            "keyRule": "Concurrent interval overlap tracking"
          }
        ],
        "color": "#c026d3",
        "problemIds": [],
        "description": "Resource Allocation pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-greedy-jump-game",
        "title": "Jump Game Pattern",
        "color": "#c026d3",
        "problemIds": [],
        "description": "Jump Game Pattern pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-greedy-huffman",
        "title": "Huffman / Merge Cost",
        "color": "#c026d3",
        "problemIds": [],
        "description": "Huffman / Merge Cost pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-bits",
    "title": "BIT MANIPULATION",
    "count": 7,
    "color": "#2563eb",
    "children": [
      {
        "id": "bits-core",
        "title": "Core",
        "children": [
          {
            "id": "pat-bits-xor",
            "title": "XOR Pattern",
            "color": "#2563eb",
            "description": "Check: (n & (1<<k))!=0; Set: n | (1<<k); Clear: n & ~(1<<k); Toggle: n ^ (1<<k).",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-single-number-1",
              "p-dsa-reverse-bits-1"
            ],
            "keyRule": "Direct register-level bit testing and manipulation"
          },
          {
            "id": "pat-bits-masking",
            "title": "Bit Masking",
            "color": "#2563eb",
            "problemIds": [],
            "description": "Bit Masking pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#2563eb",
        "problemIds": [],
        "description": "Core pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "bits-usage",
        "title": "Usage",
        "children": [
          {
            "id": "pat-bits-subset",
            "title": "Subset via Bits",
            "color": "#2563eb",
            "description": "x ^ x = 0 and x ^ 0 = x. XORing all elements cancels duplicates, isolating unique value.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-single-number-1"
            ],
            "keyRule": "Finding unique unpaired item in O(N) time with O(1) space"
          },
          {
            "id": "pat-bits-checks",
            "title": "Bit Checks",
            "color": "#2563eb",
            "description": "n = n & (n - 1) clears lowest set bit in O(number of 1s).",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-number-of-1-bits-1",
              "p-dsa-counting-bits-1"
            ],
            "keyRule": "Fast Hamming weight computation"
          },
          {
            "id": "pat-bits-prefix-xor",
            "title": "Prefix XOR",
            "color": "#2563eb",
            "description": "(n > 0) && (n & (n - 1)) == 0 verifies power of 2. Iterate mask 0..(1<<N)-1 for subsets.",
            "difficulty": "easy",
            "problemIds": [
              "p-dsa-subsets-bitmask-1"
            ],
            "keyRule": "Powers of two testing and binary combinatorial masks"
          }
        ],
        "color": "#2563eb",
        "problemIds": [],
        "description": "Usage pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-sorting",
    "title": "Sorting Algorithms",
    "count": 9,
    "color": "#475569",
    "children": [
      {
        "id": "pat-sort-bubble",
        "title": "Bubble Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Bubble Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-selection",
        "title": "Selection Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Selection Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-insertion",
        "title": "Insertion Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Insertion Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-merge",
        "title": "Merge Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Merge Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-quick",
        "title": "Quick Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Quick Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-heap",
        "title": "Heap Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Heap Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-counting",
        "title": "Counting Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Counting Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-radix",
        "title": "Radix Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Radix Sort pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "pat-sort-bucket",
        "title": "Bucket Sort",
        "color": "#475569",
        "problemIds": [],
        "description": "Bucket Sort pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  },
  {
    "id": "cat-range",
    "title": "RANGE STRUCTURES",
    "count": 5,
    "color": "#059669",
    "children": [
      {
        "id": "range-segment-tree",
        "title": "Segment Tree",
        "children": [
          {
            "id": "pat-range-query",
            "title": "Range Query",
            "color": "#059669",
            "description": "Query aggregate over [L..R] in O(log N); update element at index in O(log N).",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa130-my-calendar-i",
              "p-dsa-time-key-value-1"
            ],
            "keyRule": "Dynamic mutable array range queries with point modifications"
          },
          {
            "id": "pat-range-lazy",
            "title": "Lazy Propagation",
            "color": "#059669",
            "problemIds": [],
            "description": "Lazy Propagation pattern and problem set.",
            "difficulty": "medium"
          }
        ],
        "color": "#059669",
        "problemIds": [],
        "description": "Segment Tree pattern and problem set.",
        "difficulty": "medium"
      },
      {
        "id": "range-fenwick-tree",
        "title": "Fenwick Tree",
        "children": [
          {
            "id": "pat-range-fenwick-prefix",
            "title": "Prefix Query",
            "color": "#059669",
            "description": "Compact array where node i covers interval of length (i & -i). O(log N) prefix sum & point update.",
            "difficulty": "medium",
            "problemIds": [
              "p-dsa-time-key-value-1"
            ],
            "keyRule": "Prefix sum queries and point updates with minimal code and O(N) space"
          }
        ],
        "color": "#059669",
        "problemIds": [],
        "description": "Fenwick Tree pattern and problem set.",
        "difficulty": "medium"
      }
    ]
  }
];
