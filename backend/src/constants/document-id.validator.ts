import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsValidDocumentIdConstraint implements ValidatorConstraintInterface {
    validate(documentId: string, _args: ValidationArguments): boolean {
        // Ensure document ID is exactly 11 digits long
        if (!/^\d{11}$/.test(documentId)) {
            return false;
        }
    
        const coefficients = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
        let totalSum = 0;
    
        // Loop through the first 10 digits of the document ID
        for (let i = 0; i < 10; i++) {
            let product = parseInt(documentId[i] as string, 10) * (coefficients[i] as number);
    
            // If the product is two digits, sum them
            if (product >= 10) {
                product = Math.floor(product / 10) + (product % 10);
            }
    
            totalSum += product;
        }
    
        // Round up to the nearest multiple of 10 and calculate the verifier digit
        const nearestTen = Math.ceil(totalSum / 10) * 10;
        const calculatedVerifier = nearestTen - totalSum;
    
        // Compare calculated verifier with the actual verifier (last digit)
        const actualVerifier = parseInt(documentId[10] as string, 10);
    
        return calculatedVerifier === actualVerifier;
    }
    
    defaultMessage(_args: ValidationArguments): string {
        return 'Invalid Document ID';
    }    
}
