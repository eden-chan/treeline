import { createRef, useRef } from "react";
import type { RefObject } from "react";
import { useRoom, emoji, emojiNames, MAIN_ROOM_ID } from "./utils/dbUtils";
import styles from "./Emoji.module.css";

const refsInit = Object.fromEntries(
  emojiNames.map((name) => [name, createRef<HTMLDivElement>()]),
);

export default function InstantTopics({ roomId = MAIN_ROOM_ID }) {
  const room = useRoom(roomId);
  const { usePublishTopic, useTopicEffect } = room;

  const publishEmoji = usePublishTopic("emoji");

  useTopicEffect("emoji", ({ name, directionAngle, rotationAngle }) => {
    if (!emoji[name]) return;

    animateEmoji(
      { emoji: emoji[name], directionAngle, rotationAngle },
      elRefsRef.current[name].current,
    );
  });

  const elRefsRef = useRef<{
    [k: string]: RefObject<HTMLDivElement>;
  }>(refsInit);

  return (
    <div className={styles.container}>
      <div className="flex gap-4">
        {emojiNames.map((name) => (
          <div className="relative" key={name} ref={elRefsRef.current[name]}>
            <button
              className={styles.emojiButton}
              type="button"
              onClick={() => {
                const params = {
                  name,
                  rotationAngle: Math.random() * 360,
                  directionAngle: 225, // Angle towards top left (315 degrees, but we subtract from 360 for counterclockwise direction)
                };
                animateEmoji(
                  {
                    emoji: emoji[name],
                    rotationAngle: params.rotationAngle,
                    directionAngle: params.directionAngle,
                  },
                  elRefsRef.current[name].current,
                );

                publishEmoji(params);
              }}
            >
              {emoji[name]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function animateEmoji(
  config: { emoji: string; directionAngle: number; rotationAngle: number },
  target: HTMLDivElement | null,
) {
  if (!target) return;

  const rootEl = document.createElement("div");
  const directionEl = document.createElement("div");
  const spinEl = document.createElement("div");

  spinEl.innerText = config.emoji;
  directionEl.appendChild(spinEl);
  rootEl.appendChild(directionEl);
  document.body.appendChild(rootEl);

  rootEl.className = styles.emojiAnimation;
  spinEl.className = styles.emojiSpin;

  style(rootEl, {
    position: "fixed",
    zIndex: "9999",
    top: "100%",
    left: "100%",
    transform: `rotate(${config.directionAngle * 360}deg)`,
  });

  style(spinEl, {
    transform: `rotateZ(${config.rotationAngle * 400}deg)`,
  });

  setTimeout(() => {
    style(directionEl, {
      transform: "translate(-150vw, -150vh) scale(3)",
      transition: "all 1000ms",
      opacity: "0",
    });
  }, 20);

  setTimeout(() => rootEl.remove(), 1500);
}

function style(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, styles);
}
