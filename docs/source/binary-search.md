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

---

## Usage Examples

### Max Problem

[LC1557: Magnetic Force Between Two Balls](https://leetcode.com/problems/magnetic-force-between-two-balls/): In this problem, `m` balls are required to be placed in `n` selected integer positions (denote them as a sorted vector $P$ in ascending order) on a number axis. The goal is to **maximize** the min distance between two **adjacent** balls.

![](https://assets.leetcode.com/uploads/2020/08/11/q3v1.jpg)

- `check(k)`: Given a probable distance `k`, we can check if `k` is feasible by placing balls in order from the leftmost allowed positions while keeping each ball *at least* `k` units away from the previous one. If `m` balls can be used up before or at the rightmost allowed positions, `m` balls can have a min distance >= `k`; Otherwise, `k` is too large.
- Lower bound: Obviously, two balls can't be put together in one single position. The min distance should >= 1.
- Upper bound: Suppose all `m` balls "distribute" evenly from the leftmost to the rightmost positions, the distance between two **adjacent** balls is $\lfloor (P_{n-1} - P_0)/(m-1) \rfloor$. However, probably, not all positions in that "distribution" are allowed $P_i$ points, so the actual upper bound must <= this value. We add 1 to it just to make sure we have a determined **infeasible** upper bound as $\lfloor (P_{n-1} - P_0)/(m-1) \rfloor + 1$.

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


## Read More

See [^1]
    
      


[^1]: Extended reading: [Powerful Ultimate Binary Search Template. Solved many problems](https://leetcode.com/discuss/general-discussion/786126/python-powerful-ultimate-binary-search-template-solved-many-problems)

