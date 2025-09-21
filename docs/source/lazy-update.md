# Lazy Update

Many problems require maintaining a dynamic collection of items supporting

- Online updates (insertions, deletions, modifications)
- Efficient retrieval of the "top" item according to some criteria (e.g., highest priority, lowest value)

Instead of other traditional data structures:

- Only build offline for static requests (e.g., sorted array)
- or provide only some inefficiency in updates or queries

A trick called *lazy update* can be used to achieve efficient performance for both operations. Key idea:

Maintain two separate data structures:
  - One for the current valid items, serving as the source of truth for queries.
  - Another for tracking the rank/priority of items once any item changes, serving for the quick retrieval of the top item.

This idea is very popular and useful in practice, for example, lazy deletion in garbage collection [^1], lazy propagation in segment trees, etc.

## Example: Min-Heap with Lazy Update

```python
import heapq

class MinHeapWithLazyUpdate:
    def __init__(self):
        self.heap = []
        self.map = {}

    def insert(self, key, value) -> bool:
        # If key already exists, return False
        if key in self.map:
            return False
        self.map[key] = value
        heapq.heappush(self.heap, (value, key))
        return True

    def update(self, key, new_value) -> bool:
        # If key does not exist, return False
        if key not in self.map:
            return False
        self.map[key] = new_value
        heapq.heappush(self.heap, (new_value, key))
        return True

    def delete(self, key) -> bool:
        # If key does not exist, return False
        if key not in self.map:
            return False
        del self.map[key]
        return True

    def get_min(self) -> int | None:
        # Got the minimum valid item key without removing it. If no valid item, return None
        while self.heap and (self.heap[0][1] not in self.map or self.map[self.heap[0][1]] != self.heap[0][0]):
            heapq.heappop(self.heap)
        return self.heap[0][1] if self.heap else None

    def pop_min(self) -> int | None:
        # Remove and return the minimum valid item key. If no valid item, return None
        while self.heap and (self.heap[0][1] not in self.map or self.map[self.heap[0][1]] != self.heap[0][0]):
            heapq.heappop(self.heap)
        if not self.heap:
            return None
        _, key = heapq.heappop(self.heap)
        del self.map[key]
        return key
```




[^1]: https://www.designgurus.io/course-play/grokking-the-advanced-system-design-interview/doc/garbage-collection A system design interview problem.
