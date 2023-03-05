---
title: Using Web Components Shadow DOM to scope CSS
date: 2023-03-05
tags:
  - development
  - web-components
  - shadow-dom
  - css
---

I decided to migrate [Chūshō’s documentation](https://www.chusho.dev/) from [VuePress](https://vuepress.vuejs.org/) to [VitePress](https://vitepress.vuejs.org/) the other day. It contains pages about the Vue components the library provides and naturally they include live examples of the components behavior. These examples have a completely different style than the rest of the documentation site though and it leads to conflicts. I could have just used iframes to scope them, but I want these examples to be interactive in the future and that would make the whole thing unecessarily complicate.

I use Tailwind for the demos, to craft various styles very quickly. Until now, I disabled the preflight plugin (their custom normalize.css) to avoid breaking VuePress’ layout. But removing this plugin caused other issues when using Tailwind classes. Migrating to VitePress introduced other problems and I thought it was the right time to find a better solution.

## Web Components

I never really looked into Web Components; I knew that Shadow DOM allows to scope CSS within an element though, so I decided to look into that direction. I started by creating the simplest custom element:

```js
class ShowcaseRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
}

customElements.define('showcase-root', ShowcaseRoot);
```

And here’s how it’s used:

```html
<showcase-root>
  <button type="button">I’m a scoped button!</button>
</showcase-root>
```

### Slots & scope

It turns out this code isn’t enough to render the component children (the button in the example above). To do so, its necessary to explicitely define a `slot` Element within the component, like this:

```js
class ShowcaseRoot extends HTMLElement {
  // ...

  // This is a native method called by the browser when the component is added to the document
  connectedCallback() {
    // Create a slot and append it to the shadowRoot
    this.shadowRoot.appendChild(document.createElement('slot'));
  }
}
```

Now it renders the button; but something is off: it inherits the document styles, exactly what I wanted to avoid. I was confused by this behavior at first, but it makes sense: the content of the slot is part of the main document, and so it inherits the document styles. Technically the slot content is not part of the `shadowRoot` and therefor not scoped, only the DOM that is explicitely attached to it is.

So this won’t work for my use case. Let’s remove the slot and try to append the children directly to the `shadowRoot` instead:

```js
class ShowcaseRoot extends HTMLElement {
  // ...

  connectedCallback() {
    // Instead of creating a slot, we append the component children to its shadowRoot
    this.shadowRoot.append(...this.childNodes);
  }
}
```

And now it works! The button is scoped and doesn’t inherit the document styles anymore.

### Adding styles

The last thing to do is to add the stylesheet to be applied to the elements living inside the `shadowRoot`:

```js
class ShowcaseRoot extends HTMLElement {
  constructor() {
    // ...

    // Load an external stylesheet and attach it to the shadowRoot
    // so it’s scoped to the component
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/path/to/your/style.css';
    this.shadowRoot.appendChild(style);
  }

  // ...
}
```

And that’s it! The content is now scoped and the styles are not leaking to the rest of the page. Note that you can also use a `style` tag instead of an external stylesheet, or even go wild and use the recent [`Document.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets) and [`CSSStyleSheet`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet) APIs.

## Result

Here’s the whole component code:

```js
class ShowcaseRoot extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/path/to/your/style.css';
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    this.shadowRoot.append(...this.childNodes);
  }
}
```

You can view this code live in Chūshō’s documentation, for example [the Button component](https://www.chusho.dev/guide/components/button).
