# Digit DP

**Target Problem**: 
- Count the number with some specific properties in a range $[L, R]$.
- The requirements are usually related to the digits of the number, e.g., the sum of digits, the number of certain digits, etc.
- The upper limit $R$ can be as large as $10^{18}$ or even $10^{100}$, we can't enumerate all the numbers in the range.

For example,

> How many numbers are there in the range $[L, R]$ such that the sum of their digits is equal to $S$?

## Key Idea

First of all, to count the numbers of a certain property in the range $[L, R]$, we can define a function `count(n)` that counts the numbers with the property in the range $[0, n]$. Then the answer to our problem is `count(R) - count(L - 1)`. Then let's focus on how to implement the `count(n)`, which abviously related to the result of smaller `count(m)` where $m < n$. Intuitively, we can solve such a state-related problem with **dynamic programming**.

The key idea of digit DP is to use **dynamic programming** to count the numbers that satisfy the given properties. We can define a DP state that represents the number of ways to form a valid number with certain properties up to a certain digit.

We first introduce some state variables:
- `pos`: the current position of the digit we are processing (from left to right).
- `sum`: the current sum of the digits we have processed so far.
- `tight`: a boolean variable that indicates whether the current number we are forming is still "tight" with the upper limit $R$. If `tight` is true, it means we can only choose digits up to the corresponding digit in $R$ at this position; if false, we can choose any digit from 0 to 9.

