import {useRef, createContext, useContext} from 'react';
import {useSliderState} from 'react-stately';
import {useNumberFormatter, useSlider, useSliderThumb, VisuallyHidden, mergeProps} from 'react-aria';
import {LabelProvider} from './Label';

const SliderContext = createContext();

export function Slider(props) {
  let trackRef = useRef(null);
  let numberFormatter = useNumberFormatter(props.formatOptions);
  let state = useSliderState({ ...props, numberFormatter });
  let {
    groupProps,
    trackProps,
    labelProps,
    outputProps
  } = useSlider({...props, label: 'd'}, state, trackRef);

  return (
    <SliderContext.Provider value={{state, trackProps, trackRef, outputProps}}>
      <div
        {...groupProps}
        style={props.style}
        className={props.className}>
        <LabelProvider {...labelProps}>
          {props.children}
        </LabelProvider>
      </div>
    </SliderContext.Provider>
  );
}

export function Output({children, style, className}) {
  let {state, outputProps} = useContext(SliderContext);
  if (typeof children === 'function') {
    children = children(state);
  } else if (children == null) {
    children = state.getThumbValueLabel(0);
  }

  return (
    <output {...outputProps} style={style} className={className}>
      {children}
    </output>
  )
}

export function Track({children, style, className}) {
  let {trackProps, trackRef} = useContext(SliderContext);

  return (
    <div
      {...trackProps}
      ref={trackRef}
      style={style}
      className={className}>
      {children}
    </div>
  );
}

export function Thumb(props) {
  let {state, trackRef} = useContext(SliderContext);
  let { index = 0 } = props;
  let inputRef = useRef(null);
  let { thumbProps, inputProps } = useSliderThumb({
    index,
    trackRef,
    inputRef
  }, state);

  let isDragging = state.isThumbDragging(index);

  let className = props.className;
  if (typeof className === 'function') {
    className = className({
      state,
      isDragging
    });
  }

  let style = props.style;
  if (typeof style === 'function') {
    style = style({
      state,
      isDragging
    });
  }

  // let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      {...thumbProps}
      style={{
        position: 'absolute',
        transform: 'translateX(-50%)',
        left: `${state.getThumbPercent(index) * 100}%`,
        ...style
      }}
      className={props.className}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps)} />
      </VisuallyHidden>
    </div>
  );
}
