---
title: 'Playwright Patterns I Keep Coming Back To'
description: 'A collection of Playwright patterns that have held up across multiple projects — Page Object Model done right, fixture composition, and trace-driven debugging.'
pubDate: 2026-02-05
tags: ['playwright', 'typescript', 'testing']
draft: false
---

I've been writing Playwright tests across several different codebases over the past few years. Some patterns have proven their worth repeatedly; others I've abandoned after watching them cause more pain than they solved.

Here's what I keep using.

## Page Object Model — but lighter than you think

The classic POM advice is to wrap every page in a class with methods for every interaction. This leads to massive files and a layer of abstraction that mirrors the UI almost exactly, adding little value.

The version I actually use:

```typescript
// pages/checkout.ts
export class CheckoutPage {
  constructor(private page: Page) {}

  readonly orderSummary = this.page.getByTestId('order-summary');
  readonly placeOrderBtn = this.page.getByRole('button', { name: 'Place order' });

  async fillPayment(card: { number: string; expiry: string; cvc: string }) {
    await this.page.getByLabel('Card number').fill(card.number);
    await this.page.getByLabel('Expiry').fill(card.expiry);
    await this.page.getByLabel('CVC').fill(card.cvc);
  }
}
```

Keep it flat. Expose locators as properties (not methods) where possible — they're lazy by default and you get chaining for free. Only wrap sequences that are genuinely reused.

## Fixture composition

Playwright fixtures are the most underrated feature in the framework. Don't put everything in `beforeEach` hooks; model your test dependencies explicitly.

```typescript
// fixtures/index.ts
import { test as base } from '@playwright/test';
import { CheckoutPage } from '../pages/checkout';
import { ApiClient } from './api-client';

export const test = base.extend<{
  checkout: CheckoutPage;
  api: ApiClient;
  authenticatedUser: { id: string; token: string };
}>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  authenticatedUser: async ({ api }, use) => {
    const user = await api.createUser();
    await use(user);
    await api.deleteUser(user.id);
  },

  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});
```

Now tests declare what they need and fixtures handle setup/teardown:

```typescript
test('checkout with valid card', async ({ checkout, authenticatedUser }) => {
  // user exists, checkout page is ready
});
```

This composes cleanly and avoids shared state between tests.

## Trace-first debugging

Stop sprinkling `console.log` and `await page.screenshot()` calls when tests fail. Enable traces in your Playwright config:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'retain-on-failure',
  },
});
```

When a test fails, the trace gives you a full timeline: every action, network request, console log, and screenshot. You can scrub through the execution like a video. It's dramatically faster than trying to reproduce flaky failures locally.

In CI, upload the traces as artifacts and share the link in Slack. Your team will stop asking "can you reproduce it?" and start asking "what does the trace show?"

## Waiting for network, not time

Any `page.waitForTimeout()` in a test suite is a bug waiting to happen. Either the wait is too short (flaky) or too long (slow). Use network-aware waiting instead:

```typescript
// Bad
await page.click('#submit');
await page.waitForTimeout(2000);
await expect(page.getByText('Order confirmed')).toBeVisible();

// Good
await Promise.all([
  page.waitForResponse((r) => r.url().includes('/orders') && r.status() === 201),
  page.click('#submit'),
]);
await expect(page.getByText('Order confirmed')).toBeVisible();
```

Tie your assertions to application events, not wall clock time.

## The test data problem

Hard-coded test data is the main source of flakiness in my experience. What works in isolation fails under parallel execution when two tests compete for the same user account or product ID.

The pattern I use: generate unique test data per test run using a lightweight factory.

```typescript
const uniqueEmail = () => `test+${Date.now()}@example.com`;
const uniqueSku = (prefix = 'PROD') => `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
```

Combine this with fixture-driven API setup (create the entity, test it, clean up) and you get isolation for free.

---

None of these patterns are novel. But applying them consistently — across the whole team, in every PR — is what separates a test suite that's an asset from one that's a liability.
