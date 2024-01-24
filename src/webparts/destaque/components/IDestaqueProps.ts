import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDestaque } from "../../interfaces";

export interface IDestaqueProps {
	context: WebPartContext;
	onConfigure: () => void;
	selectedPageId: number;
	selectedSitePage: boolean;
	destaque: IDestaque;
	video?: string;
	imageOrVideo?: string;
}
