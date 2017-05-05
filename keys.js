var keysCodeEnum = Object.freeze({
    Backspace: 8,
    Delete: 46,
    One: 49,
    Ten: 58,
    NumpadOne: 97,
    NumpadTen: 106
});

var keyCodeToText = {};
keyCodeToText[keysCodeEnum.Backspace] = keyCodeToText[keysCodeEnum.Delete] = "";
for (var keyCode = keysCodeEnum.One; keyCode < keysCodeEnum.Ten; keyCode++)
    keyCodeToText[keyCode] = keyCode - (keysCodeEnum.One - 1);
for (var keyCode = keysCodeEnum.NumpadOne; keyCode < keysCodeEnum.NumpadTen; keyCode++)
    keyCodeToText[keyCode] = keyCode - (keysCodeEnum.NumpadOne - 1);
