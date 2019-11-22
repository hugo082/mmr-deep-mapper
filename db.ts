import { MediaPlan } from "./types/media-plan";
import { RootOperation, SetOperation, CampaignOperation, ZEUS_OPERATION } from "./types/operation-zeus";

export const MEDIA_PLAN: MediaPlan<RootOperation, SetOperation | CampaignOperation> = {
  data: {
    type: ZEUS_OPERATION.ROOT,
    name: "root",
    brandId: "brand_id"
  },
  children: [
    {
      data: {
        type: ZEUS_OPERATION.SET,
        name: "set_1",
      },
      children: [
        {
          data: {
            type: ZEUS_OPERATION.CAMPAIGN,
            name: "campaign_1",
          },
          children: []
        },
        {
          data: {
            type: ZEUS_OPERATION.CAMPAIGN,
            name: "campaign_2",
            campaignId: "campaign_id_2"
          },
          children: []
        }
      ]
    },
    {
      data: {
        type: ZEUS_OPERATION.SET,
        name: "set_2",
      },
      children: []
    },
    {
      data: {
        type: ZEUS_OPERATION.SET,
        name: "set_3",
      },
      children: [
        {
          data: {
            type: ZEUS_OPERATION.CAMPAIGN,
            name: "campaign_3",
            campaignId: "campaign_id_3"
          },
          children: []
        }
      ]
    }
  ]
}
