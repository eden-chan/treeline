import React, { Component } from "react";

import { Comment } from "./Comment";
import { Question } from "./Question";

import "../../style/Tip.css";

interface State {
  status: "compact" | "question" | "comment";
}

interface Props {
  onCommentConfirm: (comment: { text: string; emoji: string }) => void;
  onPromptConfirm: (prompt: { text: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

export class Tip extends Component<Props, State> {
  state: State = {
    status: "compact",
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.status !== nextState.status) {
      onUpdate();
    }
  }

  render() {
    const { onCommentConfirm, onPromptConfirm, onOpen } = this.props;
    const { status } = this.state;

    return (
      <div className="Tip">
        {status === "question" && <Question onConfirm={onPromptConfirm} />}
        {status === "comment" && <Comment onConfirm={onCommentConfirm} />}
        {status === "compact" && (
          <div className="flex">
            <div
              className="Tip__compact"
              onClick={() => {
                onOpen();
                this.setState({ status: "question" });
              }}
            >
              Ask question
            </div>
            <div
              className="Tip__compact"
              onClick={() => {
                onOpen();
                this.setState({ status: "comment" });
              }}
            >
              Add comment
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Tip;
