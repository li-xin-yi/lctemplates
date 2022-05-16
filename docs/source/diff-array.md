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