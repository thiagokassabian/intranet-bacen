import { IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";

interface IBase {
	Id: number;
	Title: string;
	GUID: string;
}

export interface ISitePage extends IBase {
	Description: string;
	Lead: string;
	BannerImageUrl: IUrl;
	OData__TopicHeader: string;
}

// interface IImage {
// 	Description: string;
// 	Url: string;
// }

export interface IListaLinkItem extends IBase {
	Url: IUrl;
	SVG: string;
	Imagem: { serverRelativeUrl: string };
	Ordem: number;
	Ocultar: boolean;
}

interface IUrl {
	Description: string;
	Url: string;
}

export type IDropdownList = {
	Id: string,
	Title: string;
};

export interface IDestaque {
	Title: string;
	Text: string;
	Tag: string;
	Image: IFilePickerResult;
	Url: string;
}