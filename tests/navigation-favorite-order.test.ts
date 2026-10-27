import assert from "node:assert/strict"
import test from "node:test"
import {
  moveFavoriteOrder,
  normalizeFavoriteOrder,
} from "../docs/.vuepress/theme/components/navigation/useFavoriteOrdering.ts"
import {
  categoryLabels,
  navigationItems,
  navigationRecommendedFavoriteIds,
  navigationRecommendedFavoriteOrder,
} from "../docs/.vuepress/theme/components/navigation/navigation.data.ts"

test("recommended favorites contain 20 unique, valid catalog entries", () => {
  const ids = navigationRecommendedFavoriteIds
  assert.equal(ids.length, 20)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(ids.every(id => navigationItems.some(item => item.id === id)))
  assert.deepEqual([...navigationRecommendedFavoriteOrder.items].sort(), [...ids].sort())
  assert.deepEqual([...navigationRecommendedFavoriteOrder.groups].sort(), Object.keys(categoryLabels).sort())
})

test("recommended favorites reproduce the supplied visible group and card order", () => {
  const groups = navigationRecommendedFavoriteOrder.groups.flatMap(group => {
    const items = navigationRecommendedFavoriteOrder.items.filter(id =>
      navigationItems.find(item => item.id === id)?.category === group,
    )
    return items.length ? [{ group, items }] : []
  })
  assert.deepEqual(groups, [
    { group: "ai", items: ["chatgpt", "hvoyai", "hugging-face"] },
    { group: "community", items: ["linux-do", "x", "baidu-tieba", "discoverhub"] },
    { group: "media", items: ["youtube", "bilibili", "viu"] },
    { group: "network", items: ["cloudflare", "namesilo", "gugavpn", "vpsknow", "fast", "speedtest", "scamalytics"] },
    { group: "development", items: ["github"] },
    { group: "gaming", items: ["steamtools", "steamdb"] },
  ])
})

test("curated defaults append unselected catalog items and preserve saved user order", () => {
  const defaults = normalizeFavoriteOrder(navigationRecommendedFavoriteOrder.items, navigationItems.map(item => item.id))
  assert.equal(defaults.length, navigationItems.length)
  assert.deepEqual(defaults.slice(0, 20), navigationRecommendedFavoriteOrder.items)
  const saved = ["viu", "youtube", "chatgpt"]
  assert.deepEqual(normalizeFavoriteOrder(saved, defaults).slice(0, saved.length), saved)
  assert.deepEqual(normalizeFavoriteOrder(["gaming", "ai"], navigationRecommendedFavoriteOrder.groups).slice(0, 2), ["gaming", "ai"])
})

test("saved order drops invalid and duplicate IDs and appends new entries", () => {
  assert.deepEqual(normalizeFavoriteOrder(["c", "deleted", "c", 3, "a"], ["a", "b", "c", "new"]), ["c", "a", "b", "new"])
})

test("missing or malformed saved order retains defaults", () => {
  for (const value of [undefined, null, {}, "a"]) {
    assert.deepEqual(normalizeFavoriteOrder(value, ["a", "b"]), ["a", "b"])
  }
})

test("moving forward and backward reaches the target position without mutating input", () => {
  const original = ["a", "b", "c", "d"]
  assert.deepEqual(moveFavoriteOrder(original, "a", "c"), ["b", "c", "a", "d"])
  assert.deepEqual(moveFavoriteOrder(original, "d", "b"), ["a", "d", "b", "c"])
  assert.deepEqual(original, ["a", "b", "c", "d"])
})

test("unknown IDs and same-position drops leave order unchanged", () => {
  assert.deepEqual(moveFavoriteOrder(["a", "b"], "a", "a"), ["a", "b"])
  assert.deepEqual(moveFavoriteOrder(["a", "b"], "missing", "a"), ["a", "b"])
  assert.deepEqual(moveFavoriteOrder(["a", "b"], "a", "missing"), ["a", "b"])
})

test("reordering a filtered subset preserves the relative order of hidden items", () => {
  const moved = moveFavoriteOrder(["a", "hidden-1", "b", "hidden-2", "c"], "a", "c")
  assert.deepEqual(moved.filter(id => id.startsWith("hidden")), ["hidden-1", "hidden-2"])
  assert.deepEqual(moved.filter(id => !id.startsWith("hidden")), ["b", "c", "a"])
})
