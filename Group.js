import {createContext, useContext} from 'react';

const GroupContext = createContext();

export function GroupProvider({children, ...value}) {
  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  )
}

export function Group({children, style, className}) {
  let {groupRef, ...groupProps} = useContext(GroupContext) || {};

  return (
    <div {...groupProps} ref={groupRef} style={style} className={className}>
      {children}
    </div>
  );
}
