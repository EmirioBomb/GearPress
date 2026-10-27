import assert from "node:assert/strict"
import test from "node:test"
import {
  moveFavoriteOrder,
  normalizeFavoriteOrder,
} from "../docs/.vuepress/theme/components/navigation/useFavoriteOrdering.ts"

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
