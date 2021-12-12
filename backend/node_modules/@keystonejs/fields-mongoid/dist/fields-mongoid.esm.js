import path from 'path';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import { Implementation, Text } from '@keystonejs/fields';
import { MongooseFieldAdapter } from '@keystonejs/adapter-mongoose';
import { KnexFieldAdapter } from '@keystonejs/adapter-knex';
import { PrismaFieldAdapter } from '@keystonejs/adapter-prisma';

class MongoIdImplementation extends Implementation {
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
    if (this.path === 'id') {
      return {
        [this.path]: {
          optional: false,
          type: 'string'
        }
      };
    }

    return {
      [this.path]: {
        optional: true,
        type: 'string | null'
      }
    };
  }

}

const validator = a => a ? /^[0-9a-fA-F]{24}$/.test(a.toString()) : true;

const normaliseValue = a => a ? a.toString().toLowerCase() : null;

class MongooseMongoIdInterface extends MongooseFieldAdapter {
  addToMongooseSchema(schema, mongoose) {
    // If this field is the primary key we actually don't have to add it; it's implicit
    if (this.field.isPrimaryKey) return;
    const schemaOptions = {
      type: mongoose.Schema.Types.ObjectId,
      validate: {
        validator: this.buildValidator(validator),
        message: '{VALUE} is not a valid Mongo ObjectId'
      }
    };
    schema.add({
      [this.field.isPrimaryKey ? '_id' : this.path]: this.mergeSchemaOptions(schemaOptions, this.config)
    });
  }

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    if (!this.field.isPrimaryKey) return;
    addPreSaveHook(item => {
      if (item.id) {
        item._id = item.id;
        delete item.id;
      }

      return item;
    });
    addPostReadHook(itemOrModel => {
      // Sometimes this is called with a mongoose model, sometimes with an object and sometimes with null
      // I do no know why
      const item = itemOrModel && itemOrModel.toObject ? itemOrModel.toObject() : itemOrModel;

      if (item && item._id) {
        item.id = item._id.toString();
        delete item._id;
      }

      return item;
    });
  }

  getQueryConditions(dbPath) {
    const mongoose = this.listAdapter.parentAdapter.mongoose;
    return _objectSpread(_objectSpread({}, this.equalityConditions(this.field.isPrimaryKey ? '_id' : dbPath, s => s && mongoose.Types.ObjectId(s))), this.inConditions(this.field.isPrimaryKey ? '_id' : dbPath, s => s && mongoose.Types.ObjectId(s)));
  }

}
class KnexMongoIdInterface extends KnexFieldAdapter {
  constructor() {
    super(...arguments);
    this.isUnique = !!this.config.isUnique;
    this.isIndexed = !!this.config.isIndexed && !this.config.isUnique;
  }

  addToTableSchema(table) {
    const column = table.string(this.path, 24);
    if (this.isUnique) column.unique();else if (this.isIndexed) column.index();
    if (this.isNotNullable) column.notNullable();
    if (this.defaultTo) column.defaultTo(this.defaultTo);
  }

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    addPreSaveHook(item => {
      // Only run the hook if the item actually contains the field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(this.path in item)) {
        return item;
      }

      if (item[this.path]) {
        if (typeof item[this.path] === 'string' && validator(item[this.path])) {
          item[this.path] = normaliseValue(item[this.path]);
        } else {
          // Should have been caught by the validator??
          throw new Error(`Invalid MongoID value given for '${this.path}'`);
        }
      } else {
        item[this.path] = null;
      }

      return item;
    });
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = normaliseValue(item[this.path]);
      }

      return item;
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath, normaliseValue)), this.inConditions(dbPath, normaliseValue));
  }

}
class PrismaMongoIdInterface extends PrismaFieldAdapter {
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

  setupHooks({
    addPreSaveHook,
    addPostReadHook
  }) {
    addPreSaveHook(item => {
      // Only run the hook if the item actually contains the field
      // NOTE: Can't use hasOwnProperty here, as the mongoose data object
      // returned isn't a POJO
      if (!(this.path in item)) {
        return item;
      }

      if (item[this.path]) {
        if (typeof item[this.path] === 'string' && validator(item[this.path])) {
          item[this.path] = normaliseValue(item[this.path]);
        } else {
          // Should have been caught by the validator??
          throw new Error(`Invalid MongoID value given for '${this.path}'`);
        }
      } else {
        item[this.path] = null;
      }

      return item;
    });
    addPostReadHook(item => {
      if (item[this.path]) {
        item[this.path] = normaliseValue(item[this.path]);
      }

      return item;
    });
  }

  getQueryConditions(dbPath) {
    return _objectSpread(_objectSpread({}, this.equalityConditions(dbPath, normaliseValue)), this.inConditions(dbPath, normaliseValue));
  }

}

const pkgDir = path.dirname(require.resolve('@keystonejs/fields-mongoid/package.json'));
const MongoId = {
  type: 'MongoId',
  implementation: MongoIdImplementation,
  views: {
    Controller: path.join(pkgDir, 'views/Controller'),
    Field: Text.views.Field,
    Filter: path.join(pkgDir, 'views/Filter')
  },
  adapters: {
    knex: KnexMongoIdInterface,
    mongoose: MongooseMongoIdInterface,
    prisma: PrismaMongoIdInterface
  },
  primaryKeyDefaults: {
    knex: {
      getConfig: () => {
        throw `The MongoId field type doesn't provide a default primary key field configuration for knex. ` + `You'll need to supply your own 'id' field for each list or use a different field type for your ` + `ids (eg '@keystonejs/fields-auto-increment').`;
      }
    },
    prisma: {
      getConfig: () => {
        throw `The MongoId field type doesn't provide a default primary key field configuration for Prisma. ` + `You'll need to supply your own 'id' field for each list or use a different field type for your ` + `ids (eg '@keystonejs/fields-auto-increment').`;
      }
    },
    mongoose: {
      getConfig: () => ({
        type: MongoId
      })
    }
  }
};

export { MongoId };
