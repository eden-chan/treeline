import { Component } from "react";
import styles from "../style/Tip.module.css";
import { Editor } from "../../example/src/editor/Editor";
import { $getRoot } from "lexical";

interface State {
  compact: boolean;
  text: string;
  emoji: string;
}

interface Props {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
    emoji: "",
  };

  // for TipContainer
  componentDidUpdate(_: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text, emoji } = this.state;

    return (
      <div className={styles.tipContainer}>
        {compact ? (
          <div
            className={`${styles.compact} ${styles.tipContent}`}
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
            }}
          >
            Add highlight
          </div>
        ) : (
          <form
            className={`${styles.card} ${styles.tipContent}`}
            onSubmit={(event) => {
              event.preventDefault();
              onConfirm({ text, emoji });
            }}
          >
            <div>
              {/* <textarea
                placeholder="Your comment"
                // biome-ignore lint/a11y/noAutofocus: This is an example app
                autoFocus
                value={text}
                onChange={(event) =>
                  this.setState({ text: event.target.value })
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }} */}
              {/* /> */}
              <Editor
                value={text}
                onChange={(editorState) => {
                  this.setState({
                    text: editorState.read(() => $getRoot().getTextContent()),
                  });
                }}
                onEnter={(editorState) => {
                  console.log("[onEnter] editorState", editorState);
                }}
              />

              <div>
                {["💩", "😱", "😍", "🔥", "😳", "⚠️"].map((_emoji) => (
                  <label key={_emoji}>
                    <input
                      checked={emoji === _emoji}
                      type="radio"
                      name="emoji"
                      value={_emoji}
                      onChange={(event) =>
                        this.setState({ emoji: event.target.value })
                      }
                    />
                    {_emoji}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }
}
