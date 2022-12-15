export type Turn = 'black' | 'white'
export const oppositeTurn = (turn: Turn): Turn => turn === 'black' ? 'white' : 'black'

type CellValue = Turn | 'empty'

export class Cell {
  public value: CellValue

  constructor(public y: number, public x: number) {
    this.value = this.initialValue()
  }

  private initialValue(): CellValue {
    if ((this.y === 3 && this.x === 3) || ((this.y === 4 && this.x === 4))) {
      return 'black'
    }
    if ((this.y === 3 && this.x === 4) || ((this.y === 4 && this.x === 3))) {
      return 'white'
    }
    return 'empty'
  }
}
