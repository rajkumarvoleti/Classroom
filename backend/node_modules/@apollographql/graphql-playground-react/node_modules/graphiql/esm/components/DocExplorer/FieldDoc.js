function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Argument from './Argument';
import MarkdownContent from './MarkdownContent';
import TypeLink from './TypeLink';
export default class FieldDoc extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field;
  }

  render() {
    const field = this.props.field;
    let argsDef;

    if (field.args && field.args.length > 0) {
      argsDef = React.createElement("div", {
        className: "doc-category"
      }, React.createElement("div", {
        className: "doc-category-title"
      }, 'arguments'), field.args.map(arg => React.createElement("div", {
        key: arg.name,
        className: "doc-category-item"
      }, React.createElement("div", null, React.createElement(Argument, {
        arg: arg,
        onClickType: this.props.onClickType
      })), React.createElement(MarkdownContent, {
        className: "doc-value-description",
        markdown: arg.description
      }))));
    }

    return React.createElement("div", null, React.createElement(MarkdownContent, {
      className: "doc-type-description",
      markdown: field.description || 'No Description'
    }), field.deprecationReason && React.createElement(MarkdownContent, {
      className: "doc-deprecation",
      markdown: field.deprecationReason
    }), React.createElement("div", {
      className: "doc-category"
    }, React.createElement("div", {
      className: "doc-category-title"
    }, 'type'), React.createElement(TypeLink, {
      type: field.type,
      onClick: this.props.onClickType
    })), argsDef);
  }

}

_defineProperty(FieldDoc, "propTypes", {
  field: PropTypes.object,
  onClickType: PropTypes.func
});