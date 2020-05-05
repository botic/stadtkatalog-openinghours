import {OpeningHours} from "../src/openinghours";

test("unknown hours", () => {
    const bh = new OpeningHours({}, "UTC");
    expect(bh.isUnknown()).toBe(true);
});

test("not unknown hours", () => {
    expect(new OpeningHours({fri: ["10:00", "20:00"]}, "UTC").isUnknown()).toBe(false);
    expect(new OpeningHours({}, "UTC", [], {
        "2020-05-05": ["10:00", "20:00"]
    }).isUnknown()).toBe(false);
});
