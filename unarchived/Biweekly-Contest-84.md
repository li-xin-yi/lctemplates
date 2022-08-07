---
date: 08-06-2022
---

# Biweekly Contest 84


T1: [Merge Similar Items](https://leetcode.com/contest/biweekly-contest-84/problems/merge-similar-items/)

```py
from collections import Counter
class Solution:
    def mergeSimilarItems(self, items1: List[List[int]], items2: List[List[int]]) -> List[List[int]]:
        return sorted(list((Counter({k:v for k,v in items1}) + Counter({k:v for k,v in items2})).items()))
```

T2: [Count Number of Bad Pairs](https://leetcode.com/contest/biweekly-contest-84/)

```py
from collections import Counter
class Solution:
    def countBadPairs(self, nums: List[int]) -> int:
        return len(nums)*(len(nums)-1)//2 - sum(n*(n-1)//2 for n in Counter([v-i for i,v in enumerate(nums)]).values())
```

T3: [Task Scheduler II](https://leetcode.com/problems/task-scheduler-ii/)

```py
class Solution:
    def taskSchedulerII(self, tasks: List[int], space: int, res:int = 0, i:int = 0, last:dict=dict()) -> int:
        return last.clear() or res if ((i == len(tasks) or (last.update({tasks[i]:max(i,last.get(tasks[i],-space)+space,res)+1})))) else self.taskSchedulerII(tasks,space,last[tasks[i]],i+1,last)
```

T4: [Minimum Replacements to Sort the Array](https://leetcode.com/contest/biweekly-contest-84/problems/minimum-replacements-to-sort-the-array/)

```py
class Solution:
    def minimumReplacement(self, nums: List[int], last:int =int(1e9), res:int = 0) -> int:
        return self.minimumReplacement(nums,v//(k:=(v+last-1)//last),res+k-1) if (nums and (v:=nums.pop())) else res
```