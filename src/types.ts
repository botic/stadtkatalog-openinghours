/**
 * StadtKatalog's object representation of opening hours.
 * Every property has an associated array with time frames. A time frame has a start and end string in the form
 * `HH:MM` (24-hour clock). Day-overlapping opening hours, which start e.g. on Monday and end on Tuesday morning,
 * are represented by greater than 24 hour values. So a time frame `["20:00", "26:00"]` indicates that
 * this business will close on 02:00 the next morning. Other semantics:
 *
 *  - `[]` – closed, not opened at the given date or weekday
 *  - `["HH:mm", "HH:mm"]` – open between the two time frames
 *  - You can define multiple open time frames per day, e.g.
 *    `["10:00", "12:30", "17:00", "23:00"]` for 10:00 to 12:30 and 17:00 to 23:00
 *  - A missing property indicates that no information is available for this date or weekday.
 */
export interface IOpeningHours {
    /**
     * Opening hours on Monday
     */
    "mon"?: string[];

    /**
     * Opening hours on Tuesday
     */
    "tue"?: string[];

    /**
     * Opening hours on Wednesday
     */
    "wed"?: string[];

    /**
     * Opening hours on Thursday
     */
    "thu"?: string[];

    /**
     * Opening hours on Friday
     */
    "fri"?: string[];

    /**
     * Opening hours on Saturday
     */
    "sat"?: string[];

    /**
     * Opening hours on Sunday
     */
    "sun"?: string[];

    /**
     * Opening hours on a holiday
     */
    "hol"?: string[];

    /**
     * Additional opening hours only valid on a certain date can be added
     * with properties in the form `"YYYY-MM-DD"`.
     */
    [propName: string]: string[] | undefined;
}

/**
 * Possible formats for the representation of a weekday.
 */
export enum WeekdayFormat {
    /**
     * `long` e.g. "Thursday"
     */
    long = "long",

    /**
     * `short` e.g. "Thu"
     */
    short = "short",

    /**
     * `narrow` e.g. "T"
     */
    narrow = "narrow",
}

/**
 * Formatting options for folded opening hours.
 */
export interface FormatOptions {
    /**
     * divider between generated time ranges, e.g. the hypen in `"10:00 – 12:00"`, default `" – "`
     */
    hyphen?: string;

    /**
     * delimiter between two time ranges, e.g. the comma in `"10:00 – 12:00, 14:30 – 20:00"`, default `", "`
      */
    delimiter?: string;

    /**
     * the locale is used when formatting the name of the day, requires an installed ICU or browser support
     */
    locale?: string;

    /**
     * format for the representation of a weekday, default `"short"`
     */
    weekdayFormat?: WeekdayFormat;

    /**
     * Prefix for holiday opening hours, default `"Holidays"`
     */
    holidayPrefix?: string;

    /**
     * Format string for time frames, default `"{start} to {end}"`
     */
    timeFrameFormat?: string;

    /**
     * Delimiter between multiple time frames, default `" and "`
     */
    timeFrameDelimiter?: string;

    /**
     * Placeholder if empty time frames = closed.
     */
    closedPlaceholder?: string;

    /**
     * Format for dates with special opening hours, which have keys in the form  'yyyy-MM-dd'.
     * The range of included special dates can be limited with the `from` and `to` property.
     * @see https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
     */
    specialDates?: {
        format?: string;
        from?: Date | undefined;
        to?: Date | undefined;
    }
}

export enum RangeType {
    weekday = "weekday",
    holiday = "holiday",
    special = "special",
}

export interface RangeTimeSpan {
    type: RangeType;
    range: string;
    timespan: string;
}
