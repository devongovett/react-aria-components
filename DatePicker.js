import {useRef, createContext, useContext} from 'react';
import {useDatePickerState, useDatePickerFieldState, useDateRangePickerState} from '@react-stately/datepicker';
import {useDatePicker, useDateRangePicker, useDateField} from '@react-aria/datepicker';
import {LabelProvider} from './Label';
import {DateFieldProvider, DateField, DateInput} from './DateField';
import {ButtonProvider} from './Button';
import {DialogProvider} from './Dialog';
import {CalendarProvider} from './Calendar';
import {PopoverProvider} from './Popover';
import {useLocale} from 'react-aria';
import {createCalendar} from '@internationalized/date';
import {GroupProvider} from './Group';

export function DatePicker(props) {
  let state = useDatePickerState(props);
  state.close = () => state.setOpen(false);
  let groupRef = useRef();
  let {
    groupProps,
    labelProps,
    fieldProps,
    buttonProps,
    dialogProps
  } = useDatePicker({...props, label: 's'}, state, groupRef);
  
  let {locale} = useLocale();
  let fieldState = useDatePickerFieldState({
    ...fieldProps,
    value: state.value,
    onChange: state.setValue,
    locale,
    createCalendar
  });
  
  let fieldRef = useRef();
  let { fieldProps: dateFieldProps } = useDateField({...fieldProps, label: 's'}, fieldState, fieldRef);
  
  return (
    <GroupProvider {...groupProps} groupRef={groupRef}>
      <DateFieldProvider state={fieldState} fieldProps={dateFieldProps} fieldRef={fieldRef}>
        <ButtonProvider {...buttonProps} onPress={() => state.setOpen(true)}>
          <LabelProvider {...labelProps}>
            <CalendarProvider autoFocus value={state.dateValue} onChange={state.setDateValue}>
              <PopoverProvider state={state} triggerRef={groupRef}>
                <DialogProvider {...dialogProps}>
                  {props.children}
                </DialogProvider>
              </PopoverProvider>
            </CalendarProvider>
          </LabelProvider>
        </ButtonProvider>
      </DateFieldProvider>
    </GroupProvider>
  );
}

const DateRangePickerContext = createContext();

export function DateRangePicker(props) {
  let state = useDateRangePickerState(props);
  state.close = () => state.setOpen(false);
  let groupRef = useRef();
  let {
    groupProps,
    labelProps,
    startFieldProps,
    endFieldProps,
    buttonProps,
    dialogProps
  } = useDateRangePicker({...props, label: 's'}, state, groupRef);
  
  return (
    <DateRangePickerContext.Provider value={{state, startFieldProps, endFieldProps}}>
      <GroupProvider {...groupProps} groupRef={groupRef}>
        <ButtonProvider {...buttonProps} onPress={() => state.setOpen(true)}>
          <LabelProvider {...labelProps}>
            <CalendarProvider autoFocus value={state.dateRange} onChange={state.setDateRange}>
              <PopoverProvider state={state} triggerRef={groupRef}>
                <DialogProvider {...dialogProps}>
                  {props.children}
                </DialogProvider>
              </PopoverProvider>
            </CalendarProvider>
          </LabelProvider>
        </ButtonProvider>
      </GroupProvider>
    </DateRangePickerContext.Provider>
  );
}

export function StartDateInput(props) {
  let {state, startFieldProps} = useContext(DateRangePickerContext);
  return (
    <DateField {...startFieldProps} value={state.value?.start} onChange={start => state.setDateTime('start', start)}>
      <DateInput {...props} />
    </DateField>
  );
}

export function EndDateInput(props) {
  let {state, endFieldProps} = useContext(DateRangePickerContext);
  return (
    <DateField {...endFieldProps} value={state.value?.end} onChange={start => state.setDateTime('end', start)}>
      <DateInput {...props} />
    </DateField>
  );
}
