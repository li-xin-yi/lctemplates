# Some Tips for Python in LeetCode

Generally speaking, it's very comfortable to write solutions in Python for LeetCode problems. However, sometimes, you may hear someone complaining about this language like:

> {opticon}`comment` This problem is unfair to us Python users! With the **same algorithm idea**, others  passed the problem by their solutions in C++ or Java, but I got a **TLE** for my Python solution. It's too slow!

or

> {opticon}`comment` It's hard to write a clean solution in Python (for some problems) because there is no *specific* built-in data types/functions/libraries/syntax sugar and I have to **code a lot** to implement them in a hurry.

To work with Python in LeetCode smoothly, you also have to code in a proper way, which may be **very different** from what you usually do in a productive environment in real-word. Anyway, based on my short experiences in writing *accepted* solutions for LeetCode problems, I have some notes and tricks to avoid redundant lines of code and suffering runtime.

## Square

Stick to `x*x` style when you are required to calculate the square of a number `x` frequently, which is the most easy way to write and run fast. Don't use `x**2` or `pow(x,2)` unless necessary.

Why? Both `**` and `pow` apply a [*fast exponentiation*](https://en.wikipedia.org/wiki/Exponentiation_by_squaring) algorithm in $O(\log n)$. When the exponent `n` increases fast, they optimize a lot but when `n=2`, it suffers from the huge constant factor compared to naively multiple two `x`s.

**Extension**: How about *square root*? I also measured three ways (`**0.5`,`math.sqrt` and `pow(,0.5)`) on a large scale of data and found `math.sqrt` has the shortest runtime but not so obiviously. 

## Transpose

## Recursion
