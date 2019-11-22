import { ZEUS_OPERATION } from "../../types/operation-zeus";
import { MediaPlan } from "../../types/media-plan";

export type ERoot<TOperations> = Extract<TOperations, { type: ZEUS_OPERATION.ROOT }>
export type ESet<TOperations> = Extract<TOperations, { type: ZEUS_OPERATION.SET }>
export type ECampaign<TOperations> = Extract<TOperations, { type: ZEUS_OPERATION.CAMPAIGN }>

export type EMediaPlan<TOperations> = MediaPlan<ERoot<TOperations>, ESet<TOperations> | ECampaign<TOperations>>
export type EChildren<TOperations> = MediaPlan<ESet<TOperations> | ECampaign<TOperations>, ESet<TOperations> | ECampaign<TOperations>>
