import { ECampaign, ESet, ERoot, EChildren } from "./operations";

export interface Mapper<
  TOperations,
  UCampaign,
  USet,
  URoot,
  TAccumulator
> {
  campaignMap: (campaign: ECampaign<TOperations>, accumulator: TAccumulator) => UCampaign,
  setMap: (set: ESet<TOperations>, children: Array<EChildren<TOperations>>, accumulator: TAccumulator) => USet,
  rootMap: (root: ERoot<TOperations>, children: Array<EChildren<TOperations>>, accumulator: TAccumulator) => URoot
}
