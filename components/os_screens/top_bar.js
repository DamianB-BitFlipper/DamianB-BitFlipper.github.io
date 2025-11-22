import React, { Component } from 'react';
import Clock from '../os_components/clock';
import SystemIndicatorPanel, { PanelSummary } from '../os_components/system_indicator_panel';

export default class TopBar extends Component {
	constructor() {
		super();
		this.panelSummaryRef = React.createRef();
		this.state = {
			show_panel: false
		};
	}

	toglePanel = () => {
		this.setState({ show_panel: !this.state.show_panel });
	}

    closePanel = () => {
        this.setState({ show_panel: false });
    }

	render() {
		return (
			<div className="main-navbar-vp absolute top-0 right-0 w-screen shadow-md flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-sm select-none z-50">
				<div
					tabIndex="0"
					className={
						'pl-3 pr-3 outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1 '
					}
				>
					Activities
				</div>
				<div
					tabIndex="0"
					className={
						'pl-2 pr-2 text-xs md:text-sm outline-none transition duration-100 ease-in-out border-b-2 border-transparent focus:border-ubb-orange py-1'
					}
				>
					<Clock />
				</div>
				<div
					id="status-bar"
					tabIndex="0"
					ref={this.panelSummaryRef}
					className={`relative pr-3 pl-3 outline-none transition duration-100 ease-in-out border-b-2 ${this.state.show_panel ? 'border-ubb-orange' : 'border-transparent'} py-1 `}
				>
					<PanelSummary onClick={this.toglePanel} />
					<SystemIndicatorPanel
						shutDown={this.props.shutDown}
						lockScreen={this.props.lockScreen}
						visible={this.state.show_panel}
						closePanel={this.closePanel}
					/>
				</div>
			</div>
		);
	}
}
