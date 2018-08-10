const OpeningHours = require("../../lib/openinghours");

test("test simple day", () => {
    const bh = new OpeningHours({ fri: ["10:00", "20:00"] }, "UTC");
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 9, 59, 59, 999)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 10, 0, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 15, 30, 0, 0)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 19, 59, 59, 999)))).toBe(true);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 0, 0, 0)))).toBe(false);
    expect(bh.isOpenAt(new Date(Date.UTC(2016, 8, 9, 20, 1, 0, 0)))).toBe(false);
});
