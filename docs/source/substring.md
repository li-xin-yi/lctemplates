# Substring Problem

## Problem Background

Given a long string `source` and a short string `target`, we want to find all the start indices of `target`'s occurrences in `source`.

The brute-force solution is to enumerate all the possible start indices of `source` and check whether it can match `target`.

```python
def find_substring(source: str, target: str) -> List[int]:
    n, m = len(source), len(target)
    indices = []
    for i in range(n - m + 1):
        if source[i:i + m] == target:
            res.append(i)
    return indices
```

Certainly, the time complexity of this solution is $O(n \cdot m)$, where $n$ is the length of `source` and $m$ is the length of `target`.

## Rabin-Karp Algorithm (Rolling Hash)

The Rabin-Karp algorithm is a string-searching algorithm that uses hashing to find any one of a set of pattern strings in a text. It is a randomized algorithm, and it is often used with another algorithm to solve the string-matching problem.

The idea of the Rabin-Karp algorithm is to use a rolling hash to compare the hash value of `target` with the hash value of each substring of `source` with the same length as `target`. The rolling hash is a hash function where the input is hashed in a window that moves through the input.

### String Hashing

The hash function that maps a string to a number is called a string hashing. The most common hash function is the polynomial rolling hash function, which is defined as follows:

$$H(s) = \sum_{i=0}^{n-1} s[i] \cdot b^{n-1-i} (\mod m)$$

where

- $s[i]$ is the ASCII value of the $i$-th character of the string `s` (**notice**: the value should starting from 1 to calculate the hash value)
- $b$: the base of the polynomial hash function, not necessarily a prime number, but larger than the maximum value of $s[i]$ (for example, $b = 256$ for ASCII characters, for lower-case English letters, $b = 26$ is enough)
- $m$: the modulus of the polynomial hash function, which is usually a large prime number (at least larger than the biggest value of $s[i]$, I usually use $10^9 + 7$)

So here we give an example to calculate the hash of `target`:

```python
# init
h_target = 0
for c in target:
    # increase the power, append new character and mod m
    h_target = (h_target * b + ord(c)) % m
```

**Observation**: the highest power of $b$ in the polynomial hash function is $b^{n-1}$, where $n$ is the length of the string.

### Update the Hash Value

We image a sliding window of length $m$ moving from the left to the right of the string `source`. When the window moves from position $i$ to position $i+1$, we need to update the hash value of the substring `source[i:i+m]` to the hash value of the substring `source[i+1:i+m+1]`. Intuitively, we pop the first character of the substring and push the next character into the substring, and then update the hash value. So there is two steps to update the hash value:

- Remove the `source[i]` from the hash value: subtract `source[i] * b^{n-1}` from the hash value
- Add the `source[i+m]` to the hash value: multiply the hash value by `b` and add `source[i+m]`

```python
def match(source: str, h_target: int, target_len: int) -> List[int]:
    res = []
    n = len(source)
    # highest power of b
    p = pow(b, target_len - 1, m)
    for i in range(n):
        if i >= target_len:
            # remove the first character
            h_source = (h_source - ord(source[i - target_len]) * p) % m
        # add the next character
        h_source = (h_source * b + ord(source[i])) % m
        if i >= target_len - 1 and h_source == h_target:
            res.append(i - target_len + 1)
    return res
```

Compared to other linear-time string-matching algorithms (e.g., KMP, AC automation, Z algorithm)

**Pros**:

- Easy to understand, implement and explain the theory in it.

To be honest, I can't memorize every theotical details and implementation of KMP. So I prefer to use rolling hash when I come across the string-matching problem in an interview.

**Cons**:

- The hash value may collide: two different strings can have the same hash value. Be careful to choose the base and the modulus of the polynomial hash function.
- You must know the length of the `target` in advance. It's not suitable for the problem that the length of the `target` is not fixed.

### Example

[LC 686. Repeated String Match](https://leetcode.com/problems/repeated-string-match/) is a typical matching problem. Repeat the string `a` to at most `len(a) + len(b)` length and check the first occurrence of `b` in the repeated string.

```python
class Solution:
    def repeatedStringMatch(self, a: str, b: str) -> int:
        base, M = 26, 10 ** 9 + 7
        target = 0
        n, m = len(a), len(b)
        for c in b:
            target = (target * base + ord(c) - ord('a') + 1 ) % M

        h = 0
        i = 0
        p = pow(base, m - 1, M)
        while i< n + m:
            if i >= m:
                last = a[(i - m) % n]
                h = (h - (ord(last) - ord('a') + 1) * p) % M
            h = (h * base + ord(a[i%n]) - ord('a') + 1) % M
            if h == target:
                # math.ceil((i+1) / n)
                return (i+n) // n
            i += 1
        return -1
```
