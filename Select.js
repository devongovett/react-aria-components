import {useRef, createContext, useContext, useState} from 'react';
import {useSelectState} from 'react-stately';
import {useSelect, HiddenSelect} from 'react-aria';
import {PopoverContext} from './Popover';
import {ButtonContext} from './Button';
import {ListBoxContext} from './ListBox';
import {LabelContext} from './Label';
import {Provider, useRenderProps} from './utils';

const SelectContext = createContext();

export function Select(props) {
  let [listBoxProps, setListBoxProps] = useState(null);

  // Create state based on the incoming props
  let state = useSelectState({
    ...props,
    items: [],
    children: () => {},
    ...listBoxProps
  });

  // Get props for child elements from useSelect
  let ref = useRef();
  let {
    labelProps,
    triggerProps,
    valueProps,
    menuProps
  } = useSelect({...props, label: 's'}, state, ref);

  return (
    <Provider
      values={[
        [SelectContext, {
          state,
          labelProps,
          triggerProps,
          valueProps,
          menuProps,
          setListBoxProps
        }],
        [LabelContext, {...labelProps, elementType: 'span'}],
        [ButtonContext, {...triggerProps, buttonRef: ref}],
        [PopoverContext, {state, triggerRef: ref, preserveChildren: true}],
        [ListBoxContext, {state, setListBoxProps, ...menuProps}]
      ]}>
      {props.children}
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name} />
    </Provider>
  );
}

export function SelectValue(props) {
  let {state, valueProps} = useContext(SelectContext);
  let renderProps = useRenderProps({
    ...props,
    defaultChildren: state.selectedItem?.rendered || 'Select an item',
    values: {
      selectedItem: state.selectedItem?.rendered
    }
  });

  return (
    <span {...valueProps} {...renderProps} />
  );
}
