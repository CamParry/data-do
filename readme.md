# data-do

A ultra lightweight javascript utility library for handling simple interactions on the client.

## Installation

Copy code from data-do.js and self host. (CDN coming soon)

```html
<script src="./data-do.js" type="module"></script>
```

## Usage

To use data-do you apply "commands" via the data-do attribute on elements in the dom.

### Basic

A command uses the following format: "trigger:target:action" where trigger is the name of the event to listen to, target is a css(ish) selector that specifes where an action should take place, and action is a function to run against the target.

```html
<button class="button" data-do="click:.dropdown:toggleShow">Dropdown</button>
<div class="dropdown" style="display:none;">
	<a href="#">Link 1</a>
	<a href="#">Link 2</a>
	<a href="#">Link 3</a>
</div>
```

### Advanced

A command can also have an optional "element" component at the beginning in the format "element:trigger:target:action". This specifies an element to watch for the trigger, which comes in useful if you want to attach an event to the document. If this is removed then the element will default to the one the data-do attribute is applied to.

```html
<button
	class="button"
	data-do="click:next:show|click:.lightbox-image:setSrc('https://picsum.photos/1200/800')"
>
	Lightbox
</button>
<div
	class="lightbox"
	data-do="doc:keydown(Escape):this:hide"
	style="display:none;"
>
	<div class="lightbox-overlay" data-do="click:parent:hide"></div>
	<div class="lightbox-content">
		<img class="lightbox-image" src="" alt="Random Image" />
		<button class="button" data-do="click:.lightbox:hide">Close</button>
	</div>
</div>
```

## Concepts

### Structure

A command is made up of the following components "element:trigger(param,param):target:action(param,param)"

Some triggers and actions are configured to take paramaters as comma seperated lists, these are predefined and can be found below.

Multiple commands can be added to the same element by seperating them with a | (pipe) character.

### Elements

This defines what element should have the event listener attached to it, when left blank it defaults to the current html element, but it can also be a css selector or on of the following predefined elements:

-   document (also aliased as doc)
-   window (also aliased as win)

### Triggers

This defines the event that is being listened to which can be any javascript event. It also takes in an optional paramater list which some events use, for example the keydown event takes an optional key paramater to filter the event with.

### Targets

This defines what element the action should be applied to. It can be a simple css selector like #id or .class, but it can also be one of the following predefined utility selectors:

-   this
-   next
-   prev
-   parent
-   children
-   firstChild
-   lastChild
-   console (allows for "click:console:log('Hello world')")

Note: A target selector always returns a list of nodes to apply the action to.

### Actions

This defines the function that will be run against the targets. These functions are predefined and some of them take a paramater and are listed below:

-   submit
-   disable
-   enable
-   toggleDisable
-   show
-   hide
-   toggleShow
-   addClass(class)
-   removeClass(class)
-   toggleClass(class)
-   fadeIn(duration)
-   fadeOut(duration)
-   collapse(duration)
-   expand(duration)
-   toggleCollapse(duration)
-   scrollToTop
-   scrollTo
-   setAttribute(name,value)
-   removeAttribute(name)
-   toggleAttribute(name)
-   setActive
-   removeActive
-   toggleActive
-   setHref(url)
-   setSrc(url)
-   log(string)
