import React from 'react';
import ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base'

import strings from 'MinhaMesaWebPartStrings';
import MinhaMesa from './components/MinhaMesa';
import { IMinhaMesaProps } from './components/IMinhaMesaProps';

export interface IMinhaMesaWebPartProps {

}

export default class MinhaMesaWebPart extends BaseClientSideWebPart<IMinhaMesaWebPartProps> {

	public render(): void {
		const element: React.ReactElement<IMinhaMesaProps> = React.createElement(
			MinhaMesa,
			{
				context: this.context
			}
		)

		ReactDom.render(element, this.domElement)
	}

	public async onInit(): Promise<void> {
		await super.onInit()

	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement)
	}

	protected get dataVersion(): Version {
		return Version.parse('1.0');
	}

	protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
		return {
			pages: [
				{
					header: {
						description: strings.PropertyPaneDescription
					},
					groups: [
						{
							groupFields: [

							]
						}
					]
				}
			]
		}
	}
}
