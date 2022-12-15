import {Cell, Turn} from "./cell";

export type Row = Cell[]

export class Board {
  public rows: Row[]

  constructor() {
    this.rows = [...new Array(8)].map((_, y) => [...new Array(8)].map((_, x) => new Cell(y, x)))
  }

  score(): { black: number, white: number } {
    return {
      black: this.rows.flat().filter(cell => cell.value === 'black').length,
      white: this.rows.flat().filter(cell => cell.value === 'white').length,
    }
  }

  canPut(turn: Turn, y: number, x: number): boolean {
    return this.flippablePlaces(turn, y, x).length > 0
  }

  put(turn: Turn, y: number, x: number) {
    this.flippablePlaces(turn, y, x).forEach(({y, x}) => this.rows[y][x].value = turn)
  }

  finished() {
    // TODO: Support more cases
    return this.rows.flat().filter(cell => cell.value !== 'empty').length === 64
  }

  private flippablePlaces(turn: Turn, y: number, x: number): Array<{ y: number, x: number }> {
    if (this.rows[y][x].value !== 'empty') {
      return []
    }
    const res: Array<{ y: number, x: number }> = [{y, x}]

    for (let moveY = -1; moveY <= 1; moveY++) {
      for (let moveX = -1; moveX <= 1; moveX++) {
        if (moveX === 0 && moveY === 0) {
          continue
        }
        let curY = y + moveY
        let curX = x + moveX
        let hasMine = false
        let places: Array<{ y: number, x: number }> = []

        while (curY >= 0 && curY <= 7 && curX >= 0 && curX <= 7) {
          const curCell = this.rows[curY][curX]
          if (curCell.value === turn) {
            hasMine = true
            break
          }
          if (curCell.value === 'empty') {
            break
          }
          places.push({y: curY, x: curX})
          curY += moveY
          curX += moveX
        }
        if (hasMine) {
          res.push(...places)
        }
      }
    }

    return res.length > 1 ? res : []
  }
}
