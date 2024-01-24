import { IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { IODataListItem } from "@microsoft/sp-odata-types"

export interface ISitePage extends IODataListItem {
	Description: string;
	Lead: string;
	BannerImageUrl: IUrl;
	OData__TopicHeader: string;
	ImagemDestaque: IImage;
}

export interface IListaLinkItem extends IODataListItem {
	Url: IUrl;
	SVG: string;
	Imagem: IImage;
	Ordem: number;
	Ocultar: boolean;
}

interface IUrl {
	Description: string;
	Url: string;
}

interface IImage {
	serverRelativeUrl: string;
	serverUrl: string;
}

export type IDropdownList = {
	Id: string,
	Title: string;
};

export interface IDestaque {
	Title: string;
	Text: string;
	Image: IFilePickerResult;
	Url: string;
}