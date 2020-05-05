export interface IOpeningHours {
    "mon"?: string[];
    "tue"?: string[];
    "wed"?: string[];
    "thu"?: string[];
    "fri"?: string[];
    "sat"?: string[];
    "sun"?: string[];
    "hol"?: string[];
    [propName: string]: string[] | undefined;
}

/**
 * Possible formats for the representation of a weekday.
 *
 * - `long` e.g. "Thursday"
 * - `short` e.g. "Thu"
 * - `narrow` e.g. "T"
 */
export enum WeekdayFormat {
    long = "long",      // Thursday
    short = "short",    // Thu
    narrow = "narrow",  // T
}

export interface FormatOptions {
    hyphen?: string;
    delimiter?: string;
    locale?: string;
    weekdayFormat?: WeekdayFormat;
}
