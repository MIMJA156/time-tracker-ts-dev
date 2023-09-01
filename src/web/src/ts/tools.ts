export function processMessageUpdateData(timeObject: object, givenDate: Date | undefined = undefined) {
    let today = givenDate ?? new Date();
    today.setHours(0, 0, 0, 0);

    let firstDayOfTheWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    let date = new Date(firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate()));
    let data = {};

    try {
        data = timeObject['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] ? timeObject['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] : {};
    } catch (e) {}

    let processedData = [];
    processedData.push({ date, data });

    for (let i = 0; i < 6; i++) {
        let date = new Date(firstDayOfTheWeek.setDate(firstDayOfTheWeek.getDate() + 1)),
            data = {};

        try {
            data = timeObject['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] ? timeObject['time'][firstDayOfTheWeek.getFullYear()][firstDayOfTheWeek.getMonth() + 1][firstDayOfTheWeek.getDate()] : {};
        } catch (e) {}

        processedData.push({ date, data });
    }

    return processedData;
}
