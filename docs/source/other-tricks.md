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

**Answer**: Use XOR-basis ([linear basis](https://en.wikipedia.org/wiki/Linear_basis)) to maximize $XOR(S^\prime) \& \neg XOR(S)$ where $S^\prime$ is a subset of $S$. The maximum value is $T + 2 (XOR(S) \& \neg T)$ where $T = XOR(S)$.

````{dropdown} Reasoning

> For any non-negative $a$ and $b$, we have 
> 
> $$a + b = (a \oplus b) + 2 (a \& b)$$

Denote $T = XOR (S)$, then we have $XOR(S_1) + XOR(S_2) = x + (T \oplus x)$ where $x = XOR(S_1)$.

To check it bit by bit, $x + (T \oplus x) = T + 2 (x \  \&  \ \neg T)$, the $i$-th bit of T:

- If $T_i = 1$, you can only get $2^i$ in the contribution to the sum above. 
- If $T_i = 0$, you can get either $0$ or two $2^i$s ($2 \cdot 2^i$) in the contribution to the sum above, depending on whether you choose $x_i = 0$ or $1$.

So the maximum value is obtained by choosing every $x_i \ \& \ \neg T_i$ as largest as possible.


````