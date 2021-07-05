const HexToHighlight = function(hexCode, alpha) {
    if(hexCode[0] == '#') {
        hexCode = hexCode.substr(1, hexCode.length - 1);
    }

    if(hexCode.length != 6){
        throw "Only six-digit hex colors are allowed.";
    }

    var aRgbHex = hexCode.match(/.{1,2}/g);
    var aRgb = [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
    ];

    return `rgba(${aRgb[0]},${aRgb[1]},${aRgb[2]},${alpha})`;
}
export default HexToHighlight;