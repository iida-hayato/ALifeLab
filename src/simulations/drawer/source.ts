import p5 from "p5"
import { Vector } from "../../classes/physics"
import { URLParameterParser } from "../../classes/url_parameter_parser"
import { Action, Drawer, LSystemDrawer } from "./drawer"
import { Line, isCollided } from "./object"

let t = 0
const canvasId = "canvas"
const fieldSize = 600
const centerPoint = new Vector(fieldSize / 2, fieldSize / 2)

const parameters = new URLParameterParser()

const fieldBaseSize = parameters.int("system.size", 600, "s.s")

export const constants = {
  system: {
    fieldSize: new Vector(fieldBaseSize, fieldBaseSize * 0.6),
  },
  simulation: {
  },
  draw: {
    refreshInterval: parameters.int("draw.refresh_interval", 100, "d.r"),
  },
}

let drawers: Drawer[] = []
const lines: Line[] = []

export const main = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(fieldSize, fieldSize)
    canvas.id(canvasId)
    canvas.parent("canvas-parent")

    setupDrawers()

    p.background(0xFF, 0xFF)
  }

  p.draw = () => {
    if (drawers.length < 100) {
      const deads: Drawer[] = []
      const newDrawers: Drawer[] = []
      const newLines: Line[] = []
      drawers.forEach(drawer => {
        const action = drawer.next(p)
        if (isCollidedWithLines(action.line) === true) {
          deads.push(drawer)
        } else {
          newDrawers.push(...action.drawers)
          newLines.push(action.line)
        }
      })

      drawers.push(...newDrawers)
      newLines.forEach(line => {
        line.draw(p)
      })
      lines.push(...newLines)

      drawers = drawers.filter(drawer => {
        return deads.includes(drawer) === false
      })
    }

    t += 1
  }
}

export const getTimestamp = (): number => {
  return t
}

function setupDrawers() {
  const position = new Vector(centerPoint.x, fieldSize - 100)
  const rule = new Map<string, string>()
  rule.set("A", "A+B")
  rule.set("B", "A")
  const constants = new Map<string, number>()
  constants.set("+", 30)
  const drawer = new LSystemDrawer(position, 270, "A", 1, rule, constants)
  drawers.push(drawer)
}

function isCollidedWithLines(line: Line): boolean {
  return lines.some(other => isCollided(line, other))
}

function refresh(p: p5) {

}
