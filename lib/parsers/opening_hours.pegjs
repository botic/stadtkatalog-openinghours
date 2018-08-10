/**
 * Based on:
 * https://github.com/whamtet/smidgen/blob/master/LICENSE
 *
 * Copyright 2018 Matthew Molloy
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

{
    /*
    * safe_get(a, b)
    * safely returns a[b] when a is not null
    */
    function safe_get(a, b) {
        if (a) {
            return a[b]
        }
    }
    function flatten(a, b) {
        var out = a
        for (var i = 0; i < b.length; i++) {
            out.push(b[i][1])
        }
        return out
    }
}

start = day_expression+
day_expression = forward_day_expression / reverse_day_expression
reverse_day_expression = (!time_range .)* time_range:time_range+ day_phrase:day_phrase
{
    return [day_phrase, time_range]
}
//9:30 a.m. - 5:00 p.m. Mon to Fri
forward_day_expression = (!day_phrase .)* day_phrase:day_phrase time_range:time_range+
{
    return [day_phrase, time_range]
}

/*
* Day Phrases
*/
day_phrase = day_list / day_range / single_day / weekday / weekend

day_list = day1:day (_ . _) day2:day (_ . _) day3:day days:((_ . _) day)+
    {
        return flatten([day1, day2, day3], days)
    }

weekday = 'weekday' / 'wochentags' {
    return [1, 2, 3, 4, 5]
}

weekend = 'weekend' / 'wochenende' {
    return [0, 6]
}

single_day = day:day {
    return [day]
}

day_range = day1:day time_separator day2:day and_clause:((_ '&' _) day)?
    {
        //add days
        var contiguous = day2 >= day1
        var days = []
        if (contiguous) {
            for (var day = day1; day <= day2; day++) {
                days.push(day)
            }
        } else {
            for (var day = day1; day <= 6; day++) {
    days.push(day)
}
for (var day = 0; day <= day2; day++) {
    days.push(day)
}
}
var extra_day = safe_get(and_clause, 1)
if (extra_day || extra_day == 0) {
    days.push(extra_day)
}
return days
}
day =
    sunday / monday / tuesday / wednesday / thursday / friday / saturday / public_holiday /
    montag / dienstag / mittwoch / donnerstag / freitag / samstag / sonntag / feiertag

// English
sunday = 'sun' ('day' / '.' / '') {return 0}
monday = 'mon' ('day' / '.' / '') {return 1}
tuesday = 'tue' ('s.' / 'sday' / 's' / '.' / '') {return 2}
wednesday = 'wed' ('nesday' / '.' / '') {return 3}
thursday = 'thu' ('rsday' / 'r.' / 'rs.' / 'rs' / 'r' / '') {return 4}
friday = 'fri' ('day' / 'd.' / 'd' / '.' / '') {return 5}
saturday = 'sat' ('urday' / '.' / '') {return 6}
public_holiday = ('ph' / 'public holiday') {return 7}

// German
sonntag = 'so' ('n' / 'n.' / 'nntag' / '.' / '') {return 0}
montag = 'mo' ('n' / 'n.' / 'ntag' / '.' / '') {return 1}
dienstag = 'di' ('e' / 'e.' / 'enstag' / '.' / '') {return 2}
mittwoch = 'mi' ('t' / 't.' / 'ttwoch' / '.' / '') {return 3}
donnerstag = 'do' ('n' / 'n.' / 'nnerstag' / '') {return 4}
freitag = 'fr' ('e' / 'e.' / 'ei' / 'ei.' / 'eitag' / '.' / '') {return 5}
samstag = 'sa' ('m' / 'm.' / 'mstag' / '.' / '') {return 6}
feiertag = ('ft' / 'feiertag' / 'feiertags') {return 7}

/*
* Time Phrases
*/

time_range = !day_phrase [^0-9]* time1:time_phrase time_separator time2:time_phrase (!day_phrase !time_phrase .)*
{
    var hours1 = time1[0]
    var mins1 = time1[1]
    var hours2 = time2[0]
    var mins2 = time2[1]

    if (hours2 < hours1) {
        hours2 += 24
    }
    return [hours1, mins1, hours2, mins2]
}

am_pm = _ am_pm:(am / pm)? _ {return am_pm || 0}
am = ('am' / 'a.m.' / 'noon') {return 0}
pm = ('pm' / 'p.m.') {return 12}

time_separator = _ ('bis' / 'to' / .) _
_ = [ \t\r\n]*
__ = [ \t\r\n]+

    time_phrase = time:long_time am_pm:am_pm
{
    var hours = time[0]
    var mins = time[2]
    return [hours + am_pm, mins]
}

long_time = hours colon minutes / four_digit_time
four_digit_time = a:[0-9] b:[0-9] c:[0-9] d:[0-9]
{
    return [parseInt(a + b, 10), '', parseInt(c + d, 10)]
}

hours = minutes
minutes = minutes:([0-9] [0-9]?) {return parseInt(minutes.join(''), 10)}
colon = ':' / '：' / '.'
