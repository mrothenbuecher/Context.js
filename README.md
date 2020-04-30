# Context.js

## Initializing
```js
context.init({
    fadeSpeed: 100,
    filter: function ($obj){},
    above: 'auto',
    preventDoubleContext: true,
    compress: false
});
```
| Parameter            | Type              | Default | Description                                                                                                                                    |
|----------------------|-------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------|
| fadeSpeed            | int               | 100     | The speed in which the context menu fades in (in ms)                                                                                           |
| filter               | function          | null    | Function that each finished list element will pass through for extra modification                                                              |
| above                | string || boolean | 'auto'  | If set to 'auto' menu will appear as a 'dropup' if there is not enough room below it. Settings to true will make the menu a 'popup' by default |
| preventDoubleContext | boolean           | true    | If set to true, browser-based context menus will not work on contextjs menus.                                                                  |
| compress             | boolean           | false   | If set to true, context menus will have less padding, making them (hopefully) more unobstrutive                                                |
