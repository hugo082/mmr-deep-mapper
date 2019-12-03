import { BiDecomposedMapper } from "./types/mapper";

export const convertBiMapperToDownContextualMapper = <
  TCampaign, TSet, TRoot,
  UDownCampaign, UDownSet, UDownRoot,
  UUpCampaign, UUpSet, UUpRoot,
  TAccumulator
>(
  biMapper: BiDecomposedMapper<TCampaign, TSet, TRoot, UDownCampaign, UDownSet, UDownRoot, UUpCampaign, UUpSet, UUpRoot, TAccumulator>
) => ({
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
