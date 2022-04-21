# Binary Search

## When should I use binary search?

You have already known that:

- The problem is **discrete** and **monotonic**. 
  - All candidate result values for the problem must be **integers**.
  - Suppose that we are solving a problem satisfies a property as: the littler a variable `k` becomes, the safer the condition can be reached. If a `k` can meet the requirement, `k-1` must can; If a `k` can't meet the  requirement, `k+1` must fail for the same condition checking. For this kind of problem, we usually **maximize** the `k` that **can meet** some requirements (we refer it as *max problem* in the following), or **minimize** the `k` that **can't meet** some requirements (we refer it as *min problem* in the following).
  - Of course, you can **negate** the condition checking results to convert those problems in which larger `k` satisfies conditions better into the problem prototype here. Therefore, we only discuss about the problem that `k` can meet but `k+1` fails as examples here.
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

In the while loop, we shrink the range by keeping `right` as an infeasible value while `left` may be still feasible. So when `left==right`, it gives **the first (min) value that can't pass `check()`**.
-  Replace `return left` with `return left-1` when you are looking for the largest value that can pass `check()` (i.e. max problem)
- Time Complexity: $O(cost(check)\cdot\log(right-left))$

## Usage Examples

TODO

## Read More

See [^1]
    
      


[^1]: Extended reading: [Powerful Ultimate Binary Search Template. Solved many problems](https://leetcode.com/discuss/general-discussion/786126/python-powerful-ultimate-binary-search-template-solved-many-problems)

