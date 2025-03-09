/*
  # Add initial coding problems

  1. New Data
    - Adds several initial problems with varying difficulties
    - Each problem includes:
      - Title
      - Description
      - Difficulty level
      - Category
      - Test cases
      - Solution template
*/

INSERT INTO problems (title, description, difficulty, category, test_cases, solution_template)
VALUES
  (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers in the array that add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    'Easy',
    'Arrays',
    '[
      {"input": {"nums": [2, 7, 11, 15], "target": 9}, "output": [0, 1]},
      {"input": {"nums": [3, 2, 4], "target": 6}, "output": [1, 2]},
      {"input": {"nums": [3, 3], "target": 6}, "output": [0, 1]}
    ]',
    'function twoSum(nums, target) {
    // Write your code here
}'
  ),
  (
    'Reverse String',
    'Write a function that reverses a string. The input string is given as an array of characters.',
    'Easy',
    'Strings',
    '[
      {"input": {"s": ["h","e","l","l","o"]}, "output": ["o","l","l","e","h"]},
      {"input": {"s": ["H","a","n","n","a","h"]}, "output": ["h","a","n","n","a","H"]}
    ]',
    'function reverseString(s) {
    // Write your code here
}'
  ),
  (
    'Valid Parentheses',
    'Given a string s containing just the characters ''()'', ''{}'', ''[]'', determine if the input string is valid. An input string is valid if: 1. Open brackets must be closed by the same type of brackets. 2. Open brackets must be closed in the correct order.',
    'Medium',
    'Strings',
    '[
      {"input": {"s": "()"}, "output": true},
      {"input": {"s": "()[]{}"}, "output": true},
      {"input": {"s": "(]"}, "output": false},
      {"input": {"s": "([)]"}, "output": false},
      {"input": {"s": "{[]}"}, "output": true}
    ]',
    'function isValid(s) {
    // Write your code here
}'
  ),
  (
    'Maximum Subarray',
    'Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
    'Medium',
    'Arrays',
    '[
      {"input": {"nums": [-2,1,-3,4,-1,2,1,-5,4]}, "output": 6},
      {"input": {"nums": [1]}, "output": 1},
      {"input": {"nums": [5,4,-1,7,8]}, "output": 23}
    ]',
    'function maxSubArray(nums) {
    // Write your code here
}'
  ),
  (
    'Merge K Sorted Lists',
    'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    'Hard',
    'LinkedLists',
    '[
      {"input": {"lists": [[1,4,5],[1,3,4],[2,6]]}, "output": [1,1,2,3,4,4,5,6]},
      {"input": {"lists": []}, "output": []},
      {"input": {"lists": [[]]}, "output": []}
    ]',
    'function mergeKLists(lists) {
    // Write your code here
}'
  );