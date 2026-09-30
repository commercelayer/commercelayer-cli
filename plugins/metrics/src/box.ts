/*
import stringWidth from "string-width"
import wrapAnsi from "wrap-ansi"


export function renderBox(title: string, lines: string[], maxWidth = 80) {

  const termWidth = Math.min(process.stdout.columns || 80, maxWidth)
  const width = termWidth - 2

  const horizontal = "─".repeat(width)

  console.log(`┌${horizontal}┐`)

  function printLine(text: string = "") {
    const w = stringWidth(text)
    const pad = width - w
    console.log(`│${text}${" ".repeat(pad)}│`)
  }

  function center(text: string) {
    const w = stringWidth(text)
    const left = Math.floor((width - w) / 2)
    const right = width - w - left
    return " ".repeat(left) + text + " ".repeat(right)
  }

  if (title) {
    printLine()
    printLine(center(title))
    printLine()
  }

  for (const line of lines) {
    const wrapped = wrapAnsi(line, width)
    wrapped.split("\n").forEach(l => printLine(l))
  }

  console.log(`└${horizontal}┘`)

}
*/