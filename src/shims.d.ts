import { PrecacheEntry } from 'workbox-precaching'

// #region <WINDOW>
declare interface Window {
  __WB_MANIFEST: string | PrecacheEntry
}
// #endregion

// #region <WORKER NAVIGATOR>
interface TitlebarAreaRect {
  x?: number
  y?: number
}
declare interface MediaDevices {
  getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>
  getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>
}
declare interface WindowControlsOverlay {
  getTitlebarAreaRect(): TitlebarAreaRect
  ongeometrychange(): void
  visible: boolean
}
export declare interface XWorkerNavigator extends WorkerNavigator {
  mediaDevices?: MediaDevices
  windowControlsOverlay?: WindowControlsOverlay
}
// #endregion

// #region <MENU ITEM>
export declare type MenuItemAction = (event: Event) => void
export declare interface MenuItem {
  icon?: unknown
  text?: string
  path?: string
  action?: MenuItemAction
  isAction?: boolean
  isDivider?: boolean
}
export declare type MenuItems = Array<MenuItem>
// #endregion
