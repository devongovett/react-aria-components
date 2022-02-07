import {createContext, useContext} from 'react';
import {mergeProps} from 'react-aria';

const LabelContext = createContext();

export function LabelProvider({children, ...value}) {
  return (
    <LabelContext.Provider value={value}>
      {children}
    </LabelContext.Provider>
  );
}

export function Label(props) {
  let context = useContext(LabelContext) || {};
  props = mergeProps(context, props);
  let {children, style, className, elementType: ElementType = 'label', ...labelProps} = props;
  return <ElementType {...labelProps} style={style} className={className}>{children}</ElementType>;
}
