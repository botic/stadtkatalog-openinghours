import {OpeningHours} from "../src/openinghours";

test("test date is on a holiday", () => {
    let bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", ["2016-09-09"]);
    expect(bh.isHoliday("2016-09-09")).toBe(true);
    bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", ["2000-10-10", "2016-09-09"]);
    expect(bh.isHoliday("2016-09-09")).toBe(true);
    bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", ["2000-10-10", "2016-09-09", "2020-11-11"]);
    expect(bh.isHoliday("2016-09-09")).toBe(true);
    expect(bh.hours.fri).toHaveLength(2);
});

test("test date is not a holiday", () => {
    let bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", []);
    expect(bh.isHoliday("2016-09-09")).toBe(false);
    bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC");
    expect(bh.isHoliday("2016-09-09")).toBe(false);
    bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", ["2000-10-10", "2015-09-09", "2017-09-09"]);
    expect(bh.isHoliday("2016-09-09")).toBe(false);
    bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", ["2017-09-09"]);
    expect(bh.isHoliday("2016-09-09")).toBe(false);
    expect(bh.hours.fri).toHaveLength(2);
});

test("invalid holidays throw", () => {
    expect(() => {
        new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC", ["2000-10-10", "2015-09-09", "2020-02-31"]);
    }).toThrow();
});
