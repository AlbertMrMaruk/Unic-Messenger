import React, { Component } from "react";

import vmsg from "../../vmsg";

import wasmURL from "../../vmsg.wasm";

import { FaMicrophone } from "react-icons/fa";

const shimURL = "https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js";

export default class Recorder extends Component {
  static defaultProps = {
    recorderParams: {},
    onRecordingComplete: () => {},
    onRecordingError: () => {},
  };

  state = {
    isRecording: false,
    duration: 0,
  };

  calcDur = (dur) => {
    let m = Math.floor(dur / 60);
    let s = dur - m * 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return m + ":" + s;
  };
  _timedur = null;
  _recorder = null;

  componentWillUnmount() {
    this._cleanup();
  }

  render() {
    const {
      recorderParams,
      onRecordingComplete,
      onRecordingError,
      className,
      ...rest
    } = this.props;

    return (
      <div
        className={`p-2 rounded-md  bg-secondarylight
          }`}
      >
        <div className="flex items-center flex-col gap-2">
          {this.state.isRecording ? (
            <button
              onClick={this._onMouseUp}
              className="text-2xl p-2 text-red-500"
            >
              <FaMicrophone />
            </button>
          ) : (
            <button
              onClick={this._onMouseDown}
              className="text-2xl p-2 text-primary"
            >
              <FaMicrophone />
            </button>
          )}
          {this.state.isRecording && (
            <div className="text-sm text-gray-600">
              {this.calcDur(this.state.duration)}
            </div>
          )}
        </div>
      </div>
      // <div className={"w-[40%]"} {...rest}>
      //   <div
      //     className={""}
      //     onMouseDown={this._onMouseDown}
      //     onMouseUp={this._onMouseUp}
      //   >
      //     <img src={""} width={24} height={24} />
      //   </div>
      // </div>
    );
  }

  _cleanup() {
    if (this._recorder) {
      this._recorder.stopRecording();
      this._recorder.close();
      delete this._recorder;
    }
  }

  _onMouseDown = () => {
    const { recorderParams } = this.props;

    this._cleanup();

    this._timedur = setInterval(() => {
      this.setState({ duration: this.state.duration + 1 });
    }, 1000);

    this._recorder = new vmsg.Recorder({
      wasmURL,
      shimURL,
      ...recorderParams,
    });

    this._recorder
      .init()
      .then(() => {
        this._recorder.startRecording();
        this.setState({ isRecording: true });
      })
      .catch((err) => this.props.onRecordingError(err));
  };

  _onMouseUp = () => {
    if (this._recorder) {
      clearInterval(this._timedur);

      this._recorder
        .stopRecording()
        .then((blob) => this.props.onRecordingComplete(blob))
        .catch((err) => this.props.onRecordingError(err));
      this.setState({ isRecording: false, duration: 0 });
    }
  };
}
