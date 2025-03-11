# @bytekit/totp

A library to generate TOTP and HOTP tokens.

## Usage

```ts
import {totp} from "@bytekit/totp";

const result = await totp("JBSWY3DPEHPK3PXP");
console.log(result);
```

Example output of the above:

```js
{
  expires: 1736638440,
  token: "482223",
  previous: "534333",
  next: "291802"
}
```

## API

### totp

The `totp` method generates a time-based one-time password along with expiration, previous, and next values.

#### Syntax
```ts
totp(options)
```

#### Parameters

`options` An [ITotpOptions](#itotpoptions) object containing the key and other options used for generating the token.

#### Return value

Returns an [ITotpToken](#itotptoken) object containing the token, expiration, next, and previous values.

#### Examples

```ts
import {totp} from "@bytekit/totp";

const result = await totp("JBSWY3DPEHPK3PXP");
console.log(result);
```

Example output of the above:

```js
{
  expires: 1736638440,
  token: "482223",
  previous: "534333",
  next: "291802"
}
```

### ITotpOptions

An object containing the key and other options used for generating TOTP tokens.

#### Instance properties

`key` _string | Uint8Array_ The key used to generate the token.

`digits` _number_ Optional. The number of digits to include in the token. Default is 6.

`algorithm` _string_ Optional. The hashing algorithm to use. Can be one of `SHA-1`; `SHA-256`; `SHA-384`; or `SHA-512`. Default is `SHA-1`.

`period` _number_ Optional. The time period, in seconds, for token generation. Default is 30 seconds.

`timestamp` _number_ Optional. The unix epoch (seconds since Jan 1, 1970) to use for token generation. Default is the current unix epoch.

### ITotpToken

An object containing the token, expiration, next, and previous values from a call to the `totp` method.

#### Instance properties

`token` _string_ The generated TOTP token.

`expires` _number_ The unix epoch at which point the token is no longer valid.

`next` _string_ The TOTP token that will be valid for the time period following the current time period.

`previous` _string_ The TOTP token that was valid for the time period preceding the current time period.