# @stadtkatalog/openinghours

This library helps you to work with opening hours received from StadtKatalog.org

## Installation

```
$ npm install @stadtkatalog/openinghours
```

## Usage

```typescript
import {OpeningHours} from "@stadtkatalog/openinghours";
const shop = new OpeningHours({
        mon: ["10:00", "18:00"],
        tue: ["10:00", "18:00"],
        wed: ["10:00", "18:00"],
        thu: ["10:00", "18:00"],
        fri: ["10:00", "18:00"],
        sat: ["16:00", "20:00"],
        sun: ["16:00", "20:00"]
    }, "Europe/Vienna");

shop.isOpenAt(new Date(2018, 7, 13, 9, 59));  // false
shop.isOpenAt(new Date(2018, 7, 13, 10, 0));  // true
shop.isOpenAt(new Date(2018, 7, 13, 17, 59)); // true
shop.isOpenAt(new Date(2018, 7, 13, 18, 0));  // false
```

## Semantics

* Opening hours are an object with the zero or more of the following properties:
  * Weekdays: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`
  * Holidays: `hol`
  * Specific dates: `yyyy-MM-dd`, e.g. `2020-03-30`
* Every property has an associated array with time frames:
  * `[]` – closed, not opened at the given date or weekday
  * `["HH:mm", "HH:mm"]` – open between the two time frames
  * You can define multiple open time frames per day, e.g. `["10:00", "12:30", "17:00", "23:00"]` for 10:00 to 12:30 and 17:00 to 23:00
* A missing property indicates that no information is available for this date or weekday.

### Examples

#### Open only on weekends

A shop with the following opening hours is open only on Saturday and Sunday,
but not during the week. It is unknown if the shop is open on a holiday.

```json
{
  "mon": [],
  "tue": [],
  "wed": [],
  "thu": [],
  "fri": [],
  "sat": ["10:00", "20:00"],
  "sun": ["10:00", "20:00"]
}
```

With the additional `hol` property it will be open on holidays too:
```json
{
  "mon": [],
  "tue": [],
  "wed": [],
  "thu": [],
  "fri": [],
  "sat": ["10:00", "20:00"],
  "sun": ["10:00", "20:00"],
  "hol": ["10:00", "20:00"]
}
```

#### Only open on special dates

This shop will be open only around christmas from 8 am to 12 am and from
2 pm to 8 pm:

```json
{
  "mon": [],
  "tue": [],
  "wed": [],
  "thu": [],
  "fri": [],
  "sat": [],
  "sun": [],
  "hol": [],
  "2020-12-20": ["08:00", "12:00", "14:00", "20:00"],
  "2020-12-21": ["08:00", "12:00", "14:00", "20:00"],
  "2020-12-22": ["08:00", "12:00", "14:00", "20:00"],
  "2020-12-23": ["08:00", "12:00", "14:00", "20:00"],
  "2020-12-24": ["08:00", "12:00", "14:00", "20:00"],
  "2020-12-25": ["08:00", "12:00", "14:00", "20:00"],
  "2020-12-26": ["08:00", "12:00", "14:00", "20:00"]
}
```

#### Unknown opening hours

Since no property is defined the opening hours are unknown.

```json
{}
```

## Class OpeningHours

Stores opening hours and provides methods to work with them.

**`see`** https://docs.stadtkatalog.org/

### Constructors

\+ **new OpeningHours**(`hours`: [IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md), `timezone`: string, `holidays`: string[]): *[OpeningHours](_openinghours_.openinghours.md)*

[Constructor details](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#constructors)

### Accessors

* [holidays](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#holidays)
* [hours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#hours)
* [specialDays](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#specialdays)
* [timezone](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#timezone)

### Methods

* [fold](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#fold)
* [getOverlongPrecedingWeekdayKey](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#getoverlongprecedingweekdaykey)
* [isHoliday](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#isholiday)
* [isOpenAt](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#isopenat)
* [isSpecialDay](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#isspecialday)
* [isUnknown](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#isunknown)
* [weekdayToWeekdayKey](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#static-weekdaytoweekdaykey)

### Constructor Details

\+ **new OpeningHours**(`hours`: [IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md), `timezone`: string, `holidays`: string[]): *[OpeningHours](_openinghours_.openinghours.md)*

Creates a new instance with the given opening hours in the specified time zone.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`hours` | [IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md) | - | contains the opening hours for each day. If a weekday key is not defined, the opening        hours on this particular day are unknown. If a weekday key references an empty array `[]`,        the entity is closed on this day. In all other cases a weekday key references an array        with multiple time frames in the format `["hh:mm", "hh:mm", ...]`.        Special days must be in the form `YYYY-MM-DD` |
`timezone` | string | - | the time zone of the entity |
`holidays` | string[] | [] | - |

**Returns:** *[OpeningHours](_openinghours_.openinghours.md)*

### Accessors

####  holidays

• **get holidays**(): *string[]*

**Returns:** *string[]*

___

####  hours

• **get hours**(): *[IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md)*

**Returns:** *[IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md)*

___

####  specialDays

• **get specialDays**(): *[IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md)*

**Returns:** *[IOpeningHours](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.iopeninghours.md)*

___

####  timezone

• **get timezone**(): *string*

**Returns:** *string*

### Methods

####  fold

▸ **fold**(`formatOptions`: [FormatOptions](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.formatoptions.md)): *string*

Folds the opening hours into a human readable string.

**`see`** https://moment.github.io/luxon/docs/manual/intl.html

**`see`** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`formatOptions` | [FormatOptions](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/interfaces/_types_.formatoptions.md) | {} | formatting options. |

**Returns:** *string*

___

####  getOverlongPrecedingWeekdayKey

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

####  isHoliday

▸ **isHoliday**(`dateStr`: string): *boolean*

Checks if the given date string is on a holiday for the `IOpeningHours` instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dateStr` | string | the date in the format `YYYY-MM-DD` |

**Returns:** *boolean*

`true` if holiday, `false` otherwise

___

####  isOpenAt

▸ **isOpenAt**(`date`: Date): *boolean*

Checks if the instance is open at the given date.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`date` | Date | JavaScript Date instance |

**Returns:** *boolean*

true if the instance is open, false otherwise

___

####  isSpecialDay

▸ **isSpecialDay**(`dateStr`: string): *boolean*

Checks if the given date string is on a day with special opening hours.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dateStr` | string | the date in the format `YYYY-MM-DD` |

**Returns:** *boolean*

`true` if holiday, `false` otherwise

___

####  isUnknown

▸ **isUnknown**(): *boolean*

Returns true if the opening hours represented by the instance are unknown.

**Returns:** *boolean*

___

#### `Static` weekdayToWeekdayKey

▸ **weekdayToWeekdayKey**(`weekday`: number): *"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"*

Returns the shorthand name for the given weekday.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`weekday` | number | 1 is Monday and 7 is Sunday |

**Returns:** *"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"*

three letter weekday key


## Licenses
* This code is licensed under ISC aka BSD
* Business hour parser is based on [whamtet/smidgen](https://github.com/whamtet/smidgen/)
