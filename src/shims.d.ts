import { PrecacheEntry } from 'workbox-precaching'

// #region <WINDOW>
declare interface Window {
  __WB_MANIFEST: string | PrecacheEntry
}
// #endregion

// #region <WORKER NAVIGATOR>
declare interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>
}

declare interface XWorkerNavigator extends WorkerNavigator {
  mediaDevices?: MediaDevices
}
// #endregion

// #region <EVENT>
declare interface XEventTarget extends EventTarget {
  value?: string
}

declare interface XEvent extends Event {
  target?: XEventTarget
}
// #endregion
