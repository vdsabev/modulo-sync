import { equal, contains } from './utils';

export const _: any = Object.freeze({ type: 'placeholder' }); // Placeholder

const isPlaceholder = equal(_);
const hasPlaceholder = contains(_);

export const replacePlaceholderInObject = <T extends {}>(placeholderObject: T, replacementValue: any): T => {
  const replacedObject = <T>{};
  const placeholderKeys = Object.keys(placeholderObject).map((key) => {
    const value = (<any>placeholderObject)[key];
    (<any>replacedObject)[key] = isPlaceholder(value) ? replacementValue : value;
  });
  return replacedObject;
};

export const replacePlaceholderInArray = <T>(placeholderArray: T[], replacementValue: T[]): (T | undefined)[] => {
  const replacementValueCopy = replacementValue.slice();
  const replacedArray = placeholderArray.map((item, index) => {
    if (isPlaceholder(item)) return replacementValueCopy.shift();

    if (hasPlaceholder(item)) {
      return replacePlaceholderInObject(item, replacementValueCopy.shift());
    }

    return item;
  });
  return replacedArray.concat(replacementValueCopy);
};
