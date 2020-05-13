import {OpeningHours} from "../src/openinghours";

test("invalid date keys detected", () => {
    expect(() => new OpeningHours({}, "Europe/Vienna")).not.toThrow();
    expect(() => new OpeningHours({"foo": []}, "Europe/Vienna")).toThrow();
    expect(() => new OpeningHours({"": []}, "Europe/Vienna")).toThrow();
    const obj = {} as any;
    obj[12345] = [];
    expect(() => new OpeningHours(obj, "Europe/Vienna")).toThrow();

    expect(() => new OpeningHours({}, "Europe/Vienna", ["2020-02-30"])).toThrow();
    expect(() => new OpeningHours({}, "Europe/Vienna", [""])).toThrow();
    expect(() => new OpeningHours({}, "Europe/Vienna", ["2020-XX-30"])).toThrow();
    expect(() => new OpeningHours({}, "Europe/Vienna", ["2020-00-00"])).toThrow();

    expect(() => new OpeningHours({ "2020-02-30": ["10:00", "20:00"] }, "Europe/Vienna", [])).toThrow();
    expect(() => new OpeningHours({ "20200202": ["10:00", "20:00"] }, "Europe/Vienna", [])).toThrow();
    expect(() => new OpeningHours({ "YYYY-XX-XX": ["10:00", "20:00"] }, "Europe/Vienna", [])).toThrow();
});
