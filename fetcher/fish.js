const fs = require('fs')
const axios = require('axios')
const fp = require('lodash/fp')
const {parse} = require('date-fns')

const recursiveMapKeys = (iteratee) => (object) =>
  Object.entries(object).reduce((acc, [key, value]) => {
    if (fp.isPlainObject(value)) {
      acc[iteratee(key)] = recursiveMapKeys(iteratee)(value)
    } else {
      acc[iteratee(key)] = value
    }
    return acc
  }, {})

const fetchFish = () => {
  axios
    .get('http://acnhapi.com/fish')
    .then((res) => res.data)
    .then((data) => Object.values(data))
    .then((data) => data.map(recursiveMapKeys(fp.camelCase)))
    .then((data) =>
      data.map(
        ({catchPhrase, museumPhrase, priceCj, availability, ...rest}) => ({
          ...rest,
          active: availability,
        }),
      ),
    )
    .then((data) =>
      data.map(({name, ...rest}) => ({
        ...rest,
        name: Object.entries(name).reduce((acc, [key, value]) => {
          acc[key.slice(4).toLowerCase()] = value
          return acc
        }, {}),
      })),
    )
    .then((data) =>
      data.map(({shadow, ...rest}) => {
        const expr = /^([^\(]+)(?: \((\d)\))?$/
        const match = expr.exec(shadow)
        const description = match[1] || ''
        // Default size to medium
        const size = match[2] || '3'
        return {
          ...rest,
          shadow: {
            description,
            size: parseInt(size),
          },
        }
      }),
    )
    .then((data) =>
      data.map(({active, ...rest}) => {
        const {
          monthNorthern,
          time,
          isAllDay,
          isAllYear,
          location,
          rarity,
        } = active
        // Convert time period to start and end 24-hour integers.
        const hours = isAllDay
          ? [{start: 0, end: 0}]
          : time
              .split(' & ')
              .map((period) => period.split(' - '))
              .map((period) =>
                period.map((time) => parse(time, 'ha', new Date())),
              )
              .map((period) => period.map((time) => time.getHours()))
              .map(([start, end]) => ({start, end}))
        // Convert month period to start and end 0-indexed integers,
        // inclusive start and exclusive end.
        const months = isAllYear
          ? [{start: 0, end: 0}]
          : monthNorthern
              .split(' & ')
              .map((period) => period.split('-'))
              .map(([startStr, endStr]) => {
                start = (parseInt(startStr) - 1) % 12
                end = endStr ? parseInt(endStr) : parseInt(startStr)
                return {start, end}
              })
        return {
          ...rest,
          active: {months, hours},
          location,
          rarity,
        }
      }),
    )
    .then((data) => fs.writeFileSync('assets/fish.json', JSON.stringify(data)))
}

fetchFish()
