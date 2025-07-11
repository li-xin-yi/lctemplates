# Some Tips for Python in LeetCode

{bdg-danger}`TODO`

Generally speaking, it's very comfortable to write solutions in Python for LeetCode problems. However, sometimes, you may hear someone complaining about this language like:

> {octicon}`comment` This problem is unfair to us Python users! With the **same algorithm idea**, others passed the problem by their solutions in C++ or Java, but I got a **TLE** for my Python solution. It's too slow!

or

> {octicon}`comment` It's hard to write a clean solution in Python (for some problems) because there is no _specific_ built-in data types/functions/libraries/syntax sugar and I have to **code a lot** to implement them in a hurry.

To work with Python in LeetCode smoothly, you also have to code in a proper way, which may be **very different** from what you usually do in a productive environment in real-word. Anyway, based on my short experiences in writing _accepted_ solutions for LeetCode problems, I have some notes and tricks to avoid redundant lines of code and suffering runtime.

## Square

Stick to `x*x` style when you are required to calculate the square of a number `x` frequently, which is the easiest way to write and run fast. Don't use `x**2` or `pow(x,2)` unless necessary. (Test results are available in [this notebook](https://github.com/li-xin-yi/lctemplates/blob/main/test/square-test.ipynb))

Why? Both `**` and `pow` apply a [_fast exponentiation_](https://en.wikipedia.org/wiki/Exponentiation_by_squaring) algorithm in $O(\log n)$. When the exponent `n` increases rapidly, they optimize a lot; but when `n=2`, they suffer from the huge _constant factors_ in complexity compared to naively multiplying two `x`s.

**Example**: [LC2249 Count Lattice Points Inside a Circle, Weekly Contest 290 Q2](https://leetcode.com/contest/weekly-contest-290/problems/count-lattice-points-inside-a-circle/) asks you to enumerate the points in a given space that hava a distance <= some `r` for some `(x,y)` (i.e., in/on a circle from a lists of circle). If you stick to `x*x` style to calculate the square, you can even pass the problem in a very straight-forward brute-force way ($O(200\times 200 \times n)$) as:

```py
class Solution:
    def countLatticePoints(self, circles: List[List[int]]) -> int:
        def check(x,y):
            for i,j,r in circles:
                dx,dy = x-i,y-j
                if dx*dx + dy*dy <= r*r:
                    return True
            return False

        res = 0
        for i in range(201):
            for j in range(201):
                if check(i,j):
                    res += 1
        return res
```

Though the problem is intended to be passed by traversing each circle and enumerating all points within `r` away from the center ($O(\max(r)\times n$)and de-duplicating them with a hashset like:

```py
class Solution:
    def countLatticePoints(self, circles: List[List[int]]) -> int:
        seen = set()

        for x,y,r in circles:
            for i in range(x-r,x+r+1):
                for j in range(y-r,y+r+1):
                    if (i,j) not in seen and (x-i)**2 + (y-j)**2 <= r**2:
                        seen.add((i,j))
        return len(seen)
```

Thus, if you write the square properly, you may even pass a problem with an inefficient algorithm.

```{dropdown} More
**Extension**: How about *square root*? I also measured three ways (`**0.5`,  `math.sqrt` and `pow(,0.5)`) on a large scale of data and found that `math.sqrt` has the shortest runtime but not so obviously. (Test results are available in [the same notebook](https://github.com/li-xin-yi/lctemplates/blob/main/test/square-test.ipynb)).
```

## Class Variables

Some problems (especially _1-D dynamic programming_ problems) only takes one integer argument `n` and returns an integer as result:

```py
class Solution
    def someFunction(n:int) -> int:
```

Sometimes, `someFunction(n)` is dependent on the values of `someFunction(n-1)` or even some `someFunction(i)` of a smaller `i`.

For example, [LC509 Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) requires a `fib(n)`, which should be calculated by `fib(n-1)+fib(n-2)` naively. You may come up with some **memorization** tricks such as [`functools.lru_cache`](https://docs.python.org/3/library/functools.html#functools.cache) decorator, yes, it certainly works and **maintains an independent cache for each instance individually**. Thus, with the decorator, to get a `fib(n)`, you only need to eval each `fib(i)` once. That means, in **each single** test case of `n`, you don't have to calculate the both `fib(n-1)` and `fib(n-2)` at the same time without any cache, which leads to the procedure like the tree below [^1] with time complexity of $O(2^n)$, it runs in linear time with `n` for each case `n` now.

[^1]: Picture from the post [Fibonacci Iterative vs. Recursive](https://syedtousifahmed.medium.com/fibonacci-iterative-vs-recursive-5182d7783055)

![](https://miro.medium.com/max/1000/1*AeRe16QGs8SJj7QP6zVrUw.png)

However, in LeetCode, the online judger spwans a new `Solution` instance for each test case, so the call of `solution1.fib(3)` in test case `n=3` can't
contribute to cache of a `fib(3)` value when you calculate `solution2.fib(4)` for another test case `n=4`, that is, we still repeatly calculate many `fib(n)` values among different cases, which can be refined to only once in fact.

Intuitively, we can make all instances of `Solution` share some common spaces to cache some results, which sounds like [_static members_](https://en.cppreference.com/w/cpp/language/static) in C++. In Python, we can achieve that by declaring some [**class variables**](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables) in `Solution` class, for example, the solution for LC509 can be written as:

```{code-block} python
:lineno-start: 1
:emphasize-lines: 2,5

class Solution:
    _res = [0,1]

    def fib(self, n: int) -> int:
        res = self._res
        while len(res)<=n:
            res.append(res[-1]+res[-2])
        return res[n]
```

The class variable `_res` is declared in line 2 right below the declaration of the class. I prefer underscore prefix to indicate it private but it doesn't matter. In line 5, I give the reference of the shared list to a variable with the shorter name `res` just for _quicker coding_. In this solution, no matter how many test cases are used to judge it, **all calculations for any number `n` will be performed only once**. Therefore, even though the time complexity of the algorithm is **not optimized**, we can still take advantage of class variables to let our solution run much faster for all test cases in total.

````{dropdown} More
My $O(\log n)$ solution in an **algorithmic** way and **without** any programming trick for this problem is also posted [here](https://leetcode.com/problems/fibonacci-number/discuss/2071503/python-ologn-algo-from-sicp-clean-code-reduction-process-given) for references.

The usage of class variables above looks like a dynamic version of *pre-calculation*. When it comes to *pre-calculation*, yep, almost all problems that benefits from class variables (e.g., [LC70 Climbing Stairs](https://leetcode.com/problems/climbing-stairs), [LC96 Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/), [LC52 N-Queens II](https://leetcode.com/problems/n-queens-ii/)) can also be solved by *pre-calculation* through a brute-force computation or just looking up in some sequence tools like [OEIS](https://oeis.org/). For example, LC96 asks for a very famous sequnce: [*Catalan numbers*](https://en.wikipedia.org/wiki/Catalan_number), so the solution below can be accepted very fast:

```py
class Solution:
    # copy the sequence from https://oeis.org/A000108
    _res = [1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012, 742900, 2674440, 9694845, 35357670, 129644790, 477638700, 1767263190, 6564120420, 24466267020, 91482563640, 343059613650, 1289904147324, 4861946401452, 18367353072152, 69533550916004, 263747951750360, 1002242216651368, 3814986502092304]
    def numTrees(self, n: int) -> int:
        return self._res[n]
```

{bdg-warning}`Warning` Usually, it's **not a good practice** to do pre-calculation in competitive programming or hard-code values for numerous variables in real-word developing works. [Python language docs](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables) also calls for **extreme caution** when using class variables because of their side effects. Please don't break the **clean** and **safe** code style unless you can't find any other way to finish the task.
````

Alternatively, you can define a variable outside `Solution` class as a global variable, which is also shared among all invocations of methods in `Solution` class. For example, in [LC 3233 Find the Count of Numbers Which Are Not Special](https://leetcode.com/problems/find-the-count-of-numbers-which-are-not-special/), we can maintain the list of primes `primes` and the number of primes <= its index as `nums` globally:

```py
import math

primes = []
nums = [0, 0]

def f(n):
    if len(nums) > n:
        return nums[n]
    while len(nums) <= n:
        for i in primes:
            if len(nums) % i == 0:
                nums.append(nums[-1])
                break
        else:
            primes.append(len(nums))
            nums.append(nums[-1] + 1)
    return nums[n]

class Solution:
    def nonSpecialCount(self, l: int, r: int) -> int:
        res = r - l + 1
        l, r = int(math.sqrt(l-1)), int(math.sqrt(r))
        return res - f(r) + f(l)
```

## Numpy & Scipy

Incredibly, LeetCode allows you to import modules like [`numpy`](https://numpy.org/) and [`scipy`](https://scipy.org/) in Python. For some problems with a large matrix or graph, some operations, even complicated algorithms, can be applied easily right after converting the inputs into `np.array`.

For example, [LC2172 Maximum AND Sum of Array](https://leetcode.com/problems/maximum-and-sum-of-array/) can be regarded as an extended [max bipartite matching problem](https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/matching.pdf), or a more explicit sub-problem, [max linear sum assignment](https://en.wikipedia.org/wiki/Assignment_problem) between `n` elements and `2*numSlots` slots. Cost between element `nums[i]` and slot `j` is intialized as `nums[i]&j`. Then, on this cost matrix, we can use the API [scipy.optimize.linear_sum_assignment](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.linear_sum_assignment.html#rc35ed51944ec-1), which implements a modified _Jonker-Volgenant algorithm_ [^2](see also in [_Hungarian algorithm_](https://en.wikipedia.org/wiki/Hungarian_algorithm)). So the solution can be written as:

[^2]: Crouse, David F. "[On implementing 2D rectangular assignment algorithms.](https://ieeexplore.ieee.org/iel7/7/7738330/07738348.pdf?casa_token=bcapCsfjAM0AAAAA:pNOva0x5frhw2LEAr8CcCTDBFIXj_t3LWAbEDAfeQ5NzQNVedyIG46OLR8QsQAclOhHQGAdILQ)" _IEEE Transactions on Aerospace and Electronic Systems_ 52, no. 4 (2016): 1679-1696.

```py
from scipy.optimize import linear_sum_assignment
import numpy as np
class Solution:
    def maximumANDSum(self, nums: List[int], numSlots: int) -> int:
        n = len(nums)
        costs = np.array([[num&(j//2+1) for j in range(2*numSlots)] for num in nums])
        rows,cols = linear_sum_assignment(costs,True)
        return costs[rows,cols].sum()
```

Which passes all test cases very fast due to the optimization in `numpy` and `scipy` in data structures & algorithms. Similary, see [this solution to LC2463](https://leetcode.cn/problems/minimum-total-distance-traveled/solution/er-fen-tu-zui-xiao-pi-pei-chun-diao-bao-o47p8/).

````{dropdown} More

Moreover, many classic graph-theory algorithms are also included in [`scipy.sparse.csgraph`](https://docs.scipy.org/doc/scipy/reference/sparse.csgraph.html). We can take advantage of the submodule to write solutions faster. For example, an application of its [`Dijkstra` API](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.csgraph.dijkstra.html#scipy.sparse.csgraph.dijkstra): [LC882 Reachable Nodes In Subdivided Graph](https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/)


```py
from scipy.sparse import dok_matrix
from scipy.sparse.csgraph import dijkstra
class Solution:
    def reachableNodes(self, edges: List[List[int]], maxMoves: int, n: int) -> int:
        graph = dok_matrix((n,n))
        for i,j,d in edges:
            graph[i,j] =  graph[j,i] = d+1
        dist = dijkstra(graph,directed=False,indices=0)
        moves = [max(0,maxMoves-i) for i in dist]
        res = len([i for i in dist if i<=maxMoves])
        for i,j,d in edges:
            res += min(moves[i]+moves[j],d)
        return int(res)
```

{bdg-info}`Note` If you're very familiar with those *data science*/ *scientific computing* packages in Python, you can enjoy the quick coding on some LeetCode problems. However, remember that you're at risk of TLE (for some historical implementation problems in those packages) or getting annoyed with type issues (integer *overflow*) if you insist on calling those APIs on a problem with a large scale of inputs. For example, for [LC2203 Minimum Weighted Subgraph With the Required Paths](https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/), the following solution comes across a TLE error probably due to its inefficient `csgraph` data structure:

```py
import numpy as np
from scipy.sparse import dok_matrix
from scipy.sparse.csgraph import shortest_path
class Solution:
    def minimumWeight(self, n: int, edges: List[List[int]], src1: int, src2: int, dest: int) -> int:
        mat = dok_matrix((n, n))
        for i,j,w in edges:
            mat[i,j] = min(mat.get((i,j),np.inf),w)
        dist_from_src1,dist_from_src2 = shortest_path(mat,directed=True,indices=[src1,src2])
        dist_to_dest = shortest_path(mat.transpose(),directed=True,indices=dest)
        res = min([dist_from_src1[i]+dist_from_src2[i]+dist_to_dest[i] for i in range(n)])
        return int(res) if res!=np.inf else -1
```

Also, as `shortest_path` takes advantage of Floyd-Warshall algorithm, sometimes we can specify it to Floyd-Warshall algorithm and it does help in some cases. For example, in [LC2977](https://leetcode.com/problems/minimum-cost-to-convert-string-ii/), this solution only uses 1600ms, much faster than the most of other solutions:


```py
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import floyd_warshall
class Solution:
    def minimumCost(self, source: str, target: str, original: List[str], changed: List[str], cost: List[int]) -> int:
        nodes = {s:i for i, s in enumerate(set(original + changed))}

        m = len(nodes)
        n = len(source)
        adj = [[float('inf')]*m for _ in range(m)]
        for x,y,w in zip(original, changed, cost):
            u, v = nodes[x], nodes[y]
            adj[u][v] = min(adj[u][v], w)

        changed = set(changed)
        original = set(original)
        original_len = set(len(s) for s in original)

        dist = floyd_warshall(csr_matrix(adj), directed=True)

        dp = [float('inf')]*(n+1)
        dp[0] = 0
        for i in range(1, n+1):
            if source[i-1] == target[i-1]:
                dp[i] = dp[i-1]
            for length in original_len:
                if i>=length and (s:= source[i-length:i]) in original and (t:= target[i-len(s):i]) in changed:
                    dp[i] = min(dp[i], dp[i-len(s)] + dist[nodes[s],nodes[t]])


        return -1 if dp[-1] == float('inf') else int(dp[-1])
```

````

Another example, [LC 587](https://leetcode.com/problems/erect-the-fence/) requires you to find the convex hull of a set of points. You can use [`scipy.spatial.ConvexHull`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.ConvexHull.html#scipy.spatial.ConvexHull) or [`scipy.spatial.Delaunay`](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.Delaunay.html#scipy.spatial.Delaunay) to solve it in a few lines:

`````{tab-set}
````{tab-item} ConvexHull
```py
from scipy.spatial import ConvexHull,Delaunay
import numpy as np

def points_in_hull(p, hull, tol=1e-12):
    return np.any(np.abs(hull.equations[:,:-1] @ p.T + np.repeat(hull.equations[:,-1][None,:], len(p), axis=0).T) <= tol, 0)

class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        if len(trees) <= 2:
            return trees
        points = np.array(trees)
        try:
            hull = ConvexHull(points)
            index = points_in_hull(points, hull)
            return points[index]
        except:
            return trees
```
````

````{tab-item} Delaunay

```py
from scipy.spatial import Delaunay
class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        try:
            hull = Delaunay(trees).convex_hull
            return list(set(tuple(trees[i]) for i in hull.ravel()))
        except:
            return trees
```
````
`````

I suggest all of you practice more on writing those **simple** and **classic** algorithms, such as Dijkstra's algorithm. Don't rely on 3-rd party package too much, especially if you're not familiar with them. Packages are awesome, but please use them only when necessary as you're preparing for tech interviews!

More examples for exercises:

- [LC 3187](https://leetcode.com/problems/peaks-in-array/) (Numpy)

## Topological Sorting

{bdg-danger}`TODO`

For example, a solution to [LC1203 Sort Items by Groups Respecting Dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/) can be written as:

```py
from collections import defaultdict
from graphlib import TopologicalSorter
class Solution:
    def sortItems(self, n: int, m: int, group: List[int], beforeItems: List[List[int]]) -> List[int]:
        groups_adj = {i:set() for i in range(-m,n) if i<0 or group[i]==-1}
        adj = defaultdict(set)
        nodes = [[] for _ in range(m)]
        indp = set()
        for i in range(n):
            u = i
            if group[i] >= 0:
                u = -group[i]-1
                nodes[u].append(i)
            for j in beforeItems[i]:
                v = -group[j]-1 if group[j] >=0 else j
                if u!=v:
                    groups_adj[u].add(v)
                else:
                    adj[i].add(j)

        res = []
        try:
            ts = TopologicalSorter(groups_adj)
            groups = ts.static_order()
            for i in groups:
                if i >= 0:
                    res.append(i)
                else:
                    ts = TopologicalSorter({j:adj[j] for j in nodes[i]})
                    res.extend(ts.static_order())
        except:
            return []
        return res
```

## Hash

In general, Python has a higher speed of reading (or slicing) and hashing **immutable** data than **mutable** one (_just a general rule, many exceptions_). Especially when we're talking about some problems that ask you to slice a sub-list from a list and hash it frequently, an efficient way to read and hash is significant to make your brute-force solution (_yes, usually you have already over-estimated the time complexity when considering hashing the whole sub-lists_) acceptable by LeetCode.

For example, [LC2261 K Divisible Elements Subarrays](https://leetcode.com/problems/k-divisible-elements-subarrays/) requires number of _unique_ subarrays. The expected solution for this problem uses [suffix array](<https://leetcode.com/problems/k-divisible-elements-subarrays/discuss/1996271/O(N)-C%2B%2B-solution-using-Suffix-array-template.>) in $O(n)$. However, we can also pass all test cases if we are able to enumerate all subarrays `nums[i:j]`, check if the subarray meets the requirement by [prefix sum](prefix-sum.md), and de-duplicate those subarrays by **a proper hash method**, though the overall time complexity is $O(n^3)$.

As we don't need to modify anything in the list `nums`, after computing prefix sum, we can first convert the whole array to something immutable, kind to slice, and then we can hash them into a set quickly. I post three data types I tested to solve the problem quickly here:

`````{tab-set}
````{tab-item} Tuple
```py
from itertools import accumulate
class Solution:
    def countDistinct(self, nums: List[int], k: int, p: int) -> int:
        n = len(nums)
        nums = tuple(nums)
        xs = [int(nums[i]%p==0) for i in range(n)]
        pre = list(accumulate(xs,initial=0))
        res = set()
        for i in range(n):
            for j in range(i+1,n+1):
                num = pre[j] - pre[i]
                if num <= k:
                    res.add(nums[i:j])
        return len(res)
```
````

````{tab-item} String
```py
from itertools import accumulate
class Solution:
    def countDistinct(self, nums: List[int], k: int, p: int) -> int:
        n = len(nums)
        xs = [int(nums[i]%p==0) for i in range(n)]
        pre = list(accumulate(xs,initial=0))
        s = ""
        pos = [0]
        for num in nums:
            s += " "+str(num)
            pos.append(len(s))
        res = set()
        for i in range(n):
            for j in range(i+1,n+1):
                num = pre[j] - pre[i]
                if num <= k:
                    res.add(s[pos[i]:pos[j]])
        return len(res)
```
````

````{tab-item} Bytes + Memoryview [^3]
```py
from itertools import accumulate
class Solution:
    def countDistinct(self, nums: List[int], k: int, p: int) -> int:
        n = len(nums)
        xs = [int(nums[i]%p==0) for i in range(n)]
        nums = memoryview(bytearray(nums))
        pre = list(accumulate(xs,initial=0))
        res = set()
        for i in range(n):
            for j in range(i+1,n+1):
                num = pre[j] - pre[i]
                if num <= k:
                    res.add(bytes(nums[i:j]))
        return len(res)
```
````
`````

All three methods are accepted by LeetCode during its weekly contest 291, and the method using `memoryview` has the shortest runtime, which even beats 97% of submitted Python solutions. Certainly, we take the advantage of the data scale, `nums[i]<=200` so we can use `nums` as bytes without changing the indexes, and `n<=200` lets this $O(n^3)$ brute-force method feasible. Recall that when you **have to** hash a complicated data structure, try your best to do some pre-processing that "simplifies" the objects to hash.

[^3]: More about `memoryview` and its effiency analysis, see this article: https://effectivepython.com/2019/10/22/memoryview-bytearray-zero-copy-interactions

## Prime Factorization

{bdg-danger}`TODO`

Usually, based on the idea of [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes), we can quickly write a simple function (**NOT exactly the implentation of the sieve!!**) to generate all prime numbers less than `N` by filtering out all non-prime numbers that can be devided by `i` once you find a prime `i`:

```py
primes = []
for i in range(2, N):
    for j in primes:
        if i % j == 0:
            break
        if j * j > i:
            primes.append(i)
            break
    else:
        primes.append(i)
```

It works based on the fact: if `i` is not a prime number, then there must be a smaller prime number `j` that divides `i`.

````{dropdown} Note
The code above is definitely not the implementation of Sieve of Eratosthenes, which should work in $O(n\log\log n)$ time. The code above inefficiently check if the current number is divisible by all prime numbers less than it. To implement a true, we must introduce a boolean array to mark if a number is already checked as a composite number. For example, the following code is a true implementation of Sieve of Eratosthenes:

```py
mask = [False]* 2 + [True] * (N-1)
primes = []
for i in range(2, N+1):
if mask[i]:
    primes.append(i)
    for j in range(i*i, N+1, i):
    mask[j] = False
return [i for i in range(2, N+1) if mask[i]]
```

To compare the efficiency of the two implementations, ref to [this notebook](https://github.com/li-xin-yi/lctemplates/blob/main/test/prime-check-test.ipynb), which also includes a more efficient code implementation in Numpy, which you can use in weekly contests to get a prime list faster.
````

Simimarly, to factorize a number `N`, we can use the following strategy:

```py
primes = set()
i = 2
while N > 1:
    if N % i == 0:
        primes.add(i)
        N //= i
    else:
        i += 1
```

It is also based on the fact: if a factor is non-prime, then there must be a smaller prime factor that divides it. This method works for most of problems involving prime factorization. However, it could be incredibly slow when we have to many inputs to factorize. Though [class variables](#class-variables) or other global pre-proceesing tricks may help, we can supress the prime checking and factorization process further. For example, [LC2709](https://leetcode.cn/problems/greatest-common-divisor-traversal/), you will may get TLE if treat prime factorization by regular methods first (about 5000ms for all test cases). So we just keep a list of primes `primes` and records **the smallest prime factor** for each number `i` in `factor[i]`.

```py
# the smallest prime factor of a number
N = 100000
factor = [0] * (N + 1)
primes = []
for i in range(2, N + 1):
    if factor[i] == 0:
        primes.append(i)
        factor[i] = i
    for p in primes:
        # for any prime p < i, if i is not divisible by p, then the smallest prime factor of i * p is p
        # until the smallest prime factor of i is p, then any multiple of i has the smallest prime factor p
        if i * p > N:
            break
        factor[i * p] = p
        if factor[i] == p:
            break
```

Then we can get all prime factors of a number `x` by:

```py
def get_factors(x):
    res = []
    while x > 1:
        res.append(factor[x])
        x //= factor[x]
    return res
```

For example, LC2709 can be solved by:

```py
N = 100000
factor = [0] * (N + 1)
primes = []
factor[1] = 1
for i in range(2, N + 1):
    if factor[i] == 0:
        primes.append(i)
        factor[i] = i
    for p in primes:
        if i * p > N:
            break
        factor[i * p] = p
        if factor[i] == p:
            break

class Solution:
    def canTraverseAllPairs(self, nums: List[int]) -> bool:
        n = len(nums)
        root = {}
        size = {}
        if n > 1 and min(nums) == 1:
            return False

        def find(x: int) -> int:
            if x not in root:
                root[x] = x
                size[x] = 1
            if root[x] != x:
                root[x] = find(root[x])
            return root[x]

        def union(x: int, y: int):
            x, y = find(x), find(y)
            if x != y:
                if size[x] > size[y]:
                    root[x] = y
                    size[y] += size[x]
                else:
                    root[y] = x
                    size[x] += size[y]


        for num in nums:
            f = factor[num]
            find(f)
            cur = num // f
            while cur != 1:
                union(factor[cur], f)
                cur //= factor[cur]

        return max(size.values()) == len(root)
```

Another example: [LC2818](https://leetcode.com/problems/apply-operations-to-maximize-score/) requires to find the number of unique prime factors of every `nums[i]`, in this official hint, just suggests the brute-force method in $O(n\sqrt{N})$ time, which must result in a TLE. We can utilize this trick to avoid the repeated factorization: [see my solution](https://leetcode.com/submissions/detail/1378423199/).

## Memoization

{bdg-danger}`TODO`

In some dynamic programming problems, we can use memoized DFS to do the top-down dynamic programming. In other languages, you may need to pass the reference of `unordered_map` (C++) or `HashMap` (Java) to the recursive DFS function and maintain the memoization table for each new arguments. However, in Python, you can simply use the decorator `lru_cache` or `cache` to make the function memoized.

More details can be found in [this docs](https://docs.python.org/3/library/functools.html#functools.cache).

Don't forget to clear the cache if necessary:

```py
[function_name].cache_clear()
```

## Balanced Tree

{bdg-danger}`TODO`

In some problems, you may need to maintain a sorted container to search for some specific elements quickly and insert/delete elements efficiently. In LC, we can import `sortedcontainers` module, which includes `SortedList` and `SortedDict` classes. For example, [LC3187 Peaks in Array](https://leetcode.com/problems/peaks-in-array/) can be solved by `SortedList`:

```py
from sortedcontainers import SortedList

class Solution:
    def countOfPeaks(self, nums: List[int], queries: List[List[int]]) -> List[int]:
        peaks = SortedList([i for i in range(1, len(nums) - 1) if nums[i] > nums[i - 1] and nums[i] > nums[i + 1]])
        res = []
        for query in queries:
            if query[0] == 1:
                _, l, r = query
                if l == r:
                    s = 0
                else:
                    i = bisect.bisect_right(peaks, l)
                    j = bisect.bisect_left(peaks, r)
                    s = j - i
                res.append(s)
            else:
                _, idx, val = query
                nums[idx] = val
                for i in range(max(0, idx-1), min(len(nums), idx+2)):
                    pos = peaks.bisect_right(i)
                    if pos > 0 and peaks[pos-1] == i:
                        peaks.remove(i)
                    if i!=0 and i!=len(nums)-1 and nums[i] > nums[i - 1] and nums[i] > nums[i + 1]:
                        peaks.add(i)
        return res
```

**Tips**: for the dynamic Top-K problems, you can use `SortedList` to maintain the top-K elements in a list, which is much faster (just in writting) than the heap-based method.

## Doubly-ended Queue

For a standard implementation of a doubly-ended queue (and queue) in Python, we usually use [`deque`](https://docs.python.org/3/library/collections.html#collections.deque) by

```py
from collections import deque
```

Though `append`, `appendleft`, `pop` and `popleft` offer a speed of approximately $O(1)$, sometimes we suffer from the constant factors in the complexity as it wrapped by Python's list.

If we're not interested in the **doubly**-ended feature so much, we can just use a list to simulate the queue. For example, in BFS approach, we can write the template as:

```py
seen = set([start])

# enqueue the starting node, assume we are calculting the distance from the starting node
q = [(start, 0)]

for node, d in q:
    for nei in adj[node]:
        if nei not in seen:
            seen.add(nei)
            q.append((nei, d+1))
```

````{dropdown} Example
A very typical application of the BFS algorithm is topological sorting. If `graphlibs.TopologicalSorter` is not available, we can solve [Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) by the BFS topo-sorting algorithm:

```py
from collections import defaultdict, Counter
class Solution:
    def findAllRecipes(self, recipes: List[str], ingredients: List[List[str]], supplies: List[str]) -> List[str]:
        adj = defaultdict(list)
        rev = Counter()
        for i, lst in zip(recipes, ingredients):
            for j in lst:
                adj[j].append(i)
            rev[i] = len(lst)
        res = set(supplies)
        for i in supplies:
            for j in adj[i]:
                if j not in res:
                    rev[j] -= 1
                    if rev[j] == 0:
                        res.add(j)
                        supplies.append(j)
        return [i for i in recipes if i in res]

```

Note that we use a list `supplies` to simulate the queue in the BFS algorithm.
````

## Modulo $10^9+7$

In many problems, the answer is required to be modulo $10^9+7$ because it may exceed the range of a 32-bit integer. Recall the properties of modulo operation:

- $(a+b) \mod M \equiv (a \mod M + b \mod M) \mod M$
- $(a-b) \mod M \equiv (a \mod M - b \mod M) \mod M$
- $(a \times b) \mod M \equiv (a \mod M \times b \mod M) \mod M$
- $(a^b) \mod M \equiv ((a \mod M)^b) \mod M$

Many operations can remain the same whenever we applying modulo operation. Thus, we usually apply modulo operation after each operation to avoid overflow. Like:

```py
M = 10**9+7

...
for i in range(n):
    res = (res + f(nums[i])) % M
...
```

However, division is not a commutative operation under modulo, that is

$$(a/b) \mod M \equiv (a \mod M / b \mod M) \mod M$$

is not necessarily true.

The correct way to calculate the division under modulo is to calculate the modular inverse of the divisor.

$$a/b \mod M \equiv a \times b^{-1} \mod M$$

where $b^{-1}$ is the modular inverse of $b$ under modulo $M$. In Python, we can use the `pow` function to calculate the modular inverse:

```py
inversed_b = pow(b, -1, M)
# res += a/b
res = (res + a * inversed_b) % M
```

It utilizes the [extended Euclidean algorithm](https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm) to calculate the modular inverse of $b$ under modulo $M$, which doesn't require the divisor $M$ to be a prime number, only requires that $b$ and $M$ are co-prime. Note that sometimes you may observe another expression `pow(b, M-2, M)` as the inverse of $b$ under modulo $M$, which is derived from the [Fermat's little theorem](https://en.wikipedia.org/wiki/Fermat%27s_little_theorem) and only works when $M$ is a prime number.

For instance, sometime.s we need to calculate a combination number ${n \choose k} = \frac{n!}{k!(n-k)!}$ ($C(n, k)$) under modulo $M$. We can pre-calculate the factorial and the modular inverse of the factorial to get the result:

```py
frac = [1]
for i in range(1, n+1):
    frac.append(frac[-1] * i % M)

inv = [pow(num, -1, M) for num in frac]

# C(n, k) = n! / (k! * (n-k)!)
res = frac[n] * inv[k] % M * inv[n-k] % M
```

which can be used in [LC 3352. Count K-Reducible Numbers Less Than N](https://leetcode.com/problems/count-k-reducible-numbers-less-than-n/).

**Example**: [LC3343. Count Number of Balanced Permutations](https://leetcode.com/problems/count-number-of-balanced-permutations/)

```py
M = 10**9 + 7

fraq = [1]

for i in range(80):
    fraq.append((fraq[-1] * (i+1)) % M)

fraq_inv = [pow(i, -1, M) for i in fraq]

# print(fraq_inv[:10])

from collections import Counter
class Solution:
    def countBalancedPermutations(self, num: str) -> int:
        nums = [int(i) for i in num]
        cnt = Counter(nums)
        s = sum(nums)
        if s % 2 != 0:
            return 0
        n = len(nums)
        k = n // 2
        target_sum = s // 2
        
        dp = [[0] * (target_sum + 1) for _ in range(k + 1)]
        dp[0][0] = 1  # Base case: one way to get sum 0 with 0 elements

        # Fill the DP table
        for num in nums:
            # Update dp table in reverse to avoid reusing elements in the same iteration
            for j in range(k, 0, -1):
                for s in range(target_sum, num - 1, -1):
                    dp[j][s] = (dp[j][s] + dp[j - 1][s - num]) % M
                    
        res = dp[-1][-1] * fraq[n - k] * fraq[k] % M
        for num in cnt:
            # divide by the factorial of the count of each number to avoid overcounting
            res = (res * fraq_inv[cnt[num]]) % M
        return res
```

More examples for exercises:

- [3428. Maximum and Minimum Sums of at Most Size K Subsequences](https://leetcode.com/problems/maximum-and-minimum-sums-of-at-most-size-k-subsequences/description/) (See [my solution](https://leetcode.com/problems/maximum-and-minimum-sums-of-at-most-size-k-subsequences/solutions/6301536/python-o-nlogn-works-on-any-large-k/))