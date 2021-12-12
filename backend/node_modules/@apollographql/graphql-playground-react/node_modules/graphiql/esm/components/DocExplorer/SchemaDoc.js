function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import TypeLink from './TypeLink';
import MarkdownContent from './MarkdownContent'; // Render the top level Schema

export default class SchemaDoc extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.schema !== nextProps.schema;
  }

  render() {
    const schema = this.props.schema;
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType && schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType && schema.getSubscriptionType();
    return React.createElement("div", null, React.createElement(MarkdownContent, {
      className: "doc-type-description",
      markdown: 'A GraphQL schema provides a root type for each kind of operation.'
    }), React.createElement("div", {
      className: "doc-category"
    }, React.createElement("div", {
      className: "doc-category-title"
    }, 'root types'), React.createElement("div", {
      className: "doc-category-item"
    }, React.createElement("span", {
      className: "keyword"
    }, 'query'), ': ', React.createElement(TypeLink, {
      type: queryType,
      onClick: this.props.onClickType
    })), mutationType && React.createElement("div", {
      className: "doc-category-item"
    }, React.createElement("span", {
      className: "keyword"
    }, 'mutation'), ': ', React.createElement(TypeLink, {
      type: mutationType,
      onClick: this.props.onClickType
    })), subscriptionType && React.createElement("div", {
      className: "doc-category-item"
    }, React.createElement("span", {
      className: "keyword"
    }, 'subscription'), ': ', React.createElement(TypeLink, {
      type: subscriptionType,
      onClick: this.props.onClickType
    }))));
  }

}

_defineProperty(SchemaDoc, "propTypes", {
  schema: PropTypes.object,
  onClickType: PropTypes.func
});