function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
/**
 * ToolbarMenu
 *
 * A menu style button to use within the Toolbar.
 */

export class ToolbarMenu extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleOpen", e => {
      preventDefault(e);
      this.setState({
        visible: true
      });

      this._subscribe();
    });

    this.state = {
      visible: false
    };
  }

  componentWillUnmount() {
    this._release();
  }

  render() {
    const visible = this.state.visible;
    return React.createElement("a", {
      className: "toolbar-menu toolbar-button",
      onClick: this.handleOpen.bind(this),
      onMouseDown: preventDefault,
      ref: node => {
        this._node = node;
      },
      title: this.props.title
    }, this.props.label, React.createElement("svg", {
      width: "14",
      height: "8"
    }, React.createElement("path", {
      fill: "#666",
      d: "M 5 1.5 L 14 1.5 L 9.5 7 z"
    })), React.createElement("ul", {
      className: 'toolbar-menu-items' + (visible ? ' open' : '')
    }, this.props.children));
  }

  _subscribe() {
    if (!this._listener) {
      this._listener = this.handleClick.bind(this);
      document.addEventListener('click', this._listener);
    }
  }

  _release() {
    if (this._listener) {
      document.removeEventListener('click', this._listener);
      this._listener = null;
    }
  }

  handleClick(e) {
    if (this._node !== e.target) {
      preventDefault(e);
      this.setState({
        visible: false
      });

      this._release();
    }
  }

}

_defineProperty(ToolbarMenu, "propTypes", {
  title: PropTypes.string,
  label: PropTypes.string
});

export function ToolbarMenuItem({
  onSelect,
  title,
  label
}) {
  return React.createElement("li", {
    onMouseOver: e => {
      e.target.className = 'hover';
    },
    onMouseOut: e => {
      e.target.className = null;
    },
    onMouseDown: preventDefault,
    onMouseUp: onSelect,
    title: title
  }, label);
}
ToolbarMenuItem.propTypes = {
  onSelect: PropTypes.func,
  title: PropTypes.string,
  label: PropTypes.string
};

function preventDefault(e) {
  e.preventDefault();
}