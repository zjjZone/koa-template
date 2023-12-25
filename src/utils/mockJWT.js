const crypto = require('crypto')

function sign(payload, salt) {
    let header = { alg: 'HS256', typ: 'JWT' };

    const tokenArr = [];

    tokenArr.push(base64UrlEncode(JSON.stringify(header)));
    tokenArr.push(base64UrlEncode(JSON.stringify(payload)));

    // 加密
    const signature = encryption(tokenArr.join('.'), salt)

    return [...tokenArr, signature].join('.');
}

function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64');
}

function encryption(value, salt) {
    return crypto
    .createHmac('SHA256', salt)
    .update(value)
    .digest('base64');
}

function verify(token, salt) {
    var segments = token.split('.');

    var [h, p, s] = segments;

    const signature = encryption([h, p].join('.'), salt);

    return signature === s;
}

console.log(sign( {user: 'luyi'}, 'zhaowajiaoyu' ));


console.log(verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibHV5aSJ9.ZBuNd+yDCFQwbnq9KqEd+mRemlZ2q/ZACjsHvLlUKfM=',
    "luyi"
))