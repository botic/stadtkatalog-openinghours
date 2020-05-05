
# Module: "helpers"

## Index

### Variables

* [WEEKDAY_KEYS](_helpers_.md#const-weekday_keys)

### Functions

* [_areOverlongTimeFrames](_helpers_.md#private-_areoverlongtimeframes)
* [_canFoldIntoDayRange](_helpers_.md#_canfoldintodayrange)
* [_createRangeBag](_helpers_.md#private-_createrangebag)
* [_eliminateEqualRanges](_helpers_.md#_eliminateequalranges)
* [_equalTimeFrames](_helpers_.md#private-_equaltimeframes)
* [_findSimpleRanges](_helpers_.md#private-_findsimpleranges)
* [_formatTimeFrames](_helpers_.md#_formattimeframes)
* [_getAdditionalStartOfDayTimeFrames](_helpers_.md#private-_getadditionalstartofdaytimeframes)
* [_isInTimeFrame](_helpers_.md#private-_isintimeframe)

## Variables

### `Const` WEEKDAY_KEYS

• **WEEKDAY_KEYS**: *string[]* = Object.freeze(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]) as string[]

## Functions

### `Private` _areOverlongTimeFrames

▸ **_areOverlongTimeFrames**(`timeFrames?`: string[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`timeFrames?` | string[] |

**Returns:** *boolean*

___

###  _canFoldIntoDayRange

▸ **_canFoldIntoDayRange**(`range`: number[]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`range` | number[] |

**Returns:** *boolean*

___

### `Private` _createRangeBag

▸ **_createRangeBag**(`reducedTimeRange`: number[]): *object*

**Parameters:**

Name | Type |
------ | ------ |
`reducedTimeRange` | number[] |

**Returns:** *object*

* \[ **propName**: *string*\]: number[]

___

###  _eliminateEqualRanges

▸ **_eliminateEqualRanges**(`week`: [IOpeningHours](../interfaces/_types_.iopeninghours.md)): *number[]*

**Parameters:**

Name | Type |
------ | ------ |
`week` | [IOpeningHours](../interfaces/_types_.iopeninghours.md) |

**Returns:** *number[]*

___

### `Private` _equalTimeFrames

▸ **_equalTimeFrames**(`a`: string[] | undefined, `b`: string[] | undefined): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`a` | string[] &#124; undefined |
`b` | string[] &#124; undefined |

**Returns:** *boolean*

___

### `Private` _findSimpleRanges

▸ **_findSimpleRanges**(`week`: [IOpeningHours](../interfaces/_types_.iopeninghours.md)): *number[]*

**Parameters:**

Name | Type |
------ | ------ |
`week` | [IOpeningHours](../interfaces/_types_.iopeninghours.md) |

**Returns:** *number[]*

___

###  _formatTimeFrames

▸ **_formatTimeFrames**(`hours`: string[], `format`: string, `delimiter`: string, `placeholder`: string): *string*

**Parameters:**

Name | Type |
------ | ------ |
`hours` | string[] |
`format` | string |
`delimiter` | string |
`placeholder` | string |

**Returns:** *string*

___

### `Private` _getAdditionalStartOfDayTimeFrames

▸ **_getAdditionalStartOfDayTimeFrames**(`overlongTimeFrames`: string[]): *string[]*

**Parameters:**

Name | Type |
------ | ------ |
`overlongTimeFrames` | string[] |

**Returns:** *string[]*

___

### `Private` _isInTimeFrame

▸ **_isInTimeFrame**(`ldt`: DateTime, `startFrame`: string, `endFrame`: string): *boolean*

Helper function to determine if a DateTime is inside the given time frame.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`ldt` | DateTime | the DateTime object to check |
`startFrame` | string | start of the time frame in the format "hh:mm" |
`endFrame` | string | end of the time frame in the format "hh:mm" |

**Returns:** *boolean*

true, if `ldt` is contained in the time frame; false otherwise
