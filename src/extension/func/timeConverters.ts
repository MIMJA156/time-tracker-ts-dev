// milliseconds -> human time
export function MillisecondsToDays(value: number) {
    return value / 1000 / 60 / 60 / 24;
}

export function MillisecondsToHours(value: number) {
    return value / 1000 / 60 / 60;
}
export function MillisecondsToMinutes(value: number) {
    return value / 1000 / 60;
}
export function MillisecondsToSeconds(value: number) {
    return value / 1000;
}

// human time -> milliseconds
export function DaysToMilliseconds(value: number) {
    return value * 1000 * 60 * 60 * 24;
}

export function HoursToMilliseconds(value: number) {
    return value * 1000 * 60 * 60;
}

export function MinutesToMilliseconds(value: number) {
    return value * 1000 * 60;
}

export function SecondsToMilliseconds(value: number) {
    return value * 1000;
}

// seconds to time values
export function SecondsToHoursMinutesSeconds(value: number) {
    let hours = Math.floor(value / (60 * 60));
    let minutes = Math.floor((value - hours * 60 * 60) / 60);
    let seconds = Math.floor(((value - (minutes * 60 + hours * 60 * 60)) / 60) * 60);

    return {
        hours,
        minutes,
        seconds,
    };
}
