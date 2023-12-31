// merge the old time object into the new one
export default function mergeInOldTimeObject(current: any, old: any) {
    let newObject: any = {};
    let timeOfCurrent = current.time;

    function iterator(depth: number, level: any, path: string) {
        if (depth === 4) return;

        let levelKeys = Object.keys(level);

        for (let i = 0; i < levelKeys.length; i++) {
            let key = levelKeys[i];
            let value = level[key];

            if (Object.keys(value).length > 0) {
                iterator(depth + 1, value, path + '.' + key);
            }

            if (key === 'total' || key === 'active') {
                switch (depth) {
                    case 3: {
                        let keys = path.split('.');

                        if (newObject[keys[1]] == null) newObject[keys[1]] = {};
                        if (newObject[keys[1]][keys[2]] == null) newObject[keys[1]][keys[2]] = {};
                        if (newObject[keys[1]][keys[2]][keys[3]] == null) newObject[keys[1]][keys[2]][keys[3]] = {};

                        if (value != null && newObject[keys[1]][keys[2]][keys[3]].total != null) newObject[keys[1]][keys[2]][keys[3]].total += value;
                        if (value != null && newObject[keys[1]][keys[2]][keys[3]].total == null) newObject[keys[1]][keys[2]][keys[3]].total = value;
                        break;
                    }
                }
            }
        }
    }

    iterator(0, timeOfCurrent, '');
    iterator(0, old, '');

    return newObject;
}
