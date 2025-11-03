export interface InspectionItemData {
  photo: File | null;
  video: File | null;
  comment: string;
  document: File | null;
}

export interface SectionData {
  [itemId: string]: InspectionItemData;
}

export interface InspectionData {
  [sectionId: string]: SectionData;
}

export interface InspectionItemInfo {
  id: string;
  title: string;
}

export interface InspectionSectionInfo {
  id: string;
  title: string;
  items: InspectionItemInfo[];
}
