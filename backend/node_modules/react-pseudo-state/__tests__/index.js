import React from 'react';
import { shallow } from 'enzyme';

import PseudoState from '../src/PseudoState';

describe('PseudoState', () => {
  test('smoke test', () => {
    const wrapper = shallow(<PseudoState>{props => <div {...props} />}</PseudoState>);
    expect(wrapper.exists).toBeTruthy();
  });

  test('initial state', () => {
    const wrapper = shallow(<PseudoState>{props => <div {...props} />}</PseudoState>);

    expect(wrapper.state('focusOrigin')).toBe(null);
    expect(wrapper.state('isActive')).toBe(false);
    expect(wrapper.state('isFocus')).toBe(false);
    expect(wrapper.state('isHover')).toBe(false);
  });

  test('mouse interactions', () => {
    const wrapper = shallow(<PseudoState>{props => <div {...props} />}</PseudoState>);

    // setup

    wrapper.simulate('mouseenter');
    expect(wrapper.state('isHover')).toBe(true);

    wrapper.simulate('mousedown');
    expect(wrapper.state('isActive')).toBe(true);

    wrapper.simulate('focus');
    expect(wrapper.state('isFocus')).toBe(true);
    expect(wrapper.state('focusOrigin')).toBe('mouse');

    // teardown

    wrapper.simulate('mouseup');
    expect(wrapper.state('isActive')).toBe(false);

    wrapper.simulate('mouseleave');
    expect(wrapper.state('isHover')).toBe(false);

    wrapper.simulate('blur');
    expect(wrapper.state('isFocus')).toBe(false);
    expect(wrapper.state('focusOrigin')).toBe(null);
  });

  test('keyboard interactions', () => {
    const wrapper = shallow(
      <PseudoState keyboardSupport="enter">{props => <div {...props} />}</PseudoState>
    );
    const ENTER = { keyCode: 13, which: 13, key: 'Enter' };
    const SPACE = { keyCode: 32, which: 32, key: ' ' };

    // some invalid key
    wrapper.simulate('keydown', { keyCode: 16, key: 'Shift' });
    expect(wrapper.state('isActive')).toBe(false);

    // enter
    wrapper.simulate('keydown', ENTER);
    expect(wrapper.state('isActive')).toBe(true);

    wrapper.simulate('keyup', ENTER);
    expect(wrapper.state('isActive')).toBe(false);

    // space: not allowed yet
    wrapper.simulate('keydown', SPACE);
    expect(wrapper.state('isActive')).toBe(false);

    // allow both enter and space
    wrapper.setProps({ keyboardSupport: 'both' });

    // space: should work now
    wrapper.simulate('keydown', SPACE);
    expect(wrapper.state('isActive')).toBe(true);

    wrapper.simulate('keyup', SPACE);
    expect(wrapper.state('isActive')).toBe(false);

    // tabbing and focusOrigin. simulating keydown of tab not working, so we
    // explicitly set `tabIsDown` on the class instance.
    wrapper.instance().tabIsDown = true;
    wrapper.simulate('focus');
    expect(wrapper.state('focusOrigin')).toBe('keyboard');

    wrapper.instance().tabIsDown = false;
    wrapper.simulate('blur');
    expect(wrapper.state('focusOrigin')).toBe(null);
  });

  test('touch interactions', () => {
    const wrapper = shallow(<PseudoState>{props => <div {...props} />}</PseudoState>);

    wrapper.simulate('touchstart');
    expect(wrapper.state('isActive')).toBe(true);

    wrapper.simulate('touchend');
    expect(wrapper.state('isActive')).toBe(false);
  });
});
