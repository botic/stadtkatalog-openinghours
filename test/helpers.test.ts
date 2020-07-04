import {_formatTimeFrames} from "../src/helpers";

test("formats empty timeframes", () => {
    expect(_formatTimeFrames([], "{start} - {end}", " - ", ""))
        .toBe("");
    expect(_formatTimeFrames([], "{start} - {end}", " - ", "placeholder"))
        .toBe("placeholder");
});

test("formats overlong time frames", () => {
    expect(_formatTimeFrames(["23:00", "25:00"], "{start} - {end}", " - ", ""))
        .toBe("23:00 - 01:00");
    expect(_formatTimeFrames(["23:00", "24:15"], "{start} - {end}", " - ", ""))
        .toBe("23:00 - 00:15");
});
