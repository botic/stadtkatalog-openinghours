import {OpeningHours} from "../src/openinghours";

test("nothing to fold", () => {
    let bh = new OpeningHours({
        mon: ["10:00", "20:00"],
        tue: ["11:00", "20:00"],
        wed: ["12:00", "20:00"],
        thu: ["13:00", "20:00"],
        fri: ["14:00", "20:00"],
        sat: ["15:00", "20:00"],
        sun: ["16:00", "20:00"],
        hol: ["17:00", "20:00"],
    }, "UTC");

    console.log(bh.fold());
});

test("fold everything", () => {
    let bh = new OpeningHours({
        mon: ["10:00", "20:00"],
        tue: ["10:00", "20:00"],
        wed: ["10:00", "20:00"],
        thu: ["10:00", "20:00"],
        fri: ["10:00", "20:00"],
        sat: ["10:00", "20:00"],
        sun: ["10:00", "20:00"],
        hol: ["10:00", "20:00"],
    }, "UTC");

    console.log(bh.fold({
        hyphen: " – ",
        delimiter: ", ",
        locale: "de-AT",
    }));
});

