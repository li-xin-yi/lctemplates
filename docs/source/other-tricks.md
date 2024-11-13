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