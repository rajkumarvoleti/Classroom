function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { GraphQLList, GraphQLNonNull } from 'graphql';
export default class TypeLink extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this.props.type !== nextProps.type;
  }

  render() {
    return renderType(this.props.type, this.props.onClick);
  }

}

_defineProperty(TypeLink, "propTypes", {
  type: PropTypes.object,
  onClick: PropTypes.func
});

function renderType(type, onClick) {
  if (type instanceof GraphQLNonNull) {
    return React.createElement("span", null, renderType(type.ofType, onClick), '!');
  }

  if (type instanceof GraphQLList) {
    return React.createElement("span", null, '[', renderType(type.ofType, onClick), ']');
  }

  return React.createElement("a", {
    className: "type-name",
    onClick: event => {
      event.preventDefault();
      onClick(type, event);
    },
    href: "#"
  }, type.name);
}