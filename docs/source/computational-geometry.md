# Computational Geometry

{bdg-danger}`TODO`

> This section collects some computational geometry problems on LeetCode （roughly, you can search the tag {bdg-link-primary-line}`geometry <https://leetcode.com/tag/geometry/>` on LC). I also enroll in a course on computational geometry in this semester, so this section is also built to help me review the course content. Problems are added gradually, and there might not be a detailed explanation for each problem.

> More algorithms can be found in [this textbook](https://www.cs.cmu.edu/afs/cs/academic/class/15456-s14/Handouts/BKOS.pdf).

## Common Senses

### Lines

> Given two different points $(x_1, y_1)$ and $(x_2, y_2)$, how to determine the line they are on?

If we want get the line equation in the form of $ax + by + c = 0$, we can use the following formula as a solution:

$$ a = y_2 - y_1, b = x_1 - x_2, c = x_2y_1 - x_1y_2 $$

### Parallel

To check if a segment constructed by two points $(x_1, y_1)$ and $(x_2, y_2)$ is parallel to another segment constructed by two points $(x_3, y_3)$ and $(x_4, y_4)$, we can check if the following condition holds:

$$ (y_2 - y_1)(x_4 - x_3) = (y_4 - y_3)(x_2 - x_1) $$

More straightforwardly, we can check if the slopes of the two segments are equal (if they are not vertical):

$$ \frac{y_2 - y_1}{x_2 - x_1} = \frac{y_4 - y_3}{x_4 - x_3} $$

In some problems, we may need to enumerate all slopes of any two points in a set, if we use the above formula, we may encounter the following issues:

1. Division by zero, if the two points are vertical, we cannot use the slope formula.
2. Floating-point precision issues, if we use the slope formula, we may encounter precision issues when comparing two floating-point numbers.

But we still have to use the slope as a hashable key for enumeration or other purposes. So we can use the following trick to normalize the slope:

```python
def normalize(dx, dy):
    if dx == 0:
        return (0, 1)  # vertical line
    if dy == 0:
        return (1, 0)  # horizontal line
    g = math.gcd(abs(dx), abs(dy))
    dx, dy = dx // g, dy // g
    if dx < 0:  # make sure dx is non-negative
        dx, dy = -dx, -dy
    return (dx, dy)  # normalized slope
```

We keep the slope as a tuple of two integers `(dx, dy)`, which is hashable and can be used as a key in a dictionary or a set. The normalization ensures that we can compare slopes without worrying about floating-point precision issues.

```{dropdown}(Collinear Segments)
In the following section, we can get the formula to check if three points $(x_1, y_1)$, $(x_2, y_2)$, and $(x_3, y_3)$ are collinear:
$$ (y_2 - y_1)(x_3 - x_2) = (y_3 - y_2)(x_2 - x_1) $$

Sometimes, we may need to enumerate all possible collinear segments in a set of points, in which we can use hash table to store not only the slope but also an intercept (or a point on the line) to distinguish different lines. For example, if we know a point $(x_0, y_0)$ on the line with normalized slope $(dx, dy)$, any $(x, y)$ on the line must satisfy the following condition:
$$ \begin{align*}
\frac{y - y_0}{x - x_0} &= \frac{dy}{dx} \\
(y - y_0) \cdot dx &= (x - x_0) \cdot dy \\
y \cdot dx - x \cdot dy &= y_0 \cdot dx - x_0 \cdot dy
\end{align*} $$

Thus, after we hash the slope, the value `y_0 * dx - x_0 * dy` can be used as the intercept to determine the line uniquely. In the exercise, you can see how we use it to eliminate all collinear segments in a set of points.
```
Exercise: [LC 3625](https://leetcode.com/problems/count-number-of-trapezoids-ii/description/)


### Cross Product

The cross product of two vectors $\vec{u} = (x_1, y_1)$ and $\vec{v} = (x_2, y_2)$ is defined as

$$ \vec{u} \times \vec{v} = x_1y_2 - x_2y_1 $$

- If $\vec{u} \times \vec{v} > 0$, then $\vec{u}$ is **counter-clockwise** with respect to $\vec{v}$
- If $\vec{u} \times \vec{v} < 0$, then $\vec{u}$ is **clockwise** with respect to $\vec{v}$
- If $\vec{u} \times \vec{v} = 0$, then $\vec{u}$ and $\vec{v}$ are **collinear**

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
  - To make $p_1 \rightarrow p_2 \rightarrow p_3$ a **clockwise** turn, we need to check the **cross product** $\vec{p_1p_2} \times \vec{p_1p_3}$.
    - If it is negative, then $p_1 \rightarrow p_2 \rightarrow p_3$ is a clockwise turn (right-turn), so we can push $p_3$ into $S$.
    - If it is positive, then $p_1 \rightarrow p_2 \rightarrow p_3$ is a counter-clockwise (left-turn) turn, so we need to pop $p_2$ from $S$ and check the next point with $p_1$ and the new top point in $S$, until $p_1 \rightarrow p_2 \rightarrow p_3$ is a clockwise turn, or there are less than two points in $S$. Then, push $p_3$ into $S$.
    - If it is zero, then $p_1 \rightarrow p_2 \rightarrow p_3$ is collinear, keep it if required (e.g., the problem requires to find all points on the convex hull).

Similarly, to construct the lower hull, we can start from the last point to the first point, or just check if every turn is clockwise instead of counter-clockwise.

Example code ([LC587](https://leetcode.com/problems/erect-the-fence/)):

```python
# check if it is a left turn (>0 ->counter-clockwise)
def ccw(x1, y1, x2, y2, x3, y3):
    return (x1 - x3) * (y2 - y3) - (y1 - y3) * (x2 - x3)

class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        n = len(trees)
        trees.sort()
        stack = []
        for i in range(n):
            while len(stack) >= 2 and ccw(*stack[-2], *stack[-1], *trees[i]) > 0:
                stack.pop()
            stack.append(trees[i])
        upper = stack
        stack = []
        for i in range(n - 1, -1, -1):
            while len(stack) >= 2 and ccw(*stack[-2], *stack[-1], *trees[i]) > 0:
                stack.pop()
            stack.append(trees[i])
        lower = stack
        return list(set((i,j) for i,j in lower + upper))
```

- Time complexity: $O(n \log n)$, where $n$ is the number of points. The bottleneck is the sorting step.
- Space complexity: $O(n)$, where $n$ is the number of points. The monotone stack requires $O(n)$ space.

To practice more, you can also try [Compute a convex hull
](https://www.codewars.com/kata/5657d8bdafec0a27c800000f) on Codewars, which asks for the **minimum** number of vertices to construct the convex hull.

:::{dropdown} Graham Scan

Andrew's monotone chain is a special case of [Graham scan](https://en.wikipedia.org/wiki/Graham_scan), which is a more general algorithm to find the convex hull of a set of points in the plane. It first finds the point $P_0$ with the smallest $y$-coordinate (and the smallest $x$-coordinate if there are multiple points with the smallest $y$-coordinate), and then sort the points by the angle they and the first point make with the $x$-axis, that is, the angle $vec{P_0P_i}$ makes with the $x$-axis direction. Then, apply the similar method, use a monotone stack to store the convex hull so far, and check if the top two points and the current point make a counter-clockwise turn.

For example, LC587 can be solved by Graham scan as well:

```python
# check if it is a left turn (>0 ->counter-clockwise)
import bisect
def ccw(p1, p2, p3):
    return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0])

def angle(x1, y1, x2, y2):
    # check the polar angle of (x2, y2) with respect to (x1, y1)
    # range: [0, 2pi)
    if (res:=math.atan2(y2 - y1, x2 - x1)) < 0:
        return 2 * math.pi + res
    return res

class Solution:
    def outerTrees(self, trees: List[List[int]]) -> List[List[int]]:
        p0 = min(trees, key=lambda p: (p[1], p[0]))
        trees = sorted([(angle(*p, *p0), abs(p[0] - p0[0]), *p) for p in trees])

        # for the points with the greatest polar angle, we should traverse them from the farthest to the nearest, to make a fine ending
        idx = bisect.bisect_left(trees, (trees[-1][0], 0, 0, 0, 0))
        trees[idx:] = trees[idx:][::-1]
        stack = [p0]
        for _, _, x, y in trees:
            while len(stack) > 1 and ccw(stack[-2], stack[-1], (x, y)) < 0:
                stack.pop()
            stack.append((x, y))
        return list(set((x, y) for x, y in stack))
```

Personally, I rarely use this version. Because

- To calculate the polar angle, we need to use some function (like `math.atan2`), which gives a floating-point number and may have some precision issues (see [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754)). In the sorting step, this imprecise key may influence the points on the edges.
- For example (LC587), we required to give all points on the egdes. We have to be careful on how to sort the points with the same polar angle. Intuitively, we should sort them by their distance to the first point, the points should traverse from the closest to the farthest. However, for the last edge, we first enumerate the farthest point then to the closer ones.
  :::

```{dropdown} Divide and Conquer

This is also an exercise (1.18) in the textbook. See more in [this post](https://algorithmtutor.com/Computational-Geometry/An-efficient-way-of-merging-two-convex-hull/)
```
