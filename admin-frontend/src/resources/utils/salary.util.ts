export const validateMinSalary = (value, allValues) => {
    if (value >= allValues.maxSalary) {
        return 'The minimum salary must be less than the maximum salary';
    }
    return undefined;
};

export const validateMaxSalary = (value, allValues) => {
    if (value <= allValues.minSalary) {
        return 'The maximum salary must be greater than the minimum salary';
    }
    return undefined;
};
