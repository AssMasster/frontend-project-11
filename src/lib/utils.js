import _ from 'lodash'

export function uniqIdWithPref(pref = '') {
  const uniqId = _.uniqueId()
  return `${pref}_${uniqId}`
}
