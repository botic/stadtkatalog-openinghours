
# Interface: IOpeningHours

StadtKatalog's object representation of opening hours.
Every property has an associated array with time frames. A time frame has a start and end string in the form
`HH:MM` (24-hour clock). Day-overlapping opening hours, which start e.g. on Monday and end on Tuesday morning,
are represented by greater than 24 hour values. So a time frame `["20:00", "26:00"]` indicates that
this business will close on 02:00 the next morning. Other semantics:

 - `[]` – closed, not opened at the given date or weekday
 - `["HH:mm", "HH:mm"]` – open between the two time frames
 - You can define multiple open time frames per day, e.g.
   `["10:00", "12:30", "17:00", "23:00"]` for 10:00 to 12:30 and 17:00 to 23:00
 - A missing property indicates that no information is available for this date or weekday.

## Hierarchy

* **IOpeningHours**

## Indexable

* \[ **propName**: *string*\]: string[] | undefined

Additional opening hours only valid on a certain date can be added
with properties in the form `"YYYY-MM-DD"`.

 - `[]` – closed, not opened at the given date or weekday
 - `["HH:mm", "HH:mm"]` – open between the two time frames
 - You can define multiple open time frames per day, e.g.
   `["10:00", "12:30", "17:00", "23:00"]` for 10:00 to 12:30 and 17:00 to 23:00
 - A missing property indicates that no information is available for this date or weekday.

## Index

### Properties

* [fri](_types_.iopeninghours.md#optional-fri)
* [hol](_types_.iopeninghours.md#optional-hol)
* [mon](_types_.iopeninghours.md#optional-mon)
* [sat](_types_.iopeninghours.md#optional-sat)
* [sun](_types_.iopeninghours.md#optional-sun)
* [thu](_types_.iopeninghours.md#optional-thu)
* [tue](_types_.iopeninghours.md#optional-tue)
* [wed](_types_.iopeninghours.md#optional-wed)

## Properties

### `Optional` fri

• **fri**? : *string[]*

Opening hours on Friday

___

### `Optional` hol

• **hol**? : *string[]*

Opening hours on a holiday

___

### `Optional` mon

• **mon**? : *string[]*

Opening hours on Monday

___

### `Optional` sat

• **sat**? : *string[]*

Opening hours on Saturday

___

### `Optional` sun

• **sun**? : *string[]*

Opening hours on Sunday

___

### `Optional` thu

• **thu**? : *string[]*

Opening hours on Thursday

___

### `Optional` tue

• **tue**? : *string[]*

Opening hours on Tuesday

___

### `Optional` wed

• **wed**? : *string[]*

Opening hours on Wednesday
