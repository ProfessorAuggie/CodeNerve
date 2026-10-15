export interface MindMapLeafPattern {
  id: string;
  title: string;
  description: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  problemIds: string[];
  visualizerId?: string;
  codeSnippetHint?: string;
  keyRule?: string;
}

export interface MindMapSubPattern {
  id: string;
  title: string;
  description?: string;
  leafCount?: number;
  patterns: MindMapLeafPattern[];
}

export interface MindMapCategory {
  id: string;
  title: string;
  count: number;
  color: string;
  bgLight: string;
  bgDark: string;
  borderColor: string;
  textColor: string;
  subPatterns: MindMapSubPattern[];
  syllabusUnit?: string;
  courseCode?: 'CSE205' | 'CSE202' | 'GLOBAL';
}

// ══════════════════════════════════════════════════════════════════
// 1. GLOBAL DSA PATTERNS TREE (Core Algorithmic Taxonomy)
// ══════════════════════════════════════════════════════════════════
export const GLOBAL_DSA_PATTERNS: MindMapCategory[] = [
  // 1. Array (20)
  {
    id: 'cat-array',
    title: 'Array',
    count: 20,
    color: '#6366f1',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/40',
    borderColor: 'border-indigo-500',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'array-two-pointer',
        title: 'Two Pointer',
        description: 'Pointers moving inward, outward, or at varied paces to optimize linear searching.',
        patterns: [
          {
            id: 'pat-two-pointer-opposite',
            title: 'Opposite Ends (Inward Pointers)',
            description: 'Two pointers moving inward from both ends (left -> <- right) for sorted pairs or palindromes.',
            difficulty: 'easy',
            problemIds: ['p-dsa-two-sum-1', 'p-dsa-three-sum-1'],
            keyRule: 'Sorted arrays + Target Sum or Palindrome checks',
          },
          {
            id: 'pat-two-pointer-same-dir',
            title: 'Same Direction (Fast & Slow / Shifting)',
            description: 'Read and write pointers moving in the same direction for in-place removal or compaction.',
            difficulty: 'easy',
            problemIds: ['p-dsa-array-insert-1', 'p-lpu-array-insert-1'],
            keyRule: 'In-place removal, duplicate filtering, compacting array elements',
          },
          {
            id: 'pat-two-pointer-merge',
            title: 'Merging Two Arrays / Intersecting',
            description: 'Traverse two sorted arrays simultaneously using independent pointers.',
            difficulty: 'easy',
            problemIds: ['p-dsa-array-traversal-1', 'p-lpu-array-traversal-1'],
            keyRule: 'Merging or finding intersection of two ordered lists',
          },
        ],
      },
      {
        id: 'array-sliding-window',
        title: 'Sliding Window',
        description: 'Maintain a contiguous window of elements to avoid repeated nested summations.',
        patterns: [
          {
            id: 'pat-sw-fixed',
            title: 'Fixed Size Window (K)',
            description: 'Subarray of fixed size K. Slide window by adding incoming element and subtracting outgoing.',
            difficulty: 'easy',
            problemIds: ['p-dsa-stock-buy-sell-1'],
            keyRule: 'Contiguous subarray with explicit fixed length K',
          },
          {
            id: 'pat-sw-variable',
            title: 'Variable Size Window (Condition <= K, >= K)',
            description: 'Expand right pointer until condition is broken; contract left pointer until valid again.',
            difficulty: 'medium',
            problemIds: ['p-dsa-char-replacement-1', 'p-dsa-container-water-1'],
            keyRule: 'Subarrays where size can change based on threshold/condition',
          },
          {
            id: 'pat-sw-aux-hash',
            title: 'Window with Auxiliary HashMap / Set',
            description: 'Maintain element frequencies or uniqueness inside the sliding window.',
            difficulty: 'medium',
            problemIds: ['p-dsa-longest-substring-no-repeat-1'],
            keyRule: 'At most K distinct elements, exact frequency thresholds',
          },
          {
            id: 'pat-sw-min-max-window',
            title: 'Maximum / Minimum Window Range',
            description: 'Find smallest or largest subarray satisfying an aggregate property.',
            difficulty: 'hard',
            problemIds: ['p-dsa130-minimum-window-substring', 'p-dsa-trapping-rain-water-1'],
            keyRule: 'Optimal bounding window containing all required characters/elements',
          },
        ],
      },
      {
        id: 'array-prefix-based',
        title: 'Prefix Based',
        description: 'Precompute cumulative running totals to answer range queries in O(1) time.',
        patterns: [
          {
            id: 'pat-prefix-range-sum',
            title: 'Prefix Sum & Range Queries',
            description: 'Range sum query in O(1): sum(L..R) = prefix[R] - prefix[L-1].',
            difficulty: 'easy',
            problemIds: ['p-dsa-array-traversal-1', 'p-lpu-array-traversal-1'],
            keyRule: 'Multiple subarray sum queries on immutable arrays',
          },
          {
            id: 'pat-prefix-xor',
            title: 'Prefix XOR & Bitwise Range',
            description: 'XOR range query: xor(L..R) = prefixXor[R] ^ prefixXor[L-1].',
            difficulty: 'medium',
            problemIds: ['p-dsa-single-number-1', 'p-dsa-counting-bits-1'],
            keyRule: 'Range XOR computations exploiting self-inverse property (x ^ x = 0)',
          },
          {
            id: 'pat-prefix-hash-target',
            title: 'Prefix Sum + HashMap (Subarray Sum = K)',
            description: 'Track seen prefix sums in a HashMap to find subarrays summing to exact target in O(N).',
            difficulty: 'medium',
            problemIds: ['p-dsa-two-sum-1'],
            keyRule: 'Contiguous subarrays with exact sum K containing negative numbers',
          },
        ],
      },
      {
        id: 'array-kadane',
        title: "Kadane's / Subarray",
        description: 'Dynamic local vs global decisions for optimal contiguous subarray problems.',
        patterns: [
          {
            id: 'pat-kadane-max-sum',
            title: 'Maximum Subarray Sum (Kadane)',
            description: 'current_max = max(num, current_max + num); overall_max = max(overall_max, current_max).',
            difficulty: 'medium',
            problemIds: ['p-dsa-kadane-1', 'p-lpu-kadane-1'],
            keyRule: 'Largest contiguous sum in O(N) time with O(1) space',
          },
          {
            id: 'pat-kadane-max-product',
            title: 'Maximum Product Subarray',
            description: 'Track both maximum and minimum running products to handle negative sign reversals.',
            difficulty: 'medium',
            problemIds: ['p-dsa-kadane-1'],
            keyRule: 'Multiplicative subarray optimization with negative integers',
          },
          {
            id: 'pat-kadane-circular',
            title: 'Circular Subarray Sum',
            description: 'max(standard_kadane, total_sum - min_kadane) to handle circular wrapping.',
            difficulty: 'medium',
            problemIds: ['p-dsa-kadane-1', 'p-lpu-kadane-1'],
            keyRule: 'Arrays that wrap around from end to beginning',
          },
        ],
      },
      {
        id: 'array-binary-search',
        title: 'Binary Search',
        description: 'Logarithmic O(log N) divide-and-conquer on ordered indexes or monotonic search spaces.',
        patterns: [
          {
            id: 'pat-bs-index',
            title: 'Binary Search on Array / Index',
            description: 'Search in sorted, rotated, or peaked arrays by checking midpoint against boundary conditions.',
            difficulty: 'easy',
            visualizerId: 'binary-search',
            problemIds: ['p-dsa-binary-search-1', 'p-dsa-search-rotated-1', 'p-lpu-binary-search-1'],
            keyRule: 'Sorted array lookup, rotated sorted array, peak finding',
          },
          {
            id: 'pat-bs-answer',
            title: 'Binary Search on Answer / Search Space',
            description: 'Define monotonic boolean predicate isPossible(mid) and binary search on possible output values.',
            difficulty: 'medium',
            problemIds: ['p-dsa-koko-bananas-1', 'p-dsa-find-min-rotated-1'],
            keyRule: 'Minimizing maximum or maximizing minimum allocation / capacity',
          },
        ],
      },
    ],
  },

  // 2. String (12)
  {
    id: 'cat-string',
    title: 'String',
    count: 12,
    color: '#ec4899',
    bgLight: 'bg-pink-50',
    bgDark: 'dark:bg-pink-950/40',
    borderColor: 'border-pink-500',
    textColor: 'text-pink-600 dark:text-pink-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'string-sliding-window',
        title: 'Sliding Window',
        description: 'Contiguous substring extraction with dynamic frequency and distinctness tracking.',
        patterns: [
          {
            id: 'pat-str-longest-no-repeat',
            title: 'Longest Substring Without Repeating Characters',
            description: 'Dynamic window using last seen character index map to advance left boundary.',
            difficulty: 'medium',
            problemIds: ['p-dsa-longest-substring-no-repeat-1'],
            keyRule: 'Substring with strictly unique characters',
          },
          {
            id: 'pat-str-min-window',
            title: 'Minimum Window Substring',
            description: 'Two pointer expansion/shrink tracking required character count frequencies.',
            difficulty: 'hard',
            problemIds: ['p-dsa130-minimum-window-substring'],
            keyRule: 'Smallest substring covering all characters of a pattern',
          },
          {
            id: 'pat-str-anagram-window',
            title: 'Find All Anagrams in a String',
            description: 'Fixed size window of size length(pattern) with frequency delta tracking.',
            difficulty: 'medium',
            problemIds: ['p-dsa130-find-all-anagrams-in-a-string'],
            keyRule: 'Fixed sliding window matching target character frequency hash',
          },
        ],
      },
      {
        id: 'string-two-pointers',
        title: 'Two Pointers',
        description: 'Linear character comparisons and inward validation across strings.',
        patterns: [
          {
            id: 'pat-str-valid-palindrome',
            title: 'Valid Palindrome & Alphanumeric Clean-up',
            description: 'Inward pointers ignoring non-alphanumeric symbols and case differences.',
            difficulty: 'easy',
            problemIds: ['p-dsa130-longest-palindromic-substring', 'p-dsa-palindrome-partitioning-1'],
            keyRule: 'Symmetry checks across characters from ends',
          },
          {
            id: 'pat-str-reverse-words',
            title: 'Reverse String / Reverse Words',
            description: 'Two pointer character swap followed by individual word boundary swaps.',
            difficulty: 'medium',
            problemIds: ['p-dsa-reverse-bits-1', 'p-cpp-strings-1'],
            keyRule: 'Word tokenization and in-place reversal',
          },
          {
            id: 'pat-str-compaction',
            title: 'String Compression & In-Place Compaction',
            description: 'Fast and slow pointer write indexing for run-length encoding.',
            difficulty: 'medium',
            problemIds: ['p-dsa-char-replacement-1'],
            keyRule: 'In-place consecutive character run encoding',
          },
        ],
      },
      {
        id: 'string-pattern-matching',
        title: 'Pattern Matching',
        description: 'Advanced exact substring matching algorithms avoiding naive O(N*M) worst cases.',
        patterns: [
          {
            id: 'pat-str-kmp',
            title: 'KMP Algorithm (Longest Prefix Suffix - LPS)',
            description: 'Precompute LPS array to avoid backtracking text pointer upon mismatch. O(N+M).',
            difficulty: 'hard',
            problemIds: ['p-dsa-word-ladder-1'],
            keyRule: 'Exact pattern matching without rewinding input text',
          },
          {
            id: 'pat-str-rabin-karp',
            title: 'Rabin-Karp Rolling Hash',
            description: 'Rolling polynomial hash with modular arithmetic for fast O(1) window hash updates.',
            difficulty: 'hard',
            problemIds: ['p-dsa130-longest-common-prefix'],
            keyRule: 'Multiple pattern search or large string rolling comparisons',
          },
          {
            id: 'pat-str-z-algo',
            title: 'Z-Algorithm',
            description: 'Construct Z-array where Z[i] is the length of longest prefix match starting at index i.',
            difficulty: 'hard',
            problemIds: ['p-dsa130-longest-common-prefix'],
            keyRule: 'Linear time prefix matching and string period detection',
          },
        ],
      },
    ],
  },

  // 3. Hash map (5)
  {
    id: 'cat-hashmap',
    title: 'Hash map',
    count: 5,
    color: '#0ea5e9',
    bgLight: 'bg-sky-50',
    bgDark: 'dark:bg-sky-950/40',
    borderColor: 'border-sky-500',
    textColor: 'text-sky-600 dark:text-sky-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'hash-frequency-based',
        title: 'Frequency Based',
        description: 'Count element occurrences for majority element, anagrams, or frequency thresholds.',
        patterns: [
          {
            id: 'pat-hash-freq-count',
            title: 'Element Frequency & Majority Voting',
            description: 'Hash map frequency counting vs Boyer-Moore O(1) space majority voting.',
            difficulty: 'easy',
            problemIds: ['p-dsa-top-k-frequent-1'],
            keyRule: 'Counting occurrences, finding elements appearing > N/2 or N/k times',
          },
        ],
      },
      {
        id: 'hash-lookup-based',
        title: 'Lookup Based',
        description: 'Transform O(N) linear search into O(1) constant time hash lookup.',
        patterns: [
          {
            id: 'pat-hash-two-sum-lookup',
            title: 'Two Sum O(1) Complement Lookup',
            description: 'Store seen values in hash map; for each x check if (target - x) exists in map.',
            difficulty: 'easy',
            problemIds: ['p-dsa-two-sum-1'],
            keyRule: 'Unsorted pair sum lookups in single pass O(N) time',
          },
        ],
      },
      {
        id: 'hash-set-based',
        title: 'Set Based',
        description: 'O(1) deduplication and sequence initiation verification.',
        patterns: [
          {
            id: 'pat-hash-longest-consecutive',
            title: 'Longest Consecutive Sequence & Hash Chaining',
            description: 'Store elements in HashSet. Check continuous streaks in unsorted arrays without sorting.',
            difficulty: 'medium',
            problemIds: ['p-dsa-hash-chaining-1', 'p-lpu-hash-chaining-1'],
            keyRule: 'Finding continuous streaks and handling bucket chains',
          },
        ],
      },
      {
        id: 'hash-index-mapping',
        title: 'Index Mapping',
        description: 'Track first or last observed indices of keys for distance and window bounds.',
        patterns: [
          {
            id: 'pat-hash-first-unique-char',
            title: 'Time Based Key-Value Index Mapping',
            description: 'Map characters and keys to timestamps and first occurrence indices.',
            difficulty: 'easy',
            problemIds: ['p-dsa-time-key-value-1'],
            keyRule: 'Position tracking for unique elements',
          },
        ],
      },
      {
        id: 'hash-grouping-pattern',
        title: 'Grouping Pattern',
        description: 'Group collections of items under an invariant canonical hash key.',
        patterns: [
          {
            id: 'pat-hash-group-anagrams',
            title: 'Group Anagrams by Sorted Key / Tuple',
            description: 'Use sorted string or 26-char frequency tuple as dictionary key to group anagrams.',
            difficulty: 'medium',
            problemIds: ['p-dsa130-find-all-anagrams-in-a-string'],
            keyRule: 'Categorizing equivalent objects into bucketed lists',
          },
        ],
      },
    ],
  },

  // 4. Stack (11)
  {
    id: 'cat-stack',
    title: 'Stack',
    count: 11,
    color: '#10b981',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/40',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'stack-monotonic',
        title: 'Monotonic Stack',
        description: 'Maintains elements in strictly increasing or decreasing order to answer range queries in linear time.',
        patterns: [
          {
            id: 'pat-mono-stack-inc',
            title: 'Monotonic Increasing Stack',
            description: 'Pushes elements while maintaining ascending order; pops larger elements to identify previous bounds.',
            difficulty: 'medium',
            problemIds: ['p-dsa-daily-temperatures-1'],
            keyRule: 'Finding next warmer temperature or smaller element ahead',
          },
          {
            id: 'pat-mono-stack-dec',
            title: 'Monotonic Decreasing Stack',
            description: 'Pushes elements maintaining descending order; pops smaller elements to find bounds.',
            difficulty: 'medium',
            problemIds: ['p-dsa-next-greater-1'],
            keyRule: 'Finding next greater element or boundary limits',
          },
        ],
      },
      {
        id: 'stack-nearest-element',
        title: 'Nearest Element',
        description: 'Find closest larger or smaller element to the left or right in O(N).',
        patterns: [
          {
            id: 'pat-stack-nge',
            title: 'Next Greater Element (NGE)',
            description: 'Traverse array maintaining monotonic stack of candidates.',
            difficulty: 'medium',
            problemIds: ['p-dsa-next-greater-1'],
            keyRule: 'Nearest element to right strictly greater than current',
          },
          {
            id: 'pat-stack-pse',
            title: 'Previous Smaller Element (PSE)',
            description: 'Traverse array from left to right to capture closest smaller boundary to left.',
            difficulty: 'medium',
            problemIds: ['p-dsa-largest-rect-histogram-1'],
            keyRule: 'Nearest left boundary for histogram and span calculations',
          },
          {
            id: 'pat-stack-nse',
            title: 'Next Smaller Element (NSE)',
            description: 'Traverse array capturing closest smaller boundary to right.',
            difficulty: 'medium',
            problemIds: ['p-dsa-largest-rect-histogram-1'],
            keyRule: 'Nearest right boundary for histogram width determination',
          },
        ],
      },
      {
        id: 'stack-range-span',
        title: 'Range / Span',
        description: 'Calculate consecutive days or elements meeting an inequality condition.',
        patterns: [
          {
            id: 'pat-stack-stock-span',
            title: 'Stock Span and Range Boundary',
            description: 'Monotonic stack storing (price, span) pairs to compress previous smaller ranges.',
            difficulty: 'medium',
            problemIds: ['p-dsa-daily-temperatures-1'],
            keyRule: 'Consecutive preceding elements less than or equal to current price',
          },
        ],
      },
      {
        id: 'stack-min-max',
        title: 'min/Max Stack',
        description: 'Support O(1) minimum or maximum element retrieval alongside standard push and pop.',
        patterns: [
          {
            id: 'pat-stack-min-stack',
            title: 'Min Stack with O(1) Auxiliary Tracking',
            description: 'Store elements paired with current minimum or use difference encoding.',
            difficulty: 'medium',
            visualizerId: 'stack-operations',
            problemIds: ['p-dsa-min-stack-1', 'p-lpu-min-stack-1'],
            keyRule: 'Constant time retrieval of min/max element in LIFO order',
          },
        ],
      },
      {
        id: 'stack-expression-handling',
        title: 'Expression Handling',
        description: 'Parse arithmetic expressions, parentheses balancing, and Polish notation evaluation.',
        patterns: [
          {
            id: 'pat-stack-eval-rpn',
            title: 'Evaluate Reverse Polish Notation (Postfix)',
            description: 'Push operands; on encountering operator, pop top two operands, evaluate, and push result.',
            difficulty: 'medium',
            problemIds: ['p-dsa-eval-rpn-1', 'p-lpu-stack-postfix-1'],
            keyRule: 'Postfix and prefix arithmetic evaluation without parentheses precedence ambiguities',
          },
          {
            id: 'pat-stack-valid-parentheses',
            title: 'Valid Parentheses & Matching Symbols',
            description: 'Push opening bracket; on closing bracket verify top of stack matches partner symbol.',
            difficulty: 'easy',
            problemIds: ['p-dsa-stack-valid-parens-1', 'p-lpu-stack-valid-parens-1', 'p-dsa-generate-parentheses-1'],
            keyRule: 'Nested delimiters, balanced tags, and brackets',
          },
        ],
      },
      {
        id: 'stack-histogram-pattern',
        title: 'Histogram Pattern',
        description: 'Determine maximum rectangular area under contiguous bars.',
        patterns: [
          {
            id: 'pat-stack-largest-rectangle-hist',
            title: 'Largest Rectangle in Histogram',
            description: 'For each bar, find PSE and NSE indices using monotonic stack; width = NSE - PSE - 1.',
            difficulty: 'hard',
            problemIds: ['p-dsa-largest-rect-histogram-1'],
            keyRule: 'Maximal area bounded by heights in linear time',
          },
        ],
      },
    ],
  },

  // 5. QUEUE / DEQUE (4)
  {
    id: 'cat-queue',
    title: 'QUEUE / DEQUE',
    count: 4,
    color: '#f97316',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/40',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600 dark:text-orange-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'queue-fifo',
        title: 'FIFO Processing',
        description: 'Order-preserving linear scheduling where first inserted element is processed first.',
        patterns: [
          {
            id: 'pat-queue-basic-fifo',
            title: 'First-In First-Out Queue Buffer',
            description: 'Sequential buffering, task pipelines, and rate-limiting queue processing.',
            difficulty: 'easy',
            problemIds: ['p-dsa-queue-1', 'p-lpu-queue-1'],
            keyRule: 'Sequential order preservation',
          },
        ],
      },
      {
        id: 'queue-level-wise',
        title: 'Level-wise Processing',
        description: 'Breadth-first exploration where all nodes at distance d are visited before distance d+1.',
        patterns: [
          {
            id: 'pat-queue-level-order',
            title: 'BFS Level Order Traversal',
            description: 'Process current queue length in a batch to separate tree/graph elements by depth level.',
            difficulty: 'medium',
            problemIds: ['p-dsa-tree-level-order-1', 'p-lpu-tree-level-order-1'],
            keyRule: 'Tree level order or shortest path in unweighted graphs',
          },
        ],
      },
      {
        id: 'queue-circular',
        title: 'Circular Queue Pattern',
        description: 'Bounded array queue utilizing modulo arithmetic (front = (front+1)%N) to prevent memory drift.',
        patterns: [
          {
            id: 'pat-queue-circular-buffer',
            title: 'Circular Queue Ring Buffer',
            description: 'Continuous bounded memory queue with wrap-around pointers.',
            difficulty: 'medium',
            problemIds: ['p-dsa-circular-queue-1', 'p-lpu-circular-queue-1'],
            keyRule: 'Fixed size buffer simulation without memory reallocation',
          },
        ],
      },
      {
        id: 'queue-deque-based',
        title: 'Deque Based',
        description: 'Double-ended queue with O(1) insertions and deletions at both ends.',
        patterns: [
          {
            id: 'pat-queue-sliding-window-max',
            title: 'LRU Cache & Sliding Window Deque',
            description: 'Maintain doubly linked list or deque for constant time eviction and retrieval.',
            difficulty: 'hard',
            problemIds: ['p-dsa-lru-cache-1'],
            keyRule: 'Tracking minimum or maximum within moving window in O(1) amortized',
          },
        ],
      },
    ],
  },

  // 6. LINKED LIST (8)
  {
    id: 'cat-linked-list',
    title: 'LINKED LIST',
    count: 8,
    color: '#eab308',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-amber-950/40',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-600 dark:text-amber-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'll-pointer-techniques',
        title: 'Pointer Techniques',
        description: 'Fast and slow pointer strategies (tortoise & hare) for structural properties.',
        patterns: [
          {
            id: 'pat-ll-cycle-detection',
            title: "Floyd's Cycle Detection (Fast & Slow Pointers)",
            description: 'Slow advances 1 step, fast advances 2 steps. If they collide, a cycle exists.',
            difficulty: 'easy',
            problemIds: ['p-dsa-ll-cycle-1', 'p-lpu-ll-cycle-1'],
            keyRule: 'Detecting cycles in O(N) time with O(1) space',
          },
          {
            id: 'pat-ll-middle-node',
            title: 'Finding the Middle Node',
            description: 'When fast pointer reaches end of list, slow pointer resides at exact midpoint.',
            difficulty: 'easy',
            problemIds: ['p-dsa-ll-middle-1', 'p-lpu-ll-middle-1'],
            keyRule: 'Midpoint determination for merge sort and palindrome checks',
          },
          {
            id: 'pat-ll-remove-nth-end',
            title: 'Remove N-th Node from End of List',
            description: 'Advance first pointer by N steps; then advance both until first reaches end.',
            difficulty: 'medium',
            problemIds: ['p-dsa-remove-nth-from-end-1'],
            keyRule: 'Single pass removal relative to list tail',
          },
        ],
      },
      {
        id: 'll-reversal',
        title: 'Reversal',
        description: 'In-place pointer redirection without allocating new nodes.',
        patterns: [
          {
            id: 'pat-ll-reverse-standard',
            title: 'Reverse Linked List (Iterative & Recursive)',
            description: 'Three pointers (prev, curr, next) to reverse link directions in O(N) time.',
            difficulty: 'easy',
            visualizerId: 'singly-linked-list',
            problemIds: ['p-dsa-ll-reverse-1', 'p-lpu-ll-reverse-1'],
            keyRule: 'Reversing linear pointer linkages',
          },
          {
            id: 'pat-ll-reverse-k-group',
            title: 'Reorder and Segmented Reverse',
            description: 'Segment and reorder linked lists in-place.',
            difficulty: 'hard',
            problemIds: ['p-dsa-reorder-list-1'],
            keyRule: 'Segmented reversal in chunks of fixed size K',
          },
        ],
      },
      {
        id: 'll-merge-lists',
        title: 'Merge Lists',
        description: 'Interleave sorted linked lists using dummy head and pointer advancing.',
        patterns: [
          {
            id: 'pat-ll-merge-two-sorted',
            title: 'Merge Two Sorted Lists & K Lists',
            description: 'Dummy head pointer; attach smaller node and advance pointer until both consumed.',
            difficulty: 'easy',
            problemIds: ['p-dsa-ll-merge-two-1', 'p-dsa-merge-k-sorted-lists-1'],
            keyRule: 'Merging ordered lists into single sorted stream in O(N+M)',
          },
        ],
      },
    ],
  },

  // 7. TREES (10)
  {
    id: 'cat-trees',
    title: 'TREES',
    count: 10,
    color: '#ef4444',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/40',
    borderColor: 'border-rose-500',
    textColor: 'text-rose-600 dark:text-rose-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'tree-traversal',
        title: 'Traversal',
        description: 'Systematic node exploration strategies across hierarchical trees.',
        patterns: [
          {
            id: 'pat-tree-dfs-traversals',
            title: 'DFS Traversals (Inorder, Preorder, Postorder)',
            description: 'Recursive and iterative traversals using stack. Inorder on BST yields sorted order.',
            difficulty: 'easy',
            problemIds: ['p-dsa-tree-traversal-1', 'p-lpu-tree-traversal-1'],
            keyRule: 'Depth-first hierarchical visit order',
          },
          {
            id: 'pat-tree-bfs-zigzag',
            title: 'BFS Level Order Traversal',
            description: 'Queue-based level by level traversal.',
            difficulty: 'medium',
            problemIds: ['p-dsa-tree-level-order-1', 'p-lpu-tree-level-order-1'],
            keyRule: 'Level-by-level inspection with queue ordering',
          },
        ],
      },
      {
        id: 'tree-recursion-patterns',
        title: 'Recursion Patterns',
        description: 'Bottom-up divide and conquer computing properties of left and right subtrees.',
        patterns: [
          {
            id: 'pat-tree-max-depth',
            title: 'Maximum Depth / Height of Binary Tree',
            description: '1 + max(maxDepth(root.left), maxDepth(root.right)). Base case: null node returns 0.',
            difficulty: 'easy',
            problemIds: ['p-dsa-tree-max-depth-1', 'p-dsa-invert-tree-1'],
            keyRule: 'Height and depth calculation through subtree aggregation',
          },
          {
            id: 'pat-tree-diameter',
            title: 'Diameter of Binary Tree & Balanced Tree',
            description: 'Calculate left height + right height at each node while returning 1 + max height upwards.',
            difficulty: 'easy',
            problemIds: ['p-dsa-diameter-tree-1', 'p-dsa-balanced-tree-1'],
            keyRule: 'Longest path between any two nodes in a tree',
          },
        ],
      },
      {
        id: 'tree-path-based',
        title: 'Path Based',
        description: 'Accumulate running sums along tree paths.',
        patterns: [
          {
            id: 'pat-tree-path-sum-leaf',
            title: 'Subtree & Same Tree Verification',
            description: 'Recursively verify structural equivalence and subtree matches.',
            difficulty: 'easy',
            problemIds: ['p-dsa-same-tree-1', 'p-dsa-subtree-of-tree-1'],
            keyRule: 'Verifying path existence and subtree equivalence',
          },
        ],
      },
      {
        id: 'tree-bst',
        title: 'BST (Binary Search Tree)',
        description: 'Ordered binary trees where left subtree < root < right subtree.',
        patterns: [
          {
            id: 'pat-bst-validate',
            title: 'Validate Binary Search Tree & Insertion',
            description: 'Recursively enforce min < node.val < max range constraint across all nodes.',
            difficulty: 'medium',
            visualizerId: 'bst-insert',
            problemIds: ['p-dsa-bst-validate-1', 'p-dsa-bst-insert-1', 'p-lpu-bst-validate-1', 'p-lpu-bst-insert-1'],
            keyRule: 'Enforcing strict BST invariant across all ancestors',
          },
          {
            id: 'pat-bst-lca',
            title: 'Lowest Common Ancestor (LCA) in BST & K-th Smallest',
            description: 'If both p and q are smaller than root, go left; if both larger, go right; else root is LCA.',
            difficulty: 'medium',
            problemIds: ['p-dsa-lca-bst-1', 'p-dsa-kth-smallest-bst-1', 'p-lpu-lca-bst-1'],
            keyRule: 'Fast O(H) common ancestor lookup utilizing BST ordering',
          },
        ],
      },
    ],
  },

  // 8. Recursion (13)
  {
    id: 'cat-recursion',
    title: 'Recursion',
    count: 13,
    color: '#8b5cf6',
    bgLight: 'bg-purple-50',
    bgDark: 'dark:bg-purple-950/40',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-600 dark:text-purple-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'rec-backtracking',
        title: 'BACKTRACKING',
        description: 'Choose, Explore, Un-choose paradigm to search entire combinatorial state spaces.',
        patterns: [
          {
            id: 'pat-backtrack-subsets',
            title: 'Subsets & Power Set',
            description: 'Include element, recurse; exclude element, recurse (2^N possibilities).',
            difficulty: 'medium',
            problemIds: ['p-dsa-subsets-1', 'p-dsa-combination-sum-1'],
            keyRule: 'All subsets / power set generation',
          },
          {
            id: 'pat-backtrack-permutations',
            title: 'Permutations & Combinations',
            description: 'Loop through candidates with a visited/used boolean array; backtrack after exploring.',
            difficulty: 'medium',
            problemIds: ['p-dsa-permutations-1'],
            keyRule: 'Ordering permutations of unique elements',
          },
          {
            id: 'pat-backtrack-n-queens',
            title: 'N-Queens & Board Placement',
            description: 'Place queen row by row; track columns, major diagonals (r-c), and minor diagonals (r+c).',
            difficulty: 'hard',
            problemIds: ['p-dsa-n-queens-1'],
            keyRule: 'Valid non-conflicting piece placements on grid',
          },
          {
            id: 'pat-backtrack-word-search',
            title: 'Grid Word Search & Palindrome Partitioning',
            description: 'DFS into 4 neighboring directions; mark cell visited during path, unmark on return.',
            difficulty: 'medium',
            problemIds: ['p-dsa-word-search-1', 'p-dsa-palindrome-partitioning-1'],
            keyRule: '2D matrix path exploration with backtracking',
          },
        ],
      },
      {
        id: 'rec-divide-conquer',
        title: 'Divide & Conquer',
        description: 'Split problem into independent subproblems, solve recursively, and combine.',
        patterns: [
          {
            id: 'pat-dc-merge-sort',
            title: 'Merge Sort & Inversion Count',
            description: 'Halve array, sort left and right halves, merge in linear time.',
            difficulty: 'medium',
            visualizerId: 'merge-sort',
            problemIds: ['p-dsa-merge-sort-1', 'p-lpu-merge-sort-1'],
            keyRule: 'Divide and conquer sorting in guaranteed O(N log N)',
          },
          {
            id: 'pat-dc-quick-select',
            title: 'Quick Sort & Partitioning',
            description: 'Partition array around pivot; recurse on sub-arrays.',
            difficulty: 'medium',
            visualizerId: 'quick-sort',
            problemIds: ['p-dsa-quick-sort-1', 'p-lpu-quick-sort-1'],
            keyRule: 'In-place cache-friendly sorting algorithm',
          },
          {
            id: 'pat-dc-pow-x-n',
            title: 'Binary Exponentiation (Pow(x, n))',
            description: 'Compute x^n by squaring x^(n/2) in O(log n) time.',
            difficulty: 'medium',
            problemIds: ['p-dsa-powx-n-1'],
            keyRule: 'Logarithmic modular exponentiation',
          },
        ],
      },
    ],
  },

  // 9. Heap (7)
  {
    id: 'cat-heap',
    title: 'Heap',
    count: 7,
    color: '#14b8a6',
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-950/40',
    borderColor: 'border-teal-500',
    textColor: 'text-teal-600 dark:text-teal-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'heap-top-k',
        title: 'Top K / Kth Element / k closest points',
        description: 'Maintain a bounded priority queue of size K to find extreme elements in O(N log K).',
        patterns: [
          {
            id: 'pat-heap-kth-largest',
            title: 'K-th Largest Element in an Array (Min-Heap of size K)',
            description: 'Push elements into min-heap; if size > k, pop minimum. Top of heap is k-th largest.',
            difficulty: 'medium',
            problemIds: ['p-dsa-heap-kth-1', 'p-lpu-heap-kth-1'],
            keyRule: 'Finding top K elements in streaming or static collections',
          },
          {
            id: 'pat-heap-top-k-freq',
            title: 'Top K Frequent Elements',
            description: 'Frequency map + min-heap of size K ordered by count.',
            difficulty: 'medium',
            problemIds: ['p-dsa-top-k-frequent-1'],
            keyRule: 'Heavy hitters and frequent items identification',
          },
          {
            id: 'pat-heap-k-closest-points',
            title: 'K Closest Points to Origin',
            description: 'Max-heap of size K keyed on Euclidean distance (x^2 + y^2).',
            difficulty: 'medium',
            problemIds: ['p-dsa-k-closest-points-1'],
            keyRule: 'Proximity queries using bounded priority queues',
          },
        ],
      },
      {
        id: 'heap-greedy-heap',
        title: 'Greedy+ Heap',
        description: 'Greedy choice dynamic re-evaluation using priority queues.',
        patterns: [
          {
            id: 'pat-heap-task-scheduler',
            title: 'Task Scheduler with Cooldown & Median Stream',
            description: 'Max-heap of task frequencies + waiting queue tracking when tasks become eligible.',
            difficulty: 'medium',
            problemIds: ['p-dsa-task-scheduler-1', 'p-dsa-median-data-stream-1'],
            keyRule: 'CPU task scheduling with cooling intervals',
          },
          {
            id: 'pat-heap-meeting-rooms-ii',
            title: 'Meeting Rooms II (Min Conference Rooms)',
            description: 'Sort meetings by start time; min-heap stores end times of active meetings.',
            difficulty: 'medium',
            problemIds: ['p-dsa-meeting-rooms-ii-1'],
            keyRule: 'Concurrent interval overlap tracking',
          },
        ],
      },
      {
        id: 'heap-k-way-merge',
        title: 'K-way Merge',
        description: 'Merge K sorted arrays or lists into a single sorted stream in O(N log K).',
        patterns: [
          {
            id: 'pat-heap-merge-k-sorted',
            title: 'Merge K Sorted Lists',
            description: 'Insert head of all K lists into min-heap. Pop smallest, link, and insert next node.',
            difficulty: 'hard',
            problemIds: ['p-dsa-merge-k-sorted-lists-1', 'p-dsa130-merge-k-sorted-arrays'],
            keyRule: 'Optimal multi-way stream merging',
          },
        ],
      },
    ],
  },

  // 10. GRAPHS (19)
  {
    id: 'cat-graphs',
    title: 'GRAPHS',
    count: 19,
    color: '#a16207',
    bgLight: 'bg-amber-50',
    bgDark: 'dark:bg-yellow-950/40',
    borderColor: 'border-yellow-600',
    textColor: 'text-amber-700 dark:text-amber-300',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'graph-traversal',
        title: 'Traversal',
        description: 'Standard exploration of network nodes and connected components.',
        patterns: [
          {
            id: 'pat-graph-bfs',
            title: 'Breadth-First Search (BFS)',
            description: 'Queue-based traversal exploring nearest neighbors first. Finds shortest path in unweighted graphs.',
            difficulty: 'medium',
            visualizerId: 'bfs',
            problemIds: ['p-dsa-bfs-1', 'p-dsa-num-islands-1', 'p-lpu-bfs-1'],
            keyRule: 'Shortest path in unweighted graphs, level by level expansion',
          },
          {
            id: 'pat-graph-dfs',
            title: 'Depth-First Search (DFS)',
            description: 'Recursive exploration visiting deepest unvisited branch before backtracking.',
            difficulty: 'medium',
            visualizerId: 'dfs',
            problemIds: ['p-dsa-dfs-1', 'p-dsa-clone-graph-1', 'p-lpu-dfs-1'],
            keyRule: 'Connected component identification, flood fill',
          },
        ],
      },
      {
        id: 'graph-cycle-detection',
        title: 'Cycle Detection',
        description: 'Identify presence of closed loop dependencies in directed and undirected graphs.',
        patterns: [
          {
            id: 'pat-graph-cycle-undirected',
            title: 'Cycle in Undirected & Directed Graph',
            description: 'DFS tracking parent pointer or 3-color recursion stack.',
            difficulty: 'medium',
            problemIds: ['p-dsa-cycle-graph-1', 'p-dsa-course-schedule-1'],
            keyRule: 'Cycle verification in bidirectional network topologies',
          },
        ],
      },
      {
        id: 'graph-topological-sort',
        title: 'Topological Sort',
        description: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) respecting dependencies.',
        patterns: [
          {
            id: 'pat-graph-kahns-algo',
            title: "Kahn's Algorithm (BFS In-Degree) & Course Schedule",
            description: 'Compute in-degrees. Push 0 in-degree nodes into queue. Remove, decrement neighbors, repeat.',
            difficulty: 'medium',
            problemIds: ['p-dsa-course-schedule-1', 'p-dsa-course-schedule-ii-1'],
            keyRule: 'Dependency resolution, task scheduling in DAGs',
          },
        ],
      },
      {
        id: 'graph-shortest-path',
        title: 'Shortest Path',
        description: 'Find minimum cumulative weight path between source and destinations.',
        patterns: [
          {
            id: 'pat-graph-dijkstra',
            title: "Dijkstra's Algorithm (Non-Negative Weights)",
            description: 'Min-heap priority queue tracking (dist, node). Greedily relax edges with non-negative weights.',
            difficulty: 'medium',
            visualizerId: 'dijkstra',
            problemIds: ['p-dsa-dijkstra-1', 'p-dsa-network-delay-time-1', 'p-lpu-dijkstra-1'],
            keyRule: 'Shortest path in positively weighted graphs',
          },
          {
            id: 'pat-graph-bellman-ford',
            title: 'Bellman-Ford Algorithm (Negative Weights & Cycles)',
            description: 'Relax all edges V-1 times. A V-th relaxation improvement indicates negative weight cycle.',
            difficulty: 'medium',
            problemIds: ['p-dsa-bellman-ford-1'],
            keyRule: 'Shortest path with negative edge weights and cycle detection',
          },
          {
            id: 'pat-graph-floyd-warshall',
            title: 'Floyd-Warshall All-Pairs Shortest Path',
            description: 'Dynamic programming matrix update: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).',
            difficulty: 'hard',
            problemIds: ['p-dsa-floyd-warshall-1'],
            keyRule: 'All-pairs shortest path in dense graphs',
          },
        ],
      },
      {
        id: 'graph-spanning-tree',
        title: 'Spanning Tree',
        description: 'Connect all vertices with minimum total edge weight and zero cycles.',
        patterns: [
          {
            id: 'pat-graph-kruskal',
            title: "Kruskal's Algorithm (Edge Sorting + DSU)",
            description: 'Sort edges ascending by weight. Greedily add edge if it connects two disconnected components.',
            difficulty: 'medium',
            problemIds: ['p-dsa-mst-kruskal-1', 'p-lpu-mst-kruskal-1'],
            keyRule: 'Minimum spanning tree using Disjoint Set Union',
          },
          {
            id: 'pat-graph-prim',
            title: "Prim's Algorithm (Vertex-based Priority Queue)",
            description: 'Start at arbitrary node. Priority queue greedily pulls lightest edge crossing cut boundary.',
            difficulty: 'medium',
            problemIds: ['p-dsa-mst-prim-1'],
            keyRule: 'MST generation in dense networks',
          },
        ],
      },
      {
        id: 'graph-dsu',
        title: 'Union-Find (DSU) Detect cycle in undirected',
        description: 'Disjoint Set Union with path compression and union by rank.',
        patterns: [
          {
            id: 'pat-graph-dsu-redundant',
            title: 'Redundant Connection (Cycle in Undirected Graph)',
            description: 'For each edge (u, v): if find(u) == find(v), edge forms a cycle; else union(u, v).',
            difficulty: 'medium',
            problemIds: ['p-dsa130-redundant-connection'],
            keyRule: 'Dynamic connectivity and cycle detection in undirected graphs',
          },
        ],
      },
      {
        id: 'graph-bipartite-multi-bfs',
        title: 'Bipartite / Multi-source BFS / 0-1 BFS',
        description: 'Advanced breadth-first variations on specialized grid and graph metrics.',
        patterns: [
          {
            id: 'pat-graph-bipartite-check',
            title: 'Is Graph Bipartite? (2-Coloring)',
            description: 'Color node with color 1, all neighbors with color 2. Conflict means graph is not bipartite.',
            difficulty: 'medium',
            problemIds: ['p-dsa130-is-graph-bipartite'],
            keyRule: 'Odd-cycle absence and 2-colorability verification',
          },
          {
            id: 'pat-graph-multi-source-bfs',
            title: 'Multi-Source BFS & Water Flow',
            description: 'Push all starting boundary source nodes into queue; expand outward simultaneously.',
            difficulty: 'medium',
            problemIds: ['p-dsa-pacific-atlantic-1'],
            keyRule: 'Simultaneous spread from multiple origins in parallel',
          },
        ],
      },
    ],
  },

  // 11. TRIE (4)
  {
    id: 'cat-trie',
    title: 'TRIE',
    count: 4,
    color: '#be123c',
    bgLight: 'bg-rose-50',
    bgDark: 'dark:bg-rose-950/40',
    borderColor: 'border-rose-700',
    textColor: 'text-rose-700 dark:text-rose-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'trie-prefix-based',
        title: 'Prefix Based',
        description: 'Tree data structure where each node represents a character along string prefixes.',
        patterns: [
          {
            id: 'pat-trie-dict',
            title: 'Implement Trie (Prefix Tree) & Word Dictionary',
            description: 'Insert words character by character; mark isEndOfWord flag. O(L) insert and lookup.',
            difficulty: 'medium',
            problemIds: ['p-dsa-implement-trie-1', 'p-dsa-word-dictionary-trie-1'],
            keyRule: 'Fast prefix lookups, dictionary autocomplete',
          },
          {
            id: 'pat-trie-word-search-ii',
            title: 'Word Search II (Boggle Grid with Trie)',
            description: 'Insert dictionary words into Trie; DFS on 2D board guided by Trie prefix existence.',
            difficulty: 'hard',
            problemIds: ['p-dsa-word-search-ii-trie-1'],
            keyRule: 'Searching multiple dictionary words simultaneously on a board',
          },
        ],
      },
      {
        id: 'trie-bitwise',
        title: 'Bitwise Trie',
        description: 'Binary Trie indexing numbers from most significant bit (MSB) to LSB (0 and 1 branches).',
        patterns: [
          {
            id: 'pat-trie-max-xor',
            title: 'Maximum XOR Prefix Tree Indexing',
            description: 'Insert 32-bit binary representations. For each number, greedily branch into opposite bit.',
            difficulty: 'medium',
            problemIds: ['p-dsa-single-number-1', 'p-dsa-subsets-bitmask-1'],
            keyRule: 'Maximizing bitwise XOR combinations in O(32*N)',
          },
        ],
      },
    ],
  },

  // 12. DYNAMIC PROGRAMMING (19)
  {
    id: 'cat-dp',
    title: 'DYNAMIC PROGRAMMING',
    count: 19,
    color: '#64748b',
    bgLight: 'bg-slate-50',
    bgDark: 'dark:bg-slate-900',
    borderColor: 'border-slate-500',
    textColor: 'text-slate-700 dark:text-slate-300',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'dp-core',
        title: 'Core',
        description: 'Overlapping subproblems and optimal substructure memoization paradigms.',
        patterns: [
          {
            id: 'pat-dp-memoization',
            title: 'Memoization (Top-Down with Cache)',
            description: 'Recursive state space with lookup table to prevent redundant re-computation.',
            difficulty: 'easy',
            visualizerId: 'fibonacci-dp',
            problemIds: ['p-dsa-climbing-stairs-1'],
            keyRule: 'Top-down state exploration with cache table',
          },
          {
            id: 'pat-dp-tabulation',
            title: 'Tabulation (Bottom-Up Iteration)',
            description: 'Solve base cases first, then iteratively build DP table towards final target.',
            difficulty: 'medium',
            problemIds: ['p-dsa-coin-change-1'],
            keyRule: 'Bottom-up DP table filling without recursion call stack overhead',
          },
        ],
      },
      {
        id: 'dp-transition-type',
        title: 'Transition Type',
        description: 'State transitions determined by dimensions and dependency relationships.',
        patterns: [
          {
            id: 'pat-dp-1d',
            title: '1D State DP (House Robber / Stairs)',
            description: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Depends on immediate prior states.',
            difficulty: 'medium',
            problemIds: ['p-dsa-house-robber-1'],
            keyRule: 'Single index linear state progression',
          },
          {
            id: 'pat-dp-2d-grid',
            title: '2D Grid / Matrix DP (Unique Paths)',
            description: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]. Bounded path traversal across grid coordinates.',
            difficulty: 'medium',
            problemIds: ['p-dsa-unique-paths-1'],
            keyRule: 'Grid paths, minimum cost path, matrix transformations',
          },
        ],
      },
      {
        id: 'dp-pattern-types',
        title: 'Pattern Types',
        description: 'Canonical dynamic programming formulations encountered in technical evaluations.',
        patterns: [
          {
            id: 'pat-dp-knapsack',
            title: '0/1 Knapsack & Target Sum',
            description: 'Include or exclude item at index i. For 0/1 knapsack, iterate capacity backwards.',
            difficulty: 'medium',
            problemIds: ['p-dsa-target-sum-1'],
            keyRule: 'Resource constraint selection with item weights and values',
          },
          {
            id: 'pat-dp-lcs',
            title: 'Longest Common Subsequence (LCS) & Edit Distance',
            description: 'Compare characters: if s1[i]==s2[j] -> 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).',
            difficulty: 'medium',
            visualizerId: 'lcs',
            problemIds: ['p-dsa-lcs-1', 'p-dsa-edit-distance-1'],
            keyRule: 'Two string alignment, transformation, and subsequence matching',
          },
          {
            id: 'pat-dp-lis',
            title: 'Longest Increasing Subsequence (LIS - O(N log N))',
            description: 'dp[i] = 1 + max(dp[j]) or Patience Sort with Binary Search in tails array.',
            difficulty: 'medium',
            problemIds: ['p-dsa-lis-1'],
            keyRule: 'Monotonically ascending subsequence identification',
          },
          {
            id: 'pat-dp-mcm',
            title: 'Word Break & Partition DP',
            description: 'Try all partition points k between i and j.',
            difficulty: 'hard',
            problemIds: ['p-dsa-word-break-1'],
            keyRule: 'Optimal parenthesization and interval partitioning',
          },
        ],
      },
      {
        id: 'dp-advanced',
        title: 'Advanced',
        description: 'Complex state encoding across non-trivial domains.',
        patterns: [
          {
            id: 'pat-dp-bitmask',
            title: 'Stock with Cooldown & Multi-State DP',
            description: 'State transitions across buy, sell, cooldown states.',
            difficulty: 'hard',
            problemIds: ['p-dsa-stock-cooldown-1'],
            keyRule: 'Finite state machine dynamic programming transitions',
          },
        ],
      },
      {
        id: 'dp-optimization',
        title: 'Optimization',
        description: 'Reducing asymptotic memory or time complexities of DP solutions.',
        patterns: [
          {
            id: 'pat-dp-space-opt',
            title: 'Space Optimization (Prev vs Current State)',
            description: 'Reduce 2D DP table to two 1D rows (prev and curr) or single array updated in place.',
            difficulty: 'medium',
            problemIds: ['p-dsa-house-robber-ii-1'],
            keyRule: 'Transforming O(N*M) space into O(M) or O(1)',
          },
        ],
      },
    ],
  },

  // 13. GREEDY (12)
  {
    id: 'cat-greedy',
    title: 'GREEDY',
    count: 12,
    color: '#d946ef',
    bgLight: 'bg-fuchsia-50',
    bgDark: 'dark:bg-fuchsia-950/40',
    borderColor: 'border-fuchsia-500',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'greedy-interval',
        title: 'Interval Greedy',
        description: 'Sort intervals by start or end time to resolve overlaps greedily.',
        patterns: [
          {
            id: 'pat-greedy-merge-intervals',
            title: 'Merge Intervals',
            description: 'Sort by start time. If current.start <= prev.end, merge (prev.end = max(prev.end, current.end)).',
            difficulty: 'medium',
            problemIds: ['p-dsa-merge-intervals-1'],
            keyRule: 'Consolidating overlapping time ranges into contiguous blocks',
          },
          {
            id: 'pat-greedy-non-overlap',
            title: 'Non-Overlapping Intervals (Erase Minimum)',
            description: 'Sort by end time. Greedily keep interval with earliest finish time to maximize room for others.',
            difficulty: 'medium',
            problemIds: ['p-dsa-non-overlapping-intervals-1'],
            keyRule: 'Minimizing interval removals by prioritizing early completion',
          },
          {
            id: 'pat-greedy-insert-interval',
            title: 'Insert Interval into Sorted Non-overlapping List',
            description: 'Add preceding intervals; merge all overlapping intervals into newInterval; add remaining.',
            difficulty: 'medium',
            problemIds: ['p-dsa-insert-interval-1'],
            keyRule: 'Single pass interval insertion and expansion',
          },
        ],
      },
      {
        id: 'greedy-scheduling',
        title: 'Scheduling Greedy',
        description: 'Maximize throughput or resource occupancy.',
        patterns: [
          {
            id: 'pat-greedy-activity-selection',
            title: 'Meeting Rooms II & Partition Labels',
            description: 'Greedily select intervals and partition indices based on last seen bounds.',
            difficulty: 'medium',
            problemIds: ['p-dsa-meeting-rooms-ii-1', 'p-dsa-partition-labels-1'],
            keyRule: 'Optimal unweighted job scheduling on single machine',
          },
        ],
      },
      {
        id: 'greedy-resource-allocation',
        title: 'Resource Allocation',
        description: 'Distribute resources to satisfy constraints greedily.',
        patterns: [
          {
            id: 'pat-greedy-gas-station',
            title: 'Gas Station (Circular Greedy Tour)',
            description: 'If total gas < total cost, return -1. Else if running tank < 0, start must be at next station i+1.',
            difficulty: 'medium',
            problemIds: ['p-dsa-gas-station-1'],
            keyRule: 'Feasibility check and starting index identification in circular loops',
          },
        ],
      },
      {
        id: 'greedy-jump-game',
        title: 'Jump Game Pattern',
        description: 'Maintain reachable frontier and greedy boundary horizon.',
        patterns: [
          {
            id: 'pat-greedy-jump-reach',
            title: 'Jump Game I & II (Reachability & Min Jumps)',
            description: 'maxReach = max(maxReach, i + nums[i]). If i > maxReach, cannot proceed.',
            difficulty: 'medium',
            problemIds: ['p-dsa-jump-game-1', 'p-dsa-jump-game-ii-1'],
            keyRule: 'Reachability verification in linear time',
          },
        ],
      },
      {
        id: 'greedy-huffman',
        title: 'Huffman / Merge Cost',
        description: 'Greedily pair two smallest elements to minimize cumulative merge weights.',
        patterns: [
          {
            id: 'pat-greedy-min-cost-connect',
            title: 'Minimum Cost to Connect Sticks (Huffman Tree)',
            description: 'Min-heap pulls two smallest sticks, adds their sum to total cost, and re-inserts sum.',
            difficulty: 'medium',
            problemIds: ['p-dsa-heap-kth-1'],
            keyRule: 'Optimal prefix merge and Huffman coding trees',
          },
        ],
      },
    ],
  },

  // 14. BIT MANIPULATION (7)
  {
    id: 'cat-bits',
    title: 'BIT MANIPULATION',
    count: 7,
    color: '#2563eb',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/40',
    borderColor: 'border-blue-600',
    textColor: 'text-blue-600 dark:text-blue-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'bits-core',
        title: 'Core',
        description: 'Bitwise fundamental operators and bitmask manipulation.',
        patterns: [
          {
            id: 'pat-bits-operators',
            title: 'Bitwise Operators & Masking (Set, Clear, Toggle, Check)',
            description: 'Check: (n & (1<<k))!=0; Set: n | (1<<k); Clear: n & ~(1<<k); Toggle: n ^ (1<<k).',
            difficulty: 'easy',
            problemIds: ['p-dsa-single-number-1', 'p-dsa-reverse-bits-1'],
            keyRule: 'Direct register-level bit testing and manipulation',
          },
        ],
      },
      {
        id: 'bits-usage',
        title: 'Usage',
        description: 'Algorithmic applications exploiting binary representations.',
        patterns: [
          {
            id: 'pat-bits-single-number',
            title: 'Single Number (XOR Cancellation)',
            description: 'x ^ x = 0 and x ^ 0 = x. XORing all elements cancels duplicates, isolating unique value.',
            difficulty: 'easy',
            problemIds: ['p-dsa-single-number-1'],
            keyRule: 'Finding unique unpaired item in O(N) time with O(1) space',
          },
          {
            id: 'pat-bits-count-set-bits',
            title: "Counting Set Bits (Brian Kernighan's Algorithm)",
            description: 'n = n & (n - 1) clears lowest set bit in O(number of 1s).',
            difficulty: 'easy',
            problemIds: ['p-dsa-number-of-1-bits-1', 'p-dsa-counting-bits-1'],
            keyRule: 'Fast Hamming weight computation',
          },
          {
            id: 'pat-bits-power-of-two',
            title: 'Power of Two Verification & Subsets via Bitmask',
            description: '(n > 0) && (n & (n - 1)) == 0 verifies power of 2. Iterate mask 0..(1<<N)-1 for subsets.',
            difficulty: 'easy',
            problemIds: ['p-dsa-subsets-bitmask-1'],
            keyRule: 'Powers of two testing and binary combinatorial masks',
          },
        ],
      },
    ],
  },

  // 15. Sorting Algorithms (9)
  {
    id: 'cat-sorting',
    title: 'Sorting Algorithms',
    count: 9,
    color: '#334155',
    bgLight: 'bg-slate-100',
    bgDark: 'dark:bg-slate-900',
    borderColor: 'border-slate-700',
    textColor: 'text-slate-800 dark:text-slate-200',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'sorting-bubble',
        title: 'Bubble Sort',
        description: 'Repeatedly swap adjacent out-of-order elements; largest bubbles to end each pass. O(N^2).',
        patterns: [
          {
            id: 'pat-sort-bubble',
            title: 'Bubble Sort (Adjacent Swaps)',
            description: 'Adaptive pass optimization with early-exit flag when array is already sorted.',
            difficulty: 'easy',
            visualizerId: 'bubble-sort',
            problemIds: ['p-dsa-bubble-sort-1', 'p-lpu-bubble-sort-1'],
            keyRule: 'Adaptive stable sorting with adjacent element swaps',
          },
        ],
      },
      {
        id: 'sorting-selection',
        title: 'Selection Sort',
        description: 'Repeatedly scan unsorted portion for minimum element and swap into current position. O(N^2).',
        patterns: [
          {
            id: 'pat-sort-selection',
            title: 'Selection Sort (Minimum Scan)',
            description: 'Scans remaining unsorted suffix for minimum element; places at head.',
            difficulty: 'easy',
            visualizerId: 'selection-sort',
            problemIds: ['p-dsa-selection-sort-1', 'p-lpu-selection-sort-1'],
            keyRule: 'Unstable minimum-selection sorting with minimal write operations',
          },
        ],
      },
      {
        id: 'sorting-insertion',
        title: 'Insertion Sort',
        description: 'Build sorted array one element at a time by shifting larger elements right. O(N^2), O(N) best.',
        patterns: [
          {
            id: 'pat-sort-insertion',
            title: 'Insertion Sort (Card Shifting)',
            description: 'Maintains sorted prefix, shifting elements to make room for current key.',
            difficulty: 'easy',
            visualizerId: 'insertion-sort',
            problemIds: ['p-dsa-insertion-sort-1', 'p-lpu-insertion-sort-1'],
            keyRule: 'Fastest for nearly sorted or small datasets',
          },
        ],
      },
      {
        id: 'sorting-merge',
        title: 'Merge Sort',
        description: 'Divide array into two halves, recursively sort, and merge in linear time. Guaranteed O(N log N).',
        patterns: [
          {
            id: 'pat-sort-merge',
            title: 'Merge Sort (Divide & Conquer)',
            description: 'Stable O(N log N) recursive halving and linear merging using auxiliary buffer.',
            difficulty: 'medium',
            visualizerId: 'merge-sort',
            problemIds: ['p-dsa-merge-sort-1', 'p-lpu-merge-sort-1'],
            keyRule: 'Stable O(N log N) divide and conquer sorting',
          },
        ],
      },
      {
        id: 'sorting-quick',
        title: 'Quick Sort',
        description: 'Partition array around pivot (Lomuto / Hoare); recurse on sub-arrays. O(N log N) average.',
        patterns: [
          {
            id: 'pat-sort-quick',
            title: 'Quick Sort (Pivot Partitioning)',
            description: 'In-place partitioning with 3-way Dutch National Flag optimization.',
            difficulty: 'medium',
            visualizerId: 'quick-sort',
            problemIds: ['p-dsa-quick-sort-1', 'p-lpu-quick-sort-1'],
            keyRule: 'In-place cache-friendly sorting algorithm',
          },
        ],
      },
      {
        id: 'sorting-heap',
        title: 'Heap Sort',
        description: 'Build max-heap in O(N); swap root with last element and sift-down. Guaranteed O(N log N) in-place.',
        patterns: [
          {
            id: 'pat-sort-heap',
            title: 'Heap Sort (In-Place Max-Heap)',
            description: 'Complete binary tree index mapping with sift-down restorative operations.',
            difficulty: 'medium',
            visualizerId: 'heap-sort',
            problemIds: ['p-dsa-heap-sort-1', 'p-lpu-heap-sort-1'],
            keyRule: 'In-place non-recursive O(N log N) worst case guarantee',
          },
        ],
      },
      {
        id: 'sorting-counting',
        title: 'Counting Sort',
        description: 'Linear time sorting exploiting integer keys and bounded ranges.',
        patterns: [
          {
            id: 'pat-sort-counting',
            title: 'Counting Sort (Sort Colors / Frequency Prefix)',
            description: 'Count frequencies of each key in range [0..K]; compute prefix sums for stable placement.',
            difficulty: 'easy',
            problemIds: ['p-dsa130-sort-colors'],
            keyRule: 'Linear time sorting when key range K is comparable to N',
          },
        ],
      },
      {
        id: 'sorting-radix',
        title: 'Radix Sort',
        description: 'Sort numbers digit by digit from least significant digit (LSD) using stable counting sort.',
        patterns: [
          {
            id: 'pat-sort-radix',
            title: 'Radix Sort (Digit by Digit LSD)',
            description: 'Stable distribution per base/radix exponent in O(D * (N + B)).',
            difficulty: 'medium',
            problemIds: ['p-dsa130-sort-colors'],
            keyRule: 'Linear time integer sorting for fixed bit/digit length numbers',
          },
        ],
      },
      {
        id: 'sorting-bucket',
        title: 'Bucket Sort',
        description: 'Distribute elements into uniform buckets; sort individual buckets and concatenate.',
        patterns: [
          {
            id: 'pat-sort-bucket',
            title: 'Bucket Sort (Uniform Distribution Partition)',
            description: 'Scatter elements into interval buckets, sort independently, and gather.',
            difficulty: 'medium',
            problemIds: ['p-dsa-top-k-frequent-1'],
            keyRule: 'Uniformly distributed floating point or integer arrays',
          },
        ],
      },
    ],
  },

  // 16. RANGE STRUCTURES (5)
  {
    id: 'cat-range',
    title: 'RANGE STRUCTURES',
    count: 5,
    color: '#06b6d4',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/40',
    borderColor: 'border-cyan-500',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    courseCode: 'GLOBAL',
    subPatterns: [
      {
        id: 'range-segment-tree',
        title: 'Segment Tree & Calendar Overlaps',
        description: 'Binary tree storing aggregated intervals for O(log N) point/range queries and updates.',
        patterns: [
          {
            id: 'pat-range-seg-point',
            title: 'Segment Tree Range Queries & Interval Booking',
            description: 'Query aggregate over [L..R] in O(log N); update element at index in O(log N).',
            difficulty: 'medium',
            problemIds: ['p-dsa130-my-calendar-i', 'p-dsa-time-key-value-1'],
            keyRule: 'Dynamic mutable array range queries with point modifications',
          },
        ],
      },
      {
        id: 'range-fenwick',
        title: 'Fenwick Tree',
        description: 'Binary Indexed Tree (BIT) utilizing two\'s complement lowest set bit (i & (-i)).',
        patterns: [
          {
            id: 'pat-range-fenwick-bit',
            title: 'Binary Indexed Tree (Prefix Sum & Point Update)',
            description: 'Compact array where node i covers interval of length (i & -i). O(log N) prefix sum & point update.',
            difficulty: 'medium',
            problemIds: ['p-dsa-time-key-value-1'],
            keyRule: 'Prefix sum queries and point updates with minimal code and O(N) space',
          },
        ],
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════
// 2. LPU ACADEMIC SYLLABUS & PATTERNS TREE
// (Mapped to Official LPU CSE205 & CSE202 Curricula)
// ══════════════════════════════════════════════════════════════════
export const LPU_ACADEMIC_PATTERNS: MindMapCategory[] = [
  // CSE205 Unit 1: Arrays, Complexity, Sorting & Searching
  {
    id: 'lpu-cse205-u1',
    title: 'CSE205 Unit 1: Arrays, Complexity & Linear Sorts',
    count: 14,
    color: '#059669',
    bgLight: 'bg-emerald-50',
    bgDark: 'dark:bg-emerald-950/40',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    courseCode: 'CSE205',
    syllabusUnit: 'cse205-u1',
    subPatterns: [
      {
        id: 'lpu-u1-arrays',
        title: 'Arrays & Memory Architecture',
        description: 'Linear 1D & 2D array representation, address calculation, element shifting, and Big-O notation.',
        patterns: [
          {
            id: 'lpu-pat-u1-traversal',
            title: '1D/2D Array Traversal & Address Mapping',
            description: 'Row-major vs column-major order calculation; sequential element scanning.',
            difficulty: 'easy',
            problemIds: ['p-lpu-array-traversal-1', 'p-lpu-rotate-image-1'],
            keyRule: 'Address(A[i][j]) = Base + W * [ (i - lr)*C + (j - lc) ]',
          },
          {
            id: 'lpu-pat-u1-insert-delete',
            title: 'Element Insertion & Deletion Shifting',
            description: 'Boundary checks, rightward shifting for insertion, and leftward shifting for deletion.',
            difficulty: 'easy',
            problemIds: ['p-lpu-array-insert-1'],
            keyRule: 'Shifting overhead in contiguous linear arrays',
          },
          {
            id: 'lpu-pat-u1-kadane',
            title: "Kadane's Algorithm for Maximum Subarray",
            description: 'Optimal local vs global subarray sum tracking in contiguous arrays.',
            difficulty: 'medium',
            problemIds: ['p-lpu-kadane-1'],
            keyRule: 'Subarray sum optimization in O(N)',
          },
        ],
      },
      {
        id: 'lpu-u1-search-sort',
        title: 'Linear & Binary Searching & Elementary Sorts',
        description: 'Searching paradigms and quadratic sorting passes per LPU practical manual.',
        patterns: [
          {
            id: 'lpu-pat-u1-search',
            title: 'Linear Search vs Binary Search',
            description: 'Sequential O(N) lookup vs Logarithmic O(log N) halving on sorted ranges.',
            difficulty: 'easy',
            visualizerId: 'binary-search',
            problemIds: ['p-lpu-linear-search-1', 'p-lpu-binary-search-1'],
            keyRule: 'Sequential vs interval halving paradigms',
          },
          {
            id: 'lpu-pat-u1-bubble',
            title: 'Bubble Sort with Pass Optimization',
            description: 'Adjacent element comparisons with early exit swapped flag.',
            difficulty: 'easy',
            visualizerId: 'bubble-sort',
            problemIds: ['p-lpu-bubble-sort-1'],
            keyRule: 'LPU Practical 1: Bubble sort algorithm',
          },
          {
            id: 'lpu-pat-u1-insertion',
            title: 'Insertion Sort (Card Playing Paradigm)',
            description: 'Insert element into its correct sorted prefix position by shifting larger elements.',
            difficulty: 'easy',
            visualizerId: 'insertion-sort',
            problemIds: ['p-lpu-insertion-sort-1'],
            keyRule: 'LPU Practical 1: Insertion sort algorithm',
          },
          {
            id: 'lpu-pat-u1-selection',
            title: 'Selection Sort (Minimum Selection)',
            description: 'Scan unsorted subarray for smallest element and swap with current index.',
            difficulty: 'easy',
            visualizerId: 'selection-sort',
            problemIds: ['p-lpu-selection-sort-1'],
            keyRule: 'LPU Practical 1: Selection sort algorithm',
          },
        ],
      },
    ],
  },

  // CSE205 Unit 2: Linked Lists, Stacks & Queues
  {
    id: 'lpu-cse205-u2',
    title: 'CSE205 Unit 2: Linked Lists, Stacks & Queues',
    count: 12,
    color: '#0d9488',
    bgLight: 'bg-teal-50',
    bgDark: 'dark:bg-teal-950/40',
    borderColor: 'border-teal-600',
    textColor: 'text-teal-700 dark:text-teal-300',
    courseCode: 'CSE205',
    syllabusUnit: 'cse205-u2',
    subPatterns: [
      {
        id: 'lpu-u2-linked-lists',
        title: 'Singly, Doubly & Circular Linked Lists',
        description: 'Dynamic pointer nodes, pointer manipulation, and circular lists.',
        patterns: [
          {
            id: 'lpu-pat-u2-sll',
            title: 'Singly Linked List Manipulation & Reversal',
            description: 'Pointer redirection, middle node detection, and in-place reversal.',
            difficulty: 'easy',
            visualizerId: 'singly-linked-list',
            problemIds: ['p-lpu-ll-reverse-1', 'p-lpu-ll-middle-1'],
            keyRule: 'LPU Practical 2: Singly linked list operations',
          },
          {
            id: 'lpu-pat-u2-dll',
            title: 'Doubly Linked List Two-Way Traversal',
            description: 'Prev and next pointer management, bidirectional searching and insertion.',
            difficulty: 'medium',
            visualizerId: 'singly-linked-list',
            problemIds: ['p-lpu-dll-1'],
            keyRule: 'LPU Practical 2: Doubly linked list node insertion & deletion',
          },
          {
            id: 'lpu-pat-u2-cll',
            title: 'Circular Linked List End-to-Head Linking',
            description: 'Tail node pointing back to head for round robin buffers.',
            difficulty: 'medium',
            visualizerId: 'singly-linked-list',
            problemIds: ['p-lpu-cll-1'],
            keyRule: 'LPU Practical 2: Circular linked list algorithms',
          },
        ],
      },
      {
        id: 'lpu-u2-stacks-queues',
        title: 'Stacks, Queues, Polish Expressions & Deques',
        description: 'LIFO & FIFO ADTs using arrays and pointers; Polish notation conversions.',
        patterns: [
          {
            id: 'lpu-pat-u2-stack-array-ll',
            title: 'Stack ADT & Parentheses Balance',
            description: 'Push, pop, and top operations with overflow/underflow handling.',
            difficulty: 'easy',
            visualizerId: 'stack-operations',
            problemIds: ['p-lpu-stack-valid-parens-1', 'p-lpu-min-stack-1'],
            keyRule: 'LPU Practical 3: Stack implementation via array and pointer',
          },
          {
            id: 'lpu-pat-u2-polish-notation',
            title: 'Infix to Postfix Conversion & Evaluation',
            description: 'Operator precedence stack, parentheses handling, and postfix evaluation.',
            difficulty: 'medium',
            visualizerId: 'stack-operations',
            problemIds: ['p-lpu-stack-postfix-1', 'p-dsa-eval-rpn-1'],
            keyRule: 'LPU Practical 3: Arithmetic polish expression conversion',
          },
          {
            id: 'lpu-pat-u2-queues',
            title: 'Linear & Circular Queue Buffers',
            description: 'Enqueue and dequeue with front/rear pointer tracking and modulo arithmetic.',
            difficulty: 'medium',
            visualizerId: 'queue-operations',
            problemIds: ['p-lpu-queue-1', 'p-lpu-circular-queue-1'],
            keyRule: 'LPU Practical 4: Queue and circular queue implementation',
          },
        ],
      },
    ],
  },

  // CSE205 Unit 3: Trees, Binary Trees & BST
  {
    id: 'lpu-cse205-u3',
    title: 'CSE205 Unit 3: Trees, BST & AVL Balance',
    count: 10,
    color: '#ea580c',
    bgLight: 'bg-orange-50',
    bgDark: 'dark:bg-orange-950/40',
    borderColor: 'border-orange-600',
    textColor: 'text-orange-700 dark:text-orange-300',
    courseCode: 'CSE205',
    syllabusUnit: 'cse205-u3',
    subPatterns: [
      {
        id: 'lpu-u3-binary-trees',
        title: 'Binary Tree Architecture & Traversals',
        description: 'Hierarchical node representations; recursive & non-recursive Inorder, Preorder, Postorder.',
        patterns: [
          {
            id: 'lpu-pat-u3-traversals',
            title: 'Inorder, Preorder & Postorder Traversals',
            description: 'Recursive and iterative tree exploration with execution stack.',
            difficulty: 'easy',
            problemIds: ['p-lpu-tree-traversal-1', 'p-lpu-tree-level-order-1'],
            keyRule: 'LPU Practical 5: Binary tree traversal algorithms',
          },
        ],
      },
      {
        id: 'lpu-u3-bst-avl',
        title: 'BST Operations & AVL Height Balancing',
        description: 'Binary search tree ordering, search, insertion, deletion, and AVL self-balancing rotations.',
        patterns: [
          {
            id: 'lpu-pat-u3-bst-ops',
            title: 'BST Insertion, Search & Invariants',
            description: 'Inorder predecessor/successor replacement for deletion with two children.',
            difficulty: 'medium',
            visualizerId: 'bst-insert',
            problemIds: ['p-lpu-bst-insert-1', 'p-lpu-bst-validate-1', 'p-lpu-lca-bst-1'],
            keyRule: 'LPU Practical 6: BST insertion, search, and deletion',
          },
          {
            id: 'lpu-pat-u3-avl',
            title: 'AVL Tree Self-Balancing Rotations (LL, RR, LR, RL)',
            description: 'Balance factor calculation and rotations to guarantee O(log N) height.',
            difficulty: 'hard',
            visualizerId: 'avl-balancing',
            problemIds: ['p-lpu-avl-tree-1'],
            keyRule: 'LPU Practical 6: AVL tree height-balance invariant',
          },
        ],
      },
    ],
  },

  // CSE205 Unit 4: Graphs, Traversals, Shortest Paths & Divide & Conquer
  {
    id: 'lpu-cse205-u4',
    title: 'CSE205 Unit 4: Graphs, Shortest Path, MST & D&C',
    count: 14,
    color: '#4f46e5',
    bgLight: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-950/40',
    borderColor: 'border-indigo-600',
    textColor: 'text-indigo-700 dark:text-indigo-300',
    courseCode: 'CSE205',
    syllabusUnit: 'cse205-u4',
    subPatterns: [
      {
        id: 'lpu-u4-graph-traversals',
        title: 'Graph Representation & BFS/DFS',
        description: 'Adjacency matrix vs adjacency list representations; BFS queue and DFS recursion.',
        patterns: [
          {
            id: 'lpu-pat-u4-bfs-dfs',
            title: 'Graph BFS & DFS Traversals',
            description: 'Visited array marking, connected component detection, and path finding.',
            difficulty: 'medium',
            visualizerId: 'bfs',
            problemIds: ['p-lpu-bfs-1', 'p-lpu-dfs-1'],
            keyRule: 'LPU Practical 7: Graph representation and traversal',
          },
        ],
      },
      {
        id: 'lpu-u4-mst-shortest-path',
        title: 'Minimum Spanning Trees & Dijkstra',
        description: 'Greedy tree spanning (Kruskal, Prim) and single-source shortest paths.',
        patterns: [
          {
            id: 'lpu-pat-u4-dijkstra',
            title: "Dijkstra's Shortest Path Algorithm",
            description: 'Relaxation of edge weights using distance arrays and priority queue.',
            difficulty: 'medium',
            visualizerId: 'dijkstra',
            problemIds: ['p-lpu-dijkstra-1'],
            keyRule: 'LPU Practical 8: Shortest path routing in weighted graphs',
          },
          {
            id: 'lpu-pat-u4-mst',
            title: "Prim's & Kruskal's Minimum Spanning Tree",
            description: 'Greedy cut property vs edge sorting with Disjoint Set Union.',
            difficulty: 'medium',
            visualizerId: 'kruskal',
            problemIds: ['p-lpu-mst-kruskal-1'],
            keyRule: 'LPU Practical 8: Minimum Spanning Tree algorithms',
          },
        ],
      },
      {
        id: 'lpu-u4-dc-sorts',
        title: 'Divide & Conquer Sorting (Merge & Quick)',
        description: 'Recursive divide and conquer sorting with recurrence relation analysis.',
        patterns: [
          {
            id: 'lpu-pat-u4-merge-quick',
            title: 'Merge Sort & Quick Sort Algorithms',
            description: 'Divide and conquer partitioning and merging in O(N log N).',
            difficulty: 'medium',
            visualizerId: 'merge-sort',
            problemIds: ['p-lpu-merge-sort-1', 'p-lpu-quick-sort-1'],
            keyRule: 'LPU Practical 9: Merge and Quick Sort implementations',
          },
        ],
      },
    ],
  },

  // CSE205 Unit 5: Heaps & Hashing
  {
    id: 'lpu-cse205-u5',
    title: 'CSE205 Unit 5: Heaps, Priority Queues & Hashing',
    count: 8,
    color: '#0891b2',
    bgLight: 'bg-cyan-50',
    bgDark: 'dark:bg-cyan-950/40',
    borderColor: 'border-cyan-600',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    courseCode: 'CSE205',
    syllabusUnit: 'cse205-u5',
    subPatterns: [
      {
        id: 'lpu-u5-heaps',
        title: 'Binary Heaps & Priority Queues',
        description: 'Complete binary tree array representations, min/max heapify, and heap sort.',
        patterns: [
          {
            id: 'lpu-pat-u5-heapify',
            title: 'Heapify & Heap Sort in O(N log N)',
            description: 'Array index mapping: parent(i)=(i-1)/2, left=2i+1, right=2i+2. Sift-down restorations.',
            difficulty: 'medium',
            visualizerId: 'heap-sort',
            problemIds: ['p-lpu-heap-sort-1', 'p-lpu-heap-kth-1'],
            keyRule: 'LPU Practical 10: Heap construction and Heap Sort',
          },
        ],
      },
      {
        id: 'lpu-u5-hashing',
        title: 'Hash Tables & Collision Resolution',
        description: 'Hash functions (division, folding, mid-square) and collision resolution strategies.',
        patterns: [
          {
            id: 'lpu-pat-u5-open-chaining',
            title: 'Separate Chaining & Hash Tables',
            description: 'Handling collisions via linked chains or linear index stepping.',
            difficulty: 'easy',
            problemIds: ['p-lpu-hash-chaining-1'],
            keyRule: 'LPU Practical 11: Collision resolution techniques',
          },
        ],
      },
    ],
  },

  // CSE205 Unit 6: Advanced/Emerging Structures & Advanced Sorting
  {
    id: 'lpu-cse205-u6',
    title: 'CSE205 Unit 6: Advanced Structures, DP & Linear Sorts',
    count: 10,
    color: '#7c3aed',
    bgLight: 'bg-violet-50',
    bgDark: 'dark:bg-violet-950/40',
    borderColor: 'border-violet-600',
    textColor: 'text-violet-700 dark:text-violet-300',
    courseCode: 'CSE205',
    syllabusUnit: 'cse205-u6',
    subPatterns: [
      {
        id: 'lpu-u6-linear-sorts',
        title: 'Radix, Bucket & Counting Sort',
        description: 'Linear time non-comparison sorting paradigms across integer ranges.',
        patterns: [
          {
            id: 'lpu-pat-u6-radix-sort',
            title: 'Radix & Counting Sort Invariants',
            description: 'Stable digit-by-digit distribution and bucket accumulation.',
            difficulty: 'medium',
            problemIds: ['p-dsa130-sort-colors'],
            keyRule: 'LPU Practical 12: Non-comparison integer sorting',
          },
        ],
      },
      {
        id: 'lpu-u6-emerging',
        title: 'Tries, Dynamic Programming & Range Trees',
        description: 'Prefix indexing, dynamic programming memoization, and segment tree ranges.',
        patterns: [
          {
            id: 'lpu-pat-u6-trie',
            title: 'Trie Prefix Trees for Dictionary Operations',
            description: 'Fast character retrieval and prefix matching.',
            difficulty: 'medium',
            problemIds: ['p-dsa-implement-trie-1'],
            keyRule: 'Prefix tree indexing in emerging curriculum',
          },
          {
            id: 'lpu-pat-u6-dp',
            title: 'Dynamic Programming Foundations (Knapsack & LCS)',
            description: 'Optimal substructure and memoization tables.',
            difficulty: 'medium',
            visualizerId: 'lcs',
            problemIds: ['p-dsa-lcs-1', 'p-dsa-coin-change-1'],
            keyRule: 'Advanced algorithmic paradigm integration',
          },
        ],
      },
    ],
  },

  // CSE202 Unit 1-6: Object Oriented Programming in C++ (LPU Academic)
  {
    id: 'lpu-cse202-all',
    title: 'CSE202: Object Oriented Programming in C++',
    count: 12,
    color: '#2563eb',
    bgLight: 'bg-blue-50',
    bgDark: 'dark:bg-blue-950/40',
    borderColor: 'border-blue-600',
    textColor: 'text-blue-700 dark:text-blue-300',
    courseCode: 'CSE202',
    syllabusUnit: 'cse202-u1',
    subPatterns: [
      {
        id: 'lpu-cse202-foundations',
        title: 'Classes, Objects, Encapsulation & Friend',
        description: 'Encapsulation, member functions, friend functions/classes, and parameter passing.',
        patterns: [
          {
            id: 'lpu-pat-cse202-classes',
            title: 'Class Design & Encapsulation Mutators',
            description: 'Private data protection and public interface methods in C++.',
            difficulty: 'easy',
            problemIds: ['p-cpp-classes-1', 'p-cpp-encapsulation-1'],
            keyRule: 'LPU CSE202 Unit 1: OOP Encapsulation',
          },
          {
            id: 'lpu-pat-cse202-friend',
            title: 'Friend Functions & Overloading',
            description: 'Granting non-member functions access to private class members.',
            difficulty: 'easy',
            problemIds: ['p-cpp-friend-1', 'p-cpp-func-overload-1'],
            keyRule: 'LPU CSE202 Unit 1: Friend functions & function overloading',
          },
        ],
      },
      {
        id: 'lpu-cse202-constructors-inheritance',
        title: 'Constructors, Inheritance & Operator Overloading',
        description: 'Constructor types, destructors, single/multiple/virtual inheritance, and operator overloading.',
        patterns: [
          {
            id: 'lpu-pat-cse202-constructors',
            title: 'Default, Parameterized & Copy Constructors',
            description: 'Object lifecycle management, deep vs shallow copy, and initializer lists.',
            difficulty: 'easy',
            problemIds: ['p-cpp-constructors-1', 'p-cpp-destructors-1'],
            keyRule: 'LPU CSE202 Unit 2: Object lifecycle & copy semantics',
          },
          {
            id: 'lpu-pat-cse202-inheritance',
            title: 'Inheritance & Virtual Base Classes (Diamond Problem)',
            description: 'Code reusability, access specifiers, and resolving multiple inheritance ambiguity.',
            difficulty: 'medium',
            problemIds: ['p-cpp-inheritance-1', 'p-cpp-diamond-problem-1'],
            keyRule: 'LPU CSE202 Unit 3: Inheritance hierarchies & virtual base classes',
          },
          {
            id: 'lpu-pat-cse202-operator-overload',
            title: 'Unary & Binary Operator Overloading',
            description: 'Overload +, -, <<, >>, and type conversion operators.',
            difficulty: 'medium',
            problemIds: ['p-cpp-operator-overload-1'],
            keyRule: 'LPU CSE202 Unit 4: Operator overloading and user-defined conversion',
          },
        ],
      },
      {
        id: 'lpu-cse202-poly-templates-stl',
        title: 'Polymorphism, Exception Handling & C++ STL',
        description: 'Virtual functions, pure virtual abstract classes, templates, and Standard Template Library.',
        patterns: [
          {
            id: 'lpu-pat-cse202-polymorphism',
            title: 'Virtual Functions & Abstract Base Classes',
            description: 'Run-time dynamic binding using vtable and vptr.',
            difficulty: 'medium',
            problemIds: ['p-cpp-polymorphism-1', 'p-cpp-abstract-class-1'],
            keyRule: 'LPU CSE202 Unit 5: Run-time dynamic polymorphism',
          },
          {
            id: 'lpu-pat-cse202-templates-stl',
            title: 'Templates & Standard Template Library (STL)',
            description: 'Function/class templates and STL containers (vector, list, map, set) with algorithms.',
            difficulty: 'medium',
            problemIds: ['p-cpp-templates-1', 'p-cpp-stl-vector-1', 'p-cpp-stl-map-1'],
            keyRule: 'LPU CSE202 Unit 6: Generic programming and STL usage',
          },
        ],
      },
    ],
  },
];
