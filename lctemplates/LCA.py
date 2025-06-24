# unweighted LCA implementation
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


# weighted LCA implementation
# assumes graph is represented as an adjacency list of tuples (neighbor, weight)
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