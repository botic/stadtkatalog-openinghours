const indexModule = require("..");

test("check opening hours class", () => {
    expect(indexModule.OpeningHours).not.toBeNull();
    expect(typeof indexModule.OpeningHours.weekdayToWeekdayKey).toBe("function");
});

test("check parseHours function", () => {
    expect(indexModule.parseHours).not.toBeNull();
    expect(typeof indexModule.parseHours).toBe("function");
});
