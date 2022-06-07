# Segment Tree

{badge}`TODO, badge-danger badge-pill`

## What is a segment tree?

Imagine that you are given an array of integers, namely `A`, of length `n`. There are totally $2^n-1$ non-empty subarries, written as `A[i:j+1]` with `0<=i<=j<n`. To maintain some statistics (e.g. sum, min, max and etc.) about each subarrey for further queries, we have some straightforward solutions:

- If we naively keep all $2^n-1$ subarries physically, we need $O(n^2)$ spaces, while every time we need to query some information about a specified interval `[i,j]`, it costs $O(1)$ time. However, if you need to update a single element in `A`, to keep all data about all intervals up-to-date, you still need $O(n^2)$ time to update all intervals containing the element. 
- In opposite, if we only keep every single element for each index (every `A[i]`), in other words, `n` intervals of length 1, as what a built-in array exactly does, we only require $O(n)$ space to build them and $O(1)$ to update any single element. But the time cost for each query of interval data increases to $O(n)$.
- ...

Yes, as you see, this is a **trade-off** between **space and time**, as well as a **trade-off** between **construction**, the following **updates**, and **queries**. A [segment tree](https://en.wikipedia.org/wiki/Segment_tree) is designed to balance those costs and break the dilemma, which offers better performance to build the array quickly and supports **numerous** times of both *update* and *query* operations. 