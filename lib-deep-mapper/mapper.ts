import { BiDecomposedMapper, ContextualDecomposedMapper, DownContext, DownContextWithParent } from "./types/mapper";

export const convertBiMapperToDownContextualMapper = <
  TCampaign, TSet, TRoot,
  UDownCampaign, UDownSet, UDownRoot,
  UUpCampaign, UUpSet, UUpRoot,
  TAccumulator, TContext extends DownContextWithParent<TAccumulator, never, never>
>(
  biMapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UUpCampaign, UUpSet, UUpRoot, TAccumulator>
): ContextualDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, TContext> => ({
  campaignMap: biMapper.downCampaignMap,
  setMap: biMapper.downSetMap,
  rootMap: biMapper.downRootMap
})

export const convertBiMapperToUpContextualMapper = <
  TCampaign, TSet, TRoot,
  UDownCampaign, UDownSet, UDownRoot,
  UUpCampaign, UUpSet, UUpRoot,
  TAccumulator
>(
  biMapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UUpCampaign, UUpSet, UUpRoot, TAccumulator>
) => ({
  campaignMap: biMapper.upCampaignMap,
  setMap: biMapper.upSetMap,
  rootMap: biMapper.upRootMap
})
