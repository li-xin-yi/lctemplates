# Prefix Sum

{badge}`Done, badge-success badge-pill`

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

### Classic

[LC2256: Minimum Average Difference](https://leetcode.com/problems/minimum-average-difference/), a very typical application of prefix sum array: it asks for the average of first `i+1` elements and the average of last `n-i-1` elements for each `0<=i<n`, in which the sum of `i+1` elements and the  last `n-i-1` elements) can be read as `pre[i]` and `pre[-1]-pre[i]` respectively.

```py
class Solution:
    def minimumAverageDifference(self, nums: List[int]) -> int:
        n = len(nums)
        pre = [0]
        idx,res = -1,float('inf')
        for num in nums:
            pre.append(pre[-1]+num)
        for i in range(n):
            diff = abs(pre[i+1]//(i+1) - (pre[-1]-pre[i+1])//(n-i-1)) if i!=n-1 else pre[i+1]//(i+1)
            if diff < res:
                res = diff
                idx = i
        return idx
```

### 2-Direction


[LC2245 Maximum Trailing Zeros in a Cornered Path](https://leetcode.com/problems/maximum-trailing-zeros-in-a-cornered-path/): instead of accumulating the number itself, in this problem, we should accumulate the number of factors of 2 and 5 along with all "paths".

![](https://assets.leetcode.com/uploads/2022/03/23/ex1new2.jpg)

The idea is explained by [@votrubac](https://leetcode.com/votrubac/) in [^1] as the picture below (`[a:b]`in the table represents there are total `a` factors of 2 and `b` factors of 5 so far in this line, upper->lower, left->right):

[^1]: [Prefix Sum of Factors 2 and 5](https://leetcode.com/problems/maximum-trailing-zeros-in-a-cornered-path/discuss/1955515/Prefix-Sum-of-Factors-2-and-5)

![Picture from](https://assets.leetcode.com/users/images/881c18fd-0d0a-4b02-9f1e-06ccb0882df7_1650190116.5992572.png)

- First, calculate the prefix sum of all factors of 2 and 5 for each row (stored as `rows`, with a shape `n*(m+1)`)) and each column (stored as `cols`, with a shape `m*(n+1)`) respectively
- Now, for each index `(i,j)`, you can reach it by
    1. left -> right: `grid[i][:j]`, the total number of factors so far (`(i,j)` exclusively) should be `rows[i][j]`
    2. right -> left: `grid[i][j+1:]`, as `rows[i][-1]-rows[i][j+1]` (yes, *suffix sum* can be calculated by prefix sum as well, you don't have to caculate it again reversely)
    3. upper -> lower: `grid[:i][j]`, as `cols[j][i]`
    4. lower -> upper: `grid[i+1:][j]`, as `cols[j][-1]-cols[j][i+1]`
- When selecting any index `(i,j)` as the "turn point" (*you must turn once to maximize the result because at least it won't reduce the number of factors anyway, why not?*), sum up the element itself with two paths that reaches it horizontally and vertically, those are, 1 and 3, 1 and 4, 2 and 3, 2 and 4 above, four combinations in total.
- Find out the max values from all selected "turn points". The overall time complexity is $O(nm)$

```py
class Solution:
    def maxTrailingZeros(self, grid: List[List[int]]) -> int:
        n,m = len(grid),len(grid[0])
        res = 0
        
        def factors(x,f):
            res = 0
            while x%f == 0:
                x//=f
                res+=1
            return res
        
        def pre_sum(lst):
            pre = [(0,0)]
            for a,b in lst:
                pre.append((pre[-1][0]+a,pre[-1][1]+b))
            return pre
        
        for i in range(n):
            for j in range(m):
                grid[i][j] = factors(grid[i][j],2),factors(grid[i][j],5)
        
        rows = [pre_sum(row) for row in grid]
        cols = [pre_sum([grid[i][j] for i in range(n)]) for j in range(m)]

        for i in range(n):
            for j in range(m):
                left_row, upper_col = rows[i][j], cols[j][i]
                right_row = rows[i][-1][0] - rows[i][j+1][0],rows[i][-1][1] - rows[i][j+1][1]
                lower_col = cols[j][-1][0] -cols[j][i+1][0],cols[j][-1][1] -cols[j][i+1][1]
                x0,y0 = grid[i][j]
                for x1,y1 in [left_row,right_row]:
                    for x2,y2 in [lower_col,upper_col]:
                        res = max(res,min(x0+x1+x2,y0+y1+y2))
        return res
```

### More than `sum`

The idea of prefix sum can be applied to other kinds of operations more than `+`, as long as they are *left-associative*, *commutative*, and *invertible*. For some special problems, some properities are even not required. For example, 

[LC238: Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/), which can be solved by calculating product from left to index `i` exclusively and then reversely calculating from right to index i exclusively as well, multiplying the "prefix product" and "suffix product", finally getting the product that excludes `i`-th element:

```py
from itertools import accumulate
from operator import mul
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        prefix = list(accumulate(nums,mul,initial=1))
        suffix = list(accumulate(reversed(nums),mul,initial=1))
        return [prefix[i]*suffix[n-1-i] for i in range(n)]
```
In the solution above, I use the `accumulate` template to show that the operator can be simply replaced by any function of a type as `a,b -> a` to accumulate for a prefix "result" array.

### 2-D Matrix

Besides 1-D array/list, when you're asked to sum up all numbers in some rectangle areas in a 2-D matrix frequently, you can also consider prefix sum with some subtle modification.

For the 2-D array `mat`, you can also discretize the matrix as a set of some elements, in which [Inclusion-Exclusion Principle](https://mathworld.wolfram.com/Inclusion-ExclusionPrinciple.html) help you calculate the union set. In order to get the sum of the sub-matrix `mat[:i][:j]`, elements in the smaller included matrices `mat[:i-1][:j]` and `mat[:i][:j-1]` should be added up and then 
you need to eliminate those elements lying in both two matrices (i.e., `mat[:i-1][:j-1]`) or they will be added twice. Finally, add the sum of matrices with the new element `mat[i][j]` to get the sum of `mat[:i][:j]`, that is

```
sum(mat[:i][:j]) = sum(mat[:i-1][:j]) + sum(mat[:i][:j-1]) - sum(mat[i][j]) + mat[i][j]
```

In Python, the process of calculating 2-D prefix sum matrix can be described as:

```py
n,m = len(mat),len(mat[0])
pre = [[0]*(m+1) for _ in range(n+1)]
for i in range(n):
    for j in range(m):
        pre[i+1][j+1] = pre[i+1][j] + pre[i][j+1] + mat[i][j] - pre[i][j]
```

To get the sum of a sub-matrix `mat[a:b][c:d]`, similary:

```
sum(mat[a:b][c:d]) = sum(mat[:b][:d]) - sum(mat[:a][:d]) - sum(mat[:b][:c] + sum(mat[:a][:b]))
```

For example, [1292 Maximum Side Length of a Square with Sum Less than or Equal to Threshold](https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/) is a classic [binary search](binary-search.md) problem, but in its `check(k)` functions, `sum(mat[i:i+k][j:j+k])` is evaluated frequently, we can use the prefix sum array to avoid repeated calculation:

```py
class Solution:
    def maxSideLength(self, mat: List[List[int]], threshold: int) -> int:
        n,m = len(mat),len(mat[0])
        pre = [[0]*(m+1) for _ in range(n+1)]
        min_value = float('inf')
        
        for i in range(n):
            for j in range(m):
                pre[i+1][j+1] = pre[i+1][j] + pre[i][j+1] + mat[i][j] - pre[i][j]
                min_value = min(min_value,mat[i][j])
        
        if min_value>threshold:
            return 0
        
        def check(k):
            for i in range(k,n+1):
                for j in range(k,m+1):
                    s = pre[i][j] - pre[i-k][j] - pre[i][j-k] + pre[i-k][j-k]
                    if s<=threshold:
                        return True
            return False
        
        l,r = 1,min(n,m)+1
        while l<r:
            mid = (l+r)//2
            if check(mid):
                l = mid + 1
            else:
                r = mid
        return l-1                    
```

### Prefix Sum of Prefix Sum

[LC2281: Sum of Total Strength of Wizards](https://leetcode.com/problems/sum-of-total-strength-of-wizards/)

1. Use monotonic stack to find the nearest smaller number for each `A[i]`: `left[i]` is the rightmost position that hosts a number < `A[i]` on the left side while `right[i]` is the leftmost position that hosts a number <= `A[i]`. That is, the longest subarray, in which `A[i]` plays a role of the min value, is `[left[i]+1,right[i]-1]` (or `(left[i],right[i])`).
2. For each `A[i]`: how to find all subarray that takes `A[i]` as the min value? Assume a subarray is written as `[l,r]`, then it must satisfy the constraint: `left[i]<l<=i<r<=right[i]`, otherwise it will include some value < `A[i]` or exclude the min value `A[i]`.
3. How to sum up all numbers in all those subarrays `[l,r]`? It may be more clear to write it in a math formula:  

$$
\begin{aligned}
& \sum_{l=left[i]+1}^i{\sum_{r=i}^{right[i]-1}}{sum(\color{green}{A}[l:r+1])} & (1)  \\
= & \sum_{l=left[i]+1}^i{\sum_{r=i}^{right[i]-1}}{\color{blue}{presum}[r+1] - \color{blue}{presum}[l]} & \bf{(2)} \\
= & \sum_{l=left[i]+1}^i{\sum_{r=i}^{right[i]-1}}{\color{blue}{presum}[r+1]} -   \sum_{l=left[i]+1}^i{\sum_{r=i}^{right[i]-1}}{\color{blue}{presum}[l]} & (3) \\
= & (i-left[i]) {\sum_{r=i}^{right[i]-1}}{\color{blue}{presum}[r+1]} - (right[i]-i)\sum_{l=left[i]+1}^i{\color{blue}{presum}[l]} & (4)\\
= & (i-left[i])(\color{red}{prepresum}[right[i]+1]-\color{red}{prepresum}[i+1]) - (right[i]-i)(\color{red}{prepresum}[i+1]-\color{red}{prepresum}[left[i]+1]) & \bf{(5)}
\end{aligned}
$$

```{note}
The formula above is not formal at all. I just use it to demonstrate some points:

1. For the first step, which follows the definition of "*sum up all subarrays with `[l,r]` satisfying the requirement mentioned above*", three layers of sum symbol ($\sum{\sum{\sum}}$) should be used here to represent the formula. But I think the inner stuff can be represented more clearly by literally `sum` notation. I don't want to introduce more variable symbols here.
2. It's easy to come up with (2) as you have learned prefix sum and **the sum of subarray** [l:r+1] is a very obvious sign to use it, and now we call the prefix sum array `presum`.
3. In (3)-(4), we reorganize the terms and extract something invariant with the loop variable from the summed terms respectively, which can remove one layer of $\sum$ immediately.
4. The last step (5) is the most difficult one to handle. But if you view the `presum` as an array (of course, actually it is), you now come across a problem that requires **the sum of subarray** again. Just apply the prefix sum of `presum` array!

In summary:
- {badge}`A, badge-success`: the raw array
- {badge}`presum, badge-primary`: the first-order prefix sum: prefix sum array of {badge}`A, badge-success`
- {badge}`prepresum, badge-danger`: the second-order prefix sum: prefix sum array of {badge}`presum, badge-primary`.

By accumulating the origin array twice, along with extracting invariables, we eliminate three $\sum$s step by step. For the problem of "sum up all target subarraies for a given index `i`", we reduce the complexity from $O((right[i]-left[i])^3)$ to $O(1)$. Certainly, it first costs $O(n)$ time to build `prepresum` array.
```

As we have the sum of all `[l,r]` subarrays for each `A[i]`, just multiply the sum by their min value `A[i]`, then sum up the result for each `A[i]` we will get the final result. I post my code solution here, which is inspired by [@lee215](https://leetcode.com/lee215/)[^2]. Note that in the last step (5) of the formula above, all indexes of `prepresum` must >= 1, so it's not necessary to consider initializing `prepresum[0]=0`, we can build `prepresum` from `prepresum[0]=presum[0]`. 

[^2]: [[Java/C++/Python] One Pass Solution](https://leetcode.com/problems/sum-of-total-strength-of-wizards/discuss/2061985/JavaC%2B%2BPython-One-Pass-Solution)


```py
from itertools import accumulate
class Solution:
    def totalStrength(self, A: List[int]) -> int:
        n = len(A)
        M = 10**9+7
        
        left = [-1]*n
        right = [n]*n
        stack = []
        for i,v in enumerate(A):
            while stack and stack[-1][0] > A[i]:
                right[stack.pop()[1]] = i
            if stack:
                left[i] = stack[-1][1]
            stack.append((v,i))
        
        res = 0
        modplus = lambda x,y:(x+y)%M
        acc = list(accumulate(accumulate(A,func=modplus),func=modplus,initial = 0))
        for i in range(n):
            l,r = left[i],right[i]
            lacc = acc[i] - acc[max(l,0)]
            racc = acc[r] - acc[i]
            ln,rn = i-l,r-i
            res =  (res + A[i]*(racc*ln - lacc*rn))%M
        return res
```

### More

Some other LC prblems applicable for this template (left as exercises):

- Easy: [LC303](https://leetcode.com/problems/range-sum-query-immutable/), [LC304](https://leetcode.com/problems/range-sum-query-2d-immutable/), [LC2100](https://leetcode.com/problems/find-good-days-to-rob-the-bank/)
- Medium: [LC1783](https://leetcode.com/problems/find-kth-largest-xor-coordinate-value/)
- Hard: [LC1730](https://leetcode.com/problems/minimum-adjacent-swaps-for-k-consecutive-ones/), [LC2234](https://leetcode.com/problems/maximum-total-beauty-of-the-gardens/), [LC1906](https://leetcode.com/problems/minimum-absolute-difference-queries/), [LC1878](https://leetcode.com/problems/get-biggest-three-rhombus-sums-in-a-grid/)