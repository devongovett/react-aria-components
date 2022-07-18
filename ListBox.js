import {cloneElement, createContext, useRef, useContext, useEffect} from 'react';

import {useListState, Item} from 'react-stately';
import {
  useListBox,
  useOption,
  mergeProps,
} from 'react-aria';
import {useRenderProps} from './utils';

export const ListBoxContext = createContext({});
const InternalListBoxContext = createContext();

export function ListBox(props) {
  let {state, setListBoxProps, listBoxRef, hidden, ...otherProps} = useContext(ListBoxContext);
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

  let renderItem = props.renderItem || ((item) => <Option item={item} />);

  return (
    <ul
      {...listBoxProps}
      ref={ref}
      style={props.style}
      className={props.className}>
      <InternalListBoxContext.Provider value={{state}}>
        {[...state.collection].map(item => cloneElement(renderItem(item), {key: item.key}))}
      </InternalListBoxContext.Provider>
    </ul>
  );
}

export function Option({ item, className, style, children }) {
  let ref = useRef();
  let {state} = useContext(InternalListBoxContext);
  let { optionProps, isSelected, isDisabled, isFocused } = useOption(
    { key: item.key },
    state,
    ref
  );

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  // let { isFocusVisible, focusProps } = useFocusRing();

  let renderProps = useRenderProps({
    className: className || item.props.className,
    style: style || item.props.style,
    children: children || item.rendered,
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
