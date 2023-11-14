import React from "react";

import vmsg from "../../vmsg";

import wasmURL from "../../vmsg.wasm";

const shimURL = "https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js";

export default class Recorder {
  static defaultProps = {
    recorderParams: {},
    onRecordingComplete: () => {},
    onRecordingError: () => {},
  };

  state = {
    isRecording: false,
  };

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
      <div className={"w-[40%]"} {...rest}>
        <div
          className={""}
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
        >
          <img src={""} width={24} height={24} />
        </div>
      </div>
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
      this._recorder
        .stopRecording()
        .then((blob) => this.props.onRecordingComplete(blob))
        .catch((err) => this.props.onRecordingError(err));
    }
  };
}
