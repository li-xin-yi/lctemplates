# Computational Geometry

{badge}`TODO,badge-danger badge-pill`

> This section collects some computational geometry problems on LeetCode （roughly, you can search the tag {bdg-link-primary-line}`geometry <https://leetcode.com/tag/geometry/>` on LC). I also enroll in a course on computational geometry in this semester, so this section is also built to help me review the course content. Problems are added gradually, and there might not be a detailed explanation for each problem.

> More algorithms can be found in [this textbook](https://www.cs.cmu.edu/afs/cs/academic/class/15456-s14/Handouts/BKOS.pdf).

## Convex Hull

The [convex hull](https://en.wikipedia.org/wiki/Convex_hull) problem refers to a classic problem that

> Given a set of points in the plane, find the smallest convex polygon that contains all the points in the set.

Usually, it requires to find out the set of **vertices** of the convex hull.

### Andrew's Monotone Chain

Sort the points by their $x$-coordinates as the first key and $y$-coordinates as the second key. Then, we can divide the points into two parts: the **upper** hull and the **lower** hull:

- Obviously, the first point (with the smallest $x$-coordinate) and the last point (with the largest $x$-coordinate) must be on the convex hull.

Let's start from the first point to construct the upper hull, using a **monotone stack** $S$ to store the convex hull so far. Then enumerate the points in the sorted order:

- If there are less than two points in $S$, push the current point into $S$. Don't worry, we are supposed to have at least two points on the upper hull (the first and the last points).
- If there are at least two points in $S$, the top two points, denoted as $p_1$ and $p2$ (from bottom to top), and the current point is $p_3$
  - To make $p_1 \rightarrow p_2 \rightarrow p_3$ a **counter-clockwise** turn, we need to check the **cross product** $\vec{p_1p_2} \times \vec{p_2p_3}$.
    - If it is positive, then $p_1 \rightarrow p_2 \rightarrow p_3$ is a counter-clockwise turn, so we can push $p_3$ into $S$.
    - If it is negative, then $p_1 \rightarrow p_2 \rightarrow p_3$ is a clockwise turn, so we need to pop $p_2$ from $S$ and check the next point with $p_1$ and the new top point in $S$, until $p_1 \rightarrow p_2 \rightarrow p_3$ is a counter-clockwise turn, or there are less than two points in $S$. Then, push $p_3$ into $S$.
    - If it is zero, then $p_1 \rightarrow p_2 \rightarrow p_3$ is collinear, keep it if required (e.g., the problem requires to find all points on the convex hull).

Similarly, to construct the lower hull, we can start from the last point to the first point, or just check if every turn is clockwise instead of counter-clockwise.

Example code ([LC587](https://leetcode.com/problems/erect-the-fence/)):

```python
def cross_product(x1, y1, x2, y2, x3, y3):
    return (x1 - x3) * (y2 - y3) - (y1 - y3) * (x2 - x3)

class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        trees.sort()
        n = len(trees)
        stack = []
        # upper hull
        for i in range(n):
            while len(stack) >= 2 and cross_product(*stack[-2], *stack[-1], *trees[i]) > 0:
                stack.pop()
            stack.append(trees[i])
        upper = stack
        stack = []
        # lower hull
        for i in range(n - 1, -1, -1):
            while len(stack) >= 2 and cross_product(*stack[-2], *stack[-1], *trees[i]) > 0:
                stack.pop()
            stack.append(trees[i])
        lower = stack
        return list(set((i,j) for i,j in lower + upper))
```
