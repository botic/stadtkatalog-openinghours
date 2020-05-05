
# Module: "parser"

## Index

### Variables

* [WEEKDAY_INDEX_TO_KEY](_parser_.md#const-weekday_index_to_key)
* [grammar](_parser_.md#const-grammar)
* [parser](_parser_.md#const-parser)

### Functions

* [foldWeekday](_parser_.md#foldweekday)
* [parseHours](_parser_.md#parsehours)

## Variables

### `Const` WEEKDAY_INDEX_TO_KEY

• **WEEKDAY_INDEX_TO_KEY**: *string[]* = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "hol"
] as string[]

___

### `Const` grammar

• **grammar**: *string* = fs.readFileSync(`${__dirname}/parsers/opening_hours.pegjs`, { encoding: "utf8" })

___

### `Const` parser

• **parser**: *Parser* = peg.generate(grammar)

## Functions

###  foldWeekday

▸ **foldWeekday**(`rawDay`: number[][]): *string[]*

**Parameters:**

Name | Type |
------ | ------ |
`rawDay` | number[][] |

**Returns:** *string[]*

___

###  parseHours

▸ **parseHours**(`str`: string): *[IOpeningHours](../interfaces/_types_.iopeninghours.md)*

Parses the given string and returns an opening hours object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`str` | string | opening hours in a human readable format  |

**Returns:** *[IOpeningHours](../interfaces/_types_.iopeninghours.md)*
