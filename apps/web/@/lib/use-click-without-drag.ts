import { useState, useCallback } from "react";

interface Position {
	x: number;
	y: number;
}

const useClickWithoutDrag = (
	callback: (
		event: React.MouseEvent<keyof HTMLElementTagNameMap, MouseEvent>,
	) => void,
) => {
	const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<keyof HTMLElementTagNameMap, MouseEvent>) => {
			setStartPos({ x: event.clientX, y: event.clientY });
			setIsDragging(false);
		},
		[],
	);

	const handleMouseMove = useCallback(
		(event: React.MouseEvent<keyof HTMLElementTagNameMap, MouseEvent>) => {
			if (isDragging) return;
			const threshold = 10; // Movement threshold to distinguish drag
			const movedX = Math.abs(event.clientX - startPos.x);
			const movedY = Math.abs(event.clientY - startPos.y);
			if (movedX > threshold || movedY > threshold) {
				setIsDragging(true);
			}
		},
		[startPos, isDragging],
	);

	const handleMouseUp = useCallback(
		(event: React.MouseEvent<keyof HTMLElementTagNameMap, MouseEvent>) => {
			if (!isDragging) {
				callback(event);
			}
			setIsDragging(false); // Reset dragging state
		},
		[isDragging, callback],
	);

	return {
		onMouseDown: handleMouseDown,
		onMouseMove: handleMouseMove,
		onMouseUp: handleMouseUp,
	};
};

export default useClickWithoutDrag;
