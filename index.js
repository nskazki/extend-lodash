'use strict';

var lodash = require('lodash').noConflict()
var mixin = lodash.mixin

mixin(lodash, { newMerge: newMerge })
mixin(lodash, { newExtend: newExtend })
mixin(lodash, { extendArray: extendArray })
mixin(lodash, { concatArray: concatArray })
mixin(lodash, { concatString: concatString })
mixin(lodash, { hasSubstring: hasSubstring })
mixin(lodash, { parallel: parallel })
mixin(lodash, { matchGlobal: matchGlobal })
mixin(lodash, { strLength: strLength })
mixin(lodash, { castToString: castToString })
lodash.prototype.v = lodash.prototype.value

module.exports = lodash

var has = lodash.has
var set = lodash.set
var rest = lodash.rest
var last = lodash.last
var merge = lodash.merge
var spread = lodash.spread
var extend = lodash.extend
var toArray = lodash.toArray
var isArray = lodash.isArray
var partial = lodash.partial
var includes = lodash.includes
var isRegExp = lodash.isRegExp
var isString = lodash.isString
var isFunction = lodash.isFunction

var format = require('util').format

;(function mixinString() {
    var blackList = concatArray(
        Object.getOwnPropertyNames(Object),
        Object.getOwnPropertyNames(Object.prototype))
    Object.getOwnPropertyNames(String.prototype)
        .filter(function(name) { return isFunction(String.prototype[name]) })
        .filter(function(name) { return !has(lodash, name) })
        .filter(function(name) { return !includes(blackList, name) })
        .forEach(function(name) {
            var method = String.prototype[name]
            var func = method.call.bind(method)
            mixin(lodash, set({}, name, func))
        })
})()

function newMerge() {
    var args = toArray(arguments)
    return spread(merge)(concatArray({}, args))
}

function newExtend() {
    var args = toArray(arguments)
    return spread(extend)(concatArray({}, args))
}

function extendArray(array) {
    if (!isArray(array))
        throw new Error(format('not array first arg: %j', arguments))

    var toExtend = rest(toArray(arguments))
    toExtend.forEach(function(el) {
        var toPush = isArray(el) ? el : [ el ]
        Array.prototype.push.apply(array, toPush)
    })

    return array
}

function concatArray(array) {
    var args = toArray(arguments)
    return Array.prototype.concat.apply([], args)
}

function concatString() {
    var args = toArray(arguments)
    return String.prototype.concat.apply('', args)
}

function hasSubstring(string) {
    var args = toArray(arguments).slice(1)
    return args.every(function(arg) {
        return isRegExp(arg)
            ? arg.test(string)
            : ~string.indexOf(arg)
    })
}

function parallel() {
    var funcs = toArray(arguments)
    return function() {
        var args = toArray(arguments)
        return funcs.map(function(func) {
            return spread(func)(args)
        })
    }
}

function matchGlobal(body, regexp) {
    var toReturn = []
    var match
    while (match = regexp.exec(body)) {
        toReturn.push(last(match))
        if (!regexp.global) break
    }
    return toReturn
}

function castToString() {
    var args = toArray(arguments)
    return args
        .map(function(arg) { return '' + value })
        .join('')
}

function strLength() {
    var args = toArray(arguments)
    return spread(castToString)(args).length
}

// v3 -> v4

lodash.all = lodash.every
lodash.any = lodash.some
lodash.backflow = lodash.flowRight
lodash.callback = lodash.iteratee
lodash.collect = lodash.map
lodash.compose = lodash.flowRight
lodash.contains = lodash.includes
lodash.detect = lodash.find
lodash.findWhere = NotSupported('findWhere')
lodash.foldl = lodash.reduce
lodash.foldr = lodash.reduceRight
lodash.include = lodash.includes
lodash.indexBy = NotSupported('indexBy')
lodash.inject = lodash.reduce
lodash.methods = lodash.functions
lodash.modArgs = NotSupported('modArgs')
lodash.object = lodash.zipObject
lodash.padLeft = lodash.padStart
lodash.padRight = lodash.padEnd
lodash.pairs = NotSupported('pairs')
lodash.pluck = NotSupported('pluck')
lodash.restParam = NotSupported('restParam')
lodash.select = lodash.filter
lodash.sortByAll = NotSupported('sortByAll')
lodash.sortByOrder = NotSupported('sortByOrder')
lodash.trimLeft = lodash.trimStart
lodash.trimRight = lodash.trimEnd
lodash.trunc = NotSupported('trunc')
lodash.unique = lodash.uniq
lodash.where = NotSupported('where')

function NotSupported(name) {
    return function notSupported() {
        console.error(new Error(name + ' is not supported in lodash@4 - try to find a replacer or rollback to extend-lodash@1.0.0'))
        const method = require('./lodash-v3/' + name)
        return method.apply(null, arguments)
    }
}
