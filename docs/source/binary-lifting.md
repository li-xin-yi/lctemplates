# Binary Lifting

In usual, binary lifting is a technique used to solve problems on trees, especially those involving finding the Lowest Common Ancestor (LCA) of two nodes. The idea is to **preprocess** the tree in such a way that we can answer LCA queries in logarithmic time.

Assuming there is a `parent` array that stores the parent[^1] of each node, we can build a `up` array that stores the 2^i-th ancestor of each node. The `up` array is built using dynamic programming, where `up[i][j]` represents the 2^i-th ancestor of node j.

[^1]: In the tree structure, *parent* refers to the parent node of a given node. However, we can generalize any surjective function relationship (e.g., `f(x) = y` which means there is a only `y` that maps to `x`) as a parent-child relationship. 

## Basic Problem - Finding the LCA

Let's start with a simple problem: finding the [**lowest common ancestor (LCA)**](https://en.wikipedia.org/wiki/Lowest_common_ancestor) of two nodes in a tree. The steps to solve this problem using binary lifting are as follows:

1. **Preprocess the tree**: to build the 2-D `parent` array, where `parent[i][j]` is the $2^i$-th ancestor of node j.
2. **Query the k-th ancestor**: to find the k-th ancestor of a node, we can use the `parent` array, which allows us to jump all the way up the tree in logarithmic time. Assume $k = \sum_{i} {2^i}, k \leq n$, then we can find the k-th ancestor of node `x` by iterating through the bits of `k` and jumping to the corresponding ancestor in the `parent` array.  
