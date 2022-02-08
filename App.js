import {MenuTrigger, Menu, Item} from './Menu';
import {Button} from './Button';
import {Popover} from './Popover';
import clsx from 'clsx';
import {OverlayProvider} from 'react-aria';
import {Select, Value} from './Select';
import {ListBox} from './ListBox';
import {ComboBox} from './ComboBox';
import {Input} from './Input';
import {Label} from './Label';
import {Slider, Track, Thumb, Output} from './Slider';
import {DialogTrigger, Modal, Dialog} from './Dialog';
import {TooltipTrigger, Tooltip} from './Tooltip';
import {NumberField, IncrementButton, DecrementButton} from './NumberField';
import {Group} from './Group';
import {Calendar, RangeCalendar, CalendarHeader, CalendarGrid, CalendarNextButton, CalendarPreviousButton} from './Calendar';
import {DateField, DateInput, DateSegment} from './DateField';
import {DatePicker} from './DatePicker';

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
      <NumberField>
        <Label>Test</Label>
        <Group style={{display: 'flex'}}>
          <DecrementButton>-</DecrementButton>
          <Input />
          <IncrementButton>+</IncrementButton>
        </Group>
      </NumberField>
      <DialogTrigger>
        <Button>Open modal</Button>
        <Modal
          style={{
            position: 'fixed',
            zIndex: 100,
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Dialog style={{
            background: 'Canvas',
            color: 'CanvasText',
            border: '1px solid gray',
            padding: 30
          }}>
            {({close}) => (
              <form style={{display: 'flex', flexDirection: 'column'}}>
                <label>
                  First Name: <input placeholder="John" />
                </label>
                <label>
                  Last Name: <input placeholder="Smith" />
                </label>
                <Button onPress={close} style={{marginTop: 10}}>
                  Submit
                </Button>
              </form>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
      <DialogTrigger>
        <Button>Open popover</Button>
        <Popover placement="bottom start">
          <Dialog style={{
            background: 'Canvas',
            color: 'CanvasText',
            border: '1px solid gray',
            padding: 30
          }}>
            {({close}) => (
              <form style={{display: 'flex', flexDirection: 'column'}}>
                <label>
                  First Name: <input placeholder="John" />
                </label>
                <label>
                  Last Name: <input placeholder="Smith" />
                </label>
                <Button onPress={close} style={{marginTop: 10}}>
                  Submit
                </Button>
              </form>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
      <TooltipTrigger offset={5}>
        <Button>Tooltip trigger</Button>
        <Tooltip 
          style={{
            background: 'Canvas',
            color: 'CanvasText',
            border: '1px solid gray',
            padding: 5
          }}>
          I am a tooltip
        </Tooltip>
      </TooltipTrigger>
      <Calendar style={{width: 220}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarPreviousButton>&lt;</CalendarPreviousButton>
          <CalendarHeader style={{ flex: 1, textAlign: 'center' }} />
          <CalendarNextButton>&gt;</CalendarNextButton>
        </div>
        <CalendarGrid style={{ width: "100%" }}>
          {({ formattedDate, isSelected, isOutsideMonth }) => (
            <div hidden={isOutsideMonth} style={{textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''}}>
              {formattedDate}
            </div>
          )}
        </CalendarGrid>
      </Calendar>
      <RangeCalendar style={{width: 220}}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarPreviousButton>&lt;</CalendarPreviousButton>
          <CalendarHeader style={{ flex: 1, textAlign: 'center' }} />
          <CalendarNextButton>&gt;</CalendarNextButton>
        </div>
        <CalendarGrid style={{ width: "100%" }}>
          {({ formattedDate, isSelected, isOutsideMonth }) => (
            <div hidden={isOutsideMonth} style={{textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''}}>
              {formattedDate}
            </div>
          )}
        </CalendarGrid>
      </RangeCalendar>
      <DateField>
        <Label style={{display: 'block'}}>Date</Label>
        <DateInput className="field">
          {segment => <DateSegment segment={segment} className={clsx('segment', {placeholder: segment.isPlaceholder})} />}
        </DateInput>
      </DateField>
      <DatePicker>
        <Label style={{display: 'block'}}>Date</Label>
        <Group style={{display: 'inline-flex'}}>
          <DateInput className="field">
            {segment => <DateSegment segment={segment} className={clsx('segment', {placeholder: segment.isPlaceholder})} />}
          </DateInput>
          <Button>🗓</Button>
        </Group>
        <Popover placement="bottom start" style={{
          background: 'Canvas',
          color: 'CanvasText',
          border: '1px solid gray',
          padding: 20
        }}>
          <Calendar style={{width: 220}}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <CalendarPreviousButton>&lt;</CalendarPreviousButton>
              <CalendarHeader style={{ flex: 1, textAlign: 'center' }} />
              <CalendarNextButton>&gt;</CalendarNextButton>
            </div>
            <CalendarGrid style={{ width: "100%" }}>
              {({ formattedDate, isSelected, isOutsideMonth }) => (
                <div hidden={isOutsideMonth} style={{textAlign: 'center', cursor: 'default', background: isSelected ? 'blue' : ''}}>
                  {formattedDate}
                </div>
              )}
            </CalendarGrid>
          </Calendar>
        </Popover>
      </DatePicker>
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
