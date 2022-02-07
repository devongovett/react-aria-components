import {MenuTrigger, Menu, Item} from './Menu';
import {Button} from './Button';
import {Popover} from './Popover';
import clsx from 'clsx';
import {OverlayProvider} from 'react-aria';
import {Select, Value} from './Select';
import {ListBox} from './ListBox';
import {ComboBox, Input} from './ComboBox';
import {Label} from './Label';
import {Slider, Track, Thumb, Output} from './Slider';

export function App() {
  return (
    <OverlayProvider>
      <MenuTrigger>
        <Button>Hi</Button>
        <Popover>
          <Menu className="menu">
            <Item className={itemClass}>Foo</Item>
            <Item className={itemClass}>Bar</Item>
            <Item className={itemClass}>Baz</Item>
          </Menu>
        </Popover>
      </MenuTrigger>
      <Select>
        <Label style={{display: 'block'}}>Test</Label>
        <Button>
          <Value />
          <span aria-hidden="true" style={{ paddingLeft: 5 }}>▼</span>
        </Button>
        <Popover>
          <ListBox className="menu">
            <Item className={itemClass}>Foo</Item>
            <Item className={itemClass}>Bar</Item>
            <Item className={itemClass}>Baz</Item>
          </ListBox>
        </Popover>
      </Select>
      <ComboBox>
        <Label style={{display: 'block'}}>Test</Label>
        <div style={{display: 'flex'}}>
          <Input />
          <Button>
            <span aria-hidden="true" style={{ padding: '0 2px' }}>▼</span>
          </Button>
        </div>
        <Popover placement="bottom end">
          <ListBox className="menu">
            <Item className={itemClass}>Foo</Item>
            <Item className={itemClass}>Bar</Item>
            <Item className={itemClass}>Baz</Item>
          </ListBox>
        </Popover>
      </ComboBox>
      <Slider
        defaultValue={[30, 60]}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 300,
          touchAction: 'none'
        }}>
        <div style={{ display: 'flex', alignSelf: 'stretch' }}>
          <Label>Test</Label>
          <Output style={{ flex: '1 0 auto', textAlign: 'end' }}>
            {state => `${state.getThumbValueLabel(0)} - ${state.getThumbValueLabel(1)}`}
          </Output>
        </div>
        <Track
          style={{
            position: 'relative',
            height: 30,
            width: '100%'
          }}>
          <div
            style={{
              position: 'absolute',
              backgroundColor: 'gray',
              height: 3,
              top: 13,
              width: '100%'
            }} />
          <CustomThumb index={0} />
          <CustomThumb index={1} />
        </Track>
      </Slider>
    </OverlayProvider>
  );
}

function itemClass({isFocused}) {
  return clsx('item', {
    focused: isFocused
  })
}

function CustomThumb({index}) {
  return (
    <Thumb
      index={index}
      style={({isDragging}) => ({
        width: 20,
        height: 20,
        borderRadius: '50%',
        top: 4,
        backgroundColor: isDragging
          ? 'dimgrey'
          : 'gray'
      })} />
    )
}
