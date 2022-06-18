import {createContext, useRef, useContext, useEffect} from 'react';

import {useListState, Item} from 'react-stately';
import {
  useListBox,
  useOption,
  mergeProps,
} from 'react-aria';
import {useRenderProps} from './utils';

export const ListBoxContext = createContext();

export function ListBox(props) {
  let {state, setListBoxProps, listBoxRef, hidden, ...otherProps} = useContext(ListBoxContext) || {};
  useEffect(() => {
    if (setListBoxProps) {
      setListBoxProps(props);
    }
  }, [props]);

  props = mergeProps(otherProps, props);

  return !state || state.isOpen ? <ListBoxInner state={state} props={props} listBoxRef={listBoxRef} /> : null;
}

function ListBoxInner({state, props, listBoxRef}) {
  let ref = useRef();
  ref = listBoxRef || ref;
  state = state || useListState(props);
  let { listBoxProps, labelProps } = useListBox(props, state, ref);

  return (
    <ul
      {...listBoxProps}
      ref={ref}
      style={props.style}
      className={props.className}>
      {[...state.collection].map((item) => (
        <Option
          key={item.key}
          item={item}
          state={state}
        />
      ))}
    </ul>
  );
}

function Option({ item, state }) {
  // Get props for the option element
  let ref = useRef();
  let isFocused = state.selectionManager.focusedKey === item.key;
  let { optionProps, isSelected, isDisabled } = useOption(
    { key: item.key },
    state,
    ref
  );

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  // let { isFocusVisible, focusProps } = useFocusRing();

  let renderProps = useRenderProps({
    className: item.props.className,
    style: item.props.style,
    children: item.rendered,
    values: {
      isFocused,
      isSelected,
      isDisabled
    }
  });

  return (
    <li
      {...mergeProps(optionProps, renderProps)}
      ref={ref} />
  );
}

export {Item};
