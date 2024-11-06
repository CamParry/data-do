class DataDo {
	elementMap = {
		window: window,
		win: window,
		document: document,
		doc: document,
	};

	triggerMap = {
		keydown: (event, params) => event.key === params[0],
	};

	actionMap = {
		disable: this.disable,
		enable: this.enable,
		toggleDisable: this.toggleDisable,
		submit: this.submit,
		toggleShow: this.toggleShow,
		show: this.show,
		hide: this.hide,
		expand: this.expand,
		collapse: this.collapse,
		toggleCollapse: this.toggleCollapse,
		addClass: this.addClass,
		removeClass: this.removeClass,
		toggleClass: this.toggleClass,
		fadeIn: this.fadeIn,
		fadeOut: this.fadeOut,
		collapse: this.collapse,
		expand: this.expand,
		toggleCollapse: this.toggleCollapse,
		scrollToTop: this.scrollToTop,
		scrollTo: this.scrollTo,
		setAttribute: this.setAttribute,
		removeAttribute: this.removeAttribute,
		toggleAttribute: this.toggleAttribute,
		setActive: this.setActive,
		removeActive: this.removeActive,
		toggleActive: this.toggleActive,
		setHref: this.setHref,
		setSrc: this.setSrc,
		log: this.log,
	};

	init() {
		document.querySelectorAll("[data-do]").forEach((element) => {
			const commands = element.getAttribute("data-do").split("|");
			commands.forEach((commandStr) => {
				const command = this.getCommand(element, commandStr);
				if (!command) return;
				this.initCommand(command);
			});
		});
	}

	initCommand(command) {
		command.element.addEventListener(command.trigger.name, (event) => {
			if (
				command.trigger.params &&
				this.triggerMap[command.trigger.name] &&
				!this.triggerMap[command.trigger.name]?.(
					event,
					command.trigger.params
				)
			) {
				return;
			}

			command.targets.forEach((target) => {
				this.actionMap[command.action.name]?.(
					target,
					...command.action.params
				);
			});
		});
	}

	stripQuotes(str) {
		return str.replace(/'/g, "");
	}

	getCommand(element, command) {
		const parts = command.match(/(?:[^\:']+|'[^']*')+/g);
		if (!parts || parts.length < 3) return null;
		if (parts.length > 3) {
			return {
				element: this.getElement(parts[0]),
				trigger: this.getTrigger(parts[1]),
				targets: this.getTargets(element, parts[2]),
				action: this.getAction(parts[3]),
			};
		}
		return {
			element,
			trigger: this.getTrigger(parts[0]),
			targets: this.getTargets(element, parts[1]),
			action: this.getAction(parts[2]),
		};
	}

	getElement(selector) {
		if (selector === "window") return window;
		if (selector === "win") return window;
		if (selector === "document") return document;
		if (selector === "doc") return document;
		return document.querySelector(selector);
	}

	getTrigger(trigger) {
		const parts = trigger.split("(");
		const name = parts[0];
		let params = [];
		if (parts[1]) {
			params = parts[1].replace(")", "").split(",").map(this.stripQuotes);
		}
		return { name, params };
	}

	getTargets(current, selector) {
		if (selector === "this") return [current];
		if (selector === "next") return [current.nextElementSibling];
		if (selector === "prev") return [current.previousElementSibling];
		if (selector === "parent") return [current.parentElement];
		if (selector === "children") return Array.from(current.children);
		if (selector === "first-child") return [current.firstElementChild];
		if (selector === "last-child") return [current.lastElementChild];
		if (selector === "console") return [console];
		return Array.from(document.querySelectorAll(selector));
	}

	getAction(action) {
		const parts = action.split("(");
		const name = parts[0];
		let params = [];
		if (parts[1]) {
			params = parts[1].replace(")", "").split(",").map(this.stripQuotes);
		}
		return { name, params };
	}

	disable(element) {
		element.disabled = true;
	}

	enable(element) {
		element.disabled = false;
	}

	toggleDisable(element) {
		element.disabled = !element.disabled;
	}

	submit(element) {
		element.submit();
	}

	toggleShow(element) {
		element.style.display = element.style.display === "none" ? "" : "none";
	}

	show(element) {
		element.style.display = "";
	}

	hide(element) {
		element.style.display = "none";
	}

	addClass(element, className) {
		element.classList.add(className);
	}

	removeClass(element, className) {
		element.classList.remove(className);
	}

	toggleClass(element, className) {
		element.classList.toggle(className);
	}

	fadeIn(element, ...params) {
		const duration = params[0] ?? 250;
		element.style.transition = "opacity " + duration + "ms ease-out";
		element.style.opacity = 1;
	}

	fadeOut(element, ...params) {
		const duration = params[0] ?? 250;
		element.style.transition = "opacity " + duration + "ms ease-out";
		element.style.opacity = 0;
	}

	collapse(element, ...params) {
		const duration = params[0] ?? 250;
		const height = element.offsetHeight;
		element.style.height = height + "px";
		element.offsetHeight;
		element.style.transition = "all " + duration + "ms ease-out";
		element.style.height = 0;
	}

	expand(element, ...params) {
		const duration = params[0] ?? 250;
		element.style.height = "auto";
		element.style.transition = "none";
		const height = element.offsetHeight;
		element.style.height = 0;
		element.style.transition = "all " + duration + "ms ease-out";
		element.offsetHeight;
		element.style.height = height + "px";
		setTimeout(() => {
			element.style.height = "auto";
		}, duration);
	}

	toggleCollapse(element, ...params) {
		element.offsetHeight === 0
			? this.expand(element, ...params)
			: this.collapse(element, ...params);
	}

	scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	scrollTo(element) {
		element.scrollIntoView({ behavior: "smooth" });
	}

	setAttribute(element, ...params) {
		const name = params[0];
		const value = params[1];
		element.setAttribute(name, value);
	}

	removeAttribute(element, ...params) {
		const name = params[0];
		element.removeAttribute(name);
	}

	toggleAttribute(element, ...params) {
		const name = params[0];
		element.hasAttribute(name)
			? element.removeAttribute(name)
			: element.setAttribute(name, "");
	}

	setActive(element) {
		element.classList.add("active");
	}

	removeActive(element) {
		element.classList.remove("active");
	}

	toggleActive(element) {
		element.classList.toggle("active");
	}

	log(element, ...params) {
		element.log(params);
	}

	setHref(element, ...params) {
		element.href = params[0];
	}

	setSrc(element, ...params) {
		element.src = params[0];
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const dataDo = new DataDo();
	dataDo.init();
});
