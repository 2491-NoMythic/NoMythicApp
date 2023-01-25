/**
 * This file contains functions that might calculate defaults that are to complicated to be in config.ts.
 * These can modified as needed.
 *
 * Replace with a simple boolean if you want
 * const aDefault = () => true
 */

import { isThursday, isTuesday } from 'date-fns'
import { toDate } from './calendar/utilities'
import { EventTypes, EventTypesType } from './types/Api'
import { isEmpty } from './utilities/bitsAndBobs'

/**
 * Current code returns true for Regular Event on Tue or Thurs
 *
 * @param eventType EventTypesType
 * @param eventDate Date
 */
const hasMealDefault = (eventType: EventTypesType, eventDate: string) => {
    if (eventType !== EventTypes.REGULAR_PRACTICE || isEmpty(eventDate)) {
        return false
    }
    const aDate = toDate(eventDate)
    return isTuesday(aDate) || isThursday(aDate)
}

export { hasMealDefault }
