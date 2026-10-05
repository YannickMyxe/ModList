import type {JSONFormatter} from "@/types/JSON_Formatter.ts";

export type ComparisonItem = {
  name: string;
  url: string;
  ratings: number[];
  average: number | null;
};

export interface ModListComparisonFile extends JSONFormatter {
  kind: "modlist-comparison";
  version: "1";
  items: ComparisonItem[];
}

