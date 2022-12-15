import {Renderer} from "./view";
import {oppositeTurn, Turn} from "./domain/cell";
import {Board} from "./domain/board";

export class Controller {
  private turn: Turn

  constructor(private board: Board, private renderer: Renderer) {
    this.turn = 'black'
  }

  start() {
    this.renderer.renderCells(this.turn)
    this.listenEvent()
  }

  finish() {
    this.renderer.renderFinishMessage()
    document.removeEventListener('click', this.onClick)
  }

  private listenEvent() {
    document.addEventListener('click', this.onClick.bind(this))
  }

  private onClick(e: Event) {
    const target = e.target
    if (target instanceof Element) {
      const cell = target.closest(".cell")
      if (cell instanceof HTMLElement) {
        const y = parseInt(cell.dataset['y'])
        const x = parseInt(cell.dataset['x'])
        this.onClickCell(y, x)
      }
    }
  }

  private onClickCell(y: number, x: number) {
    if (!this.board.canPut(this.turn, y, x)) {
      alert('You cannot put here.')
    }
    this.board.put(this.turn, y, x)
    this.turn = oppositeTurn(this.turn)
    this.renderer.renderCells(this.turn)

    if (this.board.finished()) {
      this.finish()
    }
  }
}
