import React from './mini-react';
import Component from './component';


export function createContext(defaultValue) {
	return {
		Provider: class Provider extends Component {
			render() {
				const currentValue = this.props.value;
				Provider.currentValue = currentValue || defaultValue;
				return <div></div>
			}	
		}
	}
}