const OpeningHours = require("../../src/lib/openinghours");

test("test all valid day numbers", () => {
    expect(OpeningHours.weekdayToWeekdayKey(1)).toBe("mon");
    expect(OpeningHours.weekdayToWeekdayKey(2)).toBe("tue");
    expect(OpeningHours.weekdayToWeekdayKey(3)).toBe("wed");
    expect(OpeningHours.weekdayToWeekdayKey(4)).toBe("thu");
    expect(OpeningHours.weekdayToWeekdayKey(5)).toBe("fri");
    expect(OpeningHours.weekdayToWeekdayKey(6)).toBe("sat");
    expect(OpeningHours.weekdayToWeekdayKey(7)).toBe("sun");
});

test("test some invalid day numbers", () => {
    expect(() => { OpeningHours.weekdayToWeekdayKey(-1) }).toThrow();
    expect(() => { OpeningHours.weekdayToWeekdayKey(0)  }).toThrow();
    expect(() => { OpeningHours.weekdayToWeekdayKey(8)  }).toThrow();
});
