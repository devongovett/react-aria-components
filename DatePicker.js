import {useRef} from 'react';
import {useDatePickerState, useDatePickerFieldState} from '@react-stately/datepicker';
import {useDatePicker, useDateField} from '@react-aria/datepicker';
import {LabelProvider} from './Label';
import {DateFieldProvider} from './DateField';
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
