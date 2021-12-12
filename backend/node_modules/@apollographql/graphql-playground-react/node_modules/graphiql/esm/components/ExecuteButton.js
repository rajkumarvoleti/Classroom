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
 * ExecuteButton
 *
 * What a nice round shiny button. Shows a drop-down when there are multiple
 * queries to run.
 */

export class ExecuteButton extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "_onClick", () => {
      if (this.props.isRunning) {
        this.props.onStop();
      } else {
        this.props.onRun();
      }
    });

    _defineProperty(this, "_onOptionSelected", operation => {
      this.setState({
        optionsOpen: false
      });
      this.props.onRun(operation.name && operation.name.value);
    });

    _defineProperty(this, "_onOptionsOpen", downEvent => {
      let initialPress = true;
      const downTarget = downEvent.target;
      this.setState({
        highlight: null,
        optionsOpen: true
      });

      let onMouseUp = upEvent => {
        if (initialPress && upEvent.target === downTarget) {
          initialPress = false;
        } else {
          document.removeEventListener('mouseup', onMouseUp);
          onMouseUp = null;
          const isOptionsMenuClicked = downTarget.parentNode.compareDocumentPosition(upEvent.target) & Node.DOCUMENT_POSITION_CONTAINED_BY;

          if (!isOptionsMenuClicked) {
            // menu calls setState if it was clicked
            this.setState({
              optionsOpen: false
            });
          }
        }
      };

      document.addEventListener('mouseup', onMouseUp);
    });

    this.state = {
      optionsOpen: false,
      highlight: null
    };
  }

  render() {
    const operations = this.props.operations;
    const optionsOpen = this.state.optionsOpen;
    const hasOptions = operations && operations.length > 1;
    let options = null;

    if (hasOptions && optionsOpen) {
      const highlight = this.state.highlight;
      options = React.createElement("ul", {
        className: "execute-options"
      }, operations.map(operation => React.createElement("li", {
        key: operation.name ? operation.name.value : '*',
        className: operation === highlight ? 'selected' : undefined,
        onMouseOver: () => this.setState({
          highlight: operation
        }),
        onMouseOut: () => this.setState({
          highlight: null
        }),
        onMouseUp: () => this._onOptionSelected(operation)
      }, operation.name ? operation.name.value : '<Unnamed>')));
    } // Allow click event if there is a running query or if there are not options
    // for which operation to run.


    let onClick;

    if (this.props.isRunning || !hasOptions) {
      onClick = this._onClick;
    } // Allow mouse down if there is no running query, there are options for
    // which operation to run, and the dropdown is currently closed.


    let onMouseDown;

    if (!this.props.isRunning && hasOptions && !optionsOpen) {
      onMouseDown = this._onOptionsOpen;
    }

    const pathJSX = this.props.isRunning ? React.createElement("path", {
      d: "M 10 10 L 23 10 L 23 23 L 10 23 z"
    }) : React.createElement("path", {
      d: "M 11 9 L 24 16 L 11 23 z"
    });
    return React.createElement("div", {
      className: "execute-button-wrap"
    }, React.createElement("button", {
      type: "button",
      className: "execute-button",
      onMouseDown: onMouseDown,
      onClick: onClick,
      title: "Execute Query (Ctrl-Enter)"
    }, React.createElement("svg", {
      width: "34",
      height: "34"
    }, pathJSX)), options);
  }

}

_defineProperty(ExecuteButton, "propTypes", {
  onRun: PropTypes.func,
  onStop: PropTypes.func,
  isRunning: PropTypes.bool,
  operations: PropTypes.array
});