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
