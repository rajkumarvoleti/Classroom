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
 * ToolbarButton
 *
 * A button to use within the Toolbar.
 */

export class ToolbarButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleClick", () => {
      try {
        this.props.onClick();
        this.setState({
          error: null
        });
      } catch (error) {
        this.setState({
          error
        });
      }
    });

    this.state = {
      error: null
    };
  }

  render() {
    const {
      error
    } = this.state;
    return React.createElement("button", {
      className: 'toolbar-button' + (error ? ' error' : ''),
      onClick: this.handleClick,
      title: error ? error.message : this.props.title,
      "aria-invalid": error ? 'true' : 'false'
    }, this.props.label);
  }

}

_defineProperty(ToolbarButton, "propTypes", {
  onClick: PropTypes.func,
  title: PropTypes.string,
  label: PropTypes.string
});