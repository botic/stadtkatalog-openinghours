
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

Placeholder if time frames are empty, which indicate a closed business on the corresponding weekdays or dates.

___

### `Optional` delimiter

• **delimiter**? : *undefined | string*

Delimiter between two time ranges, e.g. the comma in `"10:00 – 12:00, 14:30 – 20:00"`, default `", "`

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

The locale is used when formatting the name of the day, requires an installed ICU or browser support

___

### `Optional` specialDates

• **specialDates**? : *[SpecialDatesFormat](_types_.specialdatesformat.md)*

Format options and range filters for dates with special opening hours, which have keys in the form `yyyy-MM-dd`.
The range of included special dates can be limited with the `from` and `to` property.

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

Format for the representation of a weekday, default `"short"`
