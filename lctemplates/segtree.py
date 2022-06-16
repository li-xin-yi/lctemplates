class SegTree:
    def __init__(self, n:int):
        self.n = n
        self.sum = [0]*(4*n)
        self.min = [0]*(4*n)
        self.max = [0]*(4*n)

    def build(self, root:int,l:int, r:int, arr:list) -> None:
        if l == r:
            self.sum[root] = arr[l]
            self.min[root] = arr[l]
            self.max[root] = arr[l]
            return
        mid = (l+r)//2
        self.build(root*2, l, mid, arr)
        self.build(root*2+1, mid+1, r, arr)
        self.sum[root] = self.sum[root*2] + self.sum[root*2+1]
        self.min[root] = min(self.min[root*2], self.min[root*2+1])
        self.max[root] = max(self.max[root*2], self.max[root*2+1])
    
    def update(self, root:int, l:int, r:int, idx:int, val:int) -> None:
        if l == r:
            self.sum[root] = val
            self.min[root] = val
            self.max[root] = val
            return
        mid = (l+r)//2
        if idx <= mid:
            self.update(root*2, l, mid, idx, val)
        else:
            self.update(root*2+1, mid+1, r, idx, val)
        self.sum[root] = self.sum[root*2] + self.sum[root*2+1]
        self.min[root] = min(self.min[root*2], self.min[root*2+1])
        self.max[root] = max(self.max[root*2], self.max[root*2+1])

    def add(self, root:int, l:int, r:int, idx:int, val:int) -> None:
        if l == r:
            self.sum[root] += val
            self.min[root] += val
            self.max[root] += val
            return
        mid = (l+r)//2
        if idx <= mid:
            self.update(root*2, l, mid, idx, val)
        else:
            self.update(root*2+1, mid+1, r, idx, val)
        self.sum[root] = self.sum[root*2] + self.sum[root*2+1]
        self.min[root] = min(self.min[root*2], self.min[root*2+1])
        self.max[root] = max(self.max[root*2], self.max[root*2+1])    
    
    def query_sum(self, root:int, l:int, r:int, L:int, R:int) -> int:
        if l >= L and r <= R:
            return self.sum[root]
        mid = (l+r)//2
        res = 0
        if L <= mid:
            res += self.query_sum(root*2, l, mid, L, R)
        if R > mid:
            res += self.query_sum(root*2+1, mid+1, r, L, R)
        return res
    
    def query_max(self, root:int, l:int, r:int, L:int, R:int) -> int:
        if l >= L and r <= R:
            return self.max[root]
        res = float('-inf')
        mid = (l+r)//2
        if L <= mid:
            res = max(res, self.query_max(root*2, l, mid, L, R))
        if R > mid:
            res = max(res, self.query_max(root*2+1, mid+1, r, L, R))
        return res
    
    def query_min(self, root:int, l:int, r:int, L:int, R:int) -> int:
        if l >= L and r <= R:
            return self.min[root]
        res = float('inf')
        mid = (l+r)//2
        if L <= mid:
            res = min(res, self.query_min(root*2, l, mid, L, R))
        if R > mid:
            res = min(res, self.query_min(root*2+1, mid+1, r, L, R))
        return res

class DynamicSegTree:
    def __init__(self,l:int,r:int):
        self.l = l
        self.r = r
        self.sum = 0
        self.min = float('inf')
        self.max = float('-inf')
        self.left = None
        self.right = None