# Diff Array

{badge}`TODO, badge-danger badge-pill`

Opposite to the idea of [prefix sum](prefix-sum.md), which is aimed to evaluate the **changes** on the overall sum through one interval(subarray), a difference array is used to reconstruct the **accumulated sum** at each moment (index) from the **changes** contributed by each **discrete** interval.

```{seealso}
The data structure is often combined with [*sweep line algorithm*](https://en.m.wikipedia.org/wiki/Sweep_line_algorithm): first, we use diff array to record changes on endpoints. Then, the sweep lines help us convert those changes into the origin array by scanning all the indexes in order and accumulating the corresponding difference to the current value so far.
```

## A Typical Scenario

- Given a list of intervals in the format of `[start,end]`. 
- For each interval, a value `num` appears only within it. 
- Ask for the total value `cur` so far at some moments (indexes).

We can first record changes contributed by each interval to a *diff array* (`diff`) and eventually recover the raw array (`cnt`), which represents the current numbers at every index. The prototype is written like:

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

````{note}
Unlike [`map`](https://www.cplusplus.com/reference/map/map)/[`multimap`](https://www.cplusplus.com/reference/map/multimap/) in C++ or [`treemap`](https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html) in Java, `collections.Counter` and its superclass `dict` **don't guarantee keys ordered**: for Python<=3.6, `dict` has totally unordered keys without any assumption[^1]; after Python 3.7, it just maintains an *insertion order*[^2] instead of the comporison of values. Therefore, for both Python and Python3, to simulate the ascending order of array indexes, we must sort the keys in `diff` first by `sorted(diff)` or `sorted(diff.keys())`.  
````


[^1]: Changelog of Python 3.6 mentions that *the order-preserving aspect of this new implementation is considered an implementation detail and should not be relied upon*, see https://docs.python.org/3.6/whatsnew/3.6.html#whatsnew36-compactdict

[^2]: see https://docs.python.org/3.7/tutorial/datastructures.html#dictionaries