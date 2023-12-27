import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
	type IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import strings from 'CarrosselWebPartStrings';
import Carrossel from './components/Carrossel';
import { ICarrosselProps } from './components/ICarrosselProps';

export interface ICarrosselWebPartProps {

}

export default class CarrosselWebPart extends BaseClientSideWebPart<ICarrosselWebPartProps> {


	public render(): void {
		const element: React.ReactElement<ICarrosselProps> = React.createElement(
			Carrossel,
			{
				context: this.context
			}
		);

		ReactDom.render(element, this.domElement);
	}

	protected onDispose(): void {
		ReactDom.unmountComponentAtNode(this.domElement);
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
							groupName: strings.GroupName,
							groupFields: [

							]
						}
					]
				}
			]
		};
	}
}
