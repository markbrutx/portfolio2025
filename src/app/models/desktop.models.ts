import { AppID } from '../shared/app-id.enum'

export interface OpenApp {
  id: AppID
  isOpen: boolean
  initialPosition?: Position
}

export type Position = { x: number; y: number }
