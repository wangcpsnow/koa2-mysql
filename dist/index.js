'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _mysql = require('../models/mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _mysql3 = require('mysql');

var _mysql4 = _interopRequireDefault(_mysql3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author wangcpsnow
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @email wangcpsnow@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @fileoverview koa2 mysql middleview
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

module.exports = function () {
    var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var db;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        db = (0, _mysql2.default)();

                        ctx.mysqlQuery = function (table) {
                            return {
                                get: function get(attrs, opts) {
                                    var query = '',
                                        columns = "*";
                                    if (opts && opts.columns) {
                                        columns = _mysql4.default.escapeId(opts.columns);
                                    }
                                    if (opts && opts.or) {
                                        query = orEscape("SELECT " + columns + " FROM " + table + " WHERE ??", attrs);
                                    } else {
                                        query = andEscape("SELECT " + columns + " FROM " + table + " WHERE ??", attrs);
                                    }
                                    if (opts && opts.order) {
                                        query += ' ORDER BY ' + _mysql4.default.escape(opts.order);
                                    }
                                    if (opts && opts.order && opts.desc) {
                                        query += ' DESC ';
                                    }
                                    if (opts && opts.limit) {
                                        query += ' LIMIT ' + _mysql4.default.escape(opts.limit);
                                    }
                                    if (opts && opts.limit && opts.offset) {
                                        query += ' OFFSET ' + _mysql4.default.escape(opts.offset);
                                    }
                                    return execute(query, db);
                                },
                                post: function post(attrs) {
                                    var query = andEscape("INSERT INTO " + table + " SET ??", attrs, ',');
                                    return execute(query, db);
                                },
                                put: function put(attrs, sel) {
                                    var query = andEscape('UPDATE ' + table + " SET ??", attrs, ',');
                                    query = andEscape(query + " WHERE ??", sel);
                                    return execute(query, db);
                                },
                                delete: function _delete(attrs) {
                                    var query = andEscape("DELETE FROM " + table + " WHERE ??", attrs);
                                    return execute(query, db);
                                }
                            };
                        };
                        _context.next = 4;
                        return next();

                    case 4:
                        db.pool.end();

                    case 5:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function (_x, _x2) {
        return ref.apply(this, arguments);
    };
}();
var execute = function execute(query, db) {
    console.log(query);
    try {
        return db.client.query(query);
    } catch (err) {
        return err;
    }
};
/*AND ,*/
var andEscape = function andEscape(query, values, separator) {
    return query.replace(/\?\?/g, function (txt) {
        if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) !== 'object') {
            throw new Error("Can only escape objects");
        }
        var rtn = [],
            key = '',
            cnt = 0;
        for (key in values) {
            if (values.hasOwnProperty(key) && key !== 'files') {
                cnt += 1;
                rtn.push(_mysql4.default.escapeId(key) + ' = ' + _mysql4.default.escape(values[key]));
            }
        }
        if (cnt === 0) {
            return '1';
        }
        separator = separator || ' AND ';
        return rtn.join(separator);
    });
};
/* OR */
var orEscape = function orEscape(query, values) {
    return query.replace(/\?\?/g, function (txt) {
        if ((typeof values === 'undefined' ? 'undefined' : _typeof(values)) !== 'object') {
            throw new Error("Can only escape objects");
        }
        var rtn = [],
            key = '',
            cnt = 0;
        for (key in values) {
            if (values.hasOwnProperty(key) && key !== 'files') {
                cnt += 1;
                rtn.push(_mysql4.default.escapeId(key) + ' like ' + _mysql4.default.escape("%" + values[key] + "%"));
            }
        }
        if (cnt === 0) {
            return '1';
        }
        return rtn.join(' OR ');
    });
};