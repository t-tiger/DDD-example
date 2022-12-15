import './app.scss'
import {Board} from "./script/domain/board";
import {Renderer} from "./script/view";
import {Controller} from "./script/controller";

window.onload = () => {
  const board = new Board()
  const renderer = new Renderer(board)
  const controller = new Controller(board, renderer)
  controller.start()
}
