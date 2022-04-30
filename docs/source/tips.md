# Some Tips for Python in LeetCode

Generally speaking, it's very comfortable to write solutions in Python for LeetCode problems. However, sometimes, you may hear someone complaining about this language like:

> {opticon}`comment` This problem is unfair to us Python users! With the **same algorithm idea**, others  passed the problem by their solutions in C++ or Java, but I got a **TLE** for my Python solution. It's too slow!

or

> {opticon}`comment` It's hard to write a clean solution in Python (for some problems) because there is no *specific* built-in data types/functions/libraries/syntax sugar and I have to **code a lot** to implement them in a hurry.

To work with Python in LeetCode smoothly, you also have to code in a proper way, which may be **very different** from what you usually do in a productive environment in real-word. Anyway, based on my short experiences in writing *accepted* solutions for LeetCode problems, I have some notes and tricks to avoid redundant lines of code and suffering runtime.

## Square

Stick to `x*x` style when you are required to calculate the square of a number `x` frequently, which is the most easy way to write and run fast. Don't use `x**2` or `pow(x,2)` unless necessary. (Test results are available in [this notebook](https://github.com/li-xin-yi/lctemplates/blob/main/test/square-test.ipynb))

Why? Both `**` and `pow` apply a [*fast exponentiation*](https://en.wikipedia.org/wiki/Exponentiation_by_squaring) algorithm in $O(\log n)$. When the exponent `n` increases rapidly, they optimize a lot; but when `n=2`, it suffers from the huge *constant factors* in complexity compared to naively multipling two `x`s.

**Example**: [LC2249 Count Lattice Points Inside a Circle, Weekly Contest 290 Q2](https://leetcode.com/contest/weekly-contest-290/problems/count-lattice-points-inside-a-circle/) asks you to enumerate the points in a given space that hava a distance <= some `r` for some `(x,y)` (i.e., in/on a circle from a lists of circle). If you stick to `x*x` style to calculate the square, you can even pass the problem in a very straight-forward brute-force way ($O(200\times 200 \times n$) as:

```py
class Solution:
    def countLatticePoints(self, circles: List[List[int]]) -> int:
        def check(x,y):
            for i,j,r in circles:
                dx,dy = x-i,y-j
                if dx*dx + dy*dy <= r*r:
                    return True
            return False
        
        res = 0
        for i in range(201):
            for j in range(201):
                if check(i,j):
                    res += 1
        return res
```

Though the problem is intended to be passed by traversing each circle and enumerating all points within `r` away from the center ($O(\max(r)\times n$)and de-duplicating them with a hashset like:

```py
class Solution:
    def countLatticePoints(self, circles: List[List[int]]) -> int:
        seen = set()
        
        for x,y,r in circles:
            for i in range(x-r,x+r+1):
                for j in range(y-r,y+r+1):
                    if (i,j) not in seen and (x-i)**2 + (y-j)**2 <= r**2:
                        seen.add((i,j))
        return len(seen)
```

Thus, if you write the square properly, you may even pass a problem with a wrong algorithm.

**Extension**: How about *square root*? I also measured three ways (`**0.5`,`math.sqrt` and `pow(,0.5)`) on a large scale of data and found that `math.sqrt` has the shortest runtime but not so obviously. (Test results are available in [the same notebook](https://github.com/li-xin-yi/lctemplates/blob/main/test/square-test.ipynb)). 

## Transpose

## Recursion
