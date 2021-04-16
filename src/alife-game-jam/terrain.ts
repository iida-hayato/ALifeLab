import p5 from "p5"
import { Vector } from "../classes/physics"
import { Force } from "./force"

export class Terrain {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public constructor(public readonly size: Vector) {
  }

  public frictionAt(position: Vector): number {
    return 1  // 0(停止) ~ 1(摩擦なし)
  }

  public forceAt(position: Vector): Force {
    return Force.zero()
  }

  public draw(p: p5): void {
    return
  }
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export class VanillaTerrain extends Terrain {
  public constructor(
    public readonly size: Vector,
    public readonly gravityCenter: Vector | null,
    public readonly gravity: number,
    public readonly friction: number,
    public readonly immobilizedWidth: number,
  ) {
    super(size)
  }

  public frictionAt(position: Vector): number {
    if (position.x < this.immobilizedWidth) {
      return (position.x / this.immobilizedWidth)
    }
    if (position.x > (this.size.x - this.immobilizedWidth)) {
      return (this.size.x - position.x) / this.immobilizedWidth
    }
    if (position.y < this.immobilizedWidth) {
      return (position.y / this.immobilizedWidth)
    }
    if (position.y > (this.size.y - this.immobilizedWidth)) {
      return (this.size.y - position.y) / this.immobilizedWidth
    }

    return this.friction
  }

  public forceAt(position: Vector): Force {
    if (this.gravityCenter == undefined) {
      return Force.zero()
    }
    const distance = Math.max(this.gravityCenter.dist(position), this.gravity / 10) // ブラックホールは法律で禁止されている
    const magnitude = (1 / (distance * distance)) * this.gravity

    const vector = this.gravityCenter.sub(position)

    return new Force(vector.sized(magnitude))
  }

  public draw(p: p5): void {
    this.drawImmobilizedArea(p)
    this.drawGravityCenter(p)
  }

  private drawImmobilizedArea(p: p5): void {
    p.stroke(207, 196, 251)
    p.strokeWeight(this.immobilizedWidth)
    p.noFill()
    p.rect(0, 0, this.size.x, this.size.y)
  }

  private drawGravityCenter(p: p5): void {
    if (this.gravityCenter == undefined) {
      return
    }
    p.noStroke()
    p.fill(80)
    const size = 20
    p.ellipse(this.gravityCenter.x, this.gravityCenter.y, size, size)
  }
}

export class GravitationalTerrain extends Terrain {
  public isAtmosphereEnabled = true
  private readonly atmosphereHeight: number

  public constructor(public readonly size: Vector, public readonly center: Vector, public readonly gravity: number) {
    super(size)
    this.atmosphereHeight = this.gravity / 2
  }

  public frictionAt(position: Vector): number {
    // 大気圏
    if (!this.isAtmosphereEnabled) {
      return 1
    }
    const distance = Math.max(this.center.dist(position), 0.1)
    if (distance > this.atmosphereHeight) {
      return 1
    }

    return 1 - Math.pow((distance - this.atmosphereHeight) / this.atmosphereHeight, 12)
  }

  public forceAt(position: Vector): Force {
    const distance = Math.max(this.center.dist(position), this.gravity / 10) // ブラックホールは法律で禁止されている
    const magnitude = (1 / (distance * distance)) * this.gravity

    const vector = this.center.sub(position)

    return new Force(vector.sized(magnitude))
  }

  public draw(p: p5): void {
    p.noStroke()
    p.fill(80)
    const size = Math.max(this.gravity / 10, 4)
    p.ellipse(this.center.x, this.center.y, size, size)

    if (this.isAtmosphereEnabled) {
      p.noFill()
      p.stroke(142, 141, 176)
      p.circle(this.center.x, this.center.y, this.atmosphereHeight)
    }
  }
}

export class FrictedTerrain extends Terrain {
  public constructor(public readonly size: Vector, public readonly friction: number) {
    super(size)
    if ((friction < 0) || (friction > 1)) {
      console.log(`[Terrain] friction should be between 0-1 (${friction} given)`)
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public frictionAt(position: Vector): number {
    return this.friction
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public forceAt(position: Vector): Force {
    return Force.zero()
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public draw(p: p5): void {
  }
}
