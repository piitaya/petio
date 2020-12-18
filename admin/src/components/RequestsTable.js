import React from 'react';
import { ReactComponent as MovieIcon } from '../assets/svg/movie.svg';
import { ReactComponent as TvIcon } from '../assets/svg/tv.svg';

class RequestsTable extends React.Component {
	getUsername(id) {
		if (!this.props.api.users) {
			return null;
		} else if (id in this.props.api.users) {
			return this.props.api.users[id].title;
		} else {
			return null;
		}
	}

	typeIcon(type) {
		let icon = null;
		switch (type) {
			case 'movie':
				icon = <MovieIcon />;
				break;
			case 'tv':
				icon = <TvIcon />;
				break;
			default:
				icon = null;
		}

		return <span className="requests--icon">{icon}</span>;
	}

	calcDate(diff) {
		var day = 1000 * 60 * 60 * 24;

		var days = Math.floor(diff / day);
		var months = Math.floor(days / 31);
		var years = Math.floor(months / 12);
		days = days - months * 31;
		months = months - years * 12;

		var message = '';
		message += years ? years + ' yr ' : '';
		message += months ? months + ' m ' : '';
		message += days ? days + ' d ' : '';

		return message;
	}

	reqState(req) {
		if (req.status.length > 0) {
			return (
				<span className="requests--status requests--status__orange">
					Downloading
				</span>
			);
		}

		if (req.info.downloaded || req.info.movieFile) {
			return (
				<span className="requests--status requests--status__good">
					Downloaded
				</span>
			);
		}

		if (req.info.message === 'NotFound') {
			return (
				<span className="requests--status requests--status__bad">
					Removed
				</span>
			);
		}

		if (req.type === 'tv' && req.info) {
			if (req.info.episodeCount === req.info.episodeFileCount) {
				return (
					<span className="requests--status requests--status__good">
						Downloaded
					</span>
				);
			}

			if (req.info.seasons) {
				let missing = false;
				for (let season of req.info.seasons) {
					if (season.statistics.percentOfEpisodes !== 100)
						missing = true;
				}

				if (!missing) {
					return (
						<span className="requests--status requests--status__good">
							Downloaded
						</span>
					);
				} else {
					return (
						<span className="requests--status requests--status__bad">
							Unavailable
						</span>
					);
				}
			}
		}

		if (req.type === 'movie' && req.info) {
			if (req.info.inCinemas || req.info.digitalRelease) {
				if (req.info.inCinemas) {
					var diff = Math.floor(
						new Date(req.info.inCinemas) - new Date()
					);
					if (diff > 0) {
						return (
							<span className="requests--status requests--status__blue">
								~{this.calcDate(diff)}
							</span>
						);
					}
				}
				if (req.info.digitalRelease) {
					let digitalDate = new Date(req.info.digitalRelease);
					if (new Date() - digitalDate < 0) {
						return (
							<span className="requests--status requests--status__cinema">
								In Cinemas
							</span>
						);
					} else {
						return (
							<span className="requests--status requests--status__bad">
								Unavailable
							</span>
						);
					}
				} else {
					return (
						<span className="requests--status requests--status__bad">
							Unavailable
						</span>
					);
				}
			}
		}

		return (
			<span className="requests--status requests--status__manual">
				No status
			</span>
		);
	}

	render() {
		return (
			<table className="generic-table generic-table__rounded">
				<thead>
					<tr>
						<th>Date Added</th>
						<th className="fixed">Title</th>
						<th>Type</th>
						<th>Status</th>
						<th>Users</th>

						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(this.props.requests).length === 0 ? (
						<tr>
							<td>No requests</td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
					) : (
						Object.keys(this.props.requests).map((key) => {
							let req = this.props.requests[key];
							let active = null;

							if (req.status.length > 0) {
								active = req.status.map((child) => {
									let type = req.type;
									let prog =
										(child.sizeleft / child.size - 1) *
										-1 *
										100;
									return (
										<tr className="child">
											<td></td>
											<td>
												{type === 'tv' ? (
													<p>
														Series:{' '}
														{
															child.episode
																.seasonNumber
														}{' '}
														Episode:{' '}
														{
															child.episode
																.episodeNumber
														}
													</p>
												) : null}
												{type === 'movie' ? (
													<p>Movie</p>
												) : null}
											</td>
											<td>
												<span className="requests--quality">
													{child.quality.quality.name}
												</span>
											</td>
											<td>
												<div className="requests--prog--wrap">
													<div className="requests--prog">
														<span
															className="requests--prog--active"
															style={{
																width:
																	prog + '%',
															}}
														></span>
													</div>

													{(child.status !==
														'Downloading' &&
														child.status !==
															'downloading') ||
													!child.timeleft ? (
														<p>
															<strong className="capitalise">
																{child.status}
															</strong>
														</p>
													) : (
														<p>
															Time left{' '}
															<strong>
																{child.timeleft}
															</strong>
														</p>
													)}
												</div>
											</td>
											<td></td>
										</tr>
									);
								});
							}

							return (
								<React.Fragment key={key}>
									<tr>
										<td>
											{req.info.added
												? new Date(
														req.info.added
												  ).toLocaleDateString()
												: 'n/a'}
										</td>
										<td className="fixed">{req.title}</td>
										<td>{this.typeIcon(req.type)}</td>
										<td>
											{this.reqState(req)}
											{req.sonarrId ? (
												<span className="requests--status requests--status__sonarr">
													Sonarr
												</span>
											) : null}
											{req.radarrId ? (
												<span className="requests--status requests--status__radarr">
													Radarr
												</span>
											) : null}
										</td>
										<td>
											{req.users.map((user, i) => {
												return (
													<p
														key={`${req.id}_${user}_${i}`}
													>
														{this.getUsername(user)}
													</p>
												);
											})}
										</td>
										<td></td>
									</tr>
									{active}
								</React.Fragment>
							);
						})
					)}
				</tbody>
			</table>
		);
	}
}

export default RequestsTable;