# Diff Array

{bdg-success}`Done`

Opposite to the idea of [prefix sum](prefix-sum.md), which is aimed to evaluate the **changes** on the overall sum through one interval(subarray), a difference array is used to reconstruct the **accumulated sum** at each moment (index) from the **changes** contributed by each **discrete** interval.

```{seealso}
The data structure is often combined with [*sweep line algorithm*](https://en.m.wikipedia.org/wiki/Sweep_line_algorithm): first, we use diff array to record changes on endpoints. Then, the sweep lines help us convert those changes into the origin array by scanning all the indexes in order and accumulating the corresponding difference to the current value so far.
```



## A Typical Scenario

- Given a list of intervals in the format of `[start,end]`. 
- For each interval, a value `num` appears only within it. 
- Ask for the total value `cur` so far at some moments (indexes) frequently.

We can first record changes contributed by each interval to a *diff array* (`diff`) and eventually recover the raw array (`cnt`), which represents the current numbers at every index.

### Example

For example, suppose that our project team has a list of tasks that must be proceeded in the duration`[start,end]` (inclusively):

```
[[1,4],[2,5],[3,4],[4,7],[6,10]]
```

And their required numbers of people are `2,1,3,6,3`, so can you tell me how many people are working at time 7?

Intuitively, as the picture below shows, we record how many people start to work (+) and leave from work (-) at each moment, which is stored in `diff` array: 

![](../images/diff-array.png)

then we go back from time `0`, sum up all those changes to get the current value of that time, and finally get the `cnt` array, `cnt[i]` represents the exact number of working people at time `t`. When asked for time 7, we just need to look up the `cnt` array and return `cnt[7]` as 9.  




### Template

The prototype from this idea is written like:

```py
from collections import Counter

# record changes
diff = Counter()
for start,end,num in intervals:
    diff[start] += num
    diff[end+1] -= num

# recover the array from changes
cnt = Counter()
cur = 0
for i in sorted(diff):
    cur += diff[i]
    cnt[i] = cur
```

Though we use the word "array" to describe *diff array* and *raw array*, in many problems, the array is **sparse**: the indexes span a large range, but changes only occur at a few of them. Instead of *linear lists* (array/linked list), It costs littler space to use `dict` to simulate some indexes with changes in order. When querying the value at an index `k` in the raw array, we need to first find the largest index `idx<=k` as:

```py
from bisect import bisect_right
keys = sorted(diff)
idx = bisect_right(cnt,k)
k_value = diff[keys[idx-1]] if idx>0 else 0
```

If the queried index `k` is smaller than any recorded index, that means nothing is observed at that time, for which we return initial value 0.


````{note}
Unlike [`map`](https://www.cplusplus.com/reference/map/map)/[`multimap`](https://www.cplusplus.com/reference/map/multimap/) in C++ or [`treemap`](https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html) in Java, `collections.Counter` and its superclass `dict` **don't guarantee keys ordered**: for Python<=3.6, `dict` has totally unordered keys without any assumption[^1]; after Python 3.7, it just maintains an *insertion order*[^2] instead of the comparison of values. Therefore, for both Python and Python3, to simulate the ascending order of array indexes, we must sort the keys in `diff` first by `sorted(diff)` or `sorted(diff.keys())`.  
````

[^1]: Changelog of Python 3.6 mentions that *the order-preserving aspect of this new implementation is considered an implementation detail and should not be relied upon*, see https://docs.python.org/3.6/whatsnew/3.6.html#whatsnew36-compactdict

[^2]: see https://docs.python.org/3.7/tutorial/datastructures.html#dictionaries

For this *sparse* implementation of diff array problems, suppose that there are `n` intervals in total:

- Get the diff array[^3]:
  - **Time complexity**: $O(n)$
  - **Space complexity**: $O(n)$
- Reconstruct the raw array:
  - **Time complexity**: $O(n\log(n))$, because we need to sort those indexes with changes in `diff`
  - **Space complexity**: $O(n)$
- Get the raw value at an index `k` (obtained `keys` list from the previous step):
  - **Time complexity**: $O(\log(n))$, we can use binary search to locate the index in the simulated array
  - **Space complexity**: $O(1)$


[^3]: We take the [average complexity](https://wiki.python.org/moin/TimeComplexity) ($O(1)$) of insertion and accessing the item by an index for `dict` in this case. For the worst case, the complexity of a hash set could be $O(n)$ for both operations, but usually, we rarely come across and talk about those worst cases. Just a reminder: when analyzing the upper bound of complexity for some explicit problems involved with *hashmap*, don't take $O(1)$ for granted.

## Usage Examples

### Dense Array

[LC1109: Corporate Flight Bookings](https://leetcode.com/problems/corporate-flight-bookings/) specifies `1 <= n <= 2 * 10^4` and asks for an array of reserved seats for all `n` flights. In this problem, we don't need to consider the memory issue as `n` is not too large and an array of length `n` should be returned, just stick to array:

```py
from itertools import accumulate
class Solution:
    def corpFlightBookings(self, bookings: List[List[int]], n: int) -> List[int]:
        diff = [0]*(n+1)
        for s,e,seats in bookings:
            diff[s-1] += seats
            diff[e] -= seats
        return list(accumulate(diff))[:-1]
```

For the diff array, [prefix sum](prefix-sum.md) array calculted from it is the actual counter array (raw array). Note that we use `s-1` and `e` because the number of flights starts from 1 not 0, so we still keep adding (+) number of seats at every `start` flights and drop (-) them right after `end` flight (i.e., \#`end+1`).

### Sparse Dict

[LC2251: Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom/) has a huge range of time (0-1e9) but fewer intervals (`n`<1e5), so flowers only bloom or wither at a few moments, we don't need to allocate memory for an array of size 1e9. 

![](https://assets.leetcode.com/uploads/2022/03/02/ex1new.jpg)

Use the [template](#template) above:

```py
from collections import Counter
from bisect import bisect_right
class Solution:
    def fullBloomFlowers(self, flowers: List[List[int]], persons: List[int]) -> List[int]:
        diff = Counter()
        for s,e in flowers:
            diff[s]+=1
            diff[e+1]-=1
        
        keys = sorted(list(diff))
        cnt = Counter()
        cur = 0
        for k in keys:
            cur += diff[k]
            cnt[k] = cur
        
        res = []
        for t in persons:
            idx = bisect_right(keys,t)
            if idx == 0:
                res.append(0)
            else:
                res.append(cnt[keys[idx-1]])
        return res
```

This is a very classic problem of sparse diff array and also a special case that trivializes the difference occurs at each index to only 1.

### Slide Window

[LC1871: Jump Game VII](https://leetcode.com/problems/jump-game-vii/) looks like a *dynamic programming* problem that requires to check if there is any reachable position in `s[i-maxJump:i-minJump+1]` to determine whether `s[i]` is reachable. But the approach costs $O(n(maxJump-minJump))$ time, which leads to a TLE. To reduce the complexity caused by check all previous `[minJump, maxJump]` positions, the idea to add only *difference* contributed by each endpoints of intervals can also be applied here:

```py
class Solution:
    def canReach(self, s: str, minJump: int, maxJump: int) -> bool:
        if s[-1]!='0':
            return False
        n = len(s)
        reachable = [False]*n
        reachable[0] = True
        cur = 0 # current s[i] can be reached from how many positions
        for i in range(minJump,n):
            if i - maxJump > 0:
                cur -= reachable[i-maxJump-1]
            cur += reachable[i-minJump]
            if cur > 0 and s[i]=='0':
                reachable[i] = True
        return reachable[-1]
```

For each `s[i]`, `s[i-maxJump-1]` should be dropped from its previous steps while `s[[i-minJump]` should be added to the possible previous steps. By maintaining a counter `cur` of all previous reachable steps, the overall time complexity decreases to $O(n)$.


### More

- **Easy**: [LC732](https://leetcode.com/problems/my-calendar-iii/), [LC1094](https://leetcode.com/problems/car-pooling/), [LC1893](https://leetcode.com/problems/check-if-all-the-integers-in-a-range-are-covered/)
- **Medium**: [LC1589](https://leetcode.com/problems/maximum-sum-obtained-of-any-permutation/), [LC1943](https://leetcode.com/problems/describe-the-painting/)
- **Hard**: [LC995](https://leetcode.com/problems/minimum-number-of-k-consecutive-bit-flips/), [LC1674](https://leetcode.com/problems/minimum-moves-to-make-array-complementary/), [LC798](https://leetcode.com/problems/smallest-rotation-with-highest-score/)

## Prefix Sum vs. Diff

### Prefix sum: the "integral" of an array

Suppose that we have an array `A = [9,  7,  5,  3,  1, -1, -3, -5, -7, -9]` (index from 1), which is also an *arithmetic sequence* of 10 numbers as $A_n = 11 - 2n$. The sum of the sequence can be easily calculated as:
$S_{n} = \sum_{i=1}^{n}{A_i} = -n^2+10n$ and we let $S_0 = 0$. So the partial sum of a subsequence `A[i:j]` can be obtained by: $S_j-S_{i-1}$.

$S$ is exactly the **prefix sum** array of `A` (index from 1). If we plot both the raw array `A` (in blue) and its prefix sum $S$ as bars in the same graph (along with their curve given by the formula with $n$ above), we get:

![](../images/prefix-sum.png)

We take every element as one unit, and the barplot looks really rough. Now the gap between every two elements, denoted as $dx$, is exact 1. If we regard the array `A` as a continuous function $f(x) = 11 - 2x$, we can still reduce the gap between every two elements to as small as possible ($dx \to 0$), that is, we accumulate every small *difference* (in blue) between two neighbor $x$s to the $S$ (in red):

![](../images/integral.png)

When $dx \to 0$, we can write the presum $S$ as the integral of a continuous function $f$:

$$S(x) = \int_{1}^{x}{f(x)}dx + f(1)$$

But Notice that it is not the same as the sum formula $-x^2+10x$ because of the different $\Delta x$. Except for that, we can still view prefix sum as **a rough version of integral upon an array**.

### Diff: the "derivate" of an array

Opposite to the prefix-sum array, the diff array reflects every $\Delta y$ happening on specified $x$. Imagine that an interval`[start,end]` gives an increase $dy$ of `num` at the start endpoint `start`, and the increased difference disappears at the end of endpoint, `end+1`. If we plot those intervals as rectangles, and use $dy$ as their heights, a curve to fit the outline of those stacked rectangles accumulates all differences in overall height introduced by rectangles, which is also the recovered raw array `A`.

![](../images/diff-interval.png)

Of course, we won't only meet those regular stacked rectangles as intervals in real problems. Usually, intervals are given in a mess like:

![](../images/mess-intervals.png)

But anyway, after constructing the diff array from intervals, "integrate" them up, and then you will get the raw array.

In summary, we go through a process as:

```{mermaid}
flowchart LR

Intervals[Intervals] -->|discretize| diff[Diff array]
diff -->|integrate| raw[Raw array]
raw -->|integrate| pre[Presum array]
pre -->|difference| sum[Sum of an interval] 
```

Note that we integrate the diff array to get the raw array, and then integrate the raw array to get the prefix sum array. Therefore, `raw -> diff` is exactly an opposite operation (derivative) to the process of `raw -> presum` (integrate).

````{dropdown} Plot Code
Codes used to plot all pictures in this article are available in the following notebooks:
- [`diff-array.ipynb`](https://github.com/li-xin-yi/lctemplates/blob/main/plots/diff-array.ipynb): for [Exmaple](#example)
- [`diff-vs-prefix-sum.ipynb`](https://github.com/li-xin-yi/lctemplates/blob/main/plots/diff-vs-prefix-sum.ipynb): for [Prefix Sum vs. Diff](#prefix-sum-vs-diff)
````





