import { BiDecomposedMapper, MapperFunction, DownContext, UpContext, DownContextWithParent } from "./types/mapper";

export const basicUpMapper = <
  TCampaign, TSet, TRoot,
  UCampaign, USet, URoot,
  TAccumulator,
>(
  accumulator: TAccumulator,
  campaignMap: MapperFunction<TCampaign, DownContext<TAccumulator>, UCampaign>,
  setMap: MapperFunction<TSet, UpContext<TAccumulator, USet, UCampaign>, USet>,
  rootMap: MapperFunction<TRoot, UpContext<TAccumulator, USet, UCampaign>, URoot>,
): BiDecomposedMapper<TCampaign, TSet, TRoot, TCampaign, TSet, TRoot, UCampaign, USet, URoot, TAccumulator>  => ({
  accumulator,
  downCampaignMap: (current) => current,
  upCampaignMap: campaignMap,
  downSetMap: (current) => current,
  upSetMap: setMap,
  downRootMap: (current) => current,
  upRootMap: rootMap
})

export const basicDownMapper = <
  TCampaign, TSet, TRoot,
  UCampaign, USet, URoot,
  TAccumulator,
>(
  campaignMap: MapperFunction<TCampaign, DownContextWithParent<TAccumulator, TSet, TCampaign>, UCampaign>,
  setMap: MapperFunction<TSet, DownContextWithParent<TAccumulator, TSet | TCampaign>, USet>,
  rootMap: MapperFunction<TRoot, DownContext<TAccumulator>, URoot>,
  accumulator?: TAccumulator,
): BiDecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, UCampaign, USet, URoot, TAccumulator>  => ({
  accumulator,
  downCampaignMap: campaignMap,
  upCampaignMap: (current) => current,
  downSetMap: setMap,
  upSetMap: (current) => current,
  downRootMap: rootMap,
  upRootMap: (current) => current
})


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
