import {useRef, createContext, useContext, cloneElement} from 'react';
import {useDatePickerFieldState} from '@react-stately/datepicker';
import {useDateField, useDateSegment} from '@react-aria/datepicker';
import {useLocale, FocusScope} from 'react-aria';
import {createCalendar} from '@internationalized/date';
import {LabelProvider} from './Label';

const DateFieldProviderContext = createContext();
export function DateFieldProvider({children, ...value}) {
  return (
    <DateFieldContext.Provider value={value}>
      {children}
    </DateFieldContext.Provider>
  );
}

const DateFieldContext = createContext();

export function DateField(props) {
  let propsFromDatePicker = useContext(DateFieldProviderContext);
  let { locale } = useLocale();
  let state = useDatePickerFieldState({
    ...props,
    ...propsFromDatePicker,
    locale,
    createCalendar
  });

  let fieldRef = useRef();
  let { labelProps, fieldProps } = useDateField({...props, label: 's'}, state, fieldRef);

  return (
    <DateFieldContext.Provider value={{state, fieldProps, fieldRef}}>
      <LabelProvider {...labelProps}>
        {props.children}
      </LabelProvider>
    </DateFieldContext.Provider>
  );
}

export function DateInput({children, style, className}) {
  let {state, fieldProps, fieldRef} = useContext(DateFieldContext);
  return (
    <div {...fieldProps} ref={fieldRef} style={style} className={className}>
      <FocusScope>
        {state.segments.map((segment, i) => cloneElement(children(segment), {key: i}))}
      </FocusScope>
    </div>
  );
}

export function DateSegment({ segment, className, style, children }) {
  let {state} = useContext(DateFieldContext);
  let ref = useRef();
  let { segmentProps } = useDateSegment({}, segment, state, ref);
  
  if (typeof className === 'function') {
    className = className({
      segment,
    });
  }
  
  if (typeof style === 'function') {
    style = style({
      segment,
    });
  }
  
  if (typeof children === 'function') {
    children = children({
      segment,
    });
  } else if (children == null) {
    children = segment.text;
  }
  
  if (!segment.isEditable) {
    return <div aria-hidden="true" ref={ref} className={className} style={style}>{children}</div>
  }

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={className}
      style={style}>
      {children}
    </div>
  );
}
