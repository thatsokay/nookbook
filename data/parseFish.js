const fs = require('fs')
const papa = require('papaparse')
const fp = require('lodash/fp')
const {parse} = require('date-fns')

const parseFish = (data) =>
  data
    .map(fp.mapKeys((key) => fp.camelCase(key) || 'id'))
    .map(({id, ...rest}) => ({...rest, id: parseInt(id)}))
    .map(({sell, ...rest}) => ({...rest, price: parseInt(sell)}))
    .map(({rainSnowCatchUp, ...rest}) => ({
      ...rest,
      rainChanceUp: rainSnowCatchUp === 'Yes',
    }))
    .map(({internalId, ...rest}) => ({
      ...rest,
      internalId: parseInt(internalId),
    }))
    .map(({startTime, endTime, ...rest}) => {
      const startTimes = parseTime(startTime)
      const endTimes = parseTime(endTime)
      const hours = fp
        .zip(startTimes, endTimes)
        .map(fp.zipObj(['start', 'end']))
      return {...rest, hours}
    })
    .map((row) => ({...row, months: parseMonths(row)}))
    .map(({shadow, ...rest}) => ({...rest, shadow: parseShadow(shadow)}))
    .map(({rarity, ...rest}) => ({...rest, rarity: parseRarity(rarity)}))
    .map(
      ({
        id,
        name,
        whereHow,
        shadow,
        rarity,
        rainChanceUp,
        internalId,
        price,
        hours,
        months,
      }) => ({
        id,
        name,
        location: whereHow,
        shadow,
        rarity,
        rainChanceUp,
        internalId,
        price,
        active: {hours, months},
      }),
    )
    .sort((a, b) => a.id - b.id)

const parseTime = (time) =>
  time === 'All day'
    ? [0]
    : time
        .split('\n')
        .map((time) => parse(time, 'h:mm a', new Date()))
        .map((time) => time.getHours())

const parseMonths = (row) => {
  const monthKeys = [
    'nhJan',
    'nhFeb',
    'nhMar',
    'nhApr',
    'nhMay',
    'nhJun',
    'nhJul',
    'nhAug',
    'nhSep',
    'nhOct',
    'nhNov',
    'nhDec',
  ]
  const active = monthKeys.map((key) => row[key] === 'Yes')
  // Find start and end months. Look for rising or falling edges in
  // `active`. Start and end months are 0-indexed, inclusive start and
  // exclusive end.
  const [startMonths, endMonths] = fp
    .zip([...active.slice(-1), ...active.slice(0, -1)], active)
    .reduce(
      ([startMonths, endMonths], [prev, current], i) => {
        if (prev === current) {
          return [startMonths, endMonths]
        }
        if (current) {
          // Rising edge. `current` is start month.
          return [[...startMonths, i], endMonths]
        }
        // Falling edge. `current` is end month (exclusive).
        return [startMonths, [...endMonths, i]]
      },
      [[], []],
    )
  const months = (!startMonths.length && !endMonths.length
    ? [[0, 0]] // Assume no edges means active all year
    : active[active.length - 1]
    ? fp.zip(
        // Rotate `startMonths` to match last start month with first end month
        [...startMonths.slice(-1), ...startMonths.slice(0, -1)],
        endMonths,
      )
    : fp.zip(startMonths, endMonths)
  ).map(fp.zipObj(['start', 'end']))
  return months
}

const parseShadow = (shadow) => {
  const sizes = [
    'x-small',
    'small',
    'medium',
    'long',
    'large',
    'x-large',
    'xx-large',
  ]
  const size = sizes.findIndex((size) => shadow.toLowerCase().startsWith(size))
  const finned = shadow.toLowerCase().endsWith('fin')
  return {size, finned}
}

const parseRarity = (rarity) => {
  const rarities = ['common', 'uncommon', 'rare', 'ultra-rare']
  return rarities.indexOf(rarity.toLowerCase())
}

const contents = fs.readFileSync('data/fish.csv', {encoding: 'utf8'})
const data = papa.parse(contents.trim(), {header: true}).data
const parsed = parseFish(data)
fs.writeFileSync('assets/fish.json', JSON.stringify(parsed))
