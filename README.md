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
  * Special dates for day-specific hours: `yyyy-MM-dd`, e.g. `2020-03-30`
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

* [Constructor](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#constructor)

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
* [reduce](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#reduce)
* [weekdayToWeekdayKey](https://github.com/botic/stadtkatalog-openinghours/blob/master/doc/classes/_openinghours_.openinghours.md#static-weekdaytoweekdaykey)

## Licenses
* This code is licensed under ISC aka BSD
* Business hour parser is based on [whamtet/smidgen](https://github.com/whamtet/smidgen/)
