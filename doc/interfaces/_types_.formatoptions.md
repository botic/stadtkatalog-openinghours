
# Interface: FormatOptions

Formatting options for folded opening hours.

## Hierarchy

* **FormatOptions**

## Index

### Properties

* [delimiter](_types_.formatoptions.md#optional-delimiter)
* [hyphen](_types_.formatoptions.md#optional-hyphen)
* [locale](_types_.formatoptions.md#optional-locale)
* [weekdayFormat](_types_.formatoptions.md#optional-weekdayformat)

## Properties

### `Optional` delimiter

• **delimiter**? : *undefined | string*

delimiter between two time ranges, e.g. the comma in `"10:00 – 12:00, 14:30 – 20:00"`, default `", "`

___

### `Optional` hyphen

• **hyphen**? : *undefined | string*

divider between generated time ranges, e.g. the hypen in `"10:00 – 12:00"`, default `" – "`

___

### `Optional` locale

• **locale**? : *undefined | string*

the locale is used when formatting the name of the day, requires an installed ICU or browser support

___

### `Optional` weekdayFormat

• **weekdayFormat**? : *[WeekdayFormat](../enums/_types_.weekdayformat.md)*

format for the representation of a weekday, default `"short"`
