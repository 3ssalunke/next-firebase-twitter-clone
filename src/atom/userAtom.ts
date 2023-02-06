import { UserDocumentData } from "@/types/documentData";
import { atom } from "recoil";

export const userState = atom<UserDocumentData | null>({
  key: "userState",
  default: null,
});
