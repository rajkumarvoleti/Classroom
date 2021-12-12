function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import MD from 'markdown-it';
const md = new MD();
export default class MarkdownContent extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.markdown !== nextProps.markdown;
  }

  render() {
    const markdown = this.props.markdown;

    if (!markdown) {
      return React.createElement("div", null);
    }

    return React.createElement("div", {
      className: this.props.className,
      dangerouslySetInnerHTML: {
        __html: md.render(markdown)
      }
    });
  }

}

_defineProperty(MarkdownContent, "propTypes", {
  markdown: PropTypes.string,
  className: PropTypes.string
});