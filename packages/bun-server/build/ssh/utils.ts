import dayjs from 'dayjs'

/**
* 从命令行输出中提取目录列表
* @param stdout 命令行输出的字符串
* @returns 处理后的目录名称数组
*/
export function getDirectories(stdout): string[] {
    return stdout
        .split('\n') // 按行分割
        .filter(dir => dir) // 过滤空行
        .map(dir => dir.trim().replace(/\/$/, '')) // 去除路径末尾的斜杠
}

/**
 * 处理dist文件列表，生成带日期和序号的新dist名称
 * @param list 文件名称数组
 * @returns 返回格式为"dist-YYYY-MM-DD-XX"的新文件名
 */
export function handleDistFiles(list) {
    const currentDate = dayjs().format('YYYY-MM-DD')
    let arr = list.filter(fv => fv.includes(currentDate))
    if (arr.length === 0) {
        return `dist-${dayjs().format('YYYY-MM-DD')}-01`
    }
    const max = arr.map(mv => Number(mv.split('-').pop())).reduce((a, b) => a + b, 1)
    return `dist-${dayjs().format('YYYY-MM-DD')}-${max}`
}