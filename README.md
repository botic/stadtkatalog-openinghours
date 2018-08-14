# StadtKatalog Opening Hours

This library helps you to work with opening hours
received from StadtKatalog.org

**This module is alpha and still work in progress!**
Proceed with caution and be ready for API changes.

## Example

```javascript
const {OpeningHours} = require("@stadtkatalog/openinghours");
const shop = new OpeningHours({
        mon: ["10:00", "18:00"],
        tue: ["10:00", "18:00"],
        wed: ["10:00", "18:00"],
        thu: ["10:00", "18:00"],
        fri: ["10:00", "18:00"],
        sat: ["10:00", "18:00"],
        sun: ["10:00", "18:00"]
    }, "Europe/Vienna");

shop.isOpenAt(new Date(2018, 7, 13, 9, 59));  // false
shop.isOpenAt(new Date(2018, 7, 13, 10, 0));  // true
shop.isOpenAt(new Date(2018, 7, 13, 17, 59)); // true
shop.isOpenAt(new Date(2018, 7, 13, 18, 0));  // false
```

## Licenses
* This code is licensed under ISC aka BSD
* Business hour parser is based on [whamtet/smidgen](https://github.com/whamtet/smidgen/)
