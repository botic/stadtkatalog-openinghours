
# Class: OpeningHours

Stores opening hours and provides methods to work with them.

**`see`** https://docs.stadtkatalog.org/

## Hierarchy

* **OpeningHours**

## Index

### Constructors

* [constructor](_openinghours_.openinghours.md#constructor)

### Accessors

* [holidays](_openinghours_.openinghours.md#holidays)
* [hours](_openinghours_.openinghours.md#hours)
* [specialDays](_openinghours_.openinghours.md#specialdays)
* [timezone](_openinghours_.openinghours.md#timezone)

### Methods

* [fold](_openinghours_.openinghours.md#fold)
* [getOverlongPrecedingWeekdayKey](_openinghours_.openinghours.md#getoverlongprecedingweekdaykey)
* [isHoliday](_openinghours_.openinghours.md#isholiday)
* [isOpenAt](_openinghours_.openinghours.md#isopenat)
* [isSpecialDay](_openinghours_.openinghours.md#isspecialday)
* [isUnknown](_openinghours_.openinghours.md#isunknown)
* [weekdayToWeekdayKey](_openinghours_.openinghours.md#static-weekdaytoweekdaykey)

## Constructors

###  constructor

\+ **new OpeningHours**(`hours`: [IOpeningHours](../interfaces/_types_.iopeninghours.md), `timezone`: string, `holidays`: string[]): *[OpeningHours](_openinghours_.openinghours.md)*

Creates a new instance with the given opening hours in the specified time zone.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hours` | [IOpeningHours](../interfaces/_types_.iopeninghours.md) | - | contains the opening hours for each day. If a weekday key is not defined, the opening        hours on this particular day are unknown. If a weekday key references an empty array `[]`,        the entity is closed on this day. In all other cases a weekday key references an array        with multiple time frames in the format `["hh:mm", "hh:mm", ...]`.        Special days must be in the form `YYYY-MM-DD` |
`timezone` | string | - | the time zone of the entity |
`holidays` | string[] | [] | - |

**Returns:** *[OpeningHours](_openinghours_.openinghours.md)*

## Accessors

###  holidays

• **get holidays**(): *string[]*

**Returns:** *string[]*

___

###  hours

• **get hours**(): *[IOpeningHours](../interfaces/_types_.iopeninghours.md)*

**Returns:** *[IOpeningHours](../interfaces/_types_.iopeninghours.md)*

___

###  specialDays

• **get specialDays**(): *[IOpeningHours](../interfaces/_types_.iopeninghours.md)*

**Returns:** *[IOpeningHours](../interfaces/_types_.iopeninghours.md)*

___

###  timezone

• **get timezone**(): *string*

**Returns:** *string*

## Methods

###  fold

▸ **fold**(`formatOptions`: [FormatOptions](../interfaces/_types_.formatoptions.md)): *string*

Folds the opening hours into a human readable string.

**`see`** https://moment.github.io/luxon/docs/manual/intl.html

**`see`** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`formatOptions` | [FormatOptions](../interfaces/_types_.formatoptions.md) | {} | formatting options. |

**Returns:** *string*

___

###  getOverlongPrecedingWeekdayKey

▸ **getOverlongPrecedingWeekdayKey**(`date`: Date): *null | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "hol"*

Checks if the preceding day is overlong and returns the weekday key of this overlong day.
An overlong day ends after 23:59 hours and continues into the following one,
e.g. if the business hours are on Friday from 10:00 - 04:00; or in a 24/7 shop from 00:00 - 24:00.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`date` | Date | JavaScript date |

**Returns:** *null | "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "hol"*

the preceding three-letter weekday key; or `null` if no overlong preceding day found

___

###  isHoliday

▸ **isHoliday**(`dateStr`: string): *boolean*

Checks if the given date string is on a holiday for the `IOpeningHours` instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dateStr` | string | the date in the format `YYYY-MM-DD` |

**Returns:** *boolean*

`true` if holiday, `false` otherwise

___

###  isOpenAt

▸ **isOpenAt**(`date`: Date): *boolean*

Checks if the instance is open at the given date.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`date` | Date | JavaScript Date instance |

**Returns:** *boolean*

true if the instance is open, false otherwise

___

###  isSpecialDay

▸ **isSpecialDay**(`dateStr`: string): *boolean*

Checks if the given date string is on a day with special opening hours.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dateStr` | string | the date in the format `YYYY-MM-DD` |

**Returns:** *boolean*

`true` if holiday, `false` otherwise

___

###  isUnknown

▸ **isUnknown**(): *boolean*

Returns true if the opening hours represented by the instance are unknown.

**Returns:** *boolean*

___

### `Static` weekdayToWeekdayKey

▸ **weekdayToWeekdayKey**(`weekday`: number): *"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"*

Returns the shorthand name for the given weekday.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`weekday` | number | 1 is Monday and 7 is Sunday |

**Returns:** *"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"*

three letter weekday key
