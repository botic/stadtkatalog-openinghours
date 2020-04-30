import * as fs from "fs";
import * as peg from "pegjs";
import {IOpeningHours} from "./types";

const grammar = fs.readFileSync(`${__dirname}/parsers/opening_hours.pegjs`, { encoding: "utf8" });
const parser = peg.generate(grammar);

const WEEKDAY_INDEX_TO_KEY = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
    "hol"
] as string[];

function foldWeekday(rawDay: number[][]): string[] {
    /* this is just a guard for the parser */
    if (rawDay.some(subDay => subDay.length !== 4)) {
        throw new Error(`Invalid length of sub day, must be 4, but is ${rawDay}`);
    }

    return rawDay
        .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
        .map(dayNumber => `${dayNumber}`.padStart(2, "0"))
        .reduce((acc, curr, index) => {
            if (index % 2 && index > 0) {
                acc[acc.length - 1] += `:${curr}`;
            } else {
                acc.push(curr);
            }

            return acc;
        }, [] as string[]);
}

/**
 * Parses the given string and returns an opening hours object.
 * @param str opening hours in a human readable format
 */
export function parseHours(str: string): IOpeningHours {
    let parserStr = str
        .toLowerCase()
        .replace(/ +/, " ")
        .trim();

    const res = {} as IOpeningHours;
    const parsedResult = parser.parse(parserStr);

    for (let dayExpression of parsedResult) {
        /* this is just a guard for the parser */
        if (dayExpression[0].length > 1) {
            throw new Error(`Invalid dayExpression day with length ${dayExpression[0].length}`);
        }

        /* this is just a guard for the parser */
        if (dayExpression[1].length === 0) {
            throw new Error(`Invalid dayExpression times with length ${dayExpression[1].length}`);
        }

        const weekday = WEEKDAY_INDEX_TO_KEY[dayExpression[0][0]];
        res[weekday] = foldWeekday(dayExpression[1]);
    }

    return res;
}
