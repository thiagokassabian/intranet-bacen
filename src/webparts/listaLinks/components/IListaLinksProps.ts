import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IListaLinksProps {
	listGuid: string | string[];
	context: WebPartContext;
	color: string;
}
