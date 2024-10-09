export const validateDocumentId = (documentId: string) => {
    let vnTotal = 0;
    const vcCedula = documentId.replace(/-/g, '');
    const pLongCed = vcCedula.trim().length;
    const digitoMult = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];

    if (pLongCed !== 11) {
        return false;
    }

    for (let vDig = 0; vDig < pLongCed; vDig++) {
        let vCalculo = parseInt(vcCedula[vDig]) * digitoMult[vDig];

        if (vCalculo > 9) {
            vCalculo = Math.floor(vCalculo / 10) + (vCalculo % 10);
        }

        vnTotal += vCalculo;
    }

    return vnTotal % 10 === 0;
};
