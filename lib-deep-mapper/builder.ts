import { BiDecomposedMapper, MapperFunction, DownContext, UpContext, DownContextWithParent } from "./types/mapper";

export const mapper = ({
  buildDownMapper: <TAccumulator>(accumulator: TAccumulator) => ({
    rootMap: <TRoot, URoot>(rootMapFunction: MapperFunction<TRoot, DownContext<TAccumulator>, URoot>) => ({
      setMap: <TSet, USet>(setMapFunction: MapperFunction<TSet, DownContextWithParent<TAccumulator, URoot>, USet>) => ({
        campaignMap: <TCampaign, UCampaign>(
          campaignMapFunction: MapperFunction<TCampaign, DownContextWithParent<TAccumulator, USet | URoot, never>, UCampaign>
        ): BiDecomposedMapper<TCampaign, TSet, TRoot, UCampaign, USet, URoot, UCampaign, USet, URoot, TAccumulator> => ({
          accumulator,
          downCampaignMap: campaignMapFunction,
          upCampaignMap: (current) => current,
          downSetMap: setMapFunction,
          upSetMap: (current) => current,
          downRootMap: rootMapFunction,
          upRootMap: (current) => current
        })
      })
    })
  }),
  buildUpMapper: <TAccumulator>(accumulator: TAccumulator) => ({
    campaignMap: <TCampaign, UCampaign>(campaignMapFunction: MapperFunction<TCampaign, DownContext<TAccumulator>, UCampaign>) => ({
      setMap: <TSet, USet>(setMapFunction: MapperFunction<TSet, UpContext<TAccumulator, USet | UCampaign>, USet>) => ({
        rootMap: <TRoot, URoot>(
          rootMapFunction: MapperFunction<TRoot, UpContext<TAccumulator, UCampaign | USet>, URoot>
        ): BiDecomposedMapper<TCampaign, TSet, TRoot, TCampaign, TSet, TRoot, UCampaign, USet, URoot, TAccumulator> => ({
          accumulator,
          downCampaignMap: (current) => current,
          upCampaignMap: campaignMapFunction,
          downSetMap: (current) => current,
          upSetMap: setMapFunction,
          downRootMap: (current) => current,
          upRootMap: rootMapFunction
        })
      })
    })
  })
})
