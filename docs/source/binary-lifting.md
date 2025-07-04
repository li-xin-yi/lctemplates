# Binary Lifting

In usual, binary lifting is a technique used to solve problems on trees, especially those involving finding the Lowest Common Ancestor (LCA) of two nodes. The idea is to **preprocess** the tree in such a way that we can answer LCA queries in logarithmic time.

Assuming there is a `parent` array that stores the parent[^1] of each node, we can build a `up` array that stores the 2^i-th ancestor of each node. The `up` array is built using dynamic programming, where `up[i][j]` represents the 2^i-th ancestor of node j.

[^1]: In the tree structure, *parent* refers to the parent node of a given node. However, we can generalize any surjective function relationship (e.g., `f(x) = y` which means there is a only `y` that maps to `x`) as a parent-child relationship. 

## Basic Problem - Finding the LCA

Let's start with a simple problem: finding the [**lowest common ancestor (LCA)**](https://en.wikipedia.org/wiki/Lowest_common_ancestor) of two nodes in a tree. The steps to solve this problem using binary lifting are as follows:

1. **Preprocess the tree**: to build the 2-D `parent` array, where `parent[i][j]` is the $2^i$-th ancestor of node j.
2. **Query the k-th ancestor**: to find the k-th ancestor of a node, we can use the `parent` array, which allows us to jump all the way up the tree in logarithmic time. Assume $k = \sum_{i} {2^i}, k \leq n$, then we can find the k-th ancestor of node `x` by iterating through the bits of `k` and jumping to the corresponding ancestor in the `parent` array.  *(for this step, you can also refer to the template problem [LC 1483. Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/))*
3. **Find the LCA**: to find the LCA of two nodes `x` and `y`, we first need to bring both nodes to the same depth. We can do this by finding the depth of both nodes and then jumping up the tree until they are at the same level. Once they are at the same level, we can jump up the tree together until we find their LCA.

The whole implementation template can be found [here](https://github.com/li-xin-yi/lctemplates/blob/main/lctemplates/LCA.py)

````{tabbed} Unweighted Tree
```py
class LCA:
    def __init__(self, graph, root):
        self.graph = graph
        self.n = len(graph)
        self.m = self.n.bit_length()
        
        self.parent = [[-1]*self.m for _ in range(self.n)]
        self.depth = [0] * self.n
        self.dfs(root, -1)
        for i in range(self.m-1):
            for x in range(self.n):
                if (p := self.parent[x][i]) != -1:
                    self.parent[x][i+1] = self.parent[p][i]

    def dfs(self, node, parent) -> None:
        self.parent[node][0] = parent
        for nei in self.graph[node]:
            if nei == parent:
                continue
            self.depth[nei] = self.depth[node] + 1
            self.dfs(nei, node)
    
    def get_kth_ancestor(self, node: int, k: int) -> int:
        if k < 0 or node < 0 or node >= self.n:
            return -1
        for i in range(self.m):
            if k & (1 << i):
                node = self.parent[node][i]
                if node == -1:
                    return -1
        return node
    
    def lca(self, x: int, y: int) -> int:
        if self.depth[x] > self.depth[y]:
            x, y = y, x
        y = self.get_kth_ancestor(y, self.depth[y] - self.depth[x])
        if y == x:
            return x
        for i in range(self.m-1, -1, -1):
            parent_x, parent_y = self.parent[x][i], self.parent[y][i]
            if parent_x != parent_y:
                x, y = parent_x, parent_y
        return self.parent[x][0]
    
    def distance(self, x, y) -> int:
        lca_node = self.lca(x, y)
        return self.depth[x] + self.depth[y] - 2 * self.depth[lca_node]
```
````

````{tabbed} Weighted Tree
```py
class WeightedLCA:
    def __init__(self, graph, root):
        self.graph = graph
        self.n = len(graph)
        self.m = self.n.bit_length()
        
        self.parent = [[-1]*self.m for _ in range(self.n)]
        self.depth = [0] * self.n
        self.distance = [0] * self.n
        self.dfs(root, -1)
        for i in range(self.m-1):
            for x in range(self.n):
                if (p := self.parent[x][i]) != -1:
                    self.parent[x][i+1] = self.parent[p][i]

    def dfs(self, node, parent) -> None:
        self.parent[node][0] = parent
        for nei, weight in self.graph[node]:
            if nei == parent:
                continue
            self.depth[nei] = self.depth[node] + 1
            self.distance[nei] = self.distance[node] + weight
            self.dfs(nei, node)
    
    def get_kth_ancestor(self, node: int, k: int) -> int:
        if k < 0 or node < 0 or node >= self.n:
            return -1
        for i in range(self.m):
            if k & (1 << i):
                node = self.parent[node][i]
                if node == -1:
                    return -1
        return node
    
    def lca(self, x: int, y: int) -> int:
        if self.depth[x] > self.depth[y]:
            x, y = y, x
        y = self.get_kth_ancestor(y, self.depth[y] - self.depth[x])
        if y == x:
            return x
        for i in range(self.m-1, -1, -1):
            parent_x, parent_y = self.parent[x][i], self.parent[y][i]
            if parent_x != parent_y:
                x, y = parent_x, parent_y
        return self.parent[x][0]
    
    def dist(self, x, y) -> int:
        lca_node = self.lca(x, y)
        return self.distance[x] + self.distance[y] - 2 * self.distance[lca_node]
    
    # jump from node x by at most distance d, returns the farthest node reachable
    def upto(self, x: int, d: int) -> int:
        dx = self.distance[x]
        for i in range(self.m-1, -1, -1):
            p = self.parent[x][i]
            if p != -1 and dx - self.distance[p] <= d:
                x = p
        return x
```
````

The key idea is to preprocess every $2^i$-th ancestor of each node. After the processing, we can jump to **arbitrary** ancestor by using the binary representation of depth and iterate through the bits to go up. This allows us to answer LCA queries in $O(\log n)$ time. 

Notice `upto` method in weighted tree, it solves the problem that if you are allowed to jump at most `d` distance up from a node `x`, what is the farthest node you can reach. The method iterates throught the most significant bit to the least significant bit, checking if the distance to the parent node is within the allowed distance `d`, which also benefits from the binary representation of each ancestor's depth.

Exercises:

- [LC3585](https://leetcode.com/problems/find-weighted-median-node-in-tree/): `upto` method is useful here
- [LC2846](https://leetcode.com/problems/minimum-edge-weight-equilibrium-queries-in-a-tree/description/): prefix sum on a tree (from root to each node) is also helpful here
- [LC3553](https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths-ii/description/)
- [LC3559](https://leetcode.com/problems/number-of-ways-to-assign-edge-weights-ii/description/)