import { combineReducers } from 'redux'

import user from './user'
import config from './config'
import feed from './feed'
import comment from './comment'
import tank from './tank'
import fertilizer from './fertilizer'
import plant from './plant'
import algae from './algae'
import stone from './stone'
import notification from './notification'

export const rootReducer = combineReducers({
  user: user.reducer,
  config: config.reducer,
  feed: feed.reducer,
  comment: comment.reducer,
  tank: tank.reducer,
  fertilizer: fertilizer.reducer,
  plant: plant.reducer,
  algae: algae.reducer,
  stone: stone.reducer,
  notification: notification.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
