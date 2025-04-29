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
  ),
  (
    'Binary Tree Level Order Traversal',
    'Given the root of a binary tree, return the level order traversal of its nodes'' values. (i.e., from left to right, level by level).',
    'Medium',
    'Trees',
    '[
      {"input": {"root": [3,9,20,null,null,15,7]}, "output": [[3],[9,20],[15,7]]},
      {"input": {"root": [1]}, "output": [[1]]},
      {"input": {"root": []}, "output": []}
    ]',
    'function levelOrder(root) {
    // Write your code here
}'
  ),
  (
    'Number of Islands',
    'Given an m x n 2D binary grid grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    'Medium',
    'Graphs',
    '[
      {"input": {"grid": [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]}, "output": 1},
      {"input": {"grid": [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]}, "output": 3}
    ]',
    'function numIslands(grid) {
    // Write your code here
}'
  ),
  (
    'Climbing Stairs',
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    'Easy',
    'Dynamic Programming',
    '[
      {"input": {"n": 2}, "output": 2},
      {"input": {"n": 3}, "output": 3},
      {"input": {"n": 4}, "output": 5}
    ]',
    'function climbStairs(n) {
    // Write your code here
}'
  ),
  (
    'Trapping Rain Water',
    'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    'Hard',
    'Arrays',
    '[
      {"input": {"height": [0,1,0,2,1,0,1,3,2,1,2,1]}, "output": 6},
      {"input": {"height": [4,2,0,3,2,5]}, "output": 9}
    ]',
    'function trap(height) {
    // Write your code here
}'
  ),
  (
    'LRU Cache',
    'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class with get and put methods.',
    'Medium',
    'Design',
    '[
      {"input": {"operations": ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], "values": [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]}, "output": [null, null, null, 1, null, -1, null, -1, 3, 4]}
    ]',
    'class LRUCache {
    constructor(capacity) {
        // Initialize your data structure here
    }
    
    get(key) {
        // Return the value of the key if exists, otherwise return -1
    }
    
    put(key, value) {
        // Update or insert the value if the key exists or not
        // Evict the least recently used key when the cache reaches its capacity
    }
}'
  ),
  (
    'Palindrome Linked List',
    'Given the head of a singly linked list, return true if it is a palindrome or false otherwise.',
    'Easy',
    'LinkedLists',
    '[
      {"input": {"head": [1,2,2,1]}, "output": true},
      {"input": {"head": [1,2]}, "output": false}
    ]',
    'function isPalindrome(head) {
    // Write your code here
}'
  ),
  (
    'Word Search',
    'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
    'Medium',
    'Graphs',
    '[
      {"input": {"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCCED"}, "output": true},
      {"input": {"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "SEE"}, "output": true},
      {"input": {"board": [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "word": "ABCB"}, "output": false}
    ]',
    'function exist(board, word) {
    // Write your code here
}'
  ),
  (
    'Longest Palindromic Substring',
    'Given a string s, return the longest palindromic substring in s.',
    'Medium',
    'Strings',
    '[
      {"input": {"s": "babad"}, "output": "bab"},
      {"input": {"s": "cbbd"}, "output": "bb"}
    ]',
    'function longestPalindrome(s) {
    // Write your code here
}'
  ),
  (
    'Merge Two Sorted Lists',
    'You are given the heads of two sorted linked lists. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.',
    'Easy',
    'LinkedLists',
    '[
      {"input": {"list1": [1,2,4], "list2": [1,3,4]}, "output": [1,1,2,3,4,4]},
      {"input": {"list1": [], "list2": []}, "output": []},
      {"input": {"list1": [], "list2": [0]}, "output": [0]}
    ]',
    'function mergeTwoLists(list1, list2) {
    // Write your code here
}'
  ),
  (
    'Median of Two Sorted Arrays',
    'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).',
    'Hard',
    'Arrays',
    '[
      {"input": {"nums1": [1,3], "nums2": [2]}, "output": 2.0},
      {"input": {"nums1": [1,2], "nums2": [3,4]}, "output": 2.5}
    ]',
    'function findMedianSortedArrays(nums1, nums2) {
    // Write your code here
}'
  ),
  (
    'Validate Binary Search Tree',
    'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
    'Medium',
    'Trees',
    '[
      {"input": {"root": [2,1,3]}, "output": true},
      {"input": {"root": [5,1,4,null,null,3,6]}, "output": false}
    ]',
    'function isValidBST(root) {
    // Write your code here
}'
  ),
  (
    'Implement Queue using Stacks',
    'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).',
    'Easy',
    'Design',
    '[
      {"input": {"operations": ["MyQueue", "push", "push", "peek", "pop", "empty"], "values": [[], [1], [2], [], [], []]}, "output": [null, null, null, 1, 1, false]}
    ]',
    'class MyQueue {
    constructor() {
        // Initialize your data structure here
    }
    
    push(x) {
        // Push element x to the back of queue
    }
    
    pop() {
        // Remove the element from the front of the queue and return it
    }
    
    peek() {
        // Get the front element
    }
    
    empty() {
        // Return whether the queue is empty
    }
}'
  ),
  (
    'Course Schedule',
    'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
    'Medium',
    'Graphs',
    '[
      {"input": {"numCourses": 2, "prerequisites": [[1,0]]}, "output": true},
      {"input": {"numCourses": 2, "prerequisites": [[1,0],[0,1]]}, "output": false}
    ]',
    'function canFinish(numCourses, prerequisites) {
    // Write your code here
}'
  ),
  (
    'Kth Largest Element in an Array',
    'Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.',
    'Medium',
    'Sorting',
    '[
      {"input": {"nums": [3,2,1,5,6,4], "k": 2}, "output": 5},
      {"input": {"nums": [3,2,3,1,2,4,5,5,6], "k": 4}, "output": 4}
    ]',
    'function findKthLargest(nums, k) {
    // Write your code here
}'
  ),
  (
    'Longest Substring Without Repeating Characters',
    'Given a string s, find the length of the longest substring without repeating characters.',
    'Medium',
    'Strings',
    '[
      {"input": {"s": "abcabcbb"}, "output": 3},
      {"input": {"s": "bbbbb"}, "output": 1},
      {"input": {"s": "pwwkew"}, "output": 3}
    ]',
    'function lengthOfLongestSubstring(s) {
    // Write your code here
}'
  );