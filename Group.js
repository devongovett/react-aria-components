import {createContext, useContext} from 'react';

export const GroupContext = createContext({});

export function Group({children, style, className}) {
  let {groupRef, ...groupProps} = useContext(GroupContext);

  return (
    <div {...groupProps} ref={groupRef} style={style} className={className}>
      {children}
    </div>
  );
}
