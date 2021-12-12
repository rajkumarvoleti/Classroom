'use strict';

var _extends = require('@babel/runtime/helpers/extends');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var core = require('@emotion/core');
var client = require('@apollo/client');
var Select = require('@arch-ui/select');
var reactSelect = require('react-select');
require('intersection-observer');
var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Select__default = /*#__PURE__*/_interopDefault(Select);

function useIntersectionObserver(cb, ref) {
  React.useEffect(() => {
    let observer = new IntersectionObserver(cb, {});
    let node = ref.current;

    if (node !== null) {
      observer.observe(node);
      return () => observer.unobserve(node);
    }
  });
}

const initialItemsToLoad = 10;
const subsequentItemsToLoad = 50; // to use hooks in render props

const Relationship = /*#__PURE__*/React.forwardRef(({
  data,
  loading,
  value,
  refList,
  canRead,
  isMulti,
  search,
  autoFocus,
  serverErrors,
  onChange,
  htmlID,
  setSearch,
  selectProps,
  fetchMore,
  isDisabled
}, ref) => {
  const options = data && data[refList.gqlNames.listQueryName] ? data[refList.gqlNames.listQueryName].map(val => ({
    value: val,
    label: val._label_
  })) : [];
  const serverError = serverErrors && serverErrors.find(error => error instanceof Error && error.name === 'AccessDeniedError');
  let currentValue = null;

  const getOption = value => typeof value === 'string' ? options.find(opt => opt.value.id === value) || {
    label: value,
    value: value
  } : {
    label: value._label_,
    value: value
  };

  if (value !== null && canRead) {
    if (isMulti) {
      currentValue = (Array.isArray(value) ? value : []).map(getOption);
    } else if (value) {
      currentValue = getOption(value);
    }
  }

  const count = data && data[refList.gqlNames.listQueryMetaName] ? data[refList.gqlNames.listQueryMetaName].count : 0;
  const selectComponents = React.useMemo(() => ({
    MenuList: (_ref) => {
      let {
        children
      } = _ref,
          props = _objectWithoutProperties(_ref, ["children"]);

      const loadingRef = React.useRef(null);
      const QUERY = client.gql`
            query RelationshipSelectMore($search: String!, $first: Int!, $skip: Int!) {
              ${refList.gqlNames.listQueryName}(search: $search, first: $first, skip: $skip) {
                _label_
                id
              }
            }
          `;
      useIntersectionObserver(([{
        isIntersecting
      }]) => {
        if (!props.isLoading && isIntersecting && props.options.length < count) {
          fetchMore({
            query: QUERY,
            variables: {
              search,
              first: subsequentItemsToLoad,
              skip: props.options.length
            },
            updateQuery: (prev, {
              fetchMoreResult
            }) => {
              if (!fetchMoreResult) return prev;
              return _objectSpread(_objectSpread({}, prev), {}, {
                [refList.gqlNames.listQueryName]: [...prev[refList.gqlNames.listQueryName], ...fetchMoreResult[refList.gqlNames.listQueryName]]
              });
            }
          });
        }
      }, loadingRef);
      return core.jsx(reactSelect.components.MenuList, props, children, core.jsx("div", {
        css: {
          textAlign: 'center'
        },
        ref: loadingRef
      }, props.options.length < count && core.jsx("span", {
        css: {
          padding: 8
        }
      }, "Loading...")));
    }
  }), [count, refList.gqlNames.listQueryName]);
  return core.jsx(Select__default['default'] // this is necessary because react-select passes a second argument to onInputChange
  // and useState setters log a warning if a second argument is passed
  , _extends({
    onInputChange: val => setSearch(val),
    isLoading: loading,
    autoFocus: autoFocus,
    isMulti: isMulti,
    components: selectComponents,
    getOptionValue: option => option.value.id,
    value: currentValue,
    placeholder: canRead ? undefined : serverError && serverError.message,
    options: options,
    onChange: onChange,
    id: `react-select-${htmlID}`,
    isClearable: true,
    instanceId: htmlID,
    inputId: htmlID,
    innerRef: ref,
    menuPortalTarget: document.body,
    isDisabled: isDisabled
  }, selectProps));
});

const RelationshipSelect = ({
  innerRef,
  autoFocus,
  field,
  errors: serverErrors,
  renderContext,
  htmlID,
  onChange,
  isMulti,
  value,
  isDisabled
}) => {
  const [search, setSearch] = React.useState('');
  const refList = field.getRefList();
  const QUERY = client.gql`
    query RelationshipSelect($search: String!, $first: Int!, $skip: Int!) {
      ${refList.gqlNames.listQueryName}(search: $search, first: $first, skip: $skip) {
        _label_
        id
      }

      ${refList.gqlNames.listQueryMetaName}(search: $search) {
        count
      }
    }
  `;
  const canRead = !serverErrors || serverErrors.every(error => !(error instanceof Error && error.name === 'AccessDeniedError'));
  const selectProps = renderContext === 'dialog' ? {
    menuShouldBlockScroll: true
  } : null;
  const {
    data,
    error,
    loading,
    fetchMore
  } = client.useQuery(QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      search,
      first: initialItemsToLoad,
      skip: 0
    }
  }); // TODO: better error UI
  // TODO: Handle permission errors
  // (ie; user has permission to read this relationship field, but
  // not the related list, or some items on the list)

  if (error) {
    console.log('ERROR!!!', error);
    return 'Error';
  }

  return core.jsx(Relationship, {
    data,
    loading,
    value,
    refList,
    canRead,
    isMulti,
    search,
    autoFocus,
    serverErrors,
    onChange,
    htmlID,
    setSearch,
    selectProps,
    fetchMore,
    ref: innerRef,
    isDisabled
  });
};

exports.RelationshipSelect = RelationshipSelect;
