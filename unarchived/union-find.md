# Union Find

```py
root = list(range(n))
rank = [0]*n
def find(x):
    if x == root[x]: return x
    root[x] = find(root[x])
    return root[x]

def union(x,y):
    x, y = find(x),find(y)
    root[y] =

```