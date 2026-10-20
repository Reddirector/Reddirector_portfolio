// One-time generator for src/components/Intro/wordmark.js
// Extracts sharp, high-contrast typography:
// - RED: Cinzel 900 (sharp monumental Roman serifs, scale 106)
// - DIRECTOR: Chakra Petch 700 (sharp 45° chamfered technical cuts, scale 74, tracking +5)
import opentype from 'opentype.js'
import fs from 'fs'

function pathToSvgD(commands) {
  let d = ''
  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]
    if (cmd.type === 'M') d += 'M' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2)
    else if (cmd.type === 'L') d += 'L' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2)
    else if (cmd.type === 'Q') d += 'Q' + cmd.x1.toFixed(2) + ' ' + cmd.y1.toFixed(2) + ' ' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2)
    else if (cmd.type === 'C') d += 'C' + cmd.x1.toFixed(2) + ' ' + cmd.y1.toFixed(2) + ' ' + cmd.x2.toFixed(2) + ' ' + cmd.y2.toFixed(2) + ' ' + cmd.x.toFixed(2) + ' ' + cmd.y.toFixed(2)
    else if (cmd.type === 'Z') d += 'Z'
  }
  return d
}

function cleanCommands(commands) {
  for (const cmd of commands) {
    for (const key of ['x', 'y', 'x1', 'y1', 'x2', 'y2']) {
      if (typeof cmd[key] === 'number') {
        cmd[key] = Math.round(cmd[key] * 100) / 100
      }
    }
  }
}

const fCinzel = opentype.parse(fs.readFileSync(new URL('./cinzel900.ttf', import.meta.url)).buffer)
const fChakra = opentype.parse(fs.readFileSync(new URL('./chakra700.ttf', import.meta.url)).buffer)

const sizeRed = 106
const sizeDir = 74
const trackingDir = 5
const gap = 24

const scaleRed = sizeRed / fCinzel.unitsPerEm
const scaleDir = sizeDir / fChakra.unitsPerEm

const letters = []
let x = 0

for (const ch of 'RED') {
  const g = fCinzel.charToGlyph(ch)
  const p = g.getPath(x, 0, sizeRed)
  letters.push({ char: ch, part: 'red', glyph: g, path: p, scale: scaleRed })
  x += g.advanceWidth * scaleRed
}
x += gap
for (const ch of 'DIRECTOR') {
  const g = fChakra.charToGlyph(ch)
  const p = g.getPath(x, 0, sizeDir)
  letters.push({ char: ch, part: 'director', glyph: g, path: p, scale: scaleDir })
  x += g.advanceWidth * scaleDir + trackingDir
}

const boxes = letters.map(l => l.path.getBoundingBox())
const minY = Math.min(...boxes.map(b => b.y1))
const maxY = Math.max(...boxes.map(b => b.y2))
const shiftY = -minY + 4
const totalH = Math.round(maxY - minY + 8)
const totalW = Math.round(x + 4)

let curX = 0
const outLetters = []
for (const l of letters) {
  const g = l.glyph
  const sz = l.part === 'red' ? sizeRed : sizeDir
  const p = g.getPath(curX, shiftY, sz)
  cleanCommands(p.commands)
  const d = pathToSvgD(p.commands)
  outLetters.push({
    char: l.char,
    part: l.part,
    d,
  })
  curX += g.advanceWidth * l.scale + (l.part === 'director' ? trackingDir : 0)
  if (l.char === 'D' && l.part === 'red') curX += gap
}

const code = `// Generated file — Cinematic Sharp Display Wordmark (RED in Cinzel 900, DIRECTOR in Chakra Petch 700).
// Razor-sharp serifs, 45-degree chamfered cuts, differentiated font sizes and font styles.
export const WORDMARK_VIEWBOX = "${`0 0 ${totalW} ${totalH}`}";

export const WORDMARK_PATHS = ${JSON.stringify(outLetters, null, 2)};
`

fs.writeFileSync('../src/components/Intro/wordmark.js', code)
console.log('Successfully wrote src/components/Intro/wordmark.js!')
console.log('ViewBox:', `0 0 ${totalW} ${totalH}`, 'Letters:', outLetters.length)
