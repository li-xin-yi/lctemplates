# Prefix Sum

## What is prefix sum

Given a numeric array `lst` of length `n`, we can use an array `pre_sum` of length `n+1` to represent the current accumulated sum until now, starting from the empty array, where the sum is initialized as 0: 

```py
pre_sum = [0]
for num in lst:
    pre_sum.append(pre_sum[-1]+num)
```

In other word, `i`-th element in the prefix-sum array `pre_sum` (i.e., `pre_sum[i]`) stores the sum of `lst[0:i]` (the index range of `[0,i)`), that is, the sum of the first `i` elements in `lst`. 

Obviously, the remarkable benfit of first traversing the array to get such a prefix-sum array is the **less time and space** used to evalute the sum of each `lst[i:j]` later, for which we can simply use the following formula:

```
sum(lst[i:j]) = pre_sum[j] - pre_sum[i]
```

- **Time Complexity**: $O(n)$ for obtaining the prefix-sum array and $O(1)$ for obtaining any sum within a sub-array.
- **Space Complexity** : $O(n)$

Compare to some naive approaches:
- If you add up all elements in `lst[i:j]` every time, it costs $O(j-i)$ for every query of `sum(lst[i:j])`.
- If you store all sums between all indexes of `i<=j` in a 2-D array, it costs $O(n^2)$ space.


## When should I use prefix sum to solve problems?

- You're required to evaluate the sums of some elements with successive indexes (i.e., sums of sub-arraies) **frequently**.
- Always serves as a quick evaluation **trick** in other methods (e.g., *dynamic programming*, *binary search* and etc.) to reduce the cost of calculating the sums of some **dynamically sliced sub-arraies**.