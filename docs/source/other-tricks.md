# Other tricks

Distinguished from Python tips, we also have some other tricks to help you get accepted (AC) but not so relvant to Python programming language features.

## Time Complexity Estimation

To guess what algorithm can be used to get accepted by LeetCode, a trick to first observe the **data range** can also be used here. For example, the size $n$ of an input array is given in the **notes** section of every problem, we can roughly guess the algorithm:

| $n$        | Complexity Upper Bound | Possible Algorithms                          |
| ---------- | ---------------------- | -------------------------------------------- |
| $\le 20$   | $O(2^n)$               | Brute-force DFS, Bitmask                     |
| $\le 10^2$ | $O(n^3)$               | Brute-force, Floyd-Warshall, 3-D DP          |
| $\le 10^3$ | $O(n^2)$               | 2-D DP, BFS, DFS                             |
| $\le 10^5$ | $O(n\log n)$           | Sort, Binary Search, Dijkstra                |
| $\le 10^6$ | $O(n)$                 | Hash, Prefix Sum, Union-Find, Double Pointer |
| $\le 10^9$ | $O(\log n)$            | Binary Search                                |

## Serial Number Guess

Check https://oeis.org/ and take a brave guess.

## Round-up

$\lceil \frac{a}{b} \rceil = $ `(a + b - 1) // b`

## Bit Manipulation

| Objective | Expression |
| --------- | ---------- |
| How many bits are needed to represent a number $n$? | `x.bit_length()` |
| Numbers of ones in binary representation of $n$ | `x.bit_count()` |
| The lowest one-bit of $n$ | `x & -x` |
| The lowest zero-bit of $n$ | `~x & (x + 1)` |

### Some Conclusions

If we have a set of numbers $S$, we split them into two sets $S_1$ and $S_2$ ($S_1 \cup S_2 = S$ and $S_1 \cap S_2 = \emptyset$), how to maximize $XOR(S_1) + XOR(S_2)$? (Reference to [LC 3630](https://leetcode.com/problems/partition-array-for-maximum-xor-and-and/description/) and [CF  251D](https://codeforces.com/problemset/problem/251/D))

Read more: [Linear Basis](https://en.wikipedia.org/wiki/Linear_basis)
