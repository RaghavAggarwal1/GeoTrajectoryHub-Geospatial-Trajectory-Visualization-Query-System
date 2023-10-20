import React, { Component } from "react";
import TripsChart from "./components/trips-chart";
import styled from "styled-components";
import FileUploader from "./components/file-uploader";
import TextField from "@material-ui/core/TextField";
import data from "./data/test.json";
import Button from "@material-ui/core/Button";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { withStyles } from "@material-ui/core/styles";
function formatData(data) {
  return data.map((tripItem) => {
    return {
      vendor: tripItem.trajectory_id % 2,
      path: tripItem.trajectory.map((item) => {
        return [item.location[1], item.location[0]];
      }),
      timestamps: tripItem.trajectory.map(
        (item) => item.timestamp - 1664511000
      ),
    };
  });
}

const FormWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
  z-index: 2;
  width: 450px;
  background: rgb(255, 255, 255);
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  margin: 24px;
  padding: 10px 24px;
`;

const FormItem = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: flex-end;
  & > div {
    margin-right: 20px;
    width: 30%;
    &:first-child {
      text-align: right;
    }
  }
`;

const AntTabs = withStyles({
  root: {
    borderBottom: "1px solid #e8e8e8",
  },
  indicator: {
    backgroundColor: "#1890ff",
  },
})(Tabs);

export default class TripsDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      trips: formatData(data),
      file: null,
      longitudeRange: ["", ""],
      latitudeRange: ["", ""],
      timestampRange: ["", ""],
      trajectoryId: 73,
      kNumber: 100,
      tabIndex: 0,
    };

    this.changeFile = this.changeFile.bind(this);
  }

  changeFile(file) {
    this.setState({ file, trips: formatData(file.json) });
  }

  changeRangeByField = (field, index) => (event, value) => {
    const originValue = [...this.state[field]];
    originValue[index] = event.target.value;
    this.setState({ [field]: originValue });
  };

  changeFieldValue = (field) => (event) => {
    this.setState({ [field]: event.target.value });
  };
  handleChangeTab = (_, value) => {
    this.handleResetQuery()
    this.setState({ tabIndex: value });
  };

  handleResetQuery = () => {
    this.setState({
      longitudeRange: ["", ""],
      latitudeRange: ["", ""],
      timestampRange: ["", ""],
      trajectoryId: 73,
      kNumber: 100,
    });
  };

  handleSubmit = () => {
    const {
      longitudeRange,
      latitudeRange,
      timestampRange,
      trajectoryId,
      kNumber,
      tabIndex,
    } = this.state;

    if (tabIndex === 0) {
      console.log("spatial", longitudeRange, latitudeRange);
    }

    if (tabIndex === 1) {
      console.log(
        "spatiotemporal",
        longitudeRange,
        latitudeRange,
        timestampRange
      );
    }

    if (tabIndex === 2) {
      console.log("knn", trajectoryId, kNumber);
    }
  };

  renderForm = () => {
    const tabIndex = this.state.tabIndex;

    const baseItems = (
      <React.Fragment>
        <FormItem>
          <div>
            <label>longitude range:</label>
          </div>
          <div>
            <TextField
              label="start"
              style={{ marginRight: 20 }}
              type="number"
              size="small"
              value={this.state.longitudeRange[0]}
              onChange={this.changeRangeByField("longitudeRange", 0)}
            />
          </div>
          <div>
            <TextField
              label="end"
              type="number"
              size="small"
              value={this.state.longitudeRange[1]}
              onChange={this.changeRangeByField("longitudeRange", 1)}
            />
          </div>
        </FormItem>

        <FormItem>
          <div>
            <label>latitude range:</label>
          </div>
          <div>
            <TextField
              label="start"
              type="number"
              size="small"
              value={this.state.latitudeRange[0]}
              onChange={this.changeRangeByField("latitudeRange", 0)}
            />
          </div>
          <div>
            <TextField
              label="end"
              type="number"
              size="small"
              value={this.state.latitudeRange[1]}
              onChange={this.changeRangeByField("latitudeRange", 1)}
            />
          </div>
        </FormItem>

        {tabIndex === 1 && (
          <FormItem>
            <div>
              <label>timestamp range:</label>
            </div>
            <div>
              <TextField
                label="start"
                type="number"
                size="small"
                value={this.state.timestampRange[0]}
                onChange={this.changeRangeByField("timestampRange", 0)}
              />
            </div>
            <div>
              <TextField
                label="end"
                type="number"
                size="small"
                value={this.state.timestampRange[1]}
                onChange={this.changeRangeByField("timestampRange", 1)}
              />
            </div>
          </FormItem>
        )}
      </React.Fragment>
    );

    if (tabIndex === 2) {
      return (
        <FormItem>
          <div>
            <label>KNN:</label>
          </div>
          <div>
            <TextField
              label="trajectory id"
              type="number"
              size="small"
              value={this.state.trajectoryId}
              onChange={this.changeFieldValue("trajectoryId")}
            />
          </div>
          <div>
            <TextField
              label="K"
              type="number"
              size="small"
              value={this.state.kNumber}
              onChange={this.changeFieldValue("kNumber")}
            />
          </div>
        </FormItem>
      );
    }

    return baseItems
  };
  render() {
    return (
      <div>
        <FormWrapper>
          <FileUploader file={this.state.file} changeFile={this.changeFile} />

          <AntTabs
            value={this.state.tabIndex}
            onChange={this.handleChangeTab}
            aria-label="disabled tabs example"
          >
            <Tab label="spatial" />
            <Tab label="spatiotemporal" />
            <Tab label="KNN" />
          </AntTabs>
          {this.renderForm()}
          <FormItem>
            <div></div>
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
              >
                Query
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={this.handleResetQuery}>
                Reset
              </Button>
            </div>
          </FormItem>
        </FormWrapper>
        <TripsChart trips={this.state.trips} />
      </div>
    );
  }
}
