import { DraggableInfo, IContainer, Axis, Rect, ScrollAxis, Position } from "./interfaces";
import { getScrollingAxis, getVisibleRect, getWindowScrollingAxis, hasClass } from "./utils";
import { preventAutoScrollClass } from "./constants";

type Direction = 'begin' | 'end';
type ScrollTarget = HTMLElement | Window;

const maxSpeed = 1500; // px/s

interface Animator {
	stop: () => void;
	animate: (direnction: Direction, speed: number) => void;
}

interface ScrollParams {
	direction: Direction,
	speedFactor: number;
}

interface AnimationState {
	animator: Animator;
	scrollParams?: ScrollParams | null;
}

interface AxisAnimation {
	x?: AnimationState;
	y?: AnimationState;
}

interface ScrollerAnimator {
	axisAnimations: AxisAnimation;
	scrollerElement: HTMLElement;
	getRect: () => Rect;
}

function getScrollParams(position: Position, axis: Axis, rect: Rect): ScrollParams | null {
	const { left, right, top, bottom } = rect;
	const { x, y } = position;
	if (x < left || x > right || y < top || y > bottom) {
		return null;
	}

	let begin;
	let end;
	let pos;
	if (axis === 'x') {
		begin = left;
		end = right;
		pos = x;
	} else {
		begin = top;
		end = bottom;
		pos = y;
	}

	const scrollerSize = end - begin;

	const moveDistance = scrollerSize > 400 ? 100 : scrollerSize / 4;
	if (end - pos < moveDistance) {
		return {
			direction: 'end',
			speedFactor: (moveDistance - (end - pos)) / moveDistance
		};
	} else if (pos - begin < moveDistance) {
		return {
			direction: 'begin',
			speedFactor: (moveDistance - (pos - begin)) / moveDistance
		};
	}

	return null;
}

function addScrollValue(element: ScrollTarget, axis: Axis, value: number) {
	if (element) {
		if (element !== window) {
			if (axis === 'x') {
				(element as HTMLElement).scrollLeft += value;
			} else {
				(element as HTMLElement).scrollTop += value;
			}
		} else {
			if (axis === 'x') {
				element.scrollBy(value, 0);
			} else {
				element.scrollBy(0, value);
			}
		}
	}
}

const createAnimator = (element: ScrollTarget, axis: Axis = 'y'): Animator => {
	let request: number | null = null;
	let startTime: number | null = null;
	let direction: Direction | null = null;
	let speed: number | null = null;

	function animate(_direction: Direction, _speed: number) {
		direction = _direction;
		speed = _speed;
		start();
	}

	function start() {
		if (request === null) {
			request = requestAnimationFrame((timestamp) => {
				if (startTime === null) { startTime = timestamp; }
				const timeDiff = timestamp - startTime;
				startTime = timestamp;
				let distanceDiff = (timeDiff / 1000) * speed!;
				distanceDiff = direction === 'begin' ? (0 - distanceDiff) : distanceDiff;
				addScrollValue(element, axis, distanceDiff);
				request = null;
				start();
			});
		}
	}

	function stop() {
		if (request !== null) {
			cancelAnimationFrame(request);
			request = null;
		}
		startTime = null;
	}

	return {
		animate,
		stop
	};
}

function rectangleGetter(element: HTMLElement) {
	return () => {
		return getVisibleRect(element, element.getBoundingClientRect())
	}
}

const getViewportRect = (): Rect => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight });

function createAxisAnimations(target: ScrollTarget, scrollingAxis: ScrollAxis): AxisAnimation {
	const axisAnimations: AxisAnimation = {};
	if (scrollingAxis !== ScrollAxis.y) {
		axisAnimations.x = { animator: createAnimator(target, 'x') };
	}
	if (scrollingAxis !== ScrollAxis.x) {
		axisAnimations.y = { animator: createAnimator(target, 'y') };
	}
	return axisAnimations;
}

function getScrollerAnimator(container: IContainer): ScrollerAnimator[] {
	const scrollerAnimators: ScrollerAnimator[] = [];
	const html = window.document.documentElement;
	const body = window.document.body;
	let hasViewportAnimator = false;
	let current: HTMLElement | null = container.element;

	while (current) {
		const scrollingAxis = getScrollingAxis(current);

		if (scrollingAxis && !hasClass(current, preventAutoScrollClass)) {
			// vue3-smooth-dnd: overflow on <html> (or on <body> when it propagates to the viewport) scrolls the window,
			// so drive `window` and measure distances against the viewport instead of the element box
			const isViewport = current === html || (current === body && window.getComputedStyle(html).overflow === 'visible');
			if (!isViewport || !hasViewportAnimator) {
				hasViewportAnimator = hasViewportAnimator || isViewport;
				scrollerAnimators.push({
					axisAnimations: createAxisAnimations(isViewport ? window : current, scrollingAxis),
					getRect: isViewport ? getViewportRect : rectangleGetter(current),
					scrollerElement: isViewport ? html : current,
				});
			}
		}
		current = current.parentElement;
	}

	// vue3-smooth-dnd: with the default `overflow: visible` the page still scrolls whenever the document is bigger than the viewport
	if (!hasViewportAnimator && !hasClass(html, preventAutoScrollClass) && !hasClass(body, preventAutoScrollClass)) {
		const windowAxis = getWindowScrollingAxis();
		if (windowAxis) {
			scrollerAnimators.push({
				axisAnimations: createAxisAnimations(window, windowAxis),
				getRect: getViewportRect,
				scrollerElement: html,
			});
		}
	}

	return scrollerAnimators;
}

function setScrollParams(animatorInfos: ScrollerAnimator[], position: Position) {
	animatorInfos.forEach((animator: ScrollerAnimator) => {
		const { axisAnimations, getRect } = animator;
		const rect = getRect();
		if (axisAnimations.x) {
			axisAnimations.x.scrollParams = getScrollParams(position, 'x', rect)
		}

		if (axisAnimations.y) {
			axisAnimations.y.scrollParams = getScrollParams(position, 'y', rect)
		}
	});
}

// vue3-smooth-dnd: upstream let one scroller win for both axes, so a board could never scroll sideways while the
// pointer was over one of its columns. The topmost scroller under the pointer now wins per axis.
function stopAllButTopmost(animatorInfos: ScrollerAnimator[], position: Position) {
	const hit = document.elementFromPoint(position.x, position.y);
	(['x', 'y'] as Axis[]).forEach(axis => {
		const candidates = animatorInfos.filter(p => p.axisAnimations[axis]);
		if (candidates.length < 2) return;

		let topmost: ScrollerAnimator | undefined;
		for (let current: Element | null = hit; current && !topmost; current = current.parentElement) {
			topmost = candidates.find(p => p.scrollerElement === current);
		}

		if (topmost) {
			candidates.forEach(p => {
				if (p !== topmost) p.axisAnimations[axis]!.animator.stop();
			});
		}
	});
}

export default (containers: IContainer[], maxScrollSpeed = maxSpeed) => {
	const animatorInfos = containers.reduce((acc: ScrollerAnimator[], container: IContainer) => {
		const filteredAnimators = getScrollerAnimator(container).filter(p => {
			return !acc.find(q => q.scrollerElement === p.scrollerElement);
		});
		return [...acc, ...filteredAnimators];
	}, []);


	return ({ draggableInfo, reset }: { draggableInfo?: DraggableInfo; reset?: boolean }) => {
		if (reset) {
			animatorInfos.forEach(p => {
				p.axisAnimations.x && p.axisAnimations.x.animator.stop();
				p.axisAnimations.y && p.axisAnimations.y.animator.stop();
			});
			return;
		}

		if (draggableInfo) {
			setScrollParams(animatorInfos, draggableInfo.mousePosition);

			animatorInfos.forEach(animator => {
				const { x, y } = animator.axisAnimations;
				if (x) {
					if (x.scrollParams) {
						const { direction, speedFactor } = x.scrollParams;
						x.animator.animate(direction, speedFactor * maxScrollSpeed);
					} else {
						x.animator.stop();
					}
				}

				if (y) {
					if (y.scrollParams) {
						const { direction, speedFactor } = y.scrollParams;
						y.animator.animate(direction, speedFactor * maxScrollSpeed);
					} else {
						y.animator.stop();
					}
				}
			});

			stopAllButTopmost(animatorInfos, draggableInfo.mousePosition);
		}
	}
}
