import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IDropdownList } from "../../interfaces";

export interface IMinhaMesaProps {
	lists: IDropdownList[];
	context: WebPartContext;
	isOpen?: boolean;
}
