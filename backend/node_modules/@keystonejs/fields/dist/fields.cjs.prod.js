'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _objectWithoutProperties = require('@babel/runtime/helpers/objectWithoutProperties');
var inflection = require('inflection');
var accessControl = require('@keystonejs/access-control');
var path = require('path');
var dateFns = require('date-fns');
var adapterMongoose = require('@keystonejs/adapter-mongoose');
var adapterKnex = require('@keystonejs/adapter-knex');
var adapterPrisma = require('@keystonejs/adapter-prisma');
var graphql = require('graphql');
var language = require('graphql/language');
var luxon = require('luxon');
var mongoose = require('mongoose');
var decimal_js = require('decimal.js');
var cuid = require('cuid');
var dumbPasswords = require('dumb-passwords');
var groupBy = require('lodash.groupby');
var pSettle = require('p-settle');
var utils = require('@keystonejs/utils');
var apolloErrors = require('apollo-errors');
var serverSideGraphqlClient = require('@keystonejs/server-side-graphql-client');
var slugify = require('@sindresorhus/slugify');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var inflection__default = /*#__PURE__*/_interopDefault(inflection);
var path__default = /*#__PURE__*/_interopDefault(path);
var mongoose__default = /*#__PURE__*/_interopDefault(mongoose);
var cuid__default = /*#__PURE__*/_interopDefault(cuid);
var dumbPasswords__default = /*#__PURE__*/_interopDefault(dumbPasswords);
var groupBy__default = /*#__PURE__*/_interopDefault(groupBy);
var pSettle__default = /*#__PURE__*/_interopDefault(pSettle);
var slugify__default = /*#__PURE__*/_interopDefault(slugify);

class Field {
  constructor(path, _ref, {
    getListByKey,
    listKey,
    listAdapter,
    fieldAdapterClass,
    defaultAccess,
    schemaNames
  }) {
    let {
      hooks = {},
      isRequired,
      defaultValue,
      access,
      label,
      schemaDoc,
      adminDoc,
      adminConfig
    } = _ref,
        config = _objectWithoutProperties(_ref, ["hooks", "isRequired", "defaultValue", "access", "label", "schemaDoc", "adminDoc", "adminConfig"]);

    this.path = path;
    this.isPrimaryKey = path === 'id';
    this.schemaDoc = schemaDoc;
    this.adminDoc = adminDoc;
    this.adminConfig = adminConfig;
    this.config = config;
    this.isRequired = !!isRequired;
    this.defaultValue = defaultValue;
    this.isOrderable = false;
    this.hooks = hooks;
    this.getListByKey = getListByKey;
    this.listKey = listKey;
    this.label = label || inflection__default['default'].humanize(inflection__default['default'].underscore(path));

    if (this.config.isUnique && !this._supportsUnique) {
      throw new Error(`isUnique is not a supported option for field type ${this.constructor.name} (${this.path})`);
    }

    this.adapter = listAdapter.newFieldAdapter(fieldAdapterClass, this.constructor.name, path, this, getListByKey, _objectSpread({}, config)); // Should be overwritten by types that implement a Relationship interface

    this.isRelationship = false;
    this.access = this.parseFieldAccess({
      schemaNames,
      listKey,
      fieldKey: path,
      defaultAccess,
      access
    });
  } // By default we assume that fields do not support unique constraints.
  // Fields should override this method if they want to support uniqueness.


  get _supportsUnique() {
    return false;
  }

  parseFieldAccess(args) {
    return accessControl.parseFieldAccess(args);
  } // Field types should replace this if they want to any fields to the output type


  gqlOutputFields() {
    return [];
  }

  gqlOutputFieldResolvers() {
    return {};
  }
  /**
   * Auxiliary Types are top-level types which a type may need or provide.
   * Example: the `File` type, adds a graphql auxiliary type of `FileUpload`, as
   * well as an `uploadFile()` graphql auxiliary type query resolver
   *
   * These are special cases, and should be used sparingly
   *
   * NOTE: When a naming conflict occurs, a list's types/queries/mutations will
   * overwrite any auxiliary types defined by an individual type.
   */


  getGqlAuxTypes() {
    return [];
  }

  gqlAuxFieldResolvers() {
    return {};
  }

  getGqlAuxQueries() {
    return [];
  }

  gqlAuxQueryResolvers() {
    return {};
  }

  getGqlAuxMutations() {
    return [];
  }

  gqlAuxMutationResolvers() {
    return {};
  }
  /**
   * @param {Object} data
   * @param {Object} data.resolvedData  The incoming item for the mutation with
   * relationships and defaults already resolved
   * @param {Object} data.existingItem If this is a updateX mutation, this will
   * be the existing data in the database
   * @param {Object} data.context The graphQL context object of the current
   * request
   * @param {Object} data.originalInput The raw incoming item from the mutation
   * (no relationships or defaults resolved)
   */


  async resolveInput({
    resolvedData
  }) {
    return resolvedData[this.path];
  }

  async validateInput() {}

  async beforeChange() {}

  async afterChange() {}

  async beforeDelete() {}

  async validateDelete() {}

  async afterDelete() {}

  gqlQueryInputFields() {
    return [];
  }

  equalityInputFields(type) {
    return [`${this.path}: ${type}`, `${this.path}_not: ${type}`];
  }

  equalityInputFieldsInsensitive(type) {
    return [`${this.path}_i: ${type}`, `${this.path}_not_i: ${type}`];
  }

  inInputFields(type) {
    return [`${this.path}_in: [${type}]`, `${this.path}_not_in: [${type}]`];
  }

  orderingInputFields(type) {
    return [`${this.path}_lt: ${type}`, `${this.path}_lte: ${type}`, `${this.path}_gt: ${type}`, `${this.path}_gte: ${type}`];
  }

  stringInputFields(type) {
    return [`${this.path}_contains: ${type}`, `${this.path}_not_contains: ${type}`, `${this.path}_starts_with: ${type}`, `${this.path}_not_starts_with: ${type}`, `${this.path}_ends_with: ${type}`, `${this.path}_not_ends_with: ${type}`];
  }

  stringInputFieldsInsensitive(type) {
    return [`${this.path}_contains_i: ${type}`, `${this.path}_not_contains_i: ${type}`, `${this.path}_starts_with_i: ${type}`, `${this.path}_not_starts_with_i: ${type}`, `${this.path}_ends_with_i: ${type}`, `${this.path}_not_ends_with_i: ${type}`];
  }

  gqlCreateInputFields() {
    return [];
  }

  gqlUpdateInputFields() {
    return [];
  }

  getAdminMeta({
    schemaName
  }) {
    const schemaAccess = this.access[schemaName];
    return this.extendAdminMeta(_objectSpread(_objectSpread({
      label: this.label,
      path: this.path,
      type: this.constructor.name,
      isRequired: this.isRequired,
      isOrderable: this.isOrderable,
      // We can only pass scalar default values through to the admin ui, not
      // functions
      defaultValue: typeof this.defaultValue !== 'function' ? this.defaultValue : undefined,
      isPrimaryKey: this.isPrimaryKey
    }, this.adminConfig), {}, {
      // NOTE: This data is serialised, so we're unable to pass through any
      // access control _functions_. But we can still check for the boolean case
      // and pass that through (we assume that if there is a function, it's a
      // "maybe" true, so default it to true).
      access: {
        create: !!schemaAccess.create,
        read: !!schemaAccess.read,
        update: !!schemaAccess.update
      },
      adminDoc: this.adminDoc
    }));
  }

  extendAdminMeta(meta) {
    return meta;
  }

  extendAdminViews(views) {
    return views;
  }

  getDefaultValue({
    context,
    originalInput
  }) {
    if (typeof this.defaultValue !== 'undefined') {
      if (typeof this.defaultValue === 'function') {
        return this.defaultValue({
          context,
          originalInput
        });
      } else {
        return this.defaultValue;
      }
    } // By default, the default value is undefined


    return undefined;
  }

  getBackingTypes() {
    // Return the typescript types of the backing item for this field type.
    // This method can be helpful if you want to auto-generate typescript types.
    // Future releases of Keystone will provide full typescript support
    return {
      [this.path]: {
        optional: true,
        type: 'any'
      }
    };
  }

}

const pkgDir = path__default['default'].dirname(require.resolve('@keystonejs/fields/package.json'));
const resolveView = pathname => path__default['default'].join(pkgDir, pathname);

class CalendarDay extends Field {
  constructor(path, {
    format = 'yyyy-MM-dd',
    dateFrom,
    dateTo
  }) {
    super(...arguments);
    this.format = format;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    if (this._dateFrom && (this._dateFrom.length !== 10 || !dateFns.isValid(dateFns.parseISO(this._dateFrom)))) {
      throw new Error(`Invalid value for option "dateFrom" of field '${this.listKey}.${path}': "${this._dateFrom}"`);
    }

    if (this._dateTo && (this._dateTo.length !== 10 || !dateFns.isValid(dateFns.parseISO(this._dateTo)))) {
      throw new Error(`Invalid value for option "dateTo" of field '${this.listKey}.${path}': "${this._dateFrom}"`);
    }

    if (this._dateTo && this._dateFrom && dateFns.compareAsc(dateFns.parseISO(this._dateFrom), dateFns.parseISO(this._dateTo)) === 1) {
      throw new Error(`Invalid values for options "dateFrom", "dateTo" of field '${this.listKey}.${path}': "${dateFrom}" > "${dateTo}"`);
    }

    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('String'), ...this.orderingInputFields('String'), ...this.inInputFields('String')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }

  extendAdminMeta(meta) {
    return _objectSpread(_objectSpread({}, meta), {}, {
      format: this.format,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo
    });
  }

  async validateInput({
    resolvedData,
    addFieldValidationError
  }) {
    const initialValue = resolvedData[this.path]; // Allow passing in the `null` value to the CalendarDay field type

    if (initialValue === null) return true;
    const parsedValue = dateFns.parseISO(resolvedData[this.path]);

    if (!(initialValue.length === 10 && dateFns.isValid(parsedValue))) {
      addFieldValidationError('Invalid CalendarDay value.', {
        value: resolvedData[this.path]
      });
    }

    if (parsedValue) {
      if (dateFns.parseISO(this._dateFrom) && dateFns.compareAsc(dateFns.parseISO(this._dateFrom), parsedValue) === 1) {
        addFieldValidationError(`Value is before earliest allowed date: ${this._dateFromString}.`, {
          value: resolvedData[this.path],
          dateFrom: this._dateFromString
        });
      }

      if (dateFns.parseISO(this._dateTo) && dateFns.compareDesc(dateFns.parseISO(this._dateTo), parsedValue) === 1) {
        addFieldValidationError(`Value is after latest allowed date: ${this._dateToString}.`, {
          value: resolvedData[this.path],
          dateTo: this._dateToString
        });
      }
    }
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const CommonCalendarInterface = superclass => class extends superclass {
  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.orderingConditions(dbPath)), this.inConditions(dbPath));
  }

};

class MongoCalendarDayInterface extends CommonCalendarInterface(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    const validator = a => typeof a === 'string' && a.length === 10 && dateFns.parseISO(a);

    const schemaOptions = {
      type: String,
      validate: {
        validator: this.buildValidator(validator),
        message: '{VALUE} is not an ISO8601 date string (yyyy-MM-dd)'
      }
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config)
    });
  }

}
class KnexCalendarDayInterface extends CommonCalendarInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    const column = table.date(this.path);
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (this.defaultTo) column.defaultTo(this.defaultTo);
  }

  setupHooks({
    addPostReadHook
  }) {
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = dateFns.formatISO(item[this.path], {
          representation: 'date'
        });
      }

      return item;
    });
  }

}
class PrismaCalendarDayInterface extends CommonCalendarInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'DateTime'
    })];
  }

  _stringToDate(s) {
    return s && new Date(s + 'T00:00:00+0000');
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath, this._stringToDate)), this.orderingConditions(dbPath, this._stringToDate)), this.inConditions(dbPath, this._stringToDate));
  }

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    addPreSaveHook(item => {
      if (item[this.path]) {
        item[this.path] = this._stringToDate(item[this.path]);
      }

      return item;
    });
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = dateFns.formatISO(item[this.path], {
          representation: 'date'
        });
      }

      return item;
    });
  }

}

var index$c = {
  type: 'CalendarDay',
  implementation: CalendarDay,
  views: {
    Controller: resolveView('types/CalendarDay/views/Controller'),
    Field: resolveView('types/CalendarDay/views/Field'),
    Filter: resolveView('types/CalendarDay/views/Filter'),
    Cell: resolveView('types/CalendarDay/views/Cell')
  },
  adapters: {
    mongoose: MongoCalendarDayInterface,
    knex: KnexCalendarDayInterface,
    prisma: PrismaCalendarDayInterface
  }
};

class Checkbox extends Field {
  constructor() {
    super(...arguments);
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return false;
  }

  gqlOutputFields() {
    return [`${this.path}: Boolean`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return this.equalityInputFields('Boolean');
  }

  gqlUpdateInputFields() {
    return [`${this.path}: Boolean`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: Boolean`];
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'boolean | null'
      }
    };
  }

}
class MongoCheckboxInterface extends adapterMongoose.MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({
        type: Boolean
      }, this.config)
    });
  }

  getQueryConditions(dbPath) {
    return this.equalityConditions(dbPath);
  }

}
class KnexCheckboxInterface extends adapterKnex.KnexFieldAdapter {
  constructor() {
    super(...arguments); // Error rather than ignoring invalid config

    if (this.config.isIndexed) {
      throw `The Checkbox field type doesn't support indexes on Knex. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }
  }

  addToTableSchema(table) {
    const column = table.boolean(this.path);
    if (this.isNotNullable) column.notNullable();
    if (typeof this.defaultTo !== 'undefined') column.defaultTo(this.defaultTo);
  }

  getQueryConditions(dbPath) {
    return this.equalityConditions(dbPath);
  }

}
class PrismaCheckboxInterface extends adapterPrisma.PrismaFieldAdapter {
  constructor() {
    super(...arguments); // Error rather than ignoring invalid config

    if (this.config.isIndexed) {
      throw `The Checkbox field type doesn't support indexes on Prisma. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'Boolean'
    })];
  }

  getQueryConditions(dbPath) {
    return this.equalityConditions(dbPath);
  }

}

var index$b = {
  type: 'Checkbox',
  implementation: Checkbox,
  views: {
    Controller: resolveView('types/Checkbox/views/Controller'),
    Field: resolveView('types/Checkbox/views/Field'),
    Filter: resolveView('types/Checkbox/views/Filter'),
    Cell: resolveView('types/Checkbox/views/Cell')
  },
  adapters: {
    mongoose: MongoCheckboxInterface,
    knex: KnexCheckboxInterface,
    prisma: PrismaCheckboxInterface
  }
};

class _DateTime extends Field {
  constructor(path, {
    format,
    yearRangeFrom,
    yearRangeTo,
    yearPickerType
  }) {
    super(...arguments);
    this.format = format;
    this.yearRangeFrom = yearRangeFrom;
    this.yearRangeTo = yearRangeTo;
    this.yearPickerType = yearPickerType;
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: DateTime`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('DateTime'), ...this.orderingInputFields('DateTime'), ...this.inInputFields('DateTime')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: DateTime`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: DateTime`];
  }

  getGqlAuxTypes() {
    return [`scalar DateTime`];
  }

  extendAdminMeta(meta) {
    return _objectSpread(_objectSpread({}, meta), {}, {
      format: this.format,
      yearRangeFrom: this.yearRangeFrom,
      yearRangeTo: this.yearRangeTo,
      yearPickerType: this.yearPickerType
    });
  }

  gqlAuxFieldResolvers() {
    return {
      DateTime: new graphql.GraphQLScalarType({
        name: 'DateTime',
        description: 'DateTime custom scalar represents an ISO 8601 datetime string',

        parseValue(value) {
          return value; // value from the client
        },

        serialize(value) {
          return value; // value sent to the client
        },

        parseLiteral(ast) {
          if (ast.kind === language.Kind.STRING) {
            return ast.value; // ast value is always in string format
          }

          return null;
        }

      })
    };
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const toDate$1 = s => s && luxon.DateTime.fromISO(s, {
  zone: 'utc'
}).toJSDate();

const CommonDateTimeInterface = superclass => class extends superclass {
  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    const field_path = this.path;
    const utc_field = `${field_path}_utc`;
    const offset_field = `${field_path}_offset`; // Updates the relevant value in the item provided (by referrence)

    addPreSaveHook(item => {
      // Only run the hook if the item actually contains the datetime field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(field_path in item)) {
        return item;
      }

      const datetimeString = item[field_path]; // NOTE: Even though `0` is a valid timestamp (the unix epoch), it's not a valid ISO string,
      // so it's ok to check for falseyness here.

      if (!datetimeString) {
        item[utc_field] = null;
        item[offset_field] = null;
        delete item[field_path]; // Never store this field

        return item;
      }

      if (!luxon.DateTime.fromISO(datetimeString, {
        zone: 'utc'
      }).isValid) {
        throw new Error('Validation failed: DateTime must be either `null` or a valid ISO 8601 string');
      }

      item[utc_field] = toDate$1(datetimeString);
      item[offset_field] = luxon.DateTime.fromISO(datetimeString, {
        setZone: true
      }).toFormat('ZZ');
      delete item[field_path]; // Never store this field

      return item;
    });
    addPostReadHook(item => {
      // If there's no fields stored in the DB (can happen with MongoDB), then
      // don't bother trying to process anything
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(utc_field in item) && !(offset_field in item)) {
        return item;
      }

      if (!item[utc_field] || !item[offset_field]) {
        item[field_path] = null;
        return item;
      }

      const datetimeString = luxon.DateTime.fromJSDate(item[utc_field], {
        zone: 'utc'
      }).setZone(new luxon.FixedOffsetZone(luxon.DateTime.fromISO(`1234-01-01T00:00:00${item[offset_field]}`, {
        setZone: true
      }).offset)).toISO();
      item[field_path] = datetimeString;
      item[utc_field] = undefined;
      item[offset_field] = undefined;
      return item;
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath, toDate$1)), this.orderingConditions(dbPath, toDate$1)), this.inConditions(dbPath, toDate$1));
  }

};

class MongoDateTimeInterface extends CommonDateTimeInterface(adapterMongoose.MongooseFieldAdapter) {
  constructor() {
    super(...arguments);
    this.utcPath = `${this.path}_utc`;
    this.offsetPath = `${this.path}_offset`;
    this.realKeys = [this.utcPath, this.offsetPath];
    this.dbPath = this.utcPath;
  }

  addToMongooseSchema(schema) {
    const {
      mongooseOptions
    } = this.config;
    schema.add({
      // FIXME: Mongoose needs to know about this field in order for the correct
      // attributes to make it through to the pre-hooks.
      [this.path]: _objectSpread({
        type: String
      }, mongooseOptions),
      // These are the actual fields we care about storing in the database.
      [this.utcPath]: this.mergeSchemaOptions({
        type: Date
      }, this.config),
      [this.offsetPath]: _objectSpread({
        type: String
      }, mongooseOptions)
    });
  }

  getMongoFieldName() {
    return `${this.path}_utc`;
  }

}
class KnexDateTimeInterface extends CommonDateTimeInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.utcPath = `${this.path}_utc`;
    this.offsetPath = `${this.path}_offset`;
    this.realKeys = [this.utcPath, this.offsetPath];
    this.sortKey = this.utcPath;
    this.dbPath = this.utcPath;
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    // TODO: Should use a single field on PG
    // .. although 2 cols is nice for MySQL (no native datetime with tz)
    const utcColumn = table.timestamp(this.utcPath, {
      useTz: false
    });
    const offsetColumn = table.text(this.offsetPath); // Interpret the index options as effecting both elements

    if (this.isUnique) table.unique([this.utcPath, this.offsetPath]);else if (this.isIndexed) table.index([this.utcPath, this.offsetPath]); // Interpret not nullable to mean neither field is nullable

    if (this.isNotNullable) {
      utcColumn.notNullable();
      offsetColumn.notNullable();
    } // Allow defaults to be set for both elements of the value by nesting them
    // TODO: Add to docs..


    if (this.defaultTo && (this.defaultTo.utc || this.defaultTo.offset)) {
      if (this.defaultTo.utc) utcColumn.defaultTo(this.defaultTo.utc);
      if (this.defaultTo.offset) offsetColumn.defaultTo(this.defaultTo.offset);
    } else if (this.defaultTo) {
      utcColumn.defaultTo(this.defaultTo);
    }
  }

}
class PrismaDateTimeInterface extends CommonDateTimeInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
    this.utcPath = `${this.path}_utc`;
    this.offsetPath = `${this.path}_offset`;
    this.realKeys = [this.utcPath, this.offsetPath];
    this.sortKey = this.utcPath;
    this.dbPath = this.utcPath;
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  getPrismaSchema() {
    return [`${this.path}_utc    DateTime? ${this.config.isUnique ? '@unique' : ''}`, `${this.path}_offset String?`];
  }

}

var DateTime = {
  type: 'DateTime',
  implementation: _DateTime,
  views: {
    Controller: resolveView('types/DateTime/views/Controller'),
    Field: resolveView('types/DateTime/views/Field'),
    Filter: resolveView('types/DateTime/views/Filter'),
    Cell: resolveView('types/DateTime/views/Cell')
  },
  adapters: {
    mongoose: MongoDateTimeInterface,
    knex: KnexDateTimeInterface,
    prisma: PrismaDateTimeInterface
  }
};

class DateTimeUtcImplementation extends Field {
  constructor(path, {
    format = 'yyyy-MM-dd[T]HH:mm:ss.SSSxx'
  }) {
    super(...arguments);
    this.isOrderable = true;
    this.format = format;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path] && item[this.path].toISOString()
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('String'), ...this.orderingInputFields('String'), ...this.inInputFields('String')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }

  getGqlAuxTypes() {
    return [`scalar String`];
  }

  extendAdminMeta(meta) {
    return _objectSpread(_objectSpread({}, meta), {}, {
      format: this.format
    });
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'Date | null'
      }
    };
  }

} // All values must have an offset

const toDate = str => {
  if (str === null) {
    return null;
  }

  if (!str.match(/([zZ]|[\+\-][0-9]+(\:[0-9]+)?)$/)) {
    throw `Value supplied (${str}) is not a valid date time with offset.`;
  }

  return luxon.DateTime.fromISO(str).toJSDate();
};

class MongoDateTimeUtcInterface extends adapterMongoose.MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({
        type: Date
      }, this.config)
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath, toDate)), this.orderingConditions(dbPath, toDate)), this.inConditions(dbPath, toDate));
  }

}
class KnexDateTimeUtcInterface extends adapterKnex.KnexFieldAdapter {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    // It's important we don't exceed the precision of native Date
    // objects (ms) or JS will silently round values down.
    const column = table.timestamp(this.path, {
      useTz: true,
      precision: 3
    });
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (this.defaultTo) column.defaultTo(this.defaultTo);
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath, toDate)), this.orderingConditions(dbPath, toDate)), this.inConditions(dbPath, toDate));
  }

}
class PrismaDateTimeUtcInterface extends adapterPrisma.PrismaFieldAdapter {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'DateTime'
    })];
  }

  _stringToDate(s) {
    return s && new Date(s);
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath, this._stringToDate)), this.orderingConditions(dbPath, this._stringToDate)), this.inConditions(dbPath, this._stringToDate));
  }

  setupHooks({
    addPreSaveHook
  }) {
    addPreSaveHook(item => {
      if (item[this.path]) {
        item[this.path] = this._stringToDate(item[this.path]);
      }

      return item;
    });
  }

}

var index$a = {
  type: 'DateTimeUtc',
  implementation: DateTimeUtcImplementation,
  views: {
    Controller: DateTime.views.Controller,
    Field: DateTime.views.Field,
    Filter: DateTime.views.Filter,
    Cell: DateTime.views.Cell
  },
  adapters: {
    mongoose: MongoDateTimeUtcInterface,
    knex: KnexDateTimeUtcInterface,
    prisma: PrismaDateTimeUtcInterface
  }
};

class Decimal extends Field {
  constructor(path, {
    symbol
  }) {
    super(...arguments);
    this.symbol = symbol;
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('String'), ...this.orderingInputFields('String'), ...(this.adapter.listAdapter.parentAdapter.name === 'prisma_postgresql' ? [] : this.inInputFields('String'))];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }

  extendAdminMeta(meta) {
    return _objectSpread(_objectSpread({}, meta), {}, {
      symbol: this.symbol
    });
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}
class MongoDecimalInterface extends adapterMongoose.MongooseFieldAdapter {
  addToMongooseSchema(schema) {
    const validator = a => typeof a === 'object' && /^-?\d*\.?\d*$/.test(a);

    const schemaOptions = {
      type: mongoose__default['default'].Decimal128,
      validate: {
        validator: this.buildValidator(validator),
        message: '{VALUE} is not a Decimal value'
      }
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config)
    });
  }

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    // Updates the relevant value in the item provided (by reference)
    addPreSaveHook(item => {
      // Only run the hook if the item actually contains the field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(this.path in item)) {
        return item;
      }

      if (item[this.path]) {
        if (typeof item[this.path] === 'string') {
          item[this.path] = mongoose__default['default'].Types.Decimal128.fromString(item[this.path]);
        } else {
          // Should have been caught by the validator??
          throw `Invalid Decimal value given for '${this.path}'`;
        }
      } else {
        item[this.path] = null;
      } // else: Must either be undefined or a Decimal128 object, so leave it alone.


      return item;
    });
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = item[this.path].toString();
      }

      return item;
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath, s => s && mongoose__default['default'].Types.Decimal128.fromString(s))), this.orderingConditions(dbPath, s => s && mongoose__default['default'].Types.Decimal128.fromString(s))), this.inConditions(dbPath, s => s && mongoose__default['default'].Types.Decimal128.fromString(s)));
  }

}
class KnexDecimalInterface extends adapterKnex.KnexFieldAdapter {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique; // In addition to the standard knexOptions this type supports precision and scale

    const {
      precision,
      scale
    } = this.knexOptions;
    this.precision = precision === null ? null : parseInt(precision) || 18;
    this.scale = scale === null ? null : (this.precision, parseInt(scale) || 4);

    if (this.scale !== null && this.precision !== null && this.scale > this.precision) {
      throw `The scale configured for Decimal field '${this.path}' (${this.scale}) ` + `must not be larger than the field's precision (${this.precision})`;
    }
  }

  addToTableSchema(table) {
    const column = table.decimal(this.path, this.precision, this.scale);
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (typeof this.defaultTo !== 'undefined') column.defaultTo(this.defaultTo);
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.orderingConditions(dbPath)), this.inConditions(dbPath));
  }

}
class PrismaDecimalInterface extends adapterPrisma.PrismaFieldAdapter {
  constructor() {
    super(...arguments);
    const {
      precision,
      scale
    } = this.config;
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique; // In addition to the standard knexOptions this type supports precision and scale
    // const { precision, scale } = this.knexOptions;

    this.precision = precision === null ? null : parseInt(precision) || 18;
    this.scale = scale === null ? null : (this.precision, parseInt(scale) || 4);

    if (this.scale !== null && this.precision !== null && this.scale > this.precision) {
      throw `The scale configured for Decimal field '${this.path}' (${this.scale}) ` + `must not be larger than the field's precision (${this.precision})`;
    }
  }

  getPrismaSchema() {
    return this._schemaField({
      type: 'Decimal',
      extra: `@postgresql.Decimal(${this.precision}, ${this.scale})`
    });
  }

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    // Updates the relevant value in the item provided (by reference)
    addPreSaveHook(item => {
      // Only run the hook if the item actually contains the field
      if (!(this.path in item)) {
        return item;
      }

      if (item[this.path]) {
        if (typeof item[this.path] === 'string') {
          item[this.path] = new decimal_js.Decimal(item[this.path]);
        } else {
          // Should have been caught by the validator??
          throw `Invalid Decimal value given for '${this.path}'`;
        }
      } else {
        item[this.path] = null;
      }

      return item;
    });
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = item[this.path].toFixed(this.scale);
      }

      return item;
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.orderingConditions(dbPath));
  }

}

var index$9 = {
  type: 'Decimal',
  implementation: Decimal,
  views: {
    Controller: resolveView('types/Decimal/views/Controller'),
    Field: resolveView('types/Decimal/views/Field'),
    Filter: resolveView('types/Decimal/views/Filter')
  },
  adapters: {
    mongoose: MongoDecimalInterface,
    knex: KnexDecimalInterface,
    prisma: PrismaDecimalInterface
  }
};

// https://mongoosejs.com/docs/migrating_to_5.html#id-getter

mongoose__default['default'].set('objectIdGetter', false);
class File extends Field {
  constructor(path, {
    adapter
  }) {
    super(...arguments);
    this.graphQLOutputType = 'File';
    this.fileAdapter = adapter;

    if (!this.fileAdapter) {
      throw new Error(`No file adapter provided for File field.`);
    }
  }

  get _supportsUnique() {
    return false;
  }

  gqlOutputFields() {
    return [`${this.path}: ${this.graphQLOutputType}`];
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('String'), ...this.inInputFields('String')];
  }

  getFileUploadType() {
    return 'Upload';
  }

  getGqlAuxTypes() {
    return [`
      type ${this.graphQLOutputType} {
        id: ID
        path: String
        filename: String
        originalFilename: String
        mimetype: String
        encoding: String
        publicUrl: String
      }
    `];
  } // Called on `User.avatar` for example


  gqlOutputFieldResolvers() {
    return {
      [this.path]: item => {
        const itemValues = item[this.path];

        if (!itemValues) {
          return null;
        }

        return _objectSpread({
          publicUrl: this.fileAdapter.publicUrl(itemValues)
        }, itemValues);
      }
    };
  }

  async resolveInput({
    resolvedData,
    existingItem
  }) {
    const previousData = existingItem && existingItem[this.path];
    const uploadData = resolvedData[this.path]; // NOTE: The following two conditions could easily be combined into a
    // single `if (!uploadData) return uploadData`, but that would lose the
    // nuance of returning `undefined` vs `null`.
    // Premature Optimisers; be ware!

    if (typeof uploadData === 'undefined') {
      // Nothing was passed in, so we can bail early.
      return undefined;
    }

    if (uploadData === null) {
      // `null` was specifically uploaded, and we should set the field value to
      // null. To do that we... return `null`
      return null;
    }

    const {
      createReadStream,
      filename: originalFilename,
      mimetype,
      encoding
    } = await uploadData;
    const stream = createReadStream();

    if (!stream && previousData) {
      // TODO: FIXME: Handle when stream is null. Can happen when:
      // Updating some other part of the item, but not the file (gets null
      // because no File DOM element is uploaded)
      return previousData;
    }

    const {
      id,
      filename,
      _meta
    } = await this.fileAdapter.save({
      stream,
      filename: originalFilename,
      mimetype,
      encoding,
      id: this.adapter.listAdapter.parentAdapter.name === 'mongoose' ? new mongoose__default['default'].Types.ObjectId() : cuid__default['default']()
    });
    return {
      id,
      filename,
      originalFilename,
      mimetype,
      encoding,
      _meta
    };
  }

  gqlUpdateInputFields() {
    return [`${this.path}: ${this.getFileUploadType()}`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: ${this.getFileUploadType()}`];
  }

  getBackingTypes() {
    const type = `null | {
      id: string;
      path: string;
      filename: string;
      originalFilename: string;
      mimetype: string;
      encoding: string;
      _meta: Record<string, any>
     }
    `;
    return {
      [this.path]: {
        optional: true,
        type
      }
    };
  }

}

const CommonFileInterface = superclass => class extends superclass {
  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.inConditions(dbPath));
  }

};

class MongoFileInterface extends CommonFileInterface(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    const schemaOptions = {
      type: {
        id: mongoose__default['default'].Types.ObjectId,
        path: String,
        filename: String,
        originalFilename: String,
        mimetype: String,
        encoding: String,
        _meta: Object
      }
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config)
    });
  }

}
class KnexFileInterface extends CommonFileInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments); // Error rather than ignoring invalid config
    // We totally can index these values, it's just not trivial. See issue #1297

    if (this.config.isIndexed) {
      throw `The File field type doesn't support indexes on Knex. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }
  }

  addToTableSchema(table) {
    const column = table.jsonb(this.path);
    if (this.isNotNullable) column.notNullable();
    if (this.defaultTo) column.defaultTo(this.defaultTo);
  }

}
class PrismaFileInterface extends CommonFileInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments); // Error rather than ignoring invalid config
    // We totally can index these values, it's just not trivial. See issue #1297

    if (this.config.isIndexed) {
      throw `The File field type doesn't support indexes on Prisma. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'Json'
    })];
  }

}

var index$8 = {
  type: 'File',
  implementation: File,
  views: {
    Controller: resolveView('types/File/views/Controller'),
    Field: resolveView('types/File/views/Field'),
    Cell: resolveView('types/File/views/Cell')
  },
  adapters: {
    mongoose: MongoFileInterface,
    knex: KnexFileInterface,
    prisma: PrismaFileInterface
  }
};

class Float extends Field {
  constructor() {
    super(...arguments);
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: Float`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('Float'), ...this.orderingInputFields('Float'), ...this.inInputFields('Float')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: Float`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: Float`];
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'number | null'
      }
    };
  }

}

const CommonFloatInterface = superclass => class extends superclass {
  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.orderingConditions(dbPath)), this.inConditions(dbPath));
  }

};

class MongoFloatInterface extends CommonFloatInterface(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({
        type: Number
      }, this.config)
    });
  }

}
class KnexFloatInterface extends CommonFloatInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    const column = table.float(this.path);
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (typeof this.defaultTo !== 'undefined') column.defaultTo(this.defaultTo);
  }

}
class PrismaFloatInterface extends CommonFloatInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
  }

  getPrismaSchema() {
    return this._schemaField({
      type: 'Float'
    });
  }

}

var index$7 = {
  type: 'Float',
  implementation: Float,
  views: {
    Controller: resolveView('types/Float/views/Controller'),
    Field: resolveView('types/Float/views/Field'),
    Filter: resolveView('types/Float/views/Filter')
  },
  adapters: {
    mongoose: MongoFloatInterface,
    knex: KnexFloatInterface,
    prisma: PrismaFloatInterface
  }
};

class Integer extends Field {
  constructor() {
    super(...arguments);
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: Int`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('Int'), ...this.orderingInputFields('Int'), ...this.inInputFields('Int')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: Int`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: Int`];
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'number | null'
      }
    };
  }

}

const CommonIntegerInterface = superclass => class extends superclass {
  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.orderingConditions(dbPath)), this.inConditions(dbPath));
  }

};

class MongoIntegerInterface extends CommonIntegerInterface(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    const schemaOptions = {
      type: Number,
      validate: {
        validator: this.buildValidator(a => typeof a === 'number' && Number.isInteger(a)),
        message: '{VALUE} is not an integer value'
      }
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config)
    });
  }

}
class KnexIntegerInterface extends CommonIntegerInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    const column = table.integer(this.path);
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (typeof this.defaultTo !== 'undefined') column.defaultTo(this.defaultTo);
  }

}
class PrismaIntegerInterface extends CommonIntegerInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
  }

  getPrismaSchema() {
    return this._schemaField({
      type: 'Int'
    });
  }

}

var index$6 = {
  type: 'Integer',
  implementation: Integer,
  views: {
    Controller: resolveView('types/Integer/views/Controller'),
    Field: resolveView('types/Integer/views/Field'),
    Filter: resolveView('types/Integer/views/Filter')
  },
  adapters: {
    mongoose: MongoIntegerInterface,
    knex: KnexIntegerInterface,
    prisma: PrismaIntegerInterface
  }
};

const bcryptHashRegex = /^\$2[aby]?\$\d{1,2}\$[.\/A-Za-z0-9]{53}$/;
class Password extends Field {
  constructor(path, {
    rejectCommon,
    minLength,
    workFactor,
    useCompiledBcrypt,
    bcrypt
  }, {
    listKey
  }) {
    super(...arguments);

    if (useCompiledBcrypt) {
      throw new Error(`The Password field at ${listKey}.${path} specifies the option "useCompiledBcrypt", this has been replaced with a "bcrypt" option which accepts a different implementation of bcrypt(such as the native npm package, "bcrypt")`);
    }

    this.bcrypt = bcrypt || require('bcryptjs'); // Sanitise field specific config

    this.rejectCommon = !!rejectCommon;
    this.minLength = Math.max(Number.parseInt(minLength) || 8, 1); // Min 4, max: 31, default: 10

    this.workFactor = Math.min(Math.max(Number.parseInt(workFactor) || 10, 4), 31);

    if (this.workFactor < 6) {
      console.warn(`The workFactor for ${this.listKey}.${this.path} is very low! ` + `This will cause weak hashes!`);
    }
  }

  get _supportsUnique() {
    return false;
  }

  gqlOutputFields() {
    return [`${this.path}_is_set: Boolean`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}_is_set`]: item => {
        const val = item[this.path];
        return bcryptHashRegex.test(val);
      }
    };
  }

  gqlQueryInputFields() {
    return [`${this.path}_is_set: Boolean`];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: String`];
  } // Wrap bcrypt functionality
  // The compare() and compareSync() functions are constant-time
  // The compare() and generateHash() functions will return a Promise if no call back is provided


  compare(candidate, hash, callback) {
    return this.bcrypt.compare(candidate, hash, callback);
  }

  compareSync(candidate, hash) {
    return this.bcrypt.compareSync(candidate, hash);
  }

  generateHash(plaintext, callback) {
    this.validateNewPassword(plaintext);
    return this.bcrypt.hash(plaintext, this.workFactor, callback);
  }

  generateHashSync(plaintext) {
    this.validateNewPassword(plaintext);
    return this.bcrypt.hashSync(plaintext, this.workFactor);
  }

  extendAdminMeta(meta) {
    const {
      minLength
    } = this;
    return _objectSpread(_objectSpread({}, meta), {}, {
      minLength
    });
  } // Force values to be hashed when set


  validateNewPassword(password) {
    if (this.rejectCommon && dumbPasswords__default['default'].check(password)) {
      throw new Error(`[password:rejectCommon:${this.listKey}:${this.path}] Common and frequently-used passwords are not allowed.`);
    } // TODO: checking string length is not simple; might need to revisit this (see https://mathiasbynens.be/notes/javascript-unicode)


    if (String(password).length < this.minLength) {
      throw new Error(`[password:minLength:${this.listKey}:${this.path}] Value must be at least ${this.minLength} characters long.`);
    }
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const CommonPasswordInterface = superclass => class extends superclass {
  setupHooks({
    addPreSaveHook
  }) {
    // Updates the relevant value in the item provided (by referrence)
    addPreSaveHook(async item => {
      const path = this.field.path;
      const plaintext = item[path]; // Only run the hook if the item actually contains the field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO

      if (!(path in item)) {
        return item;
      }

      if (plaintext) {
        if (typeof plaintext === 'string') {
          item[path] = await this.field.generateHash(plaintext);
        } else {
          // Should have been caught by the validator??
          throw `Invalid Password value given for '${path}'`;
        }
      } else {
        item[path] = null;
      }

      return item;
    });
  }

};

class MongoPasswordInterface extends CommonPasswordInterface(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({
        type: String
      }, this.config)
    });
  }

  getQueryConditions(dbPath) {
    return {
      [`${this.path}_is_set`]: value => ({
        [dbPath]: value ? {
          $regex: bcryptHashRegex
        } : {
          $not: bcryptHashRegex
        }
      })
    };
  }

}
class KnexPasswordInterface extends CommonPasswordInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments); // Error rather than ignoring invalid config

    if (this.config.isIndexed) {
      throw `The Password field type doesn't support indexes on Knex. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }

    if (this.config.defaultTo) {
      throw `The Password field type doesn't support the Knex 'defaultTo' config. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }
  }

  addToTableSchema(table) {
    const column = table.string(this.path, 60);
    if (this.isNotNullable) column.notNullable();
  }

  getQueryConditions(dbPath) {
    // JM: I wonder if performing a regex match here leaks any timing info that
    // could be used to extract information about the hash.. :/
    return {
      [`${this.path}_is_set`]: value => b => value ? b.where(dbPath, '~', bcryptHashRegex.source) : b.where(dbPath, '!~', bcryptHashRegex.source).orWhereNull(dbPath)
    };
  }

}
class PrismaPasswordInterface extends CommonPasswordInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments); // Error rather than ignoring invalid config

    if (this.config.isUnique || this.config.isIndexed) {
      throw `The Password field type doesn't support indexes on Prisma. ` + `Check the config for ${this.path} on the ${this.field.listKey} list`;
    }
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'String'
    })];
  }

  getQueryConditions(dbPath) {
    // JM: I wonder if performing a regex match here leaks any timing info that
    // could be used to extract information about the hash.. :/
    return {
      // FIXME: Prisma needs to support regex matching...
      [`${this.path}_is_set`]: value => value ? {
        NOT: {
          [dbPath]: null
        }
      } : {
        [dbPath]: null
      } // ? b.where(dbPath, '~', bcryptHashRegex.source)
      // : b.where(dbPath, '!~', bcryptHashRegex.source).orWhereNull(dbPath),

    };
  }

}

var index$5 = {
  type: 'Password',
  implementation: Password,
  views: {
    Controller: resolveView('types/Password/views/Controller'),
    Field: resolveView('types/Password/views/Field'),
    Filter: resolveView('types/Password/views/Filter'),
    Cell: resolveView('types/Password/views/Cell')
  },
  adapters: {
    mongoose: MongoPasswordInterface,
    knex: KnexPasswordInterface,
    prisma: PrismaPasswordInterface
  }
};

const ParameterError = apolloErrors.createError('ParameterError', {
  message: 'Incorrect parameters supplied',
  options: {
    showPath: true
  }
});

const NESTED_MUTATIONS = ['create', 'connect', 'disconnect', 'disconnectAll'];
/*** Input validation  ***/

const throwWithErrors = (message, meta) => {
  const error = new Error(message);
  throw Object.assign(error, meta);
};

function validateInput({
  input,
  target,
  many
}) {
  // Only accept mutations which we know how to handle.
  let validInputMutations = utils.intersection(Object.keys(input), NESTED_MUTATIONS); // Filter out mutations which don't have any parameters

  if (many) {
    // to-many must have an array of objects
    validInputMutations = validInputMutations.filter(mutation => mutation === 'disconnectAll' || Array.isArray(input[mutation]));
  } else {
    validInputMutations = validInputMutations.filter(mutation => mutation === 'disconnectAll' || Object.keys(input[mutation]).length);
  } // We must have at least one valid mutation


  if (!validInputMutations.length) {
    throw new ParameterError({
      message: `Must provide a nested mutation (${NESTED_MUTATIONS.join(', ')}) when mutating ${target}`
    });
  } // For a non-many relationship we can't create AND connect - only one can be set at a time


  if (!many && validInputMutations.includes('create') && validInputMutations.includes('connect')) {
    throw new ParameterError({
      message: `Can only provide one of 'connect' or 'create' when mutating ${target}`
    });
  }

  return validInputMutations;
}

const cleanAndValidateInput = ({
  input,
  many,
  localField,
  target
}) => {
  try {
    return utils.pick(input, validateInput({
      input,
      target,
      many
    }));
  } catch (error) {
    const message = `Nested mutation operation invalid for ${target}`;
    error.path = ['<validate>'];
    throwWithErrors(message, {
      errors: [error],
      path: [localField.path]
    });
  }
};

const _runActions = async (action, targets, path) => {
  const results = await pSettle__default['default']((targets || []).map(action));
  const errors = results.map((settleInfo, index) => _objectSpread(_objectSpread({}, settleInfo), {}, {
    index
  })).filter(({
    isRejected
  }) => isRejected).map(({
    reason,
    index
  }) => {
    reason.path = [...path, index];
    return reason;
  }); // If there are no errors we know everything resolved successfully

  return [errors.length ? [] : results.map(({
    value
  }) => value), errors];
};

async function resolveNestedMany({
  input,
  currentValue,
  refList,
  context,
  localField,
  target,
  mutationState
}) {
  // Disconnections
  let disconnectIds = [];

  if (input.disconnectAll) {
    disconnectIds = [...currentValue];
  } else if (input.disconnect) {
    // We want to avoid DB lookups where possible, so we split the input into
    // two halves; one with ids, and the other without ids
    const {
      withId,
      withoutId
    } = groupBy__default['default'](input.disconnect, ({
      id
    }) => id ? 'withId' : 'withoutId'); // We set the Ids we do find immediately

    disconnectIds = (withId || []).map(({
      id
    }) => id); // And any without ids (ie; other unique criteria), have to be looked up
    // This will resolve access control, etc for us.
    // In the future, when WhereUniqueInput accepts more than just an id,
    // this will also resolve those queries for us too.

    const action = where => refList.itemQuery(where, context, refList.gqlNames.itemQueryName); // We don't throw if any fail; we're only interested in the ones this user has
    // access to read (and hence remove from the list)


    const disconnectItems = (await pSettle__default['default']((withoutId || []).map(action))).filter(({
      isFulfilled
    }) => isFulfilled).map(({
      value
    }) => value).filter(itemToDisconnect => itemToDisconnect); // Possible to get null results when the id doesn't exist, or read access is denied

    disconnectIds.push(...disconnectItems.map(({
      id
    }) => id));
  } // Connections


  let connectedIds = [];
  let createdIds = [];

  if (input.connect || input.create) {
    // This will resolve access control, etc for us.
    // In the future, when WhereUniqueInput accepts more than just an id,
    // this will also resolve those queries for us too.
    const [connectedItems, connectErrors] = await _runActions(where => refList.itemQuery({
      where
    }, context, refList.gqlNames.itemQueryName), input.connect, ['connect']); // Create related item. Will check for access control itself, no need to do anything extra here.
    // NOTE: We don't check for read access control on the returned ids as the
    // user will not have seen it, so it's ok to return it directly here.

    const [createdItems, createErrors] = await _runActions(data => refList.createMutation(data, context, mutationState), input.create, ['create']);
    const allErrors = [...connectErrors, ...createErrors];

    if (allErrors.length) {
      const message = `Unable to create and/or connect ${allErrors.length} ${target}`;
      throwWithErrors(message, {
        errors: allErrors,
        path: [localField.path]
      });
    }

    connectedIds = connectedItems.map(item => {
      if (item && item.id) {
        return item.id;
      } // Possible to get null results when the id doesn't exist, or read access is denied


      return null;
    });
    createdIds = createdItems.map(item => {
      if (item && item.id) {
        return item.id;
      } // Possible to get null results when the id doesn't exist, or read access is denied


      return null;
    });
  }

  return {
    disconnect: disconnectIds,
    connect: connectedIds,
    create: createdIds
  };
}

async function resolveNestedSingle({
  input,
  currentValue,
  localField,
  refList,
  context,
  target,
  mutationState
}) {
  let result_ = {};

  if ((input.disconnect || input.disconnectAll) && currentValue) {
    let idToDisconnect;

    if (input.disconnectAll) {
      idToDisconnect = currentValue;
    } else if (input.disconnect.id) {
      idToDisconnect = input.disconnect.id;
    } else {
      try {
        // Support other unique fields for disconnection
        idToDisconnect = (await refList.itemQuery({
          where: input.disconnect
        }, context, refList.gqlNames.itemQueryName)).id.toString();
      } catch (error) {// Maybe we don't have read access, or maybe the item doesn't exist
        // (recently deleted, or it's an erroneous value in the relationship field)
        // So we silently ignore it
      }
    }

    if (currentValue === idToDisconnect) {
      // Found the item, so unset it
      result_.disconnect = [idToDisconnect];
    }
  }

  let operation;
  let method;

  if (input.connect) {
    operation = 'connect';

    method = () => refList.itemQuery({
      where: input.connect
    }, context, refList.gqlNames.itemQueryName);
  } else if (input.create) {
    operation = 'create';

    method = () => refList.createMutation(input.create, context, mutationState);
  }

  if (operation) {
    // override result with the connected/created value
    // input is of type *RelateToOneInput
    let item;

    try {
      item = await method();
    } catch (error) {
      const message = `Unable to ${operation} a ${target}`;
      error.path = [operation];
      throwWithErrors(message, {
        errors: [error],
        path: [localField.path]
      });
    } // Might not exist if the input id doesn't exist / the user doesn't have read access


    if (item) {
      result_[operation] = [item.id];
    }
  }

  return result_;
}
/*
 * Resolve the nested mutations and return the ids of items to be connected/disconnected
 *
 * Returns: { connect: [id], disconnect: [id]}
 */


async function resolveNested({
  input,
  currentValue,
  many,
  listInfo,
  context,
  mutationState
}) {
  const localList = listInfo.local.list;
  const localField = listInfo.local.field;
  const refList = listInfo.foreign.list;
  const target = `${localList.key}.${localField.path}<${refList.key}>`;
  const args = {
    currentValue,
    refList,
    input: cleanAndValidateInput({
      input,
      many,
      localField,
      target
    }),
    context,
    localField,
    target,
    mutationState
  };
  return await (many ? resolveNestedMany(args) : resolveNestedSingle(args));
}

class Relationship extends Field {
  constructor(path, {
    ref,
    many,
    withMeta
  }) {
    super(...arguments); // JM: It bugs me this is duplicated in the field adapters but initialisation order makes it hard to avoid

    const [refListKey, refFieldPath] = ref.split('.');
    this.refListKey = refListKey;
    this.refFieldPath = refFieldPath;
    this.isOrderable = true;
    this.isRelationship = true;
    this.many = many;
    this.withMeta = typeof withMeta !== 'undefined' ? withMeta : true;
  }

  get _supportsUnique() {
    return true;
  }

  tryResolveRefList() {
    const {
      listKey,
      path,
      refListKey,
      refFieldPath
    } = this;
    const refList = this.getListByKey(refListKey);

    if (!refList) {
      throw new Error(`Unable to resolve related list '${refListKey}' from ${listKey}.${path}`);
    }

    let refField;

    if (refFieldPath) {
      refField = refList.getFieldByPath(refFieldPath);

      if (!refField) {
        throw new Error(`Unable to resolve two way relationship field '${refListKey}.${refFieldPath}' from ${listKey}.${path}`);
      }
    }

    return {
      refList,
      refField
    };
  }

  gqlOutputFields({
    schemaName
  }) {
    const {
      refList
    } = this.tryResolveRefList();

    if (!refList.access[schemaName].read) {
      // It's not accessible in any way, so we can't expose the related field
      return [];
    }

    if (this.many) {
      const filterArgs = refList.getGraphqlFilterFragment().join('\n');
      return [`${this.path}(${filterArgs}): [${refList.gqlNames.outputTypeName}!]!`, this.withMeta ? `_${this.path}Meta(${filterArgs}): _QueryMeta` : ''];
    } else {
      return [`${this.path}: ${refList.gqlNames.outputTypeName}`];
    }
  }

  extendAdminMeta(meta) {
    const {
      refListKey: ref,
      refFieldPath,
      many
    } = this;
    return _objectSpread(_objectSpread({}, meta), {}, {
      ref,
      refFieldPath,
      many
    });
  }

  gqlQueryInputFields({
    schemaName
  }) {
    const {
      refList
    } = this.tryResolveRefList();

    if (!refList.access[schemaName].read) {
      // It's not accessible in any way, so we can't expose the related field
      return [];
    }

    if (this.many) {
      return [`""" condition must be true for all nodes """
        ${this.path}_every: ${refList.gqlNames.whereInputName}`, `""" condition must be true for at least 1 node """
        ${this.path}_some: ${refList.gqlNames.whereInputName}`, `""" condition must be false for all nodes """
        ${this.path}_none: ${refList.gqlNames.whereInputName}`];
    } else {
      return [`${this.path}: ${refList.gqlNames.whereInputName}`, `${this.path}_is_null: Boolean`];
    }
  }

  gqlOutputFieldResolvers({
    schemaName
  }) {
    const {
      refList
    } = this.tryResolveRefList();

    if (!refList.access[schemaName].read) {
      // It's not accessible in any way, so we can't expose the related field
      return [];
    }

    if (this.many) {
      return _objectSpread({
        [this.path]: (item, args, context, info) => {
          return refList.listQuery(args, context, info.fieldName, info, {
            fromList: this.getListByKey(this.listKey),
            fromId: item.id,
            fromField: this.path
          });
        }
      }, this.withMeta && {
        [`_${this.path}Meta`]: (item, args, context, info) => {
          return refList.listQueryMeta(args, context, info.fieldName, info, {
            fromList: this.getListByKey(this.listKey),
            fromId: item.id,
            fromField: this.path
          });
        }
      });
    } else {
      return {
        [this.path]: (item, _, context, info) => {
          // No ID set, so we return null for the value
          const id = item && (item[this.adapter.idPath] || item[this.path] && item[this.path].id);

          if (!id) {
            return null;
          }

          const filteredQueryArgs = {
            where: {
              id: id.toString()
            }
          }; // We do a full query to ensure things like access control are applied

          return refList.listQuery(filteredQueryArgs, context, refList.gqlNames.listQueryName, info).then(items => items && items.length ? items[0] : null);
        }
      };
    }
  }
  /**
   * @param operations {Object}
   * {
   *   disconnectAll?: Boolean, (default: false),
   *   disconnect?: Array<where>, (default: []),
   *   connect?: Array<where>, (default: []),
   *   create?: Array<data>, (default: []),
   * }
   * NOTE: If `disconnectAll` is `true`, `disconnect` is ignored.
   * `where` is a WhereUniqueInput (eg; { id: "abc123" })
   * `data` is an input of the type expected for the ref list (eg; { data: { name: "Sarah" } })
   *
   * @return {Object}
   * {
   *   disconnect: Array<ID>,
   *   connect: Array<ID>,
   *   create: Array<ID>,
   * }
   * The indexes within the return arrays are guaranteed to match the indexes as
   * passed in `operations`.
   * Due to Access Control, it is possible thata some operations result in a
   * value of `null`. Be sure to guard against this in your code.
   * NOTE: If `disconnectAll` is true, `disconnect` will be an array of all
   * previous stored values, which means indecies may not match those passed in
   * `operations`.
   */


  async resolveNestedOperations(operations, item, context, getItem, mutationState) {
    const {
      refList,
      refField
    } = this.tryResolveRefList();
    const listInfo = {
      local: {
        list: this.getListByKey(this.listKey),
        field: this
      },
      foreign: {
        list: refList,
        field: refField
      }
    }; // Possible early out for null'd field
    // prettier-ignore

    if (!operations && ( // If the field is not required, and the value is `null`, we can ignore
    // it and move on.
    !this.isRequired // This field will be backlinked to this field's containing item, so we
    // can safely ignore it now expecing the backlinking process in the
    // calling code to take care of it.
    || refField && this.getListByKey(refField.refListKey) === listInfo.local.list)) {
      // Don't release the zalgo; always return a promise.
      return Promise.resolve({
        create: [],
        connect: [],
        disconnect: []
      });
    }

    let currentValue;

    if (this.many) {
      const info = {
        fieldName: this.path
      };
      currentValue = item ? await refList.listQuery({}, _objectSpread(_objectSpread({}, context), {}, {
        getListAccessControlForUser: () => true
      }), info.fieldName, info, {
        fromList: this.getListByKey(this.listKey),
        fromId: item.id,
        fromField: this.path
      }) : [];
      currentValue = currentValue.map(({
        id
      }) => id.toString());
    } else {
      currentValue = item && (item[this.adapter.idPath] || item[this.path] && item[this.path].id);
      currentValue = currentValue && currentValue.toString();
    } // Collect the IDs to be connected and disconnected. This step may trigger
    // createMutation calls in order to obtain these IDs if required.


    const {
      create = [],
      connect = [],
      disconnect = []
    } = await resolveNested({
      input: operations,
      currentValue,
      listInfo,
      many: this.many,
      context,
      mutationState
    });
    return {
      create,
      connect,
      disconnect,
      currentValue
    };
  }

  getGqlAuxTypes({
    schemaName
  }) {
    const {
      refList
    } = this.tryResolveRefList();
    const schemaAccess = refList.access[schemaName]; // We need an input type that is specific to creating nested items when
    // creating a relationship, ie;
    //
    // eg: Creating a new post at the same time as a new user
    // mutation createUser() {
    //   posts: [{ create: { title: 'Foobar' } }]
    // }
    //
    // Or, the inverse: Creating a new user at the same time as a new post
    // mutation createPost() {
    //   author: { create: { email: 'eg@example.com' } }
    // }
    //
    // Then there's the linking to existing records usecase:
    // mutation createPost() {
    //   author: { connect: { id: 'abc123' } }
    // }

    if (schemaAccess.read || schemaAccess.create || schemaAccess.update || schemaAccess.delete || schemaAccess.auth) {
      const operations = [];

      if (this.many) {
        if (refList.access[schemaName].create) {
          operations.push(`# Provide data to create a set of new ${refList.key}. Will also connect.
          create: [${refList.gqlNames.createInputName}]`);
        }

        operations.push(`# Provide a filter to link to a set of existing ${refList.key}.
          connect: [${refList.gqlNames.whereUniqueInputName}]`, `# Provide a filter to remove to a set of existing ${refList.key}.
          disconnect: [${refList.gqlNames.whereUniqueInputName}]`, `# Remove all ${refList.key} in this list.
          disconnectAll: Boolean`);
        return [`input ${refList.gqlNames.relateToManyInputName} {
          ${operations.join('\n')}
        }
      `];
      } else {
        if (schemaAccess.create) {
          operations.push(`# Provide data to create a new ${refList.key}.
        create: ${refList.gqlNames.createInputName}`);
        }

        operations.push(`# Provide a filter to link to an existing ${refList.key}.
        connect: ${refList.gqlNames.whereUniqueInputName}`, `# Provide a filter to remove to an existing ${refList.key}.
        disconnect: ${refList.gqlNames.whereUniqueInputName}`, `# Remove the existing ${refList.key} (if any).
        disconnectAll: Boolean`);
        return [`input ${refList.gqlNames.relateToOneInputName} {
          ${operations.join('\n')}
        }
      `];
      }
    } else {
      return [];
    }
  }

  gqlUpdateInputFields({
    schemaName
  }) {
    const {
      refList
    } = this.tryResolveRefList();
    const schemaAccess = refList.access[schemaName];

    if (schemaAccess.read || schemaAccess.create || schemaAccess.update || schemaAccess.delete || schemaAccess.auth) {
      if (this.many) {
        return [`${this.path}: ${refList.gqlNames.relateToManyInputName}`];
      } else {
        return [`${this.path}: ${refList.gqlNames.relateToOneInputName}`];
      }
    } else {
      return [];
    }
  }

  gqlCreateInputFields({
    schemaName
  }) {
    return this.gqlUpdateInputFields({
      schemaName
    });
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}
class MongoRelationshipInterface extends adapterMongoose.MongooseFieldAdapter {
  constructor(...args) {
    super(...args);
    this.idPath = this.dbPath; // JM: It bugs me this is duplicated in the implementation but initialisation order makes it hard to avoid

    const [refListKey, refFieldPath] = this.config.ref.split('.');
    this.refListKey = refListKey;
    this.refFieldPath = refFieldPath;
    this.isRelationship = true;
  }

  addToMongooseSchema(schema, _mongoose, rels) {
    // If we're relating to 'many' things, we don't store ids in this table
    if (!this.field.many) {
      // If we're the right hand side of a 1:1 relationship, do nothing.
      const {
        right,
        cardinality
      } = rels.find(({
        left,
        right
      }) => left.adapter === this || right && right.adapter === this);

      if (cardinality === '1:1' && right && right.adapter === this) {
        return;
      } // Otherwise, we're are hosting a foreign key


      const {
        refListKey,
        config
      } = this;
      const type = mongoose__default['default'].Types.ObjectId;
      schema.add({
        [this.path]: this.mergeSchemaOptions({
          type,
          ref: refListKey
        }, config)
      });
    }
  }

  getQueryConditions(dbPath) {
    return {
      [`${this.path}_is_null`]: value => ({
        [dbPath]: value ? {
          $not: {
            $exists: true,
            $ne: null
          }
        } : {
          $exists: true,
          $ne: null
        }
      })
    };
  }

}
class KnexRelationshipInterface extends adapterKnex.KnexFieldAdapter {
  constructor() {
    super(...arguments);
    this.idPath = this.dbPath;
    this.isRelationship = true; // Default isIndexed to true if it's not explicitly provided
    // Mutually exclusive with isUnique

    this.isUnique = typeof this.config.isUnique === 'undefined' ? false : !!this.config.isUnique;
    this.isIndexed = typeof this.config.isIndexed === 'undefined' ? !this.config.isUnique : !!this.config.isIndexed; // JM: It bugs me this is duplicated in the implementation but initialisation order makes it hard to avoid

    const [refListKey, refFieldPath] = this.config.ref.split('.');
    this.refListKey = refListKey;
    this.refFieldPath = refFieldPath;
  } // Override the isNotNullable defaulting logic; default to false, not field.isRequired
  // Non-nullability of foreign keys in a one-to-many configuration causes problems with complicates creates
  // It implies a precedence in ordering of create operations and can break the nexted create resolvers
  // Also, if a pair of list both have a non-nullable relationship with the other, all inserts on either will fail


  get isNotNullable() {
    if (this._isNotNullable) return this._isNotNullable;
    return this._isNotNullable = !!(typeof this.knexOptions.isNotNullable === 'undefined' ? false : this.knexOptions.isNotNullable);
  }

  addToTableSchema(table, rels) {
    // If we're relating to 'many' things, we don't store ids in this table
    if (!this.field.many) {
      // If we're the right hand side of a 1:1 relationship, do nothing.
      const {
        right,
        cardinality
      } = rels.find(({
        left,
        right
      }) => left.adapter === this || right && right.adapter === this);

      if (cardinality === '1:1' && right && right.adapter === this) {
        return;
      } // The foreign key needs to do this work for us; we don't know what type it is


      const refList = this.getListByKey(this.refListKey);
      const refId = refList.getPrimaryKey();
      const foreignKeyConfig = {
        path: this.path,
        isUnique: this.isUnique,
        isIndexed: this.isIndexed,
        isNotNullable: this.isNotNullable
      };
      refId.adapter.addToForeignTableSchema(table, foreignKeyConfig);
    }
  }

  getQueryConditions(dbPath) {
    return {
      [`${this.path}_is_null`]: value => b => value ? b.whereNull(dbPath) : b.whereNotNull(dbPath)
    };
  }

}
class PrismaRelationshipInterface extends adapterPrisma.PrismaFieldAdapter {
  constructor() {
    super(...arguments);
    this.idPath = `${this.dbPath}Id`;
    this.isRelationship = true; // Default isIndexed to true if it's not explicitly provided
    // Mutually exclusive with isUnique

    this.isUnique = typeof this.config.isUnique === 'undefined' ? false : !!this.config.isUnique;
    this.isIndexed = typeof this.config.isIndexed === 'undefined' ? !this.config.isUnique : !!this.config.isIndexed; // JM: It bugs me this is duplicated in the implementation but initialisation order makes it hard to avoid

    const [refListKey, refFieldPath] = this.config.ref.split('.');
    this.refListKey = refListKey;
    this.refFieldPath = refFieldPath;
  }

  getQueryConditions(dbPath) {
    return {
      [`${this.path}_is_null`]: value => value ? {
        [dbPath]: null
      } : {
        NOT: {
          [dbPath]: null
        }
      }
    };
  }

}

var index$4 = {
  type: 'Relationship',
  isRelationship: true,
  // Used internally for this special case
  implementation: Relationship,
  views: {
    Controller: resolveView('types/Relationship/views/Controller'),
    Field: resolveView('types/Relationship/views/Field'),
    Filter: resolveView('types/Relationship/views/Filter'),
    Cell: resolveView('types/Relationship/views/Cell')
  },
  adapters: {
    mongoose: MongoRelationshipInterface,
    knex: KnexRelationshipInterface,
    prisma: PrismaRelationshipInterface
  }
};

function initOptions(options) {
  let optionsArray = options;
  if (typeof options === 'string') optionsArray = options.split(/\,\s*/);
  if (!Array.isArray(optionsArray)) return null;
  return optionsArray.map(i => {
    return typeof i === 'string' ? {
      value: i,
      label: inflection__default['default'].humanize(i)
    } : i;
  });
}

const VALID_DATA_TYPES = ['enum', 'string', 'integer'];
const DOCS_URL = 'https://keystonejs.com/keystonejs/fields/src/types/select/';

function validateOptions({
  options,
  dataType,
  listKey,
  path
}) {
  if (!VALID_DATA_TYPES.includes(dataType)) {
    throw new Error(`
🚫 The select field ${listKey}.${path} is not configured with a valid data type;
📖 see ${DOCS_URL}
`);
  }

  options.forEach((option, i) => {
    if (dataType === 'enum') {
      if (!/^[a-zA-Z]\w*$/.test(option.value)) {
        throw new Error(`
🚫 The select field ${listKey}.${path} contains an invalid enum value ("${option.value}") in option ${i}
👉 You may want to use the "string" dataType
📖 see ${DOCS_URL}
`);
      }
    } else if (dataType === 'string') {
      if (typeof option.value !== 'string') {
        const integerHint = typeof option.value === 'number' ? `
👉 Did you mean to use the the "integer" dataType?` : '';
        throw new Error(`
🚫 The select field ${listKey}.${path} contains an invalid value (type ${typeof option.value}) in option ${i}${integerHint}
📖 see ${DOCS_URL}
`);
      }
    } else if (dataType === 'integer') {
      if (!Number.isInteger(option.value)) {
        throw new Error(`
🚫 The select field ${listKey}.${path} contains an invalid integer value ("${option.value}") in option ${i}
📖 see ${DOCS_URL}
`);
      }
    }
  });
}

class Select extends Field {
  constructor(path, {
    options,
    dataType = 'enum'
  }) {
    super(...arguments);
    this.options = initOptions(options);
    validateOptions({
      options: this.options,
      dataType,
      listKey: this.listKey,
      path
    });
    this.dataType = dataType;
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: ${this.getTypeName()}`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  getTypeName() {
    if (this.dataType === 'enum') {
      return `${this.listKey}${inflection__default['default'].classify(this.path)}Type`;
    } else if (this.dataType === 'integer') {
      return 'Int';
    } else {
      return 'String';
    }
  }

  getGqlAuxTypes() {
    return this.dataType === 'enum' ? [`
      enum ${this.getTypeName()} {
        ${this.options.map(i => i.value).join('\n        ')}
      }
    `] : [];
  }

  extendAdminMeta(meta) {
    const {
      options,
      dataType
    } = this;
    return _objectSpread(_objectSpread({}, meta), {}, {
      options,
      dataType
    });
  }

  gqlQueryInputFields() {
    // TODO: This could be extended for Int type options with numeric filters
    return [...this.equalityInputFields(this.getTypeName()), ...this.inInputFields(this.getTypeName())];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: ${this.getTypeName()}`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: ${this.getTypeName()}`];
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const CommonSelectInterface = superclass => class extends superclass {
  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.inConditions(dbPath));
  }

};

class MongoSelectInterface extends CommonSelectInterface(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    const options = this.field.dataType === 'integer' ? {
      type: Number
    } : {
      type: String,
      enum: [...this.field.options.map(i => i.value), null]
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(options, this.config)
    });
  }

}
class KnexSelectInterface extends CommonSelectInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    let column;

    if (this.field.dataType === 'enum') {
      column = table.enu(this.path, this.field.options.map(({
        value
      }) => value));
    } else if (this.field.dataType === 'integer') {
      column = table.integer(this.path);
    } else {
      column = table.text(this.path);
    }

    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (typeof this.defaultTo !== 'undefined') column.defaultTo(this.defaultTo);
  }

}
class PrismaSelectInterface extends CommonSelectInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
    this._prismaType = this.config.dataType === 'enum' ? `${this.field.listKey}${inflection__default['default'].classify(this.path)}Enum` : this.config.dataType === 'integer' ? 'Int' : 'String';
  }

  getPrismaEnums() {
    if (!['Int', 'String'].includes(this._prismaType)) {
      return [`enum ${this._prismaType} {
          ${this.field.options.map(i => i.value).join('\n')}
        }`];
    } else return [];
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: this._prismaType
    })];
  }

}

var index$3 = {
  type: 'Select',
  implementation: Select,
  views: {
    Controller: resolveView('types/Select/views/Controller'),
    Field: resolveView('types/Select/views/Field'),
    Filter: resolveView('types/Select/views/Filter'),
    Cell: resolveView('types/Select/views/Cell')
  },
  adapters: {
    mongoose: MongoSelectInterface,
    knex: KnexSelectInterface,
    prisma: PrismaSelectInterface
  }
};

class Text extends Field {
  constructor(path, {
    isMultiline
  }) {
    super(...arguments);
    this.isMultiline = isMultiline;
    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: String`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('String'), ...this.stringInputFields('String'), ...this.equalityInputFieldsInsensitive('String'), ...this.stringInputFieldsInsensitive('String'), ...this.inInputFields('String')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: String`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: String`];
  }

  extendAdminMeta(meta) {
    const {
      isMultiline
    } = this;
    return _objectSpread({
      isMultiline
    }, meta);
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const CommonTextInterface$1 = superclass => class extends superclass {
  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, this.equalityConditions(dbPath)), this.stringConditions(dbPath)), this.equalityConditionsInsensitive(dbPath)), this.stringConditionsInsensitive(dbPath)), this.inConditions(dbPath));
  }

};

class MongoTextInterface extends CommonTextInterface$1(adapterMongoose.MongooseFieldAdapter) {
  addToMongooseSchema(schema) {
    schema.add({
      [this.path]: this.mergeSchemaOptions({
        type: String
      }, this.config)
    });
  }

}
class KnexTextInterface extends CommonTextInterface$1(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    const column = table.text(this.path);
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (typeof this.defaultTo !== 'undefined') column.defaultTo(this.defaultTo);
  }

}
class PrismaTextInterface extends CommonTextInterface$1(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'String'
    })];
  }

}

const MAX_UNIQUE_ATTEMPTS = 100;

const findFirstNonEmptyStringValue = fields => Object.values(fields).find(value => typeof value === 'string' && value);

const generateSlug = valueToSlugify => slugify__default['default'](valueToSlugify || '');

class SlugImplementation extends Text {
  constructor(path, {
    from,
    generate,
    makeUnique,
    alwaysMakeUnique = false,
    isUnique,
    regenerateOnUpdate = true
  }, {
    listKey
  }) {
    const listAndFieldPath = `${listKey}.${path}`;

    if (typeof regenerateOnUpdate !== 'boolean') {
      throw new Error(`The 'regenerateOnUpdate' option on ${listAndFieldPath} must be true/false`);
    }

    if (typeof alwaysMakeUnique !== 'boolean') {
      throw new Error(`The 'alwaysMakeUnique' option on ${listAndFieldPath} must be true/false`);
    }

    if (from && generate) {
      throw new Error(`Only one of 'from' or 'generate' can be supplied as an option to the Slug field on ${listAndFieldPath}.`);
    }

    let generateFn;
    let makeUniqueFn;

    if (from) {
      if (typeof from !== 'string') {
        if (typeof from === 'function') {
          throw new Error(`A function was specified for the 'from' option on ${listAndFieldPath}, but 'from' exects a string. Did you mean to set the 'generate' option?`);
        }

        throw new Error(`The 'from' option on ${listAndFieldPath} must be a string`);
      }

      generateFn = ({
        resolvedData,
        existingItem
      }) => {
        // Look up fields on the list to ensure a valid field was passed
        if (!this.getListByKey(this.listKey).getFieldByPath(from)) {
          throw new Error(`The field '${from}' does not exist on the list '${listKey}' as specified in the 'from' option of '${listAndFieldPath}'`);
        } // Ensure we generate on a complete object (because `resolvedData` may
        // only be partial)


        return generateSlug(_objectSpread(_objectSpread({}, existingItem), resolvedData)[from]);
      };
    } else if (!generate) {
      // Set a default `generate` method
      generateFn = ({
        resolvedData,
        existingItem
      }) => {
        // Ensure we generate on a complete object (because `resolvedData` may
        // only be partial)
        const _existingItem$resolve = _objectSpread(_objectSpread({}, existingItem), resolvedData),
              {
          id,
          name,
          title
        } = _existingItem$resolve,
              fields = _objectWithoutProperties(_existingItem$resolve, ["id", "name", "title"]);

        const valueToSlugify = name || title || findFirstNonEmptyStringValue(fields);

        if (!valueToSlugify) {
          throw new Error('Unable to find a valid field to generate a slug for ${listAndFieldPath}. Please provide a `generate` method.');
        }

        return generateSlug(valueToSlugify);
      };
    } else {
      if (typeof generate !== 'function') {
        throw new Error(`The 'generate' option on ${listAndFieldPath} must be a function, but received ${typeof generate}`);
      } // Wrap the provided generator function in an error handler


      generateFn = async ({
        resolvedData,
        existingItem
      }) => {
        const slug = await generate({
          resolvedData,
          existingItem
        });

        if (typeof slug !== 'string') {
          throw new Error(`${listAndFieldPath}'s 'generate' option resolved with a ${typeof slug}, but expected a string.`);
        }

        return slug;
      };
    }

    if (typeof makeUnique === 'undefined') {
      // Set the default uniqueifying function
      makeUniqueFn = ({
        slug
      }) => `${slug}-${cuid__default['default'].slug()}`;
    } else {
      if (typeof makeUnique !== 'function') {
        throw new Error(`The 'makeUnique' option on ${listAndFieldPath} must be a function, but received ${typeof makeUnique}`);
      } // Wrap the provided makeUnique function in an error handler


      makeUniqueFn = async ({
        slug,
        previousSlug
      }) => {
        const uniqueifiedSlug = await makeUnique({
          slug,
          previousSlug
        });

        if (typeof uniqueifiedSlug !== 'string') {
          throw new Error(`${listAndFieldPath}'s 'makeUnique' option resolved with a ${typeof uniqueifiedSlug}, but expected a string.`);
        }

        return uniqueifiedSlug;
      };
    }

    const isUniqueCalculated = typeof isUnique === 'undefined' ? true : isUnique;
    super(arguments[0], _objectSpread(_objectSpread({}, arguments[1]), {}, {
      // Default isUnique to true
      isUnique: isUniqueCalculated
    }), arguments[2]);
    this.isUnique = isUniqueCalculated;
    this.generateFn = generateFn;
    this.makeUnique = makeUniqueFn;
    this.regenerateOnUpdate = regenerateOnUpdate;
    this.alwaysMakeUnique = alwaysMakeUnique;
    this.isOrderable = true;
  }

  async resolveInput({
    context,
    resolvedData,
    existingItem
  }) {
    let slug; // A slug has been passed in

    if (resolvedData[this.path]) {
      // A slug was passed in, so we want to use that.
      // NOTE: This can result in slugs changing if doing an update and the
      // passed-in slug is not unique:
      // 1. Perform a `create` mutation: `createPost(data: { slug:
      //    "hello-world" }) { slug }`.
      //   * Result: `{ slug: "hello-world" }`
      // 2. Perform a second `create` mutation with the same slug: `createPost(data: { slug: "hello-world" }) { id slug }`.
      //   * Result (approximately): `{ id: "1", slug: "hello-world-weer84fs" }`
      // 3. Perform an update to the second item, with the same slug as the first (again): `updatePost(id: "1", data: { slug: "hello-world" }) { id slug }`.
      //   * Result (approximately): `{ id: "1", slug: "hello-world-uyi3lh32" }`
      //   * The slug has changed, even though we passed the same slug in.
      //     This happens because there is no way to know what the previously
      //     passed-in slug was, only the most recently _uniquified_ slug (ie;
      //     `"hello-world-weer84fs"`).
      slug = resolvedData[this.path];
    } else {
      // During a create
      if (!existingItem) {
        // We always generate a new one
        slug = await this.generateFn({
          resolvedData
        });
      } else {
        // During an update
        // There used to be a slug set, and we don't want to forcibly regenerate
        if (!this.regenerateOnUpdate) {
          // So we re-use that existing slug
          // Later, we check for uniqueness against other items, while excluding
          // this one, ensuring this slug stays stable.
          // NOTE: If a slug was not previously set, this _will not_ generate a
          // new one.
          slug = existingItem[this.path];
        } else {
          // Attempt to regenerate the raw slug (before it was passed through
          // `makeUnique`) from existing data
          const existingNonUniqueSlug = await this.generateFn({
            resolvedData: existingItem
          }); // Now generate the new raw slug (it has yet to be passed through
          // `makeUnique`)

          const newNonUniqueSlug = await this.generateFn({
            resolvedData,
            existingItem
          });

          if (existingNonUniqueSlug === newNonUniqueSlug) {
            // If they match, we can re-use the existing, unique slug. Note this
            // will still pass through uniquification, but because we only check
            // uniqueness against _other_ items, and this item already existed,
            // we can assume it will not need re-uniquifying, so passing it
            // through the logic below is ok.
            slug = existingItem[this.path];
          } else {
            // If they don't match, we have to assume some data important to the
            // slug has changed, so we go with the new value, and let it get
            // uniquified later
            slug = newNonUniqueSlug;
          }
        }
      }
    }

    if (!this.isUnique && !this.alwaysMakeUnique) {
      return slug;
    }

    const listAndFieldPath = `${this.listKey}.${this.path}`; // Repeat until we have a unique slug, or we've tried too many times

    let uniqueSlug = slug;

    for (let i = 0; i < MAX_UNIQUE_ATTEMPTS; i += 1) {
      if (this.alwaysMakeUnique || i > 0) {
        uniqueSlug = await this.makeUnique({
          slug,
          previousSlug: uniqueSlug
        });
      }

      try {
        const result = await serverSideGraphqlClient.getItems({
          // Access Control may filter out some results, so we wouldn't be
          // retreiving an accurate list of all existing items. Because we add the
          // unique constraint to the field, the database will throw an error if
          // we miss a match and try to insert anyway.
          context: context.sudo(),
          listKey: this.listKey,
          first: 1,
          where: _objectSpread({
            [this.path]: uniqueSlug
          }, existingItem && existingItem.id && {
            id_not: existingItem.id
          })
        }); // If there aren't any matches, this slug can be considered unique

        if (result.length === 0) {
          return uniqueSlug;
        }
      } catch (error) {
        throw new Error(`Attempted to generate a unique slug for ${listAndFieldPath}, but failed with an error: ${error.toString()}`);
      }
    }

    throw new Error(`Attempted to generate a unique slug for ${listAndFieldPath}, but failed after too many attempts. If you've passed a custom 'makeUnique' function, ensure it is working correctly`);
  }

}

const Slug = {
  type: 'Slug',
  implementation: SlugImplementation,
  views: {
    Controller: resolveView('types/Text/views/Controller'),
    Field: resolveView('types/Text/views/Field'),
    Filter: resolveView('types/Text/views/Filter')
  },
  adapters: {
    knex: KnexTextInterface,
    mongoose: MongoTextInterface,
    prisma: PrismaTextInterface
  }
};

var index$2 = {
  type: 'Text',
  implementation: Text,
  views: {
    Controller: resolveView('types/Text/views/Controller'),
    Field: resolveView('types/Text/views/Field'),
    Filter: resolveView('types/Text/views/Filter')
  },
  adapters: {
    mongoose: MongoTextInterface,
    knex: KnexTextInterface,
    prisma: PrismaTextInterface
  }
};

var index$1 = {
  type: 'Url',
  implementation: Text,
  views: {
    Controller: resolveView('types/Text/views/Controller'),
    Field: resolveView('types/Url/views/Field'),
    Filter: resolveView('types/Text/views/Filter'),
    Cell: resolveView('types/Url/views/Cell')
  },
  adapters: {
    mongoose: MongoTextInterface,
    knex: KnexTextInterface,
    prisma: PrismaTextInterface
  }
};

class UuidImplementation extends Field {
  constructor(path, {
    caseTo = 'lower'
  }) {
    super(...arguments);

    this.normaliseValue = a => a;

    if (caseTo && caseTo.toString().toLowerCase() === 'upper') {
      this.normaliseValue = a => a && a.toString().toUpperCase();
    } else if (caseTo && caseTo.toString().toLowerCase() === 'lower') {
      this.normaliseValue = a => a && a.toString().toLowerCase();
    }

    this.isOrderable = true;
  }

  get _supportsUnique() {
    return true;
  }

  gqlOutputFields() {
    return [`${this.path}: ID${this.isPrimaryKey ? '!' : ''}`];
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: item => item[this.path]
    };
  }

  gqlQueryInputFields() {
    return [...this.equalityInputFields('ID'), ...this.inInputFields('ID')];
  }

  gqlUpdateInputFields() {
    return [`${this.path}: ID`];
  }

  gqlCreateInputFields() {
    return [`${this.path}: ID`];
  }

  getBackingTypes() {
    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const validator = a => typeof a === 'string' && /^[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}$/.test(a); // TODO: UUIDs _should_ be stored in Mongo using binary subtype 0x04 but strings are easier; see README.md


class MongoUuidInterface extends adapterMongoose.MongooseFieldAdapter {
  addToMongooseSchema(schema, mongoose) {
    const schemaOptions = {
      type: mongoose.Schema.Types.String,
      validate: {
        validator: this.buildValidator(validator),
        message: '{VALUE} is not a valid UUID. Must be 8-4-4-4-12 hex format'
      }
    };
    schema.add({
      [this.path]: this.mergeSchemaOptions(schemaOptions, this.config)
    });
  }

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    // TODO: Remove the need to dereference the list and field to get the normalise function
    addPreSaveHook(item => {
      // Only run the hook if the item actually contains the field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(this.path in item)) {
        return item;
      }

      if (item[this.path]) {
        if (typeof item[this.path] === 'string') {
          item[this.path] = this.field.normaliseValue(item[this.path]);
        } else {
          // Should have been caught by the validator??
          throw `Invalid UUID value given for '${this.path}'`;
        }
      } else {
        item[this.path] = null;
      }

      return item;
    });
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = this.field.normaliseValue(item[this.path]);
      }

      return item;
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath, this.field.normaliseValue)), this.inConditions(dbPath, this.field.normaliseValue));
  }

}
class KnexUuidInterface extends adapterKnex.KnexFieldAdapter {
  constructor() {
    super(...arguments); // TODO: Warning on invalid config for primary keys?

    if (!this.field.isPrimaryKey) {
      this.isUnique = !!this.config.isUnique;
      this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
    }
  }

  addToTableSchema(table) {
    const column = table.uuid(this.path); // Fair to say primary keys are always non-nullable and uniqueness is implied by primary()

    if (this.field.isPrimaryKey) {
      column.primary().notNullable();
    } else {
      if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
      if (this.isNotNullable) column.notNullable();
    }

    if (this.defaultTo) column.defaultTo(this.defaultTo);
  }

  addToForeignTableSchema(table, {
    path,
    isUnique,
    isIndexed,
    isNotNullable
  }) {
    if (!this.field.isPrimaryKey) {
      throw `Can't create foreign key '${path}' on table "${table._tableName}"; ` + `'${this.path}' on list '${this.field.listKey}' as is not the primary key.`;
    }

    const column = table.uuid(path);
    if (isUnique) column.unique();else if (isIndexed) column.index();
    if (isNotNullable) column.notNullable();
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath, this.field.normaliseValue)), this.inConditions(dbPath, this.field.normaliseValue));
  }

}
class PrismaUuidInterface extends adapterPrisma.PrismaFieldAdapter {
  constructor() {
    super(...arguments); // TODO: Warning on invalid config for primary keys?

    if (!this.field.isPrimaryKey) {
      this.isUnique = !!this.config.isUnique;
      this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
    }
  }

  getPrismaSchema() {
    return [this._schemaField({
      type: 'String'
    })];
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath, this.field.normaliseValue)), this.inConditions(dbPath, this.field.normaliseValue));
  }

}

const Uuid = {
  type: 'Uuid',
  implementation: UuidImplementation,
  views: {
    Controller: resolveView('types/Uuid/views/Controller'),
    Field: resolveView('types/Uuid/views/Field'),
    Filter: resolveView('types/Uuid/views/Filter')
  },
  adapters: {
    knex: KnexUuidInterface,
    mongoose: MongoUuidInterface,
    prisma: PrismaUuidInterface
  },
  primaryKeyDefaults: {
    knex: {
      getConfig: client => {
        if (client === 'postgres') {
          return {
            type: Uuid,
            knexOptions: {
              defaultTo: knex => knex.raw('gen_random_uuid()')
            }
          };
        }

        throw `The Uuid field type doesn't provide a default primary key field configuration for the ` + `'${client}' knex client. You'll need to supply your own 'id' field for each list or use a ` + `different field type for your ids (eg '@keystonejs/fields-auto-increment').`;
      }
    },
    prisma: {
      getConfig: client => {
        throw `The Uuid field type doesn't provide a default primary key field configuration for the ` + `'${client}' prisma client. You'll need to supply your own 'id' field for each list or use a ` + `different field type for your ids (eg '@keystonejs/fields-auto-increment').`;
      }
    },
    mongoose: {
      getConfig: () => {
        throw `The Uuid field type doesn't provide a default primary key field configuration for mongoose. ` + `You'll need to supply your own 'id' field for each list or use a different field type for your ` + `ids (eg '@keystonejs/fields-mongoid').`;
      }
    }
  }
};

class Virtual extends Field {
  constructor(path, {
    resolver,
    graphQLReturnType = 'String',
    graphQLReturnFragment = '',
    extendGraphQLTypes = [],
    args = []
  }) {
    super(...arguments);
    this.resolver = resolver;
    this.args = args;
    this.graphQLReturnType = graphQLReturnType;
    this.graphQLReturnFragment = graphQLReturnFragment;
    this.extendGraphQLTypes = extendGraphQLTypes;
  }

  get _supportsUnique() {
    return false;
  }

  gqlOutputFields() {
    const argString = this.args.length ? `(${this.args.map(({
      name,
      type
    }) => `${name}: ${type}`).join('\n')})` : '';
    return [`${this.path}${argString}: ${this.graphQLReturnType}`];
  }

  getGqlAuxTypes() {
    return this.extendGraphQLTypes;
  }

  gqlOutputFieldResolvers() {
    return {
      [`${this.path}`]: this.resolver
    };
  }

  gqlQueryInputFields() {
    return [];
  }

  extendAdminMeta(meta) {
    return _objectSpread(_objectSpread({}, meta), {}, {
      graphQLSelection: this.graphQLReturnFragment,
      isReadOnly: true
    });
  }

  parseFieldAccess(args) {
    const parsedAccess = accessControl.parseFieldAccess(args);
    const fieldDefaults = {
      create: false,
      update: false,
      delete: false
    };
    return Object.keys(parsedAccess).reduce((prev, schemaName) => {
      prev[schemaName] = _objectSpread(_objectSpread({}, fieldDefaults), {}, {
        read: parsedAccess[schemaName].read
      });
      return prev;
    }, {});
  }

  getBackingTypes() {
    return {};
  }

}

const CommonTextInterface = superclass => class extends superclass {
  getQueryConditions() {
    return {};
  }

};

class MongoVirtualInterface extends CommonTextInterface(adapterMongoose.MongooseFieldAdapter) {
  constructor() {
    super(...arguments);
    this.realKeys = [];
  }

  addToMongooseSchema() {}

}
class KnexVirtualInterface extends CommonTextInterface(adapterKnex.KnexFieldAdapter) {
  constructor() {
    super(...arguments);
    this.realKeys = [];
  }

  addToTableSchema() {}

}
class PrismaVirtualInterface extends CommonTextInterface(adapterPrisma.PrismaFieldAdapter) {
  constructor() {
    super(...arguments);
    this.realKeys = [];
  }

  getPrismaSchema() {
    return [];
  }

}

var index = {
  type: 'Virtual',
  implementation: Virtual,
  views: {
    Controller: resolveView('types/Virtual/views/Controller'),
    Cell: resolveView('types/Virtual/views/Cell'),
    Field: resolveView('types/Virtual/views/Field'),
    Filter: resolveView('types/Virtual/views/Filter')
  },
  adapters: {
    mongoose: MongoVirtualInterface,
    knex: KnexVirtualInterface,
    prisma: PrismaVirtualInterface
  }
};

exports.CalendarDay = index$c;
exports.Checkbox = index$b;
exports.DateTime = DateTime;
exports.DateTimeUtc = index$a;
exports.Decimal = index$9;
exports.File = index$8;
exports.Float = index$7;
exports.Implementation = Field;
exports.Integer = index$6;
exports.Password = index$5;
exports.Relationship = index$4;
exports.Select = index$3;
exports.Slug = Slug;
exports.Text = index$2;
exports.Url = index$1;
exports.Uuid = Uuid;
exports.Virtual = index;
