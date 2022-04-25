# Binary Search

## When should I use binary search?

You have already known that:

- The problem is **discrete** and **monotonic**. 
  - All candidate result values for the problem must be **integers**.
  - Suppose that we are solving a problem satisfying a property: the littler a variable `k` becomes, the more safely the condition can be reached. If a `k` can meet the requirement, `k-1` must can; If a `k` can't meet the requirements, `k+1` must fail for the same condition checking. For this kind of problem, we usually **maximize** the `k` that **can meet** some requirements (we refer to it as *max problems* in the following) or **minimize** the `k` that **can't meet** some requirements (we refer it as *min problems* in the following).
  - Of course, you can **negate** the condition checking results to convert those problems in which larger `k` satisfies conditions better into the problem prototype here. Therefore, we only discuss the problems where a `k` can meet while `k+1` fails here.
- Given a variable `k`, you can easily write a function `check` to check if `k` can meet the requirements.
- A **feasible** lower bound `left` and an **infeasible** upper bound `right` (written as `[left, right)`)
    - Here, **feasible** `left` means: value `left` can be returned as a final result for min problem, so `check(left)` must return `True`.
    - Similarly, **infeasible** `right` means: value `right` can't be the result for min problem, that is, either `check(right)=False` or `right` is not in the legal data range for the problem.
    
    
## Template

The template for min problem is:

```python
def check(k) -> bool:
    # if conditions met, return True; Otherwise, return False

left, right = # [left,right)

while left < right:
    mid = (left + right)//2
    if check(mid):
        left = mid + 1
    else:
        right = mid
return left
```

In the while loop, we shrink the range by keeping `right` as an infeasible value while `left` may still be feasible. So when `left==right`, it gives **the first (min) value that can't pass `check()`**.
-  Replace `return left` with `return left-1` when you are looking for the largest value that can pass `check()` (i.e., max problem)
- Time Complexity: $O(cost(check)\cdot\log(right-left))$

````{note}
You may also see some code use `mid = left + (right-left)//2` or `mid = right - (right-left)//2` instead of `mid = (left+right)//2` in some other templates or codes. The concern of *integer overflow* problem drives people to update `mid` carefully. However, the issue rarely occurs for Python3 solutions in LeetCode, at least I never fail for it. Perhaps it is because I always keep very cautious about finding the initial `[left, right)` as tightly as I can. But it's not neccessary for competitive programming. To submit code as soon as possible, you may have to start binary search from a very wide but **legal** range instead of wasting time analyzing the lower/upper bound. So please take care and use `mid = left + (right-left)//2` if you don't want to consider too much about the initial range.
````

---

## Usage Examples

### Max Problem

[LC1557: Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/): In this problem, `m` balls are required to be placed in `n` selected integer positions (denote them as a sorted vector $P$ in ascending order) on a number axis. The goal is to **maximize** the min distance between two **adjacent** balls.

![](https://assets.leetcode.com/uploads/2020/08/11/q3v1.jpg)

- `check(k)`: Given a probable distance `k`, we can check if `k` is feasible by placing balls in order from the leftmost allowed positions while keeping each ball *at least* `k` units away from the previous one. If `m` balls can be used up before or at the rightmost allowed positions, `m` balls can have a min distance >= `k`; Otherwise, `k` is too large.
- **Lower bound**: Obviously, two balls can't be put together in one single position. The min distance should >= 1.
- **Upper bound**: Suppose all `m` balls "distribute" evenly from the leftmost to the rightmost positions, the distance between two **adjacent** balls is $\lfloor (P_{n-1} - P_0)/(m-1) \rfloor$. However, probably, not all positions in that "distribution" are allowed $P_i$ points, so the actual upper bound must <= this value. We add 1 to it just to make sure we have a determined **infeasible** upper bound as $\lfloor (P_{n-1} - P_0)/(m-1) \rfloor + 1$.

Now, let's apply the template:

```py
class Solution:
    def maxDistance(self, position: List[int], m: int) -> int:
        position.sort()
        n = len(position)
        
        def check(k):
            last = 0
            balls = m-1
            for i in range(1,n):
                if position[i] - position[last]>=k:
                    balls -= 1
                    if balls == 0:
                        return True
                    last = i
            return False
        
        left, right = 1,(position[-1]-position[0])//(m-1)+1
        while left < right:
            mid = (left+right)//2
            if check(mid):
                left = mid + 1
            else:
                right = mid
        return left - 1
```



### Min Problem

[LC1870 Minimum Speed to Arrive on Time](https://leetcode.com/problems/minimum-speed-to-arrive-on-time/): In this problem, the condition function is very clear:
- `check(k)`: check if $\sum_{i=0}^{n-2}{\lceil dist_i/k \rceil} + dist_{n-1}/k \le hour$ holds for a given `k`.

The most challenging component of this problem is to determine the *corner case* in which no feasible speed works. First, except for the last one, all `dist[i]` must take at least one hour to finish, so it is impossible to commute in time <= `n-1` hour. Then, look at the last one, if we increase the speed to some value approaching $+\infty$, the remaining time cost will also be $\to 0$. So we just need to check if `hour<=n-1`, and by the way, we also get a upper bound:
- If the bottleneck is due to some largest `dist[i]` within `i<n-1`, as the min time to finish it is 1 hour,  the speed, `dist[i]` hour is sufficient for the situation.
- If the bottleneck is caused by the last trip, `dist[-1]`, the time limit may be tighter because the time limit for the last trip could be a float < 1 as `hour-(n-1)`.
Hence, the upper bound can be written as $\lceil \max(dist)/\min(1,hour-n+1) \rceil$, which is definitely safe speed for the problem. 

````{note}
Also, compared to the template, the condition function `check(speed)` is nagetated but returned bool values are consistent with the problem description, thus, the two branches used to update the range are swapped here. If you're still not fimilar with the usage, you can simply use `if not check(speed)` and keep everything else unchanged from the template.
````

```py
import math
class Solution:
    def minSpeedOnTime(self, dist: List[int], hour: float) -> int:
        def check(speed):
            return sum([(i+speed-1)//speed for i in dist[:-1]]) + dist[-1]/speed <= hour

        n = len(dist)

        if hour <= n-1:
            return -1
        
        l,r = 1, int(math.ceil(max(dist)/min(1,hour-n+1)))
        while l<r:
            m = (l+r)//2
            if check(m):
                r = m
            else:
                l = m + 1
        return r
```

## Read More

See [^1]
    
      


[^1]: Extended reading: [Powerful Ultimate Binary Search Template. Solved many problems](https://leetcode.com/discuss/general-discussion/786126/python-powerful-ultimate-binary-search-template-solved-many-problems)

