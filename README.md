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

## Updating Settings
```js
context.settings({initSettings});
```

## Attaching
```js
context.attach(selector, [menuObjects]);
```

## Destroying
```js
context.destroy(selector);
```

## Menu Object

### General option
```js
...
	onBeforeShow: function(context, menuObject){
		if(menuObject.text == "Foo"){
			// if the current menuObject has the text foo it will not be displayed
			return false;
		}
		return true;
	}
...
```

### Headers
```js
{
	header: 'My Header Title'
}
```

### Anchor Links
```js
{
	text: 'My Link Title', 
	href: 'http://contextjs.com/', 
	target: '_blank'
}
```
### Dividers
```js
{
	divider: true
}
```

### Event Based Actions
```js
{
    text: 'Event Based Link',
    action: function(e, context){
    	e.preventDefault();
        alert('Do Something');
    }
}
```

### Sub-Menus
```js
{
    text: 'My Sub-menu',
    subMenu: [menuObjects]
}
```
