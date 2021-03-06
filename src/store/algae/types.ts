import { File } from '../file/types'

type Algae = {
  id: number
  name: string
  description: string | null
  cause: string | null
  treatment: string | null
  source: string | null
  createdAt: Date
  updatedAt: Date
}
export type AlgaeState = Algae & {
  Photos: File[]
}
