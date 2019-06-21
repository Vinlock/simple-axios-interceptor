# Simple Axios Interceptors

## Installation
```bash
# With Yarn
yarn add simple-axios-interceptors

# With NPM
npm install simple-axios-interceptors
```

## Usage
```js
import axios from 'axios';
import connect from 'simple-axios-interceptor';

const instance = axios.create({
  baseURL: 'https://api.twitter.com/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

connect(instance, 'twitter')
  .onRequest((label, { request }) => {
    ...
  })
  .onRequestError((label, { error }) => {
    ...
  })
  .onResponse((label, { response }) => {
    ...
  })
  .onResponseError((label, { error }) => {
    ...
  });
```

## Parameters

### `connect(instance, label)`
- `instance` - Axios Instance
- `label` - **Default:** `null` Instance Label
 
### `onRequest(callback)`
- `callback` - Passes in `label` and `{ error }`

### `onRequestError(callback)`
- `callback` - Passes in `label` and `{ error }`

### `onResponse(callback)`
- `callback` - Passes in `label` and `{ error }`

### `onResponseError(callback)`
- `callback` - Passes in `label` and `{ error }`