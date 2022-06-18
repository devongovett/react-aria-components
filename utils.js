export function Provider({values, children}) {
  for (let [Context, value] of values) {
    children = <Context.Provider value={value}>{children}</Context.Provider>;
  }

  return children;
}

export function useRenderProps({className, style, children, defaultChildren, values}) {
if (typeof className === 'function') {
    className = className(values);
  }
  
  if (typeof style === 'function') {
    style = style(values);
  }

  if (typeof children === 'function') {
    children = children(values);
  } else if (children == null) {
    children = defaultChildren;
  }

  return {
    className,
    style,
    children
  };
}
