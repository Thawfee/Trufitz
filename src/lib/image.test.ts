import test from "node:test";
import assert from "node:assert/strict";
import { normalizeImageArray, resolveImageUrl } from "./image";

test("resolveImageUrl falls back to the default placeholder when input is empty", () => {
  assert.equal(resolveImageUrl("", "/images/placeholder-fashion.svg"), "/images/placeholder-fashion.svg");
  assert.equal(resolveImageUrl(undefined, "/images/placeholder-fashion.svg"), "/images/placeholder-fashion.svg");
});

test("normalizeImageArray keeps the first valid image and ignores blanks", () => {
  assert.deepEqual(normalizeImageArray(["", "https://example.com/one.jpg", "https://example.com/two.jpg"]), [
    "https://example.com/one.jpg",
    "https://example.com/two.jpg",
  ]);
});

test("normalizeImageArray returns the placeholder when nothing usable is provided", () => {
  assert.deepEqual(normalizeImageArray([]), ["/images/placeholder-fashion.svg"]);
});
