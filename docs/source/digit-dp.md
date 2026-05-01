# Digit DP

**Target Problem**: 
- Count the number with some specific properties in a range $[L, R]$.
- The requirements are usually related to the digits of the number, e.g., the sum of digits, the number of certain digits, etc.
- The upper limit $R$ can be as large as $10^{18}$ or even $10^{100}$, we can't enumerate all the numbers in the range.

For example,

> How many numbers are there in the range $[L, R]$ such that the sum of their digits is equal to $S$?

## Key Idea

The key idea of digit DP is to use **dynamic programming** to count the numbers that satisfy the given properties. We can define a DP state that represents the number of ways to form a valid number with certain properties up to a certain digit.

