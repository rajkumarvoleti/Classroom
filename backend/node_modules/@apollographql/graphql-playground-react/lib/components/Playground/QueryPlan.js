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
exports.QueryPlan = exports.QueryPlanViewer = void 0;

var React = require("react");

var react_redux_1 = require("react-redux");

var styled_1 = require("../../styled");

var selectors_1 = require("../../state/sessions/selectors");

var QueryPlanViewer =
/** @class */
function (_super) {
  __extends(QueryPlanViewer, _super);

  function QueryPlanViewer() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.setRef = function (ref) {
      _this.node = ref;
    };

    return _this;
  }

  QueryPlanViewer.prototype.componentDidMount = function () {
    var CodeMirror = require('codemirror');

    require('codemirror/addon/fold/foldgutter');

    require('codemirror/addon/fold/brace-fold');

    require('codemirror/addon/dialog/dialog');

    require('codemirror/addon/search/search');

    require('codemirror/addon/search/searchcursor');

    require('codemirror/addon/search/jump-to-line');

    require('codemirror/keymap/sublime');

    require('codemirror-graphql/mode');

    this.viewer = CodeMirror(this.node, {
      lineWrapping: true,
      value: this.props.value || '',
      readOnly: true,
      theme: 'graphiql',
      mode: 'graphql',
      keyMap: 'sublime',
      foldGutter: {
        minFoldSize: 4
      },
      gutters: ['CodeMirror-foldgutter'],
      extraKeys: {
        // Persistent search box in Query Editor
        'Cmd-F': 'findPersistent',
        'Ctrl-F': 'findPersistent',
        // Editor improvements
        'Ctrl-Left': 'goSubwordLeft',
        'Ctrl-Right': 'goSubwordRight',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight'
      }
    });
  };

  QueryPlanViewer.prototype.shouldComponentUpdate = function (nextProps) {
    return this.props.value !== nextProps.value;
  };

  QueryPlanViewer.prototype.componentDidUpdate = function () {
    var value = this.props.value || '';
    this.viewer.setValue(value);
  };

  QueryPlanViewer.prototype.componentWillUnmount = function () {
    this.viewer = null;
  };
  /**
   * Public API for retrieving the CodeMirror instance from this
   * React component.
   */


  QueryPlanViewer.prototype.getCodeMirror = function () {
    return this.viewer;
  };
  /**
   * Public API for retrieving the DOM client height for this component.
   */


  QueryPlanViewer.prototype.getClientHeight = function () {
    return this.node && this.node.clientHeight;
  };

  QueryPlanViewer.prototype.render = function () {
    return this.props.isQueryPlanSupported ? /*#__PURE__*/React.createElement(QueryPlanCodeMirror, {
      ref: this.setRef
    }) : /*#__PURE__*/React.createElement(NotSupported, null, "This GraphQL server either doesn't support Apollo Federation, or the query plan extensions is disabled. See the", ' ', /*#__PURE__*/React.createElement("a", {
      target: "_blank",
      rel: "noopener noreferrer",
      href: "https://www.apollographql.com/docs/apollo-server/federation/introduction"
    }, "docs"), ' ', "for setting up query plan viewing with Apollo Federation.");
  };

  return QueryPlanViewer;
}(React.Component);

exports.QueryPlanViewer = QueryPlanViewer;
var QueryPlanCodeMirror = styled_1.styled('div')(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  display: flex;\n  flex: 1;\n  height: 100%;\n\n  .CodeMirror {\n    height: 100%;\n    position: absolute;\n    box-sizing: border-box;\n    background: none;\n    padding-left: 38px;\n  }\n\n  .CodeMirror-cursor {\n    display: none !important;\n  }\n\n  .CodeMirror-scroll {\n    overflow: auto !important;\n    max-width: 50vw;\n    margin-right: 10px;\n  }\n\n  .CodeMirror-sizer {\n    margin-bottom: 0 !important;\n  }\n\n  .CodeMirror-lines {\n    margin: 20px 0;\n    padding: 0;\n  }\n\n  .cm-string {\n    color: ", " !important;\n  }\n\n  // This is a hack to cover a couple holes in our \"almost-graphql\" representation\n  // of the Query Plan result\n  .cm-invalidchar {\n    color: rgba(255, 255, 255, 0.4);\n  }\n"], ["\n  position: relative;\n  display: flex;\n  flex: 1;\n  height: 100%;\n\n  .CodeMirror {\n    height: 100%;\n    position: absolute;\n    box-sizing: border-box;\n    background: none;\n    padding-left: 38px;\n  }\n\n  .CodeMirror-cursor {\n    display: none !important;\n  }\n\n  .CodeMirror-scroll {\n    overflow: auto !important;\n    max-width: 50vw;\n    margin-right: 10px;\n  }\n\n  .CodeMirror-sizer {\n    margin-bottom: 0 !important;\n  }\n\n  .CodeMirror-lines {\n    margin: 20px 0;\n    padding: 0;\n  }\n\n  .cm-string {\n    color: ", " !important;\n  }\n\n  // This is a hack to cover a couple holes in our \"almost-graphql\" representation\n  // of the Query Plan result\n  .cm-invalidchar {\n    color: rgba(255, 255, 255, 0.4);\n  }\n"])), function (p) {
  return p.theme.editorColours.property;
});
var NotSupported = styled_1.styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding: 6px 25px 0;\n  font-size: 14px;\n  color: rgba(241, 143, 1, 1);\n"], ["\n  padding: 6px 25px 0;\n  font-size: 14px;\n  color: rgba(241, 143, 1, 1);\n"])));
exports.QueryPlan = react_redux_1.connect(function (state) {
  return {
    value: selectors_1.getQueryPlan(state),
    isQueryPlanSupported: selectors_1.getIsQueryPlanSupported(state)
  };
})(QueryPlanViewer);
var templateObject_1, templateObject_2;