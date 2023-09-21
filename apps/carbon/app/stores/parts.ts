import { useStore as useValue } from "@nanostores/react";
import { atom, computed } from "nanostores";
import { useNanoStore } from "~/hooks";
import type { ListItem } from "~/types";

type Part = ListItem & { replenishmentSystem: "Buy" | "Make" | "Buy and Make" };

const $partsStore = atom<Part[]>([]);

const $purchasedPartsStore = computed($partsStore, (part) =>
  part.filter((i) => i.replenishmentSystem === "Buy")
);

const $manufacturedPartsStore = computed($partsStore, (part) =>
  part.filter((i) => i.replenishmentSystem === "Make")
);

export const useParts = () => useNanoStore<Part[]>($partsStore);
export const usePurchasedParts = () => useValue($purchasedPartsStore);
export const useManufacturedParts = () => useValue($manufacturedPartsStore);
