const OpeningHours = require("../../src/lib/openinghours");

test("test simple day", () => {
    const bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC");
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
});

test("test simple day with different time zone", () => {
    const bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC+1");
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 8, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 23, 1, 0, 0)))).toBe(false);
});

test("test simple day with special hours", () => {
    const bh = new OpeningHours({ fri: ["10:00", "12:00"] }, "UTC", [], {
        "2016-09-09": ["14:00", "16:00"]
    });
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 11, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 12, 0, 0, 0)))).toBe(false);

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 13, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 14, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 16, 0, 0, 0)))).toBe(false);
});

test("test day with preceding overlong special hours", () => {
    const bh = new OpeningHours({ fri: ["10:00", "12:00"] }, "UTC", [], {
        "2016-09-08": ["14:00", "26:00"]
    });

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 8, 13, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 8, 14, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 8, 23, 59, 59, 999)))).toBe(true);

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 1, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 2, 0, 0, 0)))).toBe(false);

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 11, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 12, 0, 0, 0)))).toBe(false);

    expect(bh.hours.fri).toHaveLength(2);
    expect(bh.holidays).toHaveLength(0);
    expect(bh.specialDays["2016-09-08"]).toHaveLength(2);
    expect(bh.specialDays["2016-09-09"]).toBeUndefined();
    expect(bh.timeZone).toBe("UTC");
});


test("test simple day with special hours and overlapping normal hours", () => {
    const bh = new OpeningHours({ thu: ["20:00", "26:00"], fri: ["10:00", "12:00"] }, "UTC", [], {
        "2016-09-09": ["14:00", "16:00"]
    });

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 8, 23, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 1, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 2, 0, 0, 0)))).toBe(false);

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 11, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 12, 0, 0, 0)))).toBe(false);

    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 13, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 14, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 16, 0, 0, 0)))).toBe(false);
});

test("test day with overlapping preceding one", () => {
    const bh = new OpeningHours({ thu: ["20:00", "25:00"], fri: ["10:00", "20:00"] }, "UTC");

    // the overlapping time frame
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 1, 0, 0, 0)))).toBe(false);

    // the normal time frames
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
});

test("test day with overlapping preceding holiday", () => {
    const bh = new OpeningHours({ hol: ["20:00", "25:00"], thu: ["10:00", "20:00"], fri: ["10:00", "20:00"] }, "UTC", [
        "2016-09-08"
    ]);

    // the overlapping time frame
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 1, 0, 0, 0)))).toBe(false);

    // the normal time frames
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
});

test("test day with short overlapping preceding one", () => {
    const bh = new OpeningHours({ thu: ["20:00", "24:30"], fri: ["10:00", "20:00"] }, "UTC");

    // the overlapping time frame
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 29, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 30, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 1, 0, 0, 0)))).toBe(false);

    // the normal time frames
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
});

test("test day with short overlapping preceding one", () => {
    const bh = new OpeningHours({ thu: ["20:00", "24:00"], fri: ["10:00", "20:00"] }, "UTC");

    // the overlapping time frame
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 0, 0, 0, 1)))).toBe(false);

    // the normal time frames
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
});
