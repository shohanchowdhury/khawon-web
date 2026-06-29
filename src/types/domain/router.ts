export interface AppLocationState {
  foodStageIntro?: boolean
}

declare module 'react-router-dom' {
  interface LocationState extends AppLocationState {}
}

export {}
