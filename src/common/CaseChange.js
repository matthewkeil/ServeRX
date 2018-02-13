"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const camelBreakRegEx = /[a-z][A-Z\d]/g;
const endOfDigitRegEx = /\d\D/g;
const nonAlphaNumericRegEx = /[^a-zA-Z\d]+/g;
// const separatorBreakRegEx = /[-_\s\.\W]+/g;
const capitalBreakRegEx = /[A-Z][A-Z]/g;
var To;
(function (To) {
    To[To["camel"] = 0] = "camel";
    To[To["pascal"] = 1] = "pascal";
    To[To["kebab"] = 2] = "kebab";
    To[To["snake"] = 3] = "snake";
    To[To["dot"] = 4] = "dot";
    To[To["space"] = 5] = "space";
    To[To["upper"] = 6] = "upper";
    To[To["title"] = 7] = "title";
    To[To["lower"] = 8] = "lower";
})(To || (To = {}));
class CaseChange {
    static of(original, toCase, capitalize) {
        let words = CaseChange.separateWords(original);
        switch (toCase) {
            case To.pascal:
                return CaseChange.handleCapsAndJoin(words);
            case To.kebab:
                return CaseChange.handleCapsAndJoin(words, '-', capitalize);
            case To.snake:
                return CaseChange.handleCapsAndJoin(words, '_', capitalize);
            case To.dot:
                return CaseChange.handleCapsAndJoin(words, '.', capitalize);
            case To.space:
                return CaseChange.handleCapsAndJoin(words, ' ', capitalize);
            case To.camel:
            default:
                let changed = CaseChange.handleCapsAndJoin(words);
                return changed.substr(0, 1).toLowerCase() + changed.substr(1);
        }
    }
    static separateWords(original) {
        let input = original;
        let breaks;
        let words = [];
        input = input.replace(nonAlphaNumericRegEx, '|');
        while ((breaks = endOfDigitRegEx.exec(input)) !== null) {
            input = input.substring(0, breaks.index + 1) + '|' + input.substring(breaks.index + 1);
        }
        if (/[a-z]/.test(input)) {
            [camelBreakRegEx, capitalBreakRegEx].forEach(regex => {
                while ((breaks = regex.exec(input)) !== null) {
                    input = input.substring(0, breaks.index + 1) + '|' + input.substring(breaks.index + 1);
                }
            });
        }
        words = input.toLowerCase().split(/\|+/);
        return words;
    }
    static handleCapsAndJoin(words, separator = '', capitalize = To.title) {
        switch (capitalize) {
            case To.upper:
                words = words.map(word => word.toUpperCase());
                break;
            case To.lower:
                break;
            case To.title:
            default:
                words = words.map(word => word.substr(0, 1).toUpperCase() + word.substr(1));
                break;
        }
        return words.join(separator);
    }
}
CaseChange.To = To;
exports.CaseChange = CaseChange;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FzZUNoYW5nZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkNhc2VDaGFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFNLGVBQWUsR0FBRyxlQUFlLENBQUM7QUFDeEMsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDO0FBQ2hDLE1BQU0sb0JBQW9CLEdBQUcsZUFBZSxDQUFDO0FBQzdDLDhDQUE4QztBQUM5QyxNQUFNLGlCQUFpQixHQUFHLGFBQWEsQ0FBQztBQUV4QyxJQUFLLEVBVUo7QUFWRCxXQUFLLEVBQUU7SUFDTiw2QkFBSyxDQUFBO0lBQ0wsK0JBQU0sQ0FBQTtJQUNOLDZCQUFLLENBQUE7SUFDTCw2QkFBSyxDQUFBO0lBQ0wseUJBQUcsQ0FBQTtJQUNILDZCQUFLLENBQUE7SUFDTCw2QkFBSyxDQUFBO0lBQ0wsNkJBQUssQ0FBQTtJQUNMLDZCQUFLLENBQUE7QUFDTixDQUFDLEVBVkksRUFBRSxLQUFGLEVBQUUsUUFVTjtBQUNEO0lBR0MsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFnQixFQUFFLE1BQVcsRUFBRSxVQUEyQztRQUVuRixJQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDaEIsS0FBSyxFQUFFLENBQUMsTUFBTTtnQkFDYixNQUFNLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVDLEtBQUssRUFBRSxDQUFDLEtBQUs7Z0JBQ1osTUFBTSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdELEtBQUssRUFBRSxDQUFDLEtBQUs7Z0JBQ1osTUFBTSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzdELEtBQUssRUFB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