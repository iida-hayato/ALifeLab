import p5 from "p5"
import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { Bit, Tape, canConnect } from "./tape"
import { Life } from "../../alife-game-jam/life"

export class Machine extends Life {
  private _pointer: number
  private _life = 100
  private _workingTape: Bit[] = []

  public constructor(public position: Vector, public readonly tape: Tape) {
    super(position)
    this._size =  tape.bits.length
  }

  public get size(): number {
    return this._size
  }

  public get isAlive(): boolean {
    return this._life > 0
  }

  public get color(): Color {
    return this.tape.color
  }

  public nextBit(index?: number): Bit {
    const pointer = (this._pointer + (index ?? 0)) % this.tape.bits.length

    return this.tape.bits[pointer]
  }

  public canConnect(tape: Tape): boolean {
    const target = tape.bits[0]
    const canConnectBits = canConnect(tape.bits[0], (this.nextBit() ^ 1) as Bit)
    if (canConnectBits === false) {
      this._life -= 1 // FixMe: 副作用が起きることが明示的なメソッドの中に移す
    }

    return canConnectBits
  }

  public connect(tape: Tape): Machine | undefined {
    this._workingTape = this._workingTape.concat(tape.bits)
    tape.bits.forEach((x: Bit, index: number) => {
      const canConnectBit = canConnect(x, this.nextBit(index))
      if (canConnectBit === false) {
        this._life -= 10
      }
    })

    if (this._workingTape.length >= this.tape.bits.length) {
      const newMachine = new Machine(this.position, new Tape(this._workingTape))
      this._workingTape = []
      this._pointer = 0

      return newMachine
    } else {
      this.movePointer(tape.bits.length)

      return undefined
    }
  }

  public decompose(): Machine[] {
    const decomposedTapes: Tape[] = this.tape.split()
    if (this._workingTape.length > 0) {
      decomposedTapes.push(new Tape(this._workingTape))
    }

    return decomposedTapes.map(t => new Machine(this.position, t))
  }

  public draw(p: p5) {
    p.noStroke()
    p.fill(this.color.p5(p))

    const diameter = this.size
    p.circle(this.position.x, this.position.y, diameter)
  }

  private movePointer(index: number): void {
    this._pointer = this._pointer + index
    this._pointer %= this.tape.bits.length
  }
}
