import {useRef, createContext, useContext, useMemo} from 'react';
import {useCalendarState, useRangeCalendarState} from '@react-stately/calendar';
import {useCalendar, useRangeCalendar, useCalendarGrid, useCalendarCell} from '@react-aria/calendar';
import {useLocale, VisuallyHidden, useDateFormatter, mergeProps} from 'react-aria';
import {createCalendar, startOfWeek, getWeeksInMonth, isSameMonth} from '@internationalized/date';
import {Button} from './Button';

const CalendarProviderContext = createContext();
export function CalendarProvider({children, ...value}) {
  return (
    <CalendarProviderContext.Provider value={value}>
      {children}
    </CalendarProviderContext.Provider>
  );
}

const CalendarContext = createContext();

export function Calendar(props) {
  let propsFromDatePicker = useContext(CalendarProviderContext);
  props = mergeProps(propsFromDatePicker, props);
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar
  });

  let ref = useRef();
  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state,
    ref
  );

  return (
    <div {...calendarProps} ref={ref} style={props.style} className={props.className}>
      <CalendarContext.Provider
        value={{
          state,
          calendarProps,
          prevButtonProps,
          nextButtonProps
        }}
      >
        {props.children}
      </CalendarContext.Provider>
    </div>
  );
}

export function RangeCalendar(props) {
  let propsFromDatePicker = useContext(CalendarProviderContext);
  props = mergeProps(propsFromDatePicker, props);
  let { locale } = useLocale();
  let state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar
  });
  
  let ref = useRef();
  let { calendarProps, prevButtonProps, nextButtonProps } = useRangeCalendar(
    props,
    state,
    ref
  );
  
  return (
    <div {...calendarProps} ref={ref} style={props.style} className={props.className}>
      <CalendarContext.Provider
        value={{
          state,
          calendarProps,
          prevButtonProps,
          nextButtonProps
        }}
      >
        {props.children}
      </CalendarContext.Provider>
    </div>
  );
}

export function CalendarHeader({ children, style, className }) {
  let { state } = useContext(CalendarContext);
  let currentMonth = state.visibleRange.start;
  let monthDateFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    era: currentMonth.calendar.identifier !== "gregory" ? "long" : undefined,
    calendar: currentMonth.calendar.identifier
  });
  
  if (typeof children === 'function') {
    children = children(state);
  } else if (children == null) {
    children = monthDateFormatter.format(currentMonth.toDate(state.timeZone));
  }

  return (
    <h2 style={style} className={className}>
      {children}
    </h2>
  );
}

export function CalendarPreviousButton({ children }) {
  let { prevButtonProps } = useContext(CalendarContext);
  return <Button {...prevButtonProps}>{children}</Button>;
}

export function CalendarNextButton({ children }) {
  let { nextButtonProps } = useContext(CalendarContext);
  return <Button {...nextButtonProps}>{children}</Button>;
}

export function CalendarGrid(props) {
  let { state } = useContext(CalendarContext);
  let { gridProps } = useCalendarGrid(props, state);
  let { locale } = useLocale();

  let startDate = state.visibleRange.start;
  if (props.offset) {
    startDate = startDate.add(props.offset);
  }
  let monthStart = startOfWeek(startDate, locale);
  let weeksInMonth = getWeeksInMonth(startDate, locale);

  let dayFormatter = useDateFormatter({ weekday: "narrow" });
  let dayFormatterLong = useDateFormatter({ weekday: "long" });

  return (
    <table {...gridProps} style={props.style}>
      <thead>
        <tr>
          {[...new Array(7).keys()].map((index) => {
            let date = monthStart.add({ days: index });
            let dateDay = date.toDate(state.timeZone);
            let day = dayFormatter.format(dateDay);
            let dayLong = dayFormatterLong.format(dateDay);
            return (
              <th key={index}>
                {/* Make sure screen readers read the full day name, but we show an abbreviation visually. */}
                <VisuallyHidden>{dayLong}</VisuallyHidden>
                <span aria-hidden="true">{day}</span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {[...new Array(7).keys()].map((dayIndex) => (
              <CalendarCell
                key={dayIndex}
                state={state}
                date={monthStart.add({ weeks: weekIndex, days: dayIndex })}
                currentMonth={startDate}
                render={props.children}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CalendarCell({ state, date, currentMonth, render }) {
  let ref = useRef();
  let { cellProps, buttonProps, isPressed } = useCalendarCell(
    {date},
    state,
    ref
  );

  let dateFormatter = useDateFormatter({
    day: "numeric",
    timeZone: state.timeZone,
    calendar: currentMonth.calendar.identifier
  });

  let nativeDate = useMemo(() => date.toDate(state.timeZone), [
    date,
    state.timeZone
  ]);
  let formatted = useMemo(() => dateFormatter.format(nativeDate), [
    dateFormatter,
    nativeDate
  ]);

  return (
    <td {...cellProps}>
      <div {...buttonProps} ref={ref}>
        {render({
          formattedDate: formatted,
          date,
          isPressed,
          isSelected: state.isSelected(date),
          isOutsideMonth: !isSameMonth(date, currentMonth)
        })}
      </div>
    </td>
  );
}
