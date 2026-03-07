# Union Find

**Disjoint Set Union (DSU)** (or **Union Find** in some contexts) is a data structure that keeps track of a set of elements partitioned into a number of disjoint (non-overlapping) subsets. It provides two main operations: `find` and `union`.

The very basic implementation of Union Find can be done using a list to represent the parent of each element. Initially, each element is its own parent (i.e., each element is in its own set, I use `root` to represent the parent of each element). The `find` function is used to find the representative (or "root") of the set that an element belongs to, while the `union` function is used to merge two sets together.

Notice that in the `find` function, we perform **path compression** by setting the parent of each visited node directly to the root.
```py
root = list(range(n))
def find(x):
    if x == root[x]: return x
    # path compression
    root[x] = find(root[x])
    return root[x]

def union(x,y):
    x, y = find(x),find(y)
    root[y] = x
```