// 来自 npm cron-validator包
// This comes from the fact that parseInt trims characters coming
// after digits and consider it a valid int, so `1*` becomes `1`.
const safeParseInt = (value: string): number => {
  if (/^\d+$/.test(value)) {
    return Number(value)
  } else {
    return NaN
  }
}

const isWildcard = (value: string): boolean => {
  return value === '*'
}

const isQuestionMark = (value: string): boolean => {
  return value === '?'
}

const isInRange = (value: number, start: number, stop: number): boolean => {
  return value >= start && value <= stop
}

const isValidRange = (value: string, start: number, stop: number): boolean => {
  const sides = value.split('-')
  switch (sides.length) {
    case 1:
      return isWildcard(value) || isInRange(safeParseInt(value), start, stop)
    case 2:
      const [small, big] = sides.map((side: string): number => safeParseInt(side))
      return small <= big && isInRange(small, start, stop) && isInRange(big, start, stop)
    default:
      return false
  }
}

const isValidStep = (value: string | undefined): boolean => {
  return value === undefined || (value.search(/[^\d]/) === -1 && safeParseInt(value) > 0)
}

const validateForRange = (value: string, start: number, stop: number): boolean => {
  if (value.search(/[^\d-,\/*]/) !== -1) {
    return false
  }

  const list = value.split(',')
  return list.every((condition: string): boolean => {
    const splits = condition.split('/')
    // Prevents `*/ * * * *` from being accepted.
    if (condition.trim().endsWith('/')) {
      return false
    }

    // Prevents `*/*/* * * * *` from being accepted
    if (splits.length > 2) {
      return false
    }

    // If we don't have a `/`, right will be undefined which is considered a valid step if we don't a `/`.
    const [left, right] = splits
    return isValidRange(left, start, stop) && isValidStep(right)
  })
}

const hasValidSeconds = (seconds: string): boolean => {
  return validateForRange(seconds, 0, 59)
}

const hasValidMinutes = (minutes: string): boolean => {
  return validateForRange(minutes, 0, 59)
}

const hasValidHours = (hours: string): boolean => {
  return validateForRange(hours, 0, 23)
}

const hasValidDays = (days: string, allowBlankDay?: boolean): boolean => {
  return (allowBlankDay && isQuestionMark(days)) || validateForRange(days, 1, 31)
}

const monthAlias: { [key: string]: string } = {
  jan: '1',
  feb: '2',
  mar: '3',
  apr: '4',
  may: '5',
  jun: '6',
  jul: '7',
  aug: '8',
  sep: '9',
  oct: '10',
  nov: '11',
  dec: '12',
}

const hasValidMonths = (months: string, alias?: boolean): boolean => {
  // Prevents alias to be used as steps
  if (months.search(/\/[a-zA-Z]/) !== -1) {
    return false
  }

  if (alias) {
    const remappedMonths = months.toLowerCase().replace(/[a-z]{3}/g, (match: string): string => {
      return monthAlias[match] === undefined ? match : monthAlias[match]
    })
    // If any invalid alias was used, it won't pass the other checks as there will be non-numeric values in the months
    return validateForRange(remappedMonths, 1, 12)
  }

  return validateForRange(months, 1, 12)
}

const weekdaysAlias: { [key: string]: string } = {
  sun: '0',
  mon: '1',
  tue: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
}

type WeekdayOptions = Pick<Options, 'alias' | 'allowBlankDay' | 'allowSevenAsSunday' | 'allowNthWeekdayOfMonth'>

const hasValidWeekdays = (weekdays: string, options: WeekdayOptions): boolean => {
  const { allowBlankDay, alias, allowSevenAsSunday, allowNthWeekdayOfMonth } = options
  // If there is a question mark, checks if the allowBlankDay flag is set
  if (allowBlankDay && isQuestionMark(weekdays)) {
    return true
  } else if (!allowBlankDay && isQuestionMark(weekdays)) {
    return false
  }

  // Prevents alias to be used as steps
  if (weekdays.search(/\/[a-zA-Z]/) !== -1) {
    return false
  }

  const remappedWeekdays = alias
    ? weekdays.toLowerCase().replace(/[a-z]{3}/g, (match: string): string => {
        return weekdaysAlias[match] === undefined ? match : weekdaysAlias[match]
      })
    : weekdays
  const maxWeekdayNum = allowSevenAsSunday ? 7 : 6

  const splitByHash = remappedWeekdays.split('#')
  if (allowNthWeekdayOfMonth && splitByHash.length >= 2) {
    // see https://github.com/Airfooox/cron-validate/blob/b95aae1f3a44ad89dbfc7d1a7fca63f3b697aa14/src/helper.ts#L139
    // and https://www.quartz-scheduler.org/documentation/quartz-2.2.2/tutorials/crontrigger.html#special-characters
    const [weekday, occurrence, ...leftOvers] = splitByHash
    if (leftOvers.length !== 0) {
      return false
    }

    return isInRange(safeParseInt(occurrence), 1, 5) && isInRange(safeParseInt(weekday), 0, maxWeekdayNum)
  }

  return validateForRange(remappedWeekdays, 0, maxWeekdayNum)
}

const hasCompatibleDayFormat = (days: string, weekdays: string, allowBlankDay?: boolean) => {
  return !(allowBlankDay && isQuestionMark(days) && isQuestionMark(weekdays))
}

const split = (cron: string): string[] => {
  return cron.trim().split(/\s+/)
}

type Options = {
  // 启用对月份和星期几的 alias 支持
  alias: boolean
  //seconds 标志为 true 来启用对秒的支持
  seconds: boolean
  // 使用 allowBlankDay 标志启用 ? 符号来标记空白的天或工作日
  allowBlankDay: boolean
  // allowSevenAsSunday 标志可以启用以支持将数字 7 作为星期日
  allowSevenAsSunday: boolean
  // 可以启用Allthweekdayofmonth旗帜，以启用表示本月n-thedday的表达式：
  allowNthWeekdayOfMonth: boolean
}

const defaultOptions: Options = {
  alias: false,
  seconds: false,
  allowBlankDay: false,
  allowSevenAsSunday: false,
  allowNthWeekdayOfMonth: false,
}

export const isValidCron = (cron: string, partialOptions?: Partial<Options>): boolean => {
  const options = { ...defaultOptions, ...partialOptions }

  const splits = split(cron)

  if (splits.length > (options.seconds ? 6 : 5) || splits.length < 5) {
    return false
  }

  const checks: boolean[] = []
  if (splits.length === 6) {
    const seconds = splits.shift()
    if (seconds) {
      checks.push(hasValidSeconds(seconds))
    }
  }

  // We could only check the steps gradually and return false on the first invalid block,
  // However, this won't have any performance impact so why bother for now.
  const [minutes, hours, days, months, weekdays] = splits
  checks.push(hasValidMinutes(minutes))
  checks.push(hasValidHours(hours))
  checks.push(hasValidDays(days, options.allowBlankDay))
  checks.push(hasValidMonths(months, options.alias))
  checks.push(hasValidWeekdays(weekdays, options))
  checks.push(hasCompatibleDayFormat(days, weekdays, options.allowBlankDay))

  return checks.every(Boolean)
}
