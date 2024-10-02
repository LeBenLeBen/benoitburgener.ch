---
title: On positioning popovers
date: 2024-10-02
tags:
  - development
  - progressive-enhancement
---

Beginning new projects is usually a good time to look into features recently added to the web plateform. Now that native popovers are widely supported, I decided to give them a go in the latest project I started.

## Making a popover

To transform an element into a popover, you basically need to do two things:

- add the `popover` attribute to an element
- have a button to toggle its display, using the `popovertarget` attribute

```html
<div id="the-popover" popover>Hi y’all</div>
<button type="button" popovertarget="the-popover">Toggle popover</button>
```

And that’s it!

## Positioning the popover relative to its trigger button

If you proceed like I did, you’ll soon realize that the popover element is displayed in the middle of the viewport. Not really the behavior we usually expect. I started to look into a way to position it relatively to the button using CSS but quickly came to the conclusion it’s — at the time of writing this article — not possible.

Popovers are part of the [top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer), which means they are displayed separately, above all other elements. The good news is: browsers have started to implement a new feature called [anchor positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning) to resolve this issue. Until then, we’ll have to handle the positioning ourselves using JavaScript.

By digging deeper into the topic and looking at what other devs have done in this direction, I came across Hidde’s article on [positioning anchored popovers](https://hidde.blog/positioning-anchored-popovers/). He suggests a simple solution using the [Floating UI](https://floating-ui.com/) library. I liked the simplicity of it and decided to go in this direction. After playing a bit with it, I realised it was not enough for my use cases though:

- I had popovers living inside a sticky element, which requires the positioning to be computed again when scrolling.
- When opening the popover, it would appear at the top left of the screen for a few milliseconds and then move to the right position.
- I wanted to configure each popover positioning separately.
- I wanted to style the button controlling the popover state differently when the later was open.

This leaded me to complement Hidde’s version with the following code:

```js
import { offset, autoUpdate, computePosition } from '@floating-ui/dom';

// We need to keep a global list of open popovers to properly destroy
// Floating UI instance when it’s closed
const openPopovers = new WeakMap();

function positionPopover(e) {
  const popover = e.target;
  // Allow to customize the popover placement using the `data-popover-placement` attribute
  const placement = popover.dataset.popoverPlacement ?? 'bottom-start';
  const invoker = document.querySelector(
    `[popovertarget="${popover.getAttribute('id')}"]`
  );

  function updatePopoverPosition() {
    computePosition(invoker, popover, {
      placement,
      // Let’s space-out a bit the popover from the button, you can read more about that
      // in Floating UI documentation
      middleware: [offset(8)],
    }).then(({ x, y }) => {
      Object.assign(popover.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
      // Now that the popover is properly positioned, we can actually make it visible
      popover.classList.add('is-positioned');
    });
  }

  if (e.newState === 'open') {
    // When opening the popover, create an autoUpdate instance that will take care
    // of updating the popover position on scroll, resize, etc.
    // We store the instance to be able to destroy it when we’ll close the popover.
    openPopovers.set(
      popover,
      autoUpdate(invoker, popover, updatePopoverPosition)
    );
    // Allow to style the invoker button differently when the popover is open
    invoker.classList.add('is-popover-open');
  } else {
    // When closing the popover, we destroy the autoUpdate instance and revert everything
    const destroy = openPopovers.get(popover);
    if (typeof destroy === 'function') {
      destroy();
      openPopovers.delete(popover);
      popover.classList.remove('is-positioned');
    }
    invoker.classList.remove('is-popover-open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // When the DOM is ready, initialize all popover elements to use the
  // custom behavior above
  document
    .querySelectorAll('[popover]')
    .forEach((p) => p.addEventListener('toggle', positionPopover));
});
```

The code above requires the following CSS to behave properly:

```css
[popover] {
  width: max-content;
  margin: 0;
  padding: 0;

  position: absolute;
  top: 0;
  left: 0;

  /* Hide the popover until it’s properly positioned */
  visibility: hidden;

  &.is-positioned {
    visibility: visible;
  }
}
```
