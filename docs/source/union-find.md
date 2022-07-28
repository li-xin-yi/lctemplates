# Union Find

```py
root = list(range(n))
def find(x):
    y = find(root[x])
    root[x] = y
    # while root[x]!=x:
    #     x = root[x]
    # return x

def union(x,y):
    x, y = find(x),find(y)
    root[y] = x

```