# Trie

## Template

```py
# root of the trie
trie = {}

# ['aaa', 'ab', 'ac', 'aaab']

# a - a - a - #
#           - b - # 
#   - b - #
#   - c - #

# a list of strings as `words`
for word in words:
    root = trie
    for c in word:
        if c not in root:
            root[c] = {}
        root = root[c]
    root['#'] = {}
```

