function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 *  Copyright (c) 2019 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { GraphQLSchema, isType } from 'graphql';
import FieldDoc from './DocExplorer/FieldDoc';
import SchemaDoc from './DocExplorer/SchemaDoc';
import SearchBox from './DocExplorer/SearchBox';
import SearchResults from './DocExplorer/SearchResults';
import TypeDoc from './DocExplorer/TypeDoc';
const initialNav = {
  name: 'Schema',
  title: 'Documentation Explorer'
};
/**
 * DocExplorer
 *
 * Shows documentations for GraphQL definitions from the schema.
 *
 * Props:
 *
 *   - schema: A required GraphQLSchema instance that provides GraphQL document
 *     definitions.
 *
 * Children:
 *
 *   - Any provided children will be positioned in the right-hand-side of the
 *     top bar. Typically this will be a "close" button for temporary explorer.
 *
 */

export class DocExplorer extends React.Component {
  constructor() {
    super();

    _defineProperty(this, "handleNavBackClick", () => {
      if (this.state.navStack.length > 1) {
        this.setState({
          navStack: this.state.navStack.slice(0, -1)
        });
      }
    });

    _defineProperty(this, "handleClickTypeOrField", typeOrField => {
      this.showDoc(typeOrField);
    });

    _defineProperty(this, "handleSearch", value => {
      this.showSearch(value);
    });

    this.state = {
      navStack: [initialNav]
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.schema !== nextProps.schema || this.state.navStack !== nextState.navStack;
  }

  render() {
    const schema = this.props.schema;
    const navStack = this.state.navStack;
    const navItem = navStack[navStack.length - 1];
    let content;

    if (schema === undefined) {
      // Schema is undefined when it is being loaded via introspection.
      content = React.createElement("div", {
        className: "spinner-container"
      }, React.createElement("div", {
        className: "spinner"
      }));
    } else if (!schema) {
      // Schema is null when it explicitly does not exist, typically due to
      // an error during introspection.
      content = React.createElement("div", {
        className: "error-container"
      }, 'No Schema Available');
    } else if (navItem.search) {
      content = React.createElement(SearchResults, {
        searchValue: navItem.search,
        withinType: navItem.def,
        schema: schema,
        onClickType: this.handleClickTypeOrField,
        onClickField: this.handleClickTypeOrField
      });
    } else if (navStack.length === 1) {
      content = React.createElement(SchemaDoc, {
        schema: schema,
        onClickType: this.handleClickTypeOrField
      });
    } else if (isType(navItem.def)) {
      content = React.createElement(TypeDoc, {
        schema: schema,
        type: navItem.def,
        onClickType: this.handleClickTypeOrField,
        onClickField: this.handleClickTypeOrField
      });
    } else {
      content = React.createElement(FieldDoc, {
        field: navItem.def,
        onClickType: this.handleClickTypeOrField
      });
    }

    const shouldSearchBoxAppear = navStack.length === 1 || isType(navItem.def) && navItem.def.getFields;
    let prevName;

    if (navStack.length > 1) {
      prevName = navStack[navStack.length - 2].name;
    }

    return React.createElement("section", {
      className: "doc-explorer",
      key: navItem.name,
      "aria-label": "Documentation Explorer"
    }, React.createElement("div", {
      className: "doc-explorer-title-bar"
    }, prevName && React.createElement("button", {
      className: "doc-explorer-back",
      onClick: this.handleNavBackClick,
      "aria-label": `Go back to ${prevName}`
    }, prevName), React.createElement("div", {
      className: "doc-explorer-title"
    }, navItem.title || navItem.name), React.createElement("div", {
      className: "doc-explorer-rhs"
    }, this.props.children)), React.createElement("div", {
      className: "doc-explorer-contents"
    }, shouldSearchBoxAppear && React.createElement(SearchBox, {
      value: navItem.search,
      placeholder: `Search ${navItem.name}...`,
      onSearch: this.handleSearch
    }), content));
  } // Public API


  showDoc(typeOrField) {
    const navStack = this.state.navStack;
    const topNav = navStack[navStack.length - 1];

    if (topNav.def !== typeOrField) {
      this.setState({
        navStack: navStack.concat([{
          name: typeOrField.name,
          def: typeOrField
        }])
      });
    }
  } // Public API


  showDocForReference(reference) {
    if (reference.kind === 'Type') {
      this.showDoc(reference.type);
    } else if (reference.kind === 'Field') {
      this.showDoc(reference.field);
    } else if (reference.kind === 'Argument' && reference.field) {
      this.showDoc(reference.field);
    } else if (reference.kind === 'EnumValue' && reference.type) {
      this.showDoc(reference.type);
    }
  } // Public API


  showSearch(search) {
    const navStack = this.state.navStack.slice();
    const topNav = navStack[navStack.length - 1];
    navStack[navStack.length - 1] = { ...topNav,
      search
    };
    this.setState({
      navStack
    });
  }

  reset() {
    this.setState({
      navStack: [initialNav]
    });
  }

}

_defineProperty(DocExplorer, "propTypes", {
  schema: PropTypes.instanceOf(GraphQLSchema)
});