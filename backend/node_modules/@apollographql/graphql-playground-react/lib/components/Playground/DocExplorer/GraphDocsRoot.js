"use strict";

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __makeTemplateObject = void 0 && (void 0).__makeTemplateObject || function (cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", {
      value: raw
    });
  } else {
    cooked.raw = raw;
  }

  return cooked;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var React = require("react");

var TypeLink_1 = require("./TypeLink");

var stack_1 = require("../util/stack");

var DocsStyles_1 = require("./DocsStyles");

var styled_1 = require("../../../styled");

var GraphDocsRoot =
/** @class */
function (_super) {
  __extends(GraphDocsRoot, _super);

  function GraphDocsRoot() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GraphDocsRoot.prototype.render = function () {
    var _a = this.props,
        schema = _a.schema,
        sessionId = _a.sessionId;
    var obj = stack_1.serializeRoot(schema);
    return /*#__PURE__*/React.createElement(DocsRoot, {
      className: "doc-root"
    }, /*#__PURE__*/React.createElement(ShowRootType, {
      name: "Queries",
      fields: obj.queries,
      offset: 0,
      sessionId: sessionId
    }), obj.mutations.length > 0 && /*#__PURE__*/React.createElement(ShowRootType, {
      name: "Mutations",
      fields: obj.mutations,
      offset: obj.queries.length,
      sessionId: sessionId
    }), obj.subscriptions.length > 0 && /*#__PURE__*/React.createElement(ShowRootType, {
      name: "Subscriptions",
      fields: obj.subscriptions,
      offset: obj.queries.length + obj.mutations.length,
      sessionId: sessionId
    }));
  };

  return GraphDocsRoot;
}(React.PureComponent);

exports["default"] = GraphDocsRoot;

function ShowRootType(_a) {
  var name = _a.name,
      fields = _a.fields,
      offset = _a.offset;
  var nonDeprecatedFields = fields.filter(function (data) {
    return !data.isDeprecated;
  });
  var deprecatedFields = fields.filter(function (data) {
    return data.isDeprecated;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DocsStyles_1.CategoryTitle, null, name), nonDeprecatedFields.map(function (field, index) {
    return /*#__PURE__*/React.createElement(TypeLink_1["default"], {
      key: field.name,
      type: field,
      x: 0,
      y: offset + index,
      collapsable: true,
      lastActive: false
    });
  }), deprecatedFields.length > 0 && /*#__PURE__*/React.createElement("br", null), deprecatedFields.map(function (field, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: field.name
    }, /*#__PURE__*/React.createElement(DocsValueComment, null, "# Deprecated: ", field.deprecationReason), /*#__PURE__*/React.createElement(TypeLink_1["default"], {
      type: field,
      x: 0,
      y: offset + index + nonDeprecatedFields.length,
      collapsable: true,
      lastActive: false
    }));
  }));
}

var DocsRoot = styled_1.styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-left: 6px;\n\n  .doc-category-item .field-name {\n    color: #f25c54;\n  }\n"], ["\n  padding-left: 6px;\n\n  .doc-category-item .field-name {\n    color: #f25c54;\n  }\n"])));
var DocsValueComment = styled_1.styled.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  color: ", ";\n  padding-right: 16px;\n  padding-left: 16px;\n"], ["\n  color: ", ";\n  padding-right: 16px;\n  padding-left: 16px;\n"])), function (p) {
  return p.theme.colours.black50;
});
var templateObject_1, templateObject_2;