class DataDo {
	init() {
		document.querySelectorAll("[data-do]").forEach((element) => {
			const commands = element.getAttribute("data-do").split("|");
			commands.forEach((commandStr) => {
				const command = this.getCommand(element, commandStr);
				if (!command) return;
				this.handleCommand(command);
			});
		});
	}

	handleCommand(command) {
		command.element.addEventListener(command.trigger.name, (event) => {
			if (
				command.trigger.params &&
				this.triggers[command.trigger.name] &&
				!this.triggers[command.trigger.name]?.(
					event,
					command.trigger.params
				)
			) {
				return;
			}

			command.targets.forEach((target) => {
				this.actions[command.action.name]?.(
					target,
					...command.action.params
				);
			});
		});
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
		return this.elements[selector] ?? document.querySelector(selector);
	}

	getTrigger(trigger) {
		return this.getNameAndParams(trigger);
	}

	getTargets(element, selector) {
		return (
			this.targets[selector]?.(element) ??
			Array.from(document.querySelectorAll(selector))
		);
	}

	getAction(action) {
		return this.getNameAndParams(action);
	}

	getNameAndParams(str) {
		const parts = str.split("(");
		const name = parts[0];
		const params = parts[1]
			? parts[1].replace(")", "").split(",").map(this.stripQuotes)
			: [];
		return { name, params };
	}

	stripQuotes(str) {
		return str.replace(/'/g, "");
	}

	elements = {
		window: window,
		win: window,
		document: document,
		doc: document,
	};

	triggers = {
		keydown: (event, params) => event.key === params[0],
	};

	targets = {
		this: (el) => [el],
		next: (el) => [el.nextElementSibling],
		prev: (el) => [el.previousElementSibling],
		parent: (el) => [el.parentElement],
		children: (el) => Array.from(el.children),
		firstChild: (el) => [el.firstElementChild],
		lastChild: (el) => [el.lastElementChild],
		console: (el) => [console],
	};

	actions = {
		disable: (el) => (el.disabled = true),
		enable: (el) => (el.disabled = false),
		toggleDisable: (el) => (el.disabled = !el.disabled),
		submit: (el) => el.submit(),
		toggleShow: (el) =>
			(el.style.display = el.style.display === "none" ? "" : "none"),
		show: (el) => (el.style.display = ""),
		hide: (el) => (el.style.display = "none"),
		addClass: (el, className) => el.classList.add(className),
		removeClass: (el, className) => el.classList.remove(className),
		toggleClass: (el, className) => el.classList.toggle(className),
		fadeIn: (el, ...params) => {
			const duration = params[0] ?? 250;
			el.style.transition = "opacity " + duration + "ms ease-out";
			el.style.opacity = 1;
		},
		fadeOut: (el, ...params) => {
			const duration = params[0] ?? 250;
			el.style.transition = "opacity " + duration + "ms ease-out";
			el.style.opacity = 0;
		},
		collapse: (el, ...params) => {
			const duration = params[0] ?? 250;
			const height = el.offsetHeight;
			el.style.height = height + "px";
			el.offsetHeight;
			el.style.transition = "all " + duration + "ms ease-out";
			el.style.height = 0;
		},
		expand: (el, ...params) => {
			const duration = params[0] ?? 250;
			el.style.height = "auto";
			el.style.transition = "none";
			const height = el.offsetHeight;
			el.style.height = 0;
			el.style.transition = "all " + duration + "ms ease-out";
			el.offsetHeight;
			el.style.height = height + "px";
			setTimeout(() => {
				el.style.height = "auto";
			}, duration);
		},
		toggleCollapse: (el, ...params) =>
			el.offsetHeight === 0
				? this.expand(el, ...params)
				: this.collapse(el, ...params),
		scrollToTop: () => window.scrollTo({ top: 0, behavior: "smooth" }),
		scrollTo: (el) => el.scrollIntoView({ behavior: "smooth" }),
		setAttribute: (el, ...params) => {
			const name = params[0];
			const value = params[1];
			el.setAttribute(name, value);
		},
		removeAttribute: (el, ...params) => {
			const name = params[0];
			el.removeAttribute(name);
		},
		toggleAttribute: (el, ...params) => {
			const name = params[0];
			el.hasAttribute(name)
				? el.removeAttribute(name)
				: el.setAttribute(name, "");
		},
		setActive: (el) => el.classList.add("active"),
		removeActive: (el) => el.classList.remove("active"),
		toggleActive: (el) => el.classList.toggle("active"),
		setHref: (el, ...params) => (el.href = params[0]),
		setSrc: (el, ...params) => (el.src = params[0]),
		log: (el, ...params) => el.log(params),
	};
}

document.addEventListener("DOMContentLoaded", function () {
	const dataDo = new DataDo();
	dataDo.init();
});
