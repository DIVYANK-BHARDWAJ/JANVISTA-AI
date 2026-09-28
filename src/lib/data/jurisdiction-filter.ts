import { OfficerJurisdiction } from "@/types";

export interface JurisdictionFilterOptions {
  selectedState?: string;
  jurisdiction?: OfficerJurisdiction | null;
}

/**
 * Filter items by state and optional district based on officer login jurisdiction or dropdown selection
 */
export function filterByJurisdiction<T extends { state?: string; district?: string; regionId?: string }>(
  items: T[],
  options: JurisdictionFilterOptions,
  getRegionStateAndDistrict?: (regionId: string) => { state: string; district: string } | undefined
): T[] {
  const activeState = options.jurisdiction?.state || (options.selectedState && options.selectedState !== "All India" ? options.selectedState : null);
  const activeDistrict = options.jurisdiction?.district || null;

  if (!activeState && !activeDistrict) {
    return items;
  }

  return items.filter((item) => {
    let itemState = item.state;
    let itemDistrict = item.district;

    if ((!itemState || !itemDistrict) && item.regionId && getRegionStateAndDistrict) {
      const reg = getRegionStateAndDistrict(item.regionId);
      if (reg) {
        itemState = reg.state;
        itemDistrict = reg.district;
      }
    }

    if (activeState && itemState && itemState.toLowerCase() !== activeState.toLowerCase()) {
      return false;
    }

    if (activeDistrict && itemDistrict && itemDistrict.toLowerCase() !== activeDistrict.toLowerCase()) {
      return false;
    }

    return true;
  });
}
