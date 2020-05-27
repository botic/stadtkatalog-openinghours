
# Interface: SpecialDatesFormat

Format options and range filters for dates with special opening hours, which have keys in the form `yyyy-MM-dd`.
The range of included special dates can be limited with the `from` and `to` property.

## Hierarchy

* **SpecialDatesFormat**

## Index

### Properties

* [format](_types_.specialdatesformat.md#optional-format)
* [from](_types_.specialdatesformat.md#optional-from)
* [to](_types_.specialdatesformat.md#optional-to)

## Properties

### `Optional` format

• **format**? : *undefined | string*

Date format string for dates with special opening hours.

**`see`** https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens

___

### `Optional` from

• **from**? : *Date | undefined*

The first day from which special dates will be included in the result.
Any defined special dates before this date will be ignored.
If not defined, the current day will be used.

___

### `Optional` to

• **to**? : *Date | undefined*

The last day to which special dates will be included in the result.
If not defined, no upper limit will be applied.
