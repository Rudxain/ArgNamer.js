'use strict'

/**
@template T
@param {T} x
*/
const isIterable = x => /**@type {T extends Iterable ? true : false}*/(
	x != null && typeof x[Symbol.iterator] == 'function'
)

/**
@template T
@template {PropertyKey} K
@param {{[k in K]: T}} o
@param {K} k
*/
const getOwn = (o, k) => Object.hasOwn(o, k) ? o[k] : undefined

/**
decorator that makes positional-params into named-args object-bag.

this will be deprecated when
[this proposal](https://github.com/samuelgoto/proposal-named-parameters)
gets to Stage 4

@param {() => unknown} fn
@param {Iterable<PropertyKey>} kwargs
@return {(bag?: {}, ...rest: unknown[]) => unknown}
@example
const div = (a, b) => a / b
const named_div = ArgNamer(div, ['n', 'd'])

named_div({ n: 1, d: 2 }) //0.5
named_div({ d: 2, n: 3 }) //1.5

const named_split = ArgNamer(''.split, ['del', 'lim'])
const test = 'hello world foobar'

named_split.call(test, {del: ' ', lim: 4}) //["hello", "world", "foobar"]
named_split.call(test, {del: ' ', lim: 1}) //["hello world foobar"]
*/
const ArgNamer = (fn, kwargs) => function (bag = {}, ...rest) {
	const args = []

	if (isIterable(kwargs))
		for (const k of kwargs)
			args.push(bag != null ? getOwn(bag, k) : undefined)

	return fn.apply(this, [...args, ...rest])
}

export default ArgNamer
