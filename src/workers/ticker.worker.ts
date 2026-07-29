/// <reference lib="webworker" />
// Background heartbeat. A dedicated worker's interval keeps firing when the tab
// is inactive, unlike main-thread requestAnimationFrame. It carries no timer
// state — consumers derive remaining time from an absolute timestamp on each
// tick, so a throttled/coalesced heartbeat stays correct.

let intervalId: ReturnType<typeof setInterval> | null = null

self.onmessage = (event: MessageEvent<'start' | 'stop'>) => {
  if (event.data === 'start') {
    if (intervalId === null) {
      intervalId = setInterval(() => self.postMessage('tick'), 250)
    }
  } else if (event.data === 'stop') {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}
