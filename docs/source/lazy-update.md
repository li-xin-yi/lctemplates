# Lazy Update

Many problems require maintaining a dynamic collection of items supporting

- Online updates (insertions, deletions, modifications)
- Efficient retrieval of the "top" item according to some criteria (e.g., highest priority, lowest value)

Instead of other traditional data structures:

- Only build offline for static requests (e.g., sorted array)
- or provide only some inefficiency in updates or queries 
