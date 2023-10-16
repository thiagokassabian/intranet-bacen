import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";

let _sp: SPFI;

export const getSP = (context?: WebPartContext): SPFI => {
	if (!!context)
		_sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));

	return _sp;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLists = async (context: WebPartContext): Promise<any[]> => {
	const sp = getSP(context);
	const lists = await sp.web.lists();
	return lists.filter(list => list.Hidden === false && list.BaseTemplate === 100);
};