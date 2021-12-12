function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { GraphQLSchema, GraphQLObjectType, GraphQLInterfaceType, GraphQLUnionType, GraphQLEnumType } from 'graphql';
import Argument from './Argument';
import MarkdownContent from './MarkdownContent';
import TypeLink from './TypeLink';
import DefaultValue from './DefaultValue';
export default class TypeDoc extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleShowDeprecated", () => this.setState({
      showDeprecated: true
    }));

    this.state = {
      showDeprecated: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.type !== nextProps.type || this.props.schema !== nextProps.schema || this.state.showDeprecated !== nextState.showDeprecated;
  }

  render() {
    const schema = this.props.schema;
    const type = this.props.type;
    const onClickType = this.props.onClickType;
    const onClickField = this.props.onClickField;
    let typesTitle;
    let types;

    if (type instanceof GraphQLUnionType) {
      typesTitle = 'possible types';
      types = schema.getPossibleTypes(type);
    } else if (type instanceof GraphQLInterfaceType) {
      typesTitle = 'implementations';
      types = schema.getPossibleTypes(type);
    } else if (type instanceof GraphQLObjectType) {
      typesTitle = 'implements';
      types = type.getInterfaces();
    }

    let typesDef;

    if (types && types.length > 0) {
      typesDef = React.createElement("div", {
        className: "doc-category"
      }, React.createElement("div", {
        className: "doc-category-title"
      }, typesTitle), types.map(subtype => React.createElement("div", {
        key: subtype.name,
        className: "doc-category-item"
      }, React.createElement(TypeLink, {
        type: subtype,
        onClick: onClickType
      }))));
    } // InputObject and Object


    let fieldsDef;
    let deprecatedFieldsDef;

    if (type.getFields) {
      const fieldMap = type.getFields();
      const fields = Object.keys(fieldMap).map(name => fieldMap[name]);
      fieldsDef = React.createElement("div", {
        className: "doc-category"
      }, React.createElement("div", {
        className: "doc-category-title"
      }, 'fields'), fields.filter(field => !field.isDeprecated).map(field => React.createElement(Field, {
        key: field.name,
        type: type,
        field: field,
        onClickType: onClickType,
        onClickField: onClickField
      })));
      const deprecatedFields = fields.filter(field => field.isDeprecated);

      if (deprecatedFields.length > 0) {
        deprecatedFieldsDef = React.createElement("div", {
          className: "doc-category"
        }, React.createElement("div", {
          className: "doc-category-title"
        }, 'deprecated fields'), !this.state.showDeprecated ? React.createElement("button", {
          className: "show-btn",
          onClick: this.handleShowDeprecated
        }, 'Show deprecated fields...') : deprecatedFields.map(field => React.createElement(Field, {
          key: field.name,
          type: type,
          field: field,
          onClickType: onClickType,
          onClickField: onClickField
        })));
      }
    }

    let valuesDef;
    let deprecatedValuesDef;

    if (type instanceof GraphQLEnumType) {
      const values = type.getValues();
      valuesDef = React.createElement("div", {
        className: "doc-category"
      }, React.createElement("div", {
        className: "doc-category-title"
      }, 'values'), values.filter(value => !value.isDeprecated).map(value => React.createElement(EnumValue, {
        key: value.name,
        value: value
      })));
      const deprecatedValues = values.filter(value => value.isDeprecated);

      if (deprecatedValues.length > 0) {
        deprecatedValuesDef = React.createElement("div", {
          className: "doc-category"
        }, React.createElement("div", {
          className: "doc-category-title"
        }, 'deprecated values'), !this.state.showDeprecated ? React.createElement("button", {
          className: "show-btn",
          onClick: this.handleShowDeprecated
        }, 'Show deprecated values...') : deprecatedValues.map(value => React.createElement(EnumValue, {
          key: value.name,
          value: value
        })));
      }
    }

    return React.createElement("div", null, React.createElement(MarkdownContent, {
      className: "doc-type-description",
      markdown: type.description || 'No Description'
    }), type instanceof GraphQLObjectType && typesDef, fieldsDef, deprecatedFieldsDef, valuesDef, deprecatedValuesDef, !(type instanceof GraphQLObjectType) && typesDef);
  }

}

_defineProperty(TypeDoc, "propTypes", {
  schema: PropTypes.instanceOf(GraphQLSchema),
  type: PropTypes.object,
  onClickType: PropTypes.func,
  onClickField: PropTypes.func
});

function Field({
  type,
  field,
  onClickType,
  onClickField
}) {
  return React.createElement("div", {
    className: "doc-category-item"
  }, React.createElement("a", {
    className: "field-name",
    onClick: event => onClickField(field, type, event)
  }, field.name), field.args && field.args.length > 0 && ['(', React.createElement("span", {
    key: "args"
  }, field.args.map(arg => React.createElement(Argument, {
    key: arg.name,
    arg: arg,
    onClickType: onClickType
  }))), ')'], ': ', React.createElement(TypeLink, {
    type: field.type,
    onClick: onClickType
  }), React.createElement(DefaultValue, {
    field: field
  }), field.description && React.createElement(MarkdownContent, {
    className: "field-short-description",
    markdown: field.description
  }), field.deprecationReason && React.createElement(MarkdownContent, {
    className: "doc-deprecation",
    markdown: field.deprecationReason
  }));
}

Field.propTypes = {
  type: PropTypes.object,
  field: PropTypes.object,
  onClickType: PropTypes.func,
  onClickField: PropTypes.func
};

function EnumValue({
  value
}) {
  return React.createElement("div", {
    className: "doc-category-item"
  }, React.createElement("div", {
    className: "enum-value"
  }, value.name), React.createElement(MarkdownContent, {
    className: "doc-value-description",
    markdown: value.description
  }), value.deprecationReason && React.createElement(MarkdownContent, {
    className: "doc-deprecation",
    markdown: value.deprecationReason
  }));
}

EnumValue.propTypes = {
  value: PropTypes.object
};