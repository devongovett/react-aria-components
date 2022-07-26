import {cloneElement, createContext, useRef, useContext, useLayoutEffect, useEffect, useMemo, useState, useReducer} from 'react';
import {createPortal} from 'react-dom';
import {useListState, Item} from 'react-stately';
import {
  useListBox,
  useOption,
  useListBoxSection,
  mergeProps,
} from 'react-aria';
import {useRenderProps} from './utils';

let id = 0;

export const ListBoxContext = createContext({});
const InternalListBoxContext = createContext();

class FakeNode {
  constructor(ownerDocument) {
    this.firstChild = null;
    this.lastChild = null;
    this.previousSibling = null;
    this.nextSibling = null;
    this.ownerDocument = ownerDocument;
  }

  *[Symbol.iterator]() {
    let node = this.firstChild;
    while (node) {
      yield node;
      node = node.nextSibling;
    }
  }

  get childNodes() {
    return {
      [Symbol.iterator]: this[Symbol.iterator].bind(this)
    }
  }

  appendChild(child) {
    if (this.firstChild == null) {
      this.firstChild = child;
    }

    if (this.lastChild) {
      this.lastChild.nextSibling = child;
      child.previousSibling = this.lastChild;
    } else {
      child.previousSibling = null;
    }
    child.nextSibling = null;
    this.lastChild = child;

    this.ownerDocument.addNode(child);
    this.ownerDocument.update();
  }

  insertBefore(newNode, referenceNode) {
    newNode.nextSibling = referenceNode;
    newNode.previousSibling = referenceNode.previousSibling;

    if (this.firstChild === referenceNode) {
      this.firstChild = newNode;
    } else {
      referenceNode.previousSibling.nextSibling = newNode;
    }

    referenceNode.previousSibling = newNode;

    this.ownerDocument.addNode(newNode);
    this.ownerDocument.update();
  }

  removeChild(child) {
    if (child.nextSibling) {
      child.nextSibling.previousSibling = child.previousSibling;
    }

    if (child.previousSibling) {
      child.previousSibling.nextSibling = child.nextSibling;
    }

    if (this.firstChild === child) {
      this.firstChild = child.nextSibling;
    }

    if (this.lastChild === child) {
      this.lastChild = child.previousSibling;
    }

    this.ownerDocument.removeNode(child);
    this.ownerDocument.update();
  }

  addEventListener(evt) {}
  removeEventListener(evt) {}
}

class Root extends FakeNode {
  nodeType = Node.DOCUMENT_FRAGMENT_NODE;
  ownerDocument = this;
  keyMap = new Map();

  constructor(update) {
    super();
    this.update = update;
  }

  createElement(type) {
    if (type !== 'option' && type !== 'optgroup') {
      throw new Error(`<${type}> is not allowed inside a ListBox. Please render an <Item> or <Section>.`)
    }
    // console.log(type)
    return new FakeElement(type, this);
  }

  addEventListener(evt) {}
  removeEventListener(evt) {}

  addNode(node) {
    if (!this.keyMap.has(node.key)) {
      this.keyMap.set(node.key, node);

      for (let child of node) {
        this.addNode(child);
      }
    }
  }

  removeNode(node) {
    for (let child of node) {
      this.removeNode(child);
    }

    this.keyMap.delete(node.key);
  }

  get size() {
    return this.keyMap.size;
  }

  getKeys() {
    return this.keyMap.keys();
  }

  getKeyBefore(key) {
    let node = this.keyMap.get(key);
    return node ? node.previousSibling?.key : null;
  }

  getKeyAfter(key) {
    let node = this.keyMap.get(key);
    return node ? node.nextSibling?.key : null;
  }

  getFirstKey() {
    return this.firstChild?.key;
  }

  getLastKey() {
    return this.lastChild?.key;
  }

  getItem(key) {
    return this.keyMap.get(key);
  }
}

class FakeElement extends FakeNode {
  nodeType = Node.ELEMENT_NODE;
  
  constructor(type, ownerDocument) {
    super(ownerDocument);
    this.type = type === 'optgroup' ? 'section' : 'item';
    this.key = ++id; // TODO
    this.value = null;
    this.rendered = null;
    this.textValue = null;
    this.props = {};
    // this.props = {id: ++id};
  }

  set multiple(value) {
    // this.props = {...this.props, ...value};
    this.props = value;
    this.rendered = value.rendered;
    this.value = value.value;
    this.textValue = value.textValue ?? (typeof value.rendered === 'string' ? value.rendered : '') || value['aria-label'] || '';
    this.ownerDocument.update();
  }

  hasAttribute() {}
  setAttribute() {}
  setAttributeNS() {}
  removeAttribute() {}
}

function useCachedChildren(props) {
  let cache = useMemo(() => new WeakMap(), []);
  return useMemo(() => {
    if (props.items && typeof props.children === 'function') {
      let children = [];
      for (let item of props.items) {
        let rendered = cache.get(item);
        if (!rendered) {
          rendered = props.children(item);
          if (rendered.key == null) {
            let key = item.key ?? item.id;
            if (key == null) {
              throw new Error('Could not determine key for item');
            }
            rendered = cloneElement(rendered, {key});
          }
          cache.set(item, rendered);
        }
        children.push(rendered);
      }
      return children;
    } else {
      return props.children;
    }  
  }, [props.children, props.items]);
}

export function ListBox(props) {
  let {state, setListBoxProps, listBoxRef, hidden, ...otherProps} = useContext(ListBoxContext);
  useEffect(() => {
    if (setListBoxProps) {
      setListBoxProps(props);
    }
  }, [props]);

  let isMounted = useRef(false);
  let [c, queueUpdate] = useReducer(c => c + 1, 0);
  let update = () => {
    if (isMounted.current) {
      queueUpdate();
    }
  };

  useLayoutEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    queueUpdate();
  }, []);

  let children = useCachedChildren(props);
  let collection = useMemo(() => new Root(update), []);
  let portal = createPortal(children, collection);

  props = mergeProps(otherProps, props);
  props.collection = collection;
  delete props.children;
  delete props.items;

  // return !state || state.isOpen ? <ListBoxInner state={state} props={props} listBoxRef={listBoxRef} /> : null;
  return <>
    {portal}
    <ListBoxInner state={state} props={props} listBoxRef={listBoxRef} />
  </>
}

function ListBoxInner({state, props, listBoxRef}) {
  let ref = useRef();
  ref = listBoxRef || ref;
  state = state || useListState(props);
  let { listBoxProps, labelProps } = useListBox(props, state, ref);

  let renderSection = props.renderSection || ((section) => <ListBoxSection section={section} />);
  let renderItem = props.renderItem || ((item) => <Option item={item} />);

  let children = useCachedChildren({
    items: state.collection,
    children: item => 
      item.type === 'section'
        ? renderSection(item)
        : renderItem(item)
  });

  return (
    <ul
      {...listBoxProps}
      ref={ref}
      style={props.style}
      className={props.className}>
      <InternalListBoxContext.Provider value={{state}}>
        {children}
      </InternalListBoxContext.Provider>
    </ul>
  );
}

export function ListBoxSection({section, children, className, style}) {
  let {renderItem, state} = useContext(InternalListBoxContext);
  let {itemProps, headingProps, groupProps} = useListBoxSection({
    heading: section.rendered,
    'aria-label': section['aria-label']
  });

  let renderProps = useRenderProps({
    className: className || section.props.className,
    style: style || section.props.style,
    children: children || section.rendered,
    values: section
  });

  let childItems = useCachedChildren({
    items: section.childNodes,
    children: renderItem
  });

  return (
    <li {...itemProps} style={{display: 'contents'}}>
      {renderProps.children &&
        <span {...headingProps} style={{display: 'contents'}}>
          {renderProps.children}
        </span>
      }
      <ul {...groupProps} {...renderProps}>
        {childItems}
      </ul>
    </li>
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
