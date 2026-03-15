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

This basic implementation has a time complexity of O(n) for the `find` operation in the worst case, which can happen when the tree becomes very deep.

To optimize the time complexity, we can use **union by rank** (or **union by size**), which can help keep the tree flat. By the trick of union by rank, we always attach the smaller tree under the root of the larger tree. This way, we can ensure that the depth of the tree remains logarithmic.

`````{tab-set}
````{tab-item} By size

The easier and more intuitive way is to keep track of the size of each tree and always attach the smaller tree under the root of the larger tree.

```py
size = [1] * n

def union(x,y):
    x, y = find(x),find(y)
    if x == y: return
    if size[x] < size[y]:
        x, y = y, x
    root[y] = x
    size[x] += size[y]
```
````

````{tab-item} By rank
Here, **rank** refers to the depth of the tree. We always attach the tree with smaller rank under the root of the tree with larger rank. If both trees have the same rank, we can choose one as the new root and increase its rank by 1.

```py
rank = [0] * n

def union(x,y):
    x, y = find(x),find(y)
    if x == y: return
    if rank[x] < rank[y]:
        x, y = y, x
    elif rank[x] == rank[y]:
        rank[x] += 1
    root[y] = x
```
````
`````


