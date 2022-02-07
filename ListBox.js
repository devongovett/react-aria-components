import {createContext, useRef, useContext, useEffect} from 'react';

import {useListState, Item} from 'react-stately';
import {
  useListBox,
  useOption,
  mergeProps,
} from 'react-aria';

const ListBoxContext = createContext();

export function ListBoxProvider({children, ...value}) {
  return (
    <ListBoxContext.Provider value={value}>
      {children}
    </ListBoxContext.Provider>
  );
}

export function ListBox(props) {
  let {state, setListBoxProps, listBoxRef, ...otherProps} = useContext(ListBoxContext) || {};
  useEffect(() => {
    if (setListBoxProps) {
      setListBoxProps(props);
    }
  }, [props]);

  props = mergeProps(otherProps, props);

  // let state = useListState(props);

  let ref = useRef();
  ref = listBoxRef || ref;
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

  let className = item.props.className;
  if (typeof className === 'function') {
    className = className({
      isFocused,
      isSelected,
      isDisabled
    });
  }

  let style = item.props.style;
  if (typeof style === 'function') {
    style = style({
      isFocused,
      isSelected,
      isDisabled
    });
  }

  let rendered = item.rendered;
  if (typeof rendered === 'function') {
    rendered = rendered({
      isFocused,
      isSelected,
      isDisabled
    });
  }

  return (
    <li
      {...mergeProps(optionProps)}
      ref={ref}
      style={style}
      className={className}>
      {rendered}
    </li>
  );
}

export {Item};
