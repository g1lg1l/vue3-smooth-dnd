// End-to-end checks against the demo. Every reported issue has a test named after it.
import { expect, test } from '@playwright/test'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const center = async (locator) => {
  const box = await locator.boundingBox()
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

/** Press at `from`, exceed the 1px start threshold, then move to `to` in steps. Leaves the button down. */
async function dragTo(page, from, to, steps = 20) {
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(from.x + 4, from.y + 4)
  await sleep(30)
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(from.x + ((to.x - from.x) * i) / steps, from.y + ((to.y - from.y) * i) / steps)
    await sleep(16)
  }
  await sleep(120)
}

/** Release and wait for the drop animation and the drop event. */
async function release(page, ms = 700) {
  await page.mouse.up()
  await sleep(ms)
}

const ghost = (page) =>
  page.evaluate(() => {
    const el = document.querySelector('.smooth-dnd-ghost')
    if (!el) return null
    const rect = el.getBoundingClientRect()
    return {
      x: rect.x,
      y: rect.y,
      parent: el.parentElement.tagName,
      opacity: el.style.opacity,
      transform: el.style.transform,
    }
  })

const isDragging = (page) => page.evaluate(() => document.body.classList.contains('smooth-dnd-dragging'))

/** Newest logged event for a container, parsed. */
const lastEvent = async (page, source, event) => {
  const row = page
    .locator(`[data-testid="event-log"] li[data-source="${source}"][data-event="${event}"]`)
    .first()
  if ((await row.count()) === 0) return undefined
  return JSON.parse(await row.locator('code').textContent())
}

const items = (list) => list.locator('> .smooth-dnd-draggable-wrapper')

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (error) => {
    throw error
  })
})

test.describe('copy → contain (#20)', () => {
  test('addedIndex is 0 again after every item was deleted', async ({ page }) => {
    await page.goto('#/copy-contain')
    const source = items(page.getByTestId('source-list'))
    const target = page.getByTestId('target-list')
    const targetItems = items(target)

    for (let i = 0; i < 3; i++) {
      const box = await target.boundingBox()
      const last = (await targetItems.count()) ? await targetItems.last().boundingBox() : null
      const y = Math.min(last ? last.y + last.height + 20 : box.y + 40, box.y + box.height - 12)
      await dragTo(page, await center(source.nth(i)), { x: box.x + box.width / 2, y })
      await release(page)
    }
    await expect(targetItems).toHaveCount(3)

    const remove = target.getByRole('button', { name: 'Delete' })
    while ((await remove.count()) > 0) {
      await remove.first().click()
      await sleep(50)
    }
    await expect(targetItems).toHaveCount(0)

    const box = await target.boundingBox()
    await dragTo(page, await center(source.nth(0)), { x: box.x + box.width / 2, y: box.y + 40 })
    await release(page)
    expect(await lastEvent(page, 'contain', 'drop')).toMatchObject({ removedIndex: null, addedIndex: 0 })
  })
})

test.describe('playground', () => {
  let listA, listB

  test.beforeEach(async ({ page }) => {
    await page.goto('#/playground')
    listA = page.getByTestId('list-A')
    listB = page.getByTestId('list-B')
    await expect(items(listA)).toHaveCount(6)
  })

  test('drop outside animates back when removeOnDropOut is off (#13)', async ({ page }) => {
    const outside = { x: 640, y: 40 } // top bar
    await dragTo(page, await center(items(listA).nth(0)), outside)
    await page.mouse.up()
    await sleep(60)
    const g = await ghost(page)
    expect(g).not.toBeNull()
    expect(g.opacity).not.toBe('0')
    expect(g.transform).not.toMatch(/scale\(0\.9\)/)
    await sleep(700)
    await expect(items(listA)).toHaveCount(6)
    expect(await lastEvent(page, 'A', 'drop')).toBeUndefined()
  })

  test('drop outside removes the item when removeOnDropOut is on', async ({ page }) => {
    await page.getByLabel('removeOnDropOut').check()
    await dragTo(page, await center(items(listA).nth(0)), { x: 640, y: 40 })
    await page.mouse.up()
    await sleep(60)
    expect((await ghost(page)).opacity).toBe('0')
    await sleep(700)
    await expect(items(listA)).toHaveCount(5)
    expect(await lastEvent(page, 'A', 'drop')).toMatchObject({ removedIndex: 0, addedIndex: null })
  })

  test('no :hover on items while dragging, hover works again afterwards (#18)', async ({ page }) => {
    const from = await center(items(listA).nth(0))
    const to = await center(items(listA).nth(3))
    await dragTo(page, from, to)
    const hovered = await page.evaluate(
      () =>
        [...document.querySelectorAll(':hover')].filter((el) =>
          el.matches('.smooth-dnd-draggable-wrapper, .smooth-dnd-draggable-wrapper *'),
        ).length,
    )
    expect(hovered).toBe(0)
    await release(page)
    await page.mouse.move(to.x + 1, to.y + 1)
    await sleep(50)
    const hoveredAfter = await page.evaluate(
      () =>
        [...document.querySelectorAll(':hover')].filter((el) => el.matches('.smooth-dnd-draggable-wrapper'))
          .length,
    )
    expect(hoveredAfter).toBe(1)
    expect(await isDragging(page)).toBe(false)
  })

  test('reorders within a list and moves between lists', async ({ page }) => {
    const texts = async () => (await items(listA).allInnerTexts()).map((t) => t.trim())
    const before = await texts()
    await dragTo(page, await center(items(listA).nth(0)), await center(items(listA).nth(2)))
    await release(page)
    const after = await texts()
    expect(after[0]).toBe(before[1])
    expect(after).toContain(before[0])

    const box = await listB.boundingBox()
    await dragTo(page, await center(items(listA).nth(0)), { x: box.x + box.width / 2, y: box.y + 30 })
    await release(page)
    await expect(items(listB)).toHaveCount(5)
    expect(await lastEvent(page, 'B', 'drop')).toMatchObject({ removedIndex: null, addedIndex: 0 })
    expect(await lastEvent(page, 'A', 'drop')).toMatchObject({ removedIndex: 0, addedIndex: null })
  })

  test('ghost follows the pointer under a filter and is re-parented to body (#14)', async ({ page }) => {
    await page.getByLabel('Filter on ancestor').check()
    await sleep(50)
    const box = await items(listA).nth(1).boundingBox()
    const from = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
    await dragTo(page, from, { x: from.x + 60, y: from.y + 90 })
    const g = await ghost(page)
    expect(g.parent).toBe('BODY')
    expect(Math.abs(g.x - (box.x + 60))).toBeLessThan(3)
    expect(Math.abs(g.y - (box.y + 90))).toBeLessThan(3)
    await release(page)

    await page.getByLabel('Filter on ancestor').uncheck()
    await sleep(50)
    const box2 = await items(listA).nth(1).boundingBox()
    await dragTo(page, { x: box2.x + 30, y: box2.y + box2.height / 2 }, { x: box2.x + 30, y: box2.y + 80 })
    const g2 = await ghost(page)
    expect(g2.parent).toBe('DIV')
    expect(Math.abs(g2.y - (box2.y + 80 - box2.height / 2))).toBeLessThan(3)
    await release(page)
  })
})

test.describe('auto scroll', () => {
  test('scrolls the window, a scrollable element and a horizontal strip', async ({ page }) => {
    await page.goto('#/auto-scroll')
    const rows = items(page.getByTestId('rows-list'))
    await dragTo(page, await center(rows.nth(0)), { x: 300, y: 705 })
    await sleep(800)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(50)
    await release(page)
    await page.evaluate(() => window.scrollTo(0, 0))
    await sleep(100)

    const boxed = page.getByTestId('boxed-list')
    await boxed.scrollIntoViewIfNeeded()
    const bb = await boxed.boundingBox()
    await dragTo(page, await center(items(boxed).nth(0)), {
      x: bb.x + bb.width / 2,
      y: bb.y + bb.height - 15,
    })
    await sleep(800)
    expect(await boxed.evaluate((el) => el.scrollTop)).toBeGreaterThan(50)
    await release(page)

    const strip = page.getByTestId('strip-list')
    await strip.scrollIntoViewIfNeeded()
    await sleep(200)
    const sb = await strip.boundingBox()
    await dragTo(page, await center(items(strip).nth(0)), {
      x: sb.x + sb.width - 15,
      y: sb.y + sb.height / 2,
    })
    await sleep(800)
    expect(await strip.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50)
    await release(page)
  })
})

test.describe('kanban', () => {
  test('moves cards, reorders columns, ghost is not offset by a column filter (#14)', async ({ page }) => {
    await page.goto('#/kanban')
    const columns = items(page.getByTestId('board'))
    const cards = (i) => columns.nth(i).locator('.smooth-dnd-container > .smooth-dnd-draggable-wrapper')
    const c0 = await cards(0).count()
    const c1 = await cards(1).count()

    const target = await columns.nth(1).locator('.smooth-dnd-container').boundingBox()
    await dragTo(page, await center(cards(0).nth(0)), { x: target.x + target.width / 2, y: target.y + 40 })
    await release(page, 900)
    await expect(cards(0)).toHaveCount(c0 - 1)
    await expect(cards(1)).toHaveCount(c1 + 1)

    const names = () => page.locator('.column-handle .column-name').allInnerTexts()
    const before = await names()
    await dragTo(
      page,
      await center(columns.nth(0).locator('.column-handle')),
      await center(columns.nth(2).locator('.column-handle')),
    )
    await release(page, 900)
    const after = await names()
    expect(after.slice(0, 3)).toEqual([before[1], before[2], before[0]])

    await page.getByLabel('Filter on columns').check()
    await sleep(50)
    const cb = await cards(1).nth(0).boundingBox()
    await dragTo(
      page,
      { x: cb.x + cb.width / 2, y: cb.y + cb.height / 2 },
      { x: cb.x + cb.width / 2 + 200, y: cb.y + cb.height / 2 + 120 },
    )
    const g = await ghost(page)
    expect(g.parent).toBe('BODY')
    expect(Math.abs(g.x - (cb.x + 200))).toBeLessThan(3)
    expect(Math.abs(g.y - (cb.y + 120))).toBeLessThan(3)
    await release(page, 900)
  })
})

test.describe('kanban scrolling', () => {
  const column = (page, i) => items(page.getByTestId('board')).nth(i).locator('.smooth-dnd-container')
  const cards = (page, i) => column(page, i).locator('> .smooth-dnd-draggable-wrapper')

  test('a column scrolls vertically and the board sideways while the pointer is over a column', async ({
    page,
  }) => {
    await page.goto('#/kanban')
    const board = page.getByTestId('board')
    // the first column always has 12 cards, enough to overflow
    const first = column(page, 0)
    const cb = await first.boundingBox()
    await dragTo(page, await center(cards(page, 1).nth(0)), {
      x: cb.x + cb.width / 2,
      y: cb.y + cb.height - 15,
    })
    await sleep(800)
    expect(await first.evaluate((el) => el.scrollTop)).toBeGreaterThan(50)
    await release(page, 900)

    const bb = await board.boundingBox()
    // 60px from the board's right edge lands on a partially visible column
    await dragTo(page, await center(cards(page, 1).nth(0)), { x: bb.x + bb.width - 60, y: cb.y + 100 })
    await sleep(800)
    expect(await board.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50)
    await release(page, 900)
  })

  test('the drop placeholder stays aligned inside a scrolled column', async ({ page }) => {
    await page.goto('#/kanban')
    const first = column(page, 0)
    await first.evaluate((el) => {
      el.scrollTop = 220
    })
    await sleep(100)
    const cb = await first.boundingBox()
    await dragTo(page, await center(cards(page, 1).nth(0)), {
      x: cb.x + cb.width / 2,
      y: cb.y + cb.height / 2,
    })

    const placeholder = await first.locator('.smooth-dnd-drop-preview-constant-class').boundingBox()
    expect(placeholder).not.toBeNull()
    const rects = await cards(page, 0).evaluateAll((els) =>
      els
        .filter((el) => el.style.visibility !== 'hidden')
        .map((el) => ({ top: el.getBoundingClientRect().top, bottom: el.getBoundingClientRect().bottom })),
    )
    const overlap = Math.max(
      0,
      ...rects.map(
        (r) => Math.min(r.bottom, placeholder.y + placeholder.height) - Math.max(r.top, placeholder.y),
      ),
    )
    expect(overlap).toBeLessThan(6)
    await release(page, 900)
  })
})

test('home hero list is sortable', async ({ page }) => {
  await page.goto('')
  const list = items(page.getByTestId('hero-list'))
  const titles = () => list.locator('.film-title').allInnerTexts()
  const before = await titles()
  await dragTo(page, await center(list.nth(0)), await center(list.nth(2)))
  await release(page)
  const after = await titles()
  expect(after[0]).toBe(before[1])
  expect(after).toContain(before[0])
})

test('reference documents every prop and event of both components', async ({ page }) => {
  await page.goto('#/reference')
  await expect(page.getByTestId('container-props').locator('tbody tr')).toHaveCount(18)
  await expect(page.getByTestId('container-events').locator('tbody tr')).toHaveCount(6)
  await expect(page.getByTestId('draggable-props').locator('tbody tr')).toHaveCount(1)
  await expect(page.locator('[data-undocumented]')).toHaveCount(0)
})
