function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from '../../utility/debounce';
export default class SearchBox extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleChange", event => {
      const value = event.target.value;
      this.setState({
        value
      });
      this.debouncedOnSearch(value);
    });

    _defineProperty(this, "handleClear", () => {
      this.setState({
        value: ''
      });
      this.props.onSearch('');
    });

    this.state = {
      value: props.value || ''
    };
    this.debouncedOnSearch = debounce(200, this.props.onSearch);
  }

  render() {
    return React.createElement("label", {
      className: "search-box"
    }, React.createElement("div", {
      className: "search-box-icon",
      "aria-hidden": "true"
    }, '\u26b2'), React.createElement("input", {
      value: this.state.value,
      onChange: this.handleChange,
      type: "text",
      placeholder: this.props.placeholder,
      "aria-label": this.props.placeholder
    }), this.state.value && React.createElement("button", {
      className: "search-box-clear",
      onClick: this.handleClear,
      "aria-label": "Clear search input"
    }, '\u2715'));
  }

}

_defineProperty(SearchBox, "propTypes", {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onSearch: PropTypes.func
});