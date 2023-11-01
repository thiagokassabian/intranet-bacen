import { Log } from '@microsoft/sp-core-library';
import {
	BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

const LOG_SOURCE: string = 'HideElementApplicationCustomizer';

export interface IHideElementApplicationCustomizerProperties {
	elementId: string;
}


export default class HideElementApplicationCustomizer
	extends BaseApplicationCustomizer<IHideElementApplicationCustomizerProperties> {

	public onInit(): Promise<void> {

		if (this.properties.elementId !== "") {
			const spElement = document.getElementById(this.properties.elementId);

			if (spElement) {
				Log.info(LOG_SOURCE, `Element ${spElement} found`);
				spElement.style.display = "none";
			}
		}

		return Promise.resolve();
	}
}
