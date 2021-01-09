"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const admin_bro_1 = require("admin-bro");
const TYPES_MAPPING = [
    ['STRING', 'string'],
    ['TEXT', 'string'],
    ['INTEGER', 'number'],
    ['BIGINT', 'number'],
    ['FLOAT', 'float'],
    ['REAL', 'float'],
    ['DOUBLE', 'float'],
    ['DECIMAL', 'float'],
    ['DATE', 'datetime'],
    ['DATEONLY', 'date'],
    ['ENUM', 'string'],
    ['ARRAY', 'array'],
    ['JSON', 'object'],
    ['JSONB', 'object'],
    ['BLOB', 'string'],
    ['UUID', 'string'],
    ['CIDR', 'string'],
    ['INET', 'string'],
    ['MACADDR', 'string'],
    ['RANGE', 'string'],
    ['GEOMETRY', 'string'],
    ['BOOLEAN', 'boolean'],
];
class Property extends admin_bro_1.BaseProperty {
    constructor(sequelizePath) {
        const { fieldName } = sequelizePath;
        super({ path: fieldName });
        this.fieldName = fieldName;
        this.sequelizePath = sequelizePath;
    }
    name() {
        return this.fieldName;
    }
    isEditable() {
        if (this.sequelizePath._autoGenerated) {
            return false;
        }
        if (this.sequelizePath.autoIncrement) {
            return false;
        }
        if (this.isId()) {
            return false;
        }
        return true;
    }
    isVisible() {
        // fields containing password are hidden by default
        return !this.name().match('password');
    }
    isId() {
        return !!this.sequelizePath.primaryKey;
    }
    reference() {
        var _a;
        if (this.isArray()) {
            return null;
        }
        if (this.sequelizePath.references === 'string') {
            return this.sequelizePath.references;
        }
        if (this.sequelizePath.references && typeof this.sequelizePath.references !== 'string') {
            return (_a = this.sequelizePath.references) === null || _a === void 0 ? void 0 : _a.model;
        }
        return null;
    }
    availableValues() {
        return this.sequelizePath.values && this.sequelizePath.values.length
            ? this.sequelizePath.values
            : null;
    }
    isArray() {
        return this.sequelizePath.type.constructor.name === 'ARRAY';
    }
    /**
     * @returns {PropertyType}
     */
    type() {
        let sequelizeType = this.sequelizePath.type;
        if (this.isArray()) {
            sequelizeType = sequelizeType.type;
        }
        const key = TYPES_MAPPING.find((element) => (sequelizeType.constructor.name === element[0]));
        if (this.reference()) {
            return 'reference';
        }
        const type = key && key[1];
        return (type || 'string');
    }
    isSortable() {
        return this.type() !== 'mixed' && !this.isArray();
    }
    isRequired() {
        return !(typeof this.sequelizePath.allowNull === 'undefined'
            || this.sequelizePath.allowNull === true);
    }
}
exports.default = Property;
