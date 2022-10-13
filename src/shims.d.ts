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
