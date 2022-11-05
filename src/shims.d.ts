// eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
// these APIs are auto-imported from @vueuse/core
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
export declare interface WorkerNavigator extends WorkerNavigator {
  mediaDevices?: MediaDevices
  windowControlsOverlay?: WindowControlsOverlay
}
// #endregion

// #region <MENU ITEM>
export declare type MenuItemAction = (event: Event) => void
export declare interface SubmenuItem {
  icon?: string
  text?: string
  path?: string
  action?: MenuItemAction
  color?: 'base' | 'neutral' | 'primary' | 'secondary' | 'accent'
  type?: 'route' | 'action'
}
export declare type SubmenuItems = Array<SubmenuItem>
export declare interface MenuItem extends SubmenuItem {
  type?: 'divider' | 'route' | 'action' | 'group'
  childMenu?: SubmenuItems
}
export declare type MenuItems = Array<MenuItem>
// #endregion

// #region <AUTH>
export declare interface AuthData {
  username: string
  password: string
}
// #endregion

// #region <PAWN>
export declare interface PawnType {
  id: number
  text: string
  icon: string
}
export declare type PawnTypes = Array<PawnType>

export declare interface PawnItem {
  item: string
  haveStones: boolean
  stone: string
  purity: string
  description: string
  weight: number
  weightUnit: string
  appraiseValue: number
}
export declare type PawnItems = Array<PawnItem>

export declare interface Pawn {
  id: number
  pawnTypeId: number
  clientId: number
  ticketNumber: string
  loanDate: string
  maturityDate: string
  expiryDate: string
  appraiseValue: number
  principalAmount: number
  monthly: Array<number>
  liquidation: number
  interestAmount: Array<number>
  serviceCharge: Array<number>
  netProceeds: number
  pawnDescription: string
  pawnItems: PawnItems
}
export declare type Pawns = Array<Pawn>

export declare interface TablePawnItem extends PawnItem {
  open?: boolean
}
export declare type TablePawnItems = Array<TablePawnItem>

export declare interface DisplayPawnItem {
  id: number
  ticketNumber: string
  pawnType: string
  items: number
  principalAmount: string
  expiryDate: string
  pawner: string
}

export declare type DisplayPawnItems = Array<DisplayPawnItem>
// #endregion

// #region <TABLE>
export declare interface TableHead {
  text: string
  value: string
  align?: 'left' | 'right' | 'center'
}
export declare type TableHeads = Array<TableHead>
export declare type TableItems = Array<any>
// #endregion

// #region <COMPONENTS>
export declare type LayoutCardSize = 'box' | 'full' | 'default' | undefined
export declare type LayoutCardState = 'hidden' | 'show' | 'default' | undefined
// #endregion

// #region <OTHERS>
export declare type ListenerCleanup = () => void
// #endregion

export declare interface OnComponentOpenParams {
  duration: number
  actions: any
}
