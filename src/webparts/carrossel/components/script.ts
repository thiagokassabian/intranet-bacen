export function carrossel(id: string): void {
	// Script para funcionamento do componente como uma "esteira"
	const container = document.querySelector(`#${id}`);
	const nav: HTMLElement | null = document.querySelector(`#${id} .items`);
	const left = document.querySelector(`#${id} .left`);
	const right = document.querySelector(`#${id} .right`);
	let idx: NodeJS.Timeout;
	let oldPosition = 0;

	if (!container || !nav || !left || !right) return;

	container.addEventListener("mouseenter", function () {
		if (nav.scrollWidth > nav.offsetWidth) {
			left.classList.add("show");
			right.classList.add("show");
		}
	});
	container.addEventListener("mouseleave", function () {
		if (nav.scrollWidth > nav.offsetWidth) {
			left.classList.remove("show");
			right.classList.remove("show");
		}
	});

	left.addEventListener("mouseenter", function () {
		idx = setInterval(() => {
			if (oldPosition > 0) {
				nav.style.right = (oldPosition -= 1) + 'px';
				right.classList.remove("d-none");
			}

			if (oldPosition === 0) left.classList.add("d-none");
		}, 0);
	});

	left.addEventListener("mouseleave", function () {
		clearInterval(idx);
	});

	right.addEventListener("mouseenter", function () {
		idx = setInterval(() => {
			const slideWidth = nav.scrollWidth - nav.offsetWidth;
			if (oldPosition < slideWidth) nav.style.right = (oldPosition += 1) + 'px';
			else right.classList.add("d-none");

			if (oldPosition > 0) left.classList.remove("d-none");
		}, 0);
	});

	right.addEventListener("mouseleave", function () {
		clearInterval(idx);
	});

	window.addEventListener("resize", function () {
		if (window.innerWidth < 1200) {
			oldPosition = 0;
			nav.style.right = '0';
		}
	});
}