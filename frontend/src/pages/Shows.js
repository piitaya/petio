import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Api from "../data/Api";
// import Popular from "../components/Popular";
// import History from "../components/History";
import ShowCard from "../components/TvCard";
import Carousel from "../components/Carousel";
import { ReactComponent as Spinner } from "../assets/svg/spinner.svg";
// import User from "../data/User";

class Shows extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      personalised: false,
      loading: true,
    };

    this.getPersonalised = this.getPersonalised.bind(this);
  }

  componentDidMount() {
    let page = document.querySelectorAll(".page-wrap")[0];
    page.scrollTop = 0;
    window.scrollTo(0, 0);

    if (!Object.keys(this.props.api.popular).length > 0) {
      Api.getPopular();
    }

    this.getPersonalised();
  }

  async getPersonalised() {
    try {
      let personalised = await Api.discoveryShows();
      this.setState({
        personalised: personalised,
        loading: false,
      });
    } catch {
      console.log("Couldn't load user personalised");
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="spinner">
          <div>
            <p>Building your personalised TV Discovery...</p>
            <Spinner />
          </div>
        </div>
      );
    }
    return (
      <>
        <h1 className="main-title mb--1">TV Shows</h1>
        {this.state.personalised && this.state.personalised.length > 0
          ? this.state.personalised.map((row, r) => {
              if (!row || row.results.length < 4) return null;
              return (
                <section key={`psn__${r}`}>
                  <h3 className="sub-title mb--1">{row.title}</h3>
                  <Carousel>
                    {row.results.length > 0
                      ? row.results.map((series) => {
                          if (!series.id) return null;
                          return (
                            <ShowCard
                              key={`psn__${r}__${series.id}`}
                              msg={this.props.msg}
                              series={series}
                            />
                          );
                        })
                      : null}
                  </Carousel>
                </section>
              );
            })
          : null}
      </>
    );
  }
}

Shows = withRouter(Shows);

function MoviesContainer(props) {
  return <Shows api={props.api} msg={props.msg} />;
}

const mapStateToProps = function (state) {
  return {
    api: state.api,
  };
};

export default connect(mapStateToProps)(MoviesContainer);
