
# Interface: FormatOptions

Formatting options for folded opening hours.

## Hierarchy

* **FormatOptions**

## Index

### Properties

* [closedPlaceholder](_types_.formatoptions.md#optional-closedplaceholder)
* [delimiter](_types_.formatoptions.md#optional-delimiter)
* [holidayPrefix](_types_.formatoptions.md#optional-holidayprefix)
* [hyphen](_types_.formatoptions.md#optional-hyphen)
* [locale](_types_.formatoptions.md#optional-locale)
* [specialDates](_types_.formatoptions.md#optional-specialdates)
* [timeFrameDelimiter](_types_.formatoptions.md#optional-timeframedelimiter)
* [timeFrameFormat](_types_.formatoptions.md#optional-timeframeformat)
* [weekdayFormat](_types_.formatoptions.md#optional-weekdayformat)

## Properties

### `Optional` closedPlaceholder

• **closedPlaceholder**? : *undefined | string*

Placeholder if empty time frames = closed.

___

### `Optional` delimiter

• **delimiter**? : *undefined | string*

delimiter between two time ranges, e.g. the comma in `"10:00 – 12:00, 14:30 – 20:00"`, default `", "`

___

### `Optional` holidayPrefix

• **holidayPrefix**? : *undefined | string*

Prefix for holiday opening hours, default `"Holidays"`

___

### `Optional` hyphen

• **hyphen**? : *undefined | string*

divider between generated time ranges, e.g. the hypen in `"10:00 – 12:00"`, default `" – "`

___

### `Optional` locale

• **locale**? : *undefined | string*

the locale is used when formatting the name of the day, requires an installed ICU or browser support

___

### `Optional` specialDates

• **specialDates**? : *undefined | object*

Format for dates with special opening hours, which have keys in the form  'yyyy-MM-dd'.
The range of included special dates can be limited with the `from` and `to` property.

**`see`** https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens

___

### `Optional` timeFrameDelimiter

• **timeFrameDelimiter**? : *undefined | string*

Delimiter between multiple time frames, default `" and "`

___

### `Optional` timeFrameFormat

• **timeFrameFormat**? : *undefined | string*

Format string for time frames, default `"{start} to {end}"`

___

### `Optional` weekdayFormat

• **weekdayFormat**? : *[WeekdayFormat](../enums/_types_.weekdayformat.md)*

format for the representation of a weekday, default `"short"`
