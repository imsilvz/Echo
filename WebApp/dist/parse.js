const utf = "dUrbYBsAAAAfAhICUQMCJxMBBlwB/w1LYWxlIEdhcmRuZXIDS2FsZSBHYXJkbmVyAicHzwEBAf8BAwISAlkDQmFsbXVuZx9pdCBsZXRzIHBlb3BsZSBncmluZCBtb25leSBhbmQgaGF2ZSBvdGhlciBwZW9wbGUgc3RpbGwgcHJvZml0LCBpdHMgZmluZQ==";
const utf2 = "OEbbYBsAAAAfAhICYAMCJxQBAyYB/w5DYWxseXBzbyBEYXduA0NhbGx5cHNvIERhd24CJwfPAQEB/wEDH2F0IHdoYXQgbGV2ZWwgY291bGQgeW91IGRvIHRoYXQ/";
const utf3 = "EEXbYBsAAAAfAhICTwMCJxQBBCYB/w5Tb3JlbiBNYWlsYW5kA1NvcmVuIE1haWxhbmQCJwfPAQEB/wEDH0RpZG4ndCBnZXQgb25lLiBUaGF0J3MgdGhhdA==";
const utf4 = "jUPbYBsAAAAfAhICUQMCJxgBBiYB/xJBaGthaGx5IERhcmtibGFkZQNBaGthaGx5IERhcmtibGFkZQInB88BAQH/AQMfeWVzIHRoZXkgbGVmdA==";
const utf5 = "E1jbYB0AAAAfAicWAQEBAf8QR2xpYmJpYmJpIEJpYmJpA0dsaWJiaWJiaSBCaWJiaQInB88BAQH/AQMfAicWAQEmAf8QR2xpYmJpYmJpIEJpYmJpA0dsaWJiaWJiaSBCaWJiaQInB88BAQH/AQMgZ2VudGx5IHBhdHMgAicQAQEmAv8KQ2hpbGkgVG90A0NoaWxpIFRvdAInB88BAQH/AQMu";
const utf6 = "oVvbYAoAAAAfAicYAQ8jAf8SQW1hbGllIENhcnR3cmlnaHQDQW1hbGllIENhcnR3cmlnaHQCJwfPAQEB/wEDAhICWQNCcnluaGlsZHIfKHRoYW5rIDwzKQ==";
const utf7 = "Zl/bYBsAAAAfAhICTgMCJxgBAiYB/xJNZW5lbGtpciBSaWtsZW5lbQNNZW5lbGtpciBSaWtsZW5lbQInB88BAQH/AQMfaWYgaSBjYW4gZG8gYWR2YW5jZWQgcmVsYXRpdml0eSB3aGlsZSBtb2xkaW5nIGEgY29udmVyc2F0aW9uIGFib3V0IHBlbmd1aW5zIG9uIGRpc2NvcmQ="
const utf8 = "cV/bYB0AAAAfAicUAQEBAf8OVGFsaWEgVmFsc2luZwNUYWxpYS…BJgL/C0x5cmEgSGF3a2UDTHlyYSBIYXdrZQInB88BAQH/AQMu";
let buffer = Buffer.from(utf6, 'base64');

console.log(buffer.toString('hex'))

function FindHexOffset(buffer, match, start = 0) {
    let byteLength = match.length / 2;

    let offset = start;
    while(offset < buffer.length - byteLength) {
        let slice = buffer.slice(offset, offset + byteLength);
        if(slice.toString('hex') == match) {
            offset += byteLength;
            break;
        }
        offset++;
    }
    return offset;
}

let offset = FindHexOffset(buffer, '01ff');

// skip 1 byte
let nameOffset = FindHexOffset(buffer, '03', offset);

console.log(buffer.slice(offset, nameOffset).toString('utf8'));
console.log(buffer.slice(offset, nameOffset).toString('hex'));

// server is here
let offset2 = offset + 1;
while(offset2 < buffer.length - 4)
{
    let slice = buffer.slice(offset2, offset2 + 4);
    if(slice.toString('hex') == '01ff0103') {
        offset2 += 4;
        break;
    }
    offset2++;
}

// 
let offset3 = offset2;
while(offset3 < buffer.length)
{
    let slice = buffer.slice(offset3, offset3 + 1)
    if(slice.toString('hex') == '1f') {
        break;
    }
    offset3++;
}

console.log("Offset 1:");
console.log(buffer.slice(offset, offset2).toString('hex'));
console.log("offset 2:");
console.log(buffer.slice(offset2, offset3).toString('hex'));
console.log("Offset 3:");
console.log(buffer.slice(offset3).toString('hex'));

console.log(offset, offset2, offset3);