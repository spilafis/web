import React from "react";
import services from "../backend";
import { connect } from "react-redux";
import { ArticlePage, ArticleFooter } from "../components";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { history, actions } from "../store";
import { push } from "react-router-redux";
import _ from "lodash";

class Article extends React.Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				country: PropTypes.string.isRequired,
				category: PropTypes.string.isRequired,
				article: PropTypes.string.isRequired,
			}).isRequired,
		}).isRequired,
		onMount: PropTypes.func.isRequired,
	};
	constructor() {
		super();

		this.state = { loading: false };
	}

	componentWillMount() {
		this.setState({ loading: true });

		this.props
			.onMount(this.props.category, this.props.match.params.article)
			.then(s => {
				return this.setState({ loading: false });
			});
	}

	componentWillUnmount() {}

	componentWillUpdate(nextProps, b) {
		const articleChanged =
			this.props.match &&
			nextProps.match &&
			this.props.match.params.article !== nextProps.match.params.article;
		const categoryChanged = this.props.category !== nextProps.category;

		if (articleChanged || categoryChanged) {
			this.setState({ loading: true });
			this.props
				.onMount(nextProps.category, nextProps.match.params.article)
				.then(s => {
					return this.setState({ loading: false });
				});
		}
	}

	render() {
		const { loading } = this.state;
		const { article, direction } = this.props;
		const { category, country, onNavigateTo } = this.props;

		if (!article || !category) return <div style={{ height: 100 }} />;

		let next = null,
			previous = null;
		if (category) {
			let index = category.fields.articles
				.map(a => a.fields.slug)
				.indexOf(article.fields.slug);

			if (index > 0) {
				previous = category.fields.articles[index - 1];
			}

			if (index + 1 < category.fields.articles.length) {
				next = category.fields.articles[index + 1];
			}
		}

		console.log(country)
		return (
			<div>
				<ArticlePage
					category={category}
					article={article}
					loading={loading}
				/>
				<ArticleFooter
					onNavigateTo={onNavigateTo(category, country)}
					{...{ direction, previous, next }}
				/>
			</div>
		);
	}
}

const mapState = (s, p) => {
	return {
		article: s.article,
		match: p.match,
		country: p.country || s.country,
		category: p.category || s.category,
		direction: s.direction,
	};
};
const mapDispatch = (d, p) => {
	return {
		onMount: (category, slug) => {
			if (category && category.fields.articles) {
				return Promise.resolve(
					d(
						actions.selectArticle(
							_.first(
								category.fields.articles.filter(
									a => a.fields.slug === slug
								)
							)
						)
					)
				);
            }
            
            return Promise.resolve(true);
		},
		onNavigateTo: (category, country) => slug => {
			setTimeout(() => {
				d(push(`/${country.fields.slug}/${category.fields.slug}/${slug}`));
			}, 200);
		},
	};
};

export default connect(mapState, mapDispatch)(Article);
