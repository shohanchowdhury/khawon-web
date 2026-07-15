import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { test, expect } from '@playwright/test'

const OUTPUT_DIR = join(process.cwd(), 'audit-output', 'foods-layout')
const NAV_HEIGHT = 76
const VIEWPORT_HEIGHT = 900
const TOLERANCE = 2

interface BoxMetrics {
  x: number
  y: number
  width: number
  height: number
}

interface LayoutCheck {
  name: string
  pass: boolean
  detail: string
}

interface StateReport {
  state: string
  metrics: Record<string, BoxMetrics | number | boolean>
  checks: LayoutCheck[]
}

function boxMetrics(locator: {
  boundingBox: () => Promise<{
    x: number
    y: number
    width: number
    height: number
  } | null>
}): Promise<BoxMetrics | null> {
  return locator.boundingBox().then((box) =>
    box
      ? {
          x: Math.round(box.x),
          y: Math.round(box.y),
          width: Math.round(box.width),
          height: Math.round(box.height),
        }
      : null,
  )
}

function near(a: number, b: number, tolerance = TOLERANCE): boolean {
  return Math.abs(a - b) <= tolerance
}

async function collectStateMetrics(
  page: import('@playwright/test').Page,
  state: string,
): Promise<StateReport> {
  const sidebar = page.locator('.foods-layout__split-sidebar')
  const header = page.locator('.foods-sidebar__header')
  const nav = page.locator('.foods-layout__split-nav')
  const split = page.locator('.foods-layout__split')
  const allDishes = page.locator('.foods-layout__split-nav-item').first()
  const firstCategory = page.locator('.foods-category-nav-item').first()

  await expect(sidebar).toBeVisible()
  await expect(nav).toBeVisible()

  const [
    sidebarBox,
    headerBox,
    navBox,
    splitBox,
    allDishesBox,
    firstCategoryBox,
    docScrollWidth,
    docClientWidth,
    navScrollHeight,
    navClientHeight,
  ] = await Promise.all([
    boxMetrics(sidebar),
    boxMetrics(header),
    boxMetrics(nav),
    boxMetrics(split),
    boxMetrics(allDishes),
    boxMetrics(firstCategory),
    page.evaluate(() => document.documentElement.scrollWidth),
    page.evaluate(() => document.documentElement.clientWidth),
    nav.evaluate((el) => el.scrollHeight),
    nav.evaluate((el) => el.clientHeight),
  ])

  const scrollTopBefore = await nav.evaluate((el) => el.scrollTop)
  await nav.hover()
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(200)
  const scrollTopAfter = await nav.evaluate((el) => el.scrollTop)
  const navScrolls =
    navScrollHeight > navClientHeight && scrollTopAfter > scrollTopBefore

  const checks: LayoutCheck[] = []

  if (splitBox) {
    const maxSplit = VIEWPORT_HEIGHT - NAV_HEIGHT + 40
    checks.push({
      name: 'split_height_bounded',
      pass: splitBox.height <= maxSplit,
      detail: `split height ${splitBox.height}px (max ~${maxSplit}px)`,
    })
  }

  if (sidebarBox) {
    const maxSidebar = VIEWPORT_HEIGHT - NAV_HEIGHT + 40
    checks.push({
      name: 'sidebar_height_bounded',
      pass: sidebarBox.height <= maxSidebar,
      detail: `sidebar height ${sidebarBox.height}px (max ~${maxSidebar}px)`,
    })
  }

  checks.push({
    name: 'nav_scrollable',
    pass: navScrolls || navScrollHeight <= navClientHeight + 1,
    detail: `nav scrollHeight ${navScrollHeight}, clientHeight ${navClientHeight}, scrolled ${scrollTopBefore}→${scrollTopAfter}`,
  })

  if (sidebarBox && headerBox && navBox) {
    const fullBleed =
      near(headerBox.width, sidebarBox.width) &&
      near(navBox.width, sidebarBox.width) &&
      near(headerBox.x, sidebarBox.x) &&
      near(navBox.x, sidebarBox.x)

    checks.push({
      name: 'sidebar_full_bleed',
      pass: fullBleed,
      detail: `sidebar ${sidebarBox.width}px @${sidebarBox.x}, header ${headerBox.width}px @${headerBox.x}, nav ${navBox.width}px @${navBox.x}`,
    })
  }

  if (allDishesBox && firstCategoryBox) {
    checks.push({
      name: 'nav_item_width_alignment',
      pass: near(allDishesBox.width, firstCategoryBox.width),
      detail: `All dishes ${allDishesBox.width}px vs first category ${firstCategoryBox.width}px`,
    })
  }

  checks.push({
    name: 'no_horizontal_overflow',
    pass: docScrollWidth <= docClientWidth + 1,
    detail: `scrollWidth ${docScrollWidth}px, clientWidth ${docClientWidth}px`,
  })

  const main = page.locator('.foods-layout__split-main')
  if (await main.isVisible()) {
    const mainBox = await boxMetrics(main)
    if (mainBox && sidebarBox) {
      checks.push({
        name: 'main_column_present',
        pass: mainBox.width > sidebarBox.width,
        detail: `main ${mainBox.width}px, sidebar ${sidebarBox.width}px`,
      })
    }
  }

  return {
    state,
    metrics: {
      sidebar: sidebarBox ?? { x: 0, y: 0, width: 0, height: 0 },
      header: headerBox ?? { x: 0, y: 0, width: 0, height: 0 },
      nav: navBox ?? { x: 0, y: 0, width: 0, height: 0 },
      split: splitBox ?? { x: 0, y: 0, width: 0, height: 0 },
      navScrollHeight,
      navClientHeight,
      docScrollWidth,
      docClientWidth,
      navScrolls,
    },
    checks,
  }
}

test.describe('Foods layout audit', () => {
  test('capture home and browse layout metrics', async ({ page }) => {
    mkdirSync(OUTPUT_DIR, { recursive: true })

    await page.goto('/foods')
    await page.waitForSelector('.foods-page--home', { timeout: 20_000 })
    await page.waitForSelector('.foods-category-nav-item', { timeout: 20_000 })

    const homeReport = await collectStateMetrics(page, 'home')
    await page.screenshot({ path: join(OUTPUT_DIR, 'home.png'), fullPage: true })
    await page
      .locator('.foods-layout__split-sidebar')
      .screenshot({ path: join(OUTPUT_DIR, 'home-sidebar.png') })

    const curryButton = page
      .locator('.foods-category-nav-item')
      .filter({
        has: page.locator('.foods-category-nav-item__name', { hasText: 'Curry' }),
      })
      .first()
    await curryButton.click()
    await page.waitForSelector('.foods-page--browse', { timeout: 10_000 })

    const browseReport = await collectStateMetrics(page, 'browse-curry')
    await page.screenshot({
      path: join(OUTPUT_DIR, 'browse-curry.png'),
      fullPage: true,
    })
    await page
      .locator('.foods-layout__split-sidebar')
      .screenshot({ path: join(OUTPUT_DIR, 'browse-sidebar.png') })

    const report = {
      viewport: { width: 1440, height: 900 },
      generatedAt: new Date().toISOString(),
      states: [homeReport, browseReport],
    }

    writeFileSync(join(OUTPUT_DIR, 'report.json'), JSON.stringify(report, null, 2))

    console.log('\n=== Foods layout audit ===\n')
    for (const state of report.states) {
      console.log(`[${state.state}]`)
      for (const check of state.checks) {
        console.log(`  ${check.pass ? 'PASS' : 'FAIL'} ${check.name}: ${check.detail}`)
      }
      console.log('')
    }

    const failures = report.states.flatMap((state) =>
      state.checks.filter((check) => !check.pass).map((check) => ({
        state: state.state,
        ...check,
      })),
    )

    if (failures.length > 0) {
      console.log(`Total failures: ${failures.length}`)
      for (const failure of failures) {
        console.log(`  - ${failure.state}: ${failure.name}`)
      }
    } else {
      console.log('All layout checks passed.')
    }

    expect(
      failures,
      `Layout audit failures:\n${failures.map((f) => `${f.state}: ${f.name} — ${f.detail}`).join('\n')}`,
    ).toEqual([])
  })
})
