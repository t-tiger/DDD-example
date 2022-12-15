import {Cell, Turn} from "./domain/cell";
import {Board} from "./domain/board";

export class Renderer {
  constructor(private board: Board) {
  }

  renderCells(turn: Turn) {
    const cellValue = (cell: Cell) => {
      if (cell.value === 'black') return '⚫'
      if (cell.value === 'white') return '⚪'
      return ''
    }

    const boardHtml = this.board.rows.map(row => {
      return `<div class="row">` +
          row.map(cell => `<div class="cell" data-y="${cell.y}" data-x="${cell.x}">${cellValue(cell)}</div>`).join('') + "</div>"
    }).join('')
    document.getElementById('board').innerHTML = boardHtml

    const {black, white} = this.board.score()
    document.getElementById('score').innerHTML = `Black: ${black}, White: ${white}`
    document.getElementById('turn').innerHTML = `Turn: ${turn}`
  }

  renderFinishMessage() {
    // TODO
  }
}

