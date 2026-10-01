// One-time generator for src/components/Intro/wordmark.js
// Usage: cd scripts && npm init -y && npm i opentype.js && node generate-wordmark.mjs
// Downloads Barlow Condensed 900 (OFL) once and emits outline paths for WORDMARK.
// Edit WORDMARK here, run, then copy the printed JSON block into wordmark.js.
import opentype from 'opentype.js'
import fs from 'fs'

const WORDMARK = 'REDDIRECTOR'
// Font file: download once into this folder as barlow900.ttf —
// curl -o barlow900.ttf 'https://fonts.gstatic.com/s/barlowcondensed/v13/HTxwL3I-JCGChYJ8VI-L6OO_au7B45L0_3E.ttf'
const buf = fs.readFileSync(new URL('./barlow900.ttf', import.meta.url))
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
const fontSize = 100
const scale = fontSize / font.unitsPerEm

// Measure first: cap top (min y, negative) and advance width.
let x = 0
const raw = []
for (const char of WORDMARK) {
  const glyph = font.charToGlyph(char)
  const path = glyph.getPath(x, 0, fontSize)
  const box = path.getBoundingBox()
  raw.push({ char, path, advance: glyph.advanceWidth * scale, y2: box.y2, y1: box.y1 })
  x += glyph.advanceWidth * scale
}
const minY = Math.min(...raw.map(l => l.y1))
const shift = -minY + 2 // move cap top down to y=2
const width = Math.round(x)
const height = Math.round(raw[0].y2 + shift + 2)
const letters = raw.map(l => ({ char: l.char, d: l.path.toPathData(2) }))
// Shift: toPathData has no y-offset, so wrap each in a translate via re-gen on baseline y=shift.
let x2 = 0
const shifted = []
for (const char of WORDMARK) {
  const glyph = font.charToGlyph(char)
  const path = glyph.getPath(x2, shift, fontSize)
  shifted.push({ char, d: path.toPathData(2) })
  x2 += glyph.advanceWidth * scale
}
const out = {
  font: 'Barlow Condensed 900 (Google Fonts, OFL)',
  viewBox: `0 0 ${width} ${height}`,
  letters: shifted,
}
fs.writeFileSync('wordmark.json', JSON.stringify(out, null, 1))
console.log('viewBox:', out.viewBox, 'letters:', shifted.length)
