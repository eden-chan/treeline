export const randomDarkColor = `#${[0, 0, 0]
    .map(() =>
        Math.floor(Math.random() * 200)
            .toString(16)
            .padStart(2, '0')
    )
    .join('')}`;

export const getCurrentDate = (): number => {
    return Date.now();
};