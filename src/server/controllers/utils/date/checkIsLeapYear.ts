import dayjs from 'dayjs'
import { isLeapYear, isValid } from 'date-fns'

export const checkIsLeapYear = (date: Date) => {

    const dateDay = dayjs(date).date()
    const dateMonth = dayjs(date).month() + 1
    const dateYear = dayjs(date).year()

    if (dateDay === 29 && dateMonth === 2) {
        return isLeapYear(dateYear)
    } else {
        return isValid(new Date(dateYear, dateMonth - 1, dateDay))
    }
    
}