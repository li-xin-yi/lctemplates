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

## Alternatives

You may also see some other ways written by coders. For example, some may first assign a `(n+1)`-zeros list and then update every `pre_sum[i]` by iterations, which can be regarded as a trivial *dynamic programming* approach (we refer it as *Alt-1 template* in the following):

```py
pre_sum = [0]*(n+1)
for i in range(n):
    pre_sum[i+1] = pre_sum[i]+lst[i]
```

while some may utilize [itertools.accumulate](https://docs.python.org/3/library/itertools.html#itertools.accumulate) function directly (we refer it as *Alt-2 template* in the following) as

```py
from itertools import accumulate
pre_sum = list(accumulate(lst,initial=0))
```

I also measured the runtime (we use CPU time here) for those three templates using Python 3.8, by running on `m` lists of `n`-elements respectively. The source code and raw data are available in [this notebook](https://github.com/li-xin-yi/lctemplates/blob/main/test/prefix-sum-templates.ipynb). The results are listed as below:

Scale   | Original | Alt 1 | Alt 2
---------|---------|----------|---------
n=1e5, m = 100 | 2.45s | 2.78s | **516ms**
n=5, m=1e4 |15.6ms | 46.9ms | **\~ 0ns**
n=1e4, m=1e4 | 20.2s | 28.1s | **5.25s**

To conclude, **`accumulate` (Alt-2 template) outperforms other templates significantly and keeps a very neat code style meanwhile**, which is resulted from some optimization in this function implementation.

But I still suggest you stick to any template **as long as you're comfortable with it** because LeetCode conducts very loose restrictions on runtime. About 100 test cases with the most extended list as $10^5$-elements are usually designed for each LeetCode problem (like row 1 in the table above), in which a template won't have a great impact on overall runtime, so you can pick any preferred style in a LC weekly contest just for finding the solution fast.

## Usage Examples

## Extensions \& Generalization


