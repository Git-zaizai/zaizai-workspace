
/**
 * 计算两个字符串的差异
 * @param str1 第一个字符串
 * @param str2 第二个字符串
 * @param options 配置选项
 * @returns 差异结果对象
 */
interface DiffResult {
  isSame: boolean
  differences: Array<{
    type: 'add' | 'remove' | 'change'
    index: number
    char?: string
    expected?: string
    actual?: string
  }>
  sameCharacters: number
  totalCharacters: number
  similarity: number // 0-1 之间的相似度
  diffString: string // 可视化的差异字符串
}

function findStringDifferences(
  str1: string, 
  str2: string, 
  options: {
    caseSensitive?: boolean
    showDiff?: boolean
    maxDiff?: number
  } = {}
): DiffResult {
  const {
    caseSensitive = true,
    showDiff = true,
    maxDiff = 100
  } = options

  // 处理大小写敏感
  const s1 = caseSensitive ? str1 : str1.toLowerCase()
  const s2 = caseSensitive ? str2 : str2.toLowerCase()

  // 如果完全相同
  if (s1 === s2) {
    return {
      isSame: true,
      differences: [],
      sameCharacters: str1.length,
      totalCharacters: Math.max(str1.length, str2.length),
      similarity: 1,
      diffString: str1
    }
  }

  const differences: DiffResult['differences'] = []
  let sameCount = 0
  
  // 使用动态规划找出最长公共子序列
  const dp: number[][] = Array(s1.length + 1).fill(null).map(() => Array(s2.length + 1).fill(0))
  
  // 填充 DP 表
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1])
      }
    }
  }

  // 回溯找出差异
  let i = s1.length, j = s2.length
  const diffChars: string[] = []
  
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i-1] === s2[j-1]) {
      // 字符相同
      sameCount++
      diffChars.unshift(str1[i-1] || str2[j-1]) // 使用原始字符
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      // str2 有新增字符
      if (showDiff && differences.length < maxDiff) {
        differences.unshift({
          type: 'add',
          index: j - 1,
          char: str2[j-1],
          actual: str2[j-1]
        })
      }
      diffChars.unshift(`+${str2[j-1]}`)
      j--
    } else if (i > 0 && (j === 0 || dp[i-1][j] > dp[i][j-1])) {
      // str1 有删除字符
      if (showDiff && differences.length < maxDiff) {
        differences.unshift({
          type: 'remove',
          index: i - 1,
          char: str1[i-1],
          expected: str1[i-1]
        })
      }
      diffChars.unshift(`-${str1[i-1]}`)
      i--
    }
  }

  // 计算相似度
  const totalChars = Math.max(str1.length, str2.length)
  const similarity = sameCount / totalChars

  return {
    isSame: false,
    differences: differences.slice(0, maxDiff),
    sameCharacters: sameCount,
    totalCharacters: totalChars,
    similarity: similarity,
    diffString: diffChars.join('')
  }
}

/**
 * 简化版本的字符串差异对比（用于快速比较）
 */
function quickDiff(str1: string, str2: string): { isSame: boolean; firstDiffIndex: number } {
  const minLen = Math.min(str1.length, str2.length)
  
  for (let i = 0; i < minLen; i++) {
    if (str1[i] !== str2[i]) {
      return { isSame: false, firstDiffIndex: i }
    }
  }
  
  // 长度不同
  if (str1.length !== str2.length) {
    return { isSame: false, firstDiffIndex: minLen }
  }
  
  return { isSame: true, firstDiffIndex: -1 }
}

/**
 * 可视化差异输出
 */
function visualizeDiff(str1: string, str2: string): string {
  const result = findStringDifferences(str1, str2)
  
  if (result.isSame) {
    return '字符串完全相同'
  }
  
  let output = '字符串差异分析:\n'
  output += `相似度: ${(result.similarity * 100).toFixed(2)}%\n`
  output += `相同字符: ${result.sameCharacters}/${result.totalCharacters}\n`
  output += `差异数量: ${result.differences.length}\n\n`
  
  if (result.differences.length > 0) {
    output += '详细差异:\n'
    result.differences.forEach((diff, index) => {
      switch (diff.type) {
        case 'add':
          output += `  [+${index}] 位置 ${diff.index}: 新增字符 "${diff.char}"\n`
          break
        case 'remove':
          output += `  [-${index}] 位置 ${diff.index}: 删除字符 "${diff.char}"\n`
          break
        case 'change':
          output += `  [~${index}] 位置 ${diff.index}: "${diff.expected}" → "${diff.actual}"\n`
          break
      }
    })
  }
  
  return output
}
