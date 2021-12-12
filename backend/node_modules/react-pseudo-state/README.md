# React Pseudo State

The solution for handling pseudo-states when working with a CSS in JS solution.

[![Build Status](https://travis-ci.org/jossmac/react-pseudo-state.svg?branch=master)](https://travis-ci.org/jossmac/react-pseudo-state)

### Install

```bash
yarn add react-pseudo-state
```

### Use

```jsx
import { PseudoState } from 'react-pseudo-state';

const Button = ({ children, ...props }) => (
  <PseudoState>
    {(handlers, snapshot) => (
      <button
        css={{
          background: snapshot.isHover ? 'lightBlue' : 'blue',
          color: snapshot.isActive ? 'slateGray' : 'lightSlateGray',
          outline: snapshot.isFocus && snapshot.focusOrigin === 'keyboard'
            ? '3px dotted blue'
            : null,
        }}
        {...props}
        {...handlers}
      >
        {children}
      </button>
    )}
  </PseudoState>
);
```

A higher-order-component is also provided if that's more your speed:

```jsx
import { withPseudoState } from 'react-pseudo-state';

const ButtonElement = ({ isActive, ...props }) => (
  <button css={{ color: isActive ? 'slateGray' : 'lightSlateGray' }} {...props} />
);

export const Button = withPseudoState(ButtonElement);
```

### Keyboard support

The native browser behaviour is that `Enter` is for anchors and buttons, whilst `Space` is only called on buttons. To stay compliant it's recommended to dynamically populate the `keyboardSupport` property.

The shape of `keyboardSupport` is described below in the [Types section](#types). It will default to `'auto'`, which sniffs the event target for a node type.

```jsx
import { PseudoState } from 'react-pseudo-state';

const Button = (props) => (
  <PseudoState keyboardSupport={props.href ? 'enter' : 'both'}>
    {(handlers, snapshot) => props.href ? <a /> : <button />)}
  </PseudoState>
);
```

### Types

The first argument to the `children` function is an object of handlers, which must be spread onto the node returned from `children`:

```jsx
type Handlers = {
  onBlur: () => mixed,
  onFocus: () => mixed,
  onKeyDown?: (event: SyntheticKeyboardEvent<HTMLElement>) => mixed,
  onKeyUp?: (event: SyntheticKeyboardEvent<HTMLElement>) => mixed,
  onMouseDown: () => mixed,
  onMouseEnter: () => mixed,
  onMouseLeave: () => mixed,
  onMouseUp: () => mixed,
  onTouchEnd: () => mixed,
  onTouchStart: () => mixed,
};
```

The second argument is the snapshot, or current state of the element:

```jsx
type Snapshot = {
  focusOrigin: null | 'keyboard' | 'mouse',
  isActive: boolean,
  isFocus: boolean,
  isHover: boolean,
};
```

The actual `PseudoState` component only has two properties:

```jsx
type Props = {
  children: (Handlers, Snapshot) => React$Node,
  keyboardSupport: 'auto' | 'enter' | 'space' | 'both' | 'none',
};
```
