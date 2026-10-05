import type {
  ComparisonItem,
  ModListComparisonFile,
} from "@/types/ModListComparison";

export function createModListComparison(
  items: ComparisonItem[],
): ModListComparisonFile {
  return {
    kind: "modlist-comparison",
    version: "1",
    items,
  };
}
