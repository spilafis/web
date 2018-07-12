import React from "react";
import "./ServiceHome.css";
import {
	translate
} from "react-i18next";

import HeaderBar from "./HeaderBar";
import _ from "lodash";

class ServiceDepartmentList extends React.Component {
	state = {
		regions: [],
	};
	componentDidMount() {

	}

	renderRegion(c) {
		let {
			onOpenDepartment
		} = this.props;

		const {
			id,
			name,
		} = c;

		return (
			<li key={id}>
				<hr className="line" />
				<div className="container" onClick={() => setTimeout(() => onOpenDepartment(c.id, name), 300)}>
					<strong>{name}</strong>
					<div className="right">
						<i className="material-icons">keyboard_arrow_right</i>
					</div>
				</div>
			</li>
		);
	}
	render() {
		const {
			allRegions
		} = this.props;
		const {
			t,
		} = this.props;
		if ((allRegions || []).length === 0) {
			return (
				<div className="ServiceCategoryList">
					<div className="Title">
						<h1>{t("Service Categories")}</h1>
					</div>
					<div className="loader" />
				</div>
			);
		}
		let sortedRegions = _.sortBy(allRegions || [], c => {
			return c.name;
		});
		return [
			<HeaderBar key={"Header"} title={t("Locations").toUpperCase()}>
			</HeaderBar>,
			<div key={"List"} className="ServiceCategoryList">
				<ul>
					{sortedRegions.map(c => this.renderRegion(c))}
				</ul>
			</div>,
		];
	}
}

export default translate()(ServiceDepartmentList);
