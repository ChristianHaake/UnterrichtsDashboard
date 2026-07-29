import { useEffect, useRef } from 'react'

/**
 * Runs `onTick` at a steady cadence while `active` is true, driven by a
 * dedicated Web Worker so it keeps firing in a backgrounded tab. The callback
 * is read through a ref, so changing it does not restart the worker.
 */
export function useHeartbeat(active: boolean, onTick: () => void) {
  const callbackRef = useRef(onTick)
  callbackRef.current = onTick

  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL('../../workers/ticker.worker.ts', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = () => callbackRef.current()
    workerRef.current = worker
    return () => {
      worker.postMessage('stop')
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    workerRef.current?.postMessage(active ? 'start' : 'stop')
  }, [active])
}
