const actions = {
    GET_PATIENT: 'get:patient',
    GET_PATIENT_SELF: 'get:patient:self',
    UPDATE_PATIENT: 'update:patient',
    UPDATE_PATIENT_SELF: 'update:patient:self',
    DELETE_PATIENT: 'delete:patient',
    DELETE_PATIENT_SELF: 'delete:patient:self',

    GET_DOCTOR: 'get:doctor',
    GET_DOCTOR_SELF: 'get:doctor:self',
    GET_DOCTORS: 'get:doctors',
    UPDATE_DOCTOR: 'update:doctor',
    UPDATE_DOCTOR_SELF: 'update:doctor:self',
    DELETE_DOCTOR: 'delete:doctor',
    DELETE_DOCTOR_SELF: 'delete:doctor:self',
    BOOK_DOCTOR: 'book:doctor',

    GET_NURSE: 'get:nurse',
    GET_NURSE_SELF: 'get:nurse:self',
    GET_NURSES: 'get:nurses',
    UPDATE_NURSE: 'update:nurse',
    UPDATE_NURSE_SELF: 'update:nurse:self',
    DELETE_NURSE: 'delete:nurse',
    DELETE_NURSE_SELF: 'delete:nurse:self',
}

const permissions = {
    patient: [
        actions.GET_PATIENT_SELF,
        actions.UPDATE_PATIENT_SELF,
        actions.DELETE_PATIENT_SELF,
        actions.GET_DOCTOR,
        actions.GET_DOCTORS,
        actions.BOOK_DOCTOR,
        actions.GET_NURSE,
        actions.GET_NURSES
    ],
    doctor: [
        actions.GET_DOCTOR_SELF,
        actions.UPDATE_DOCTOR_SELF,
        actions.DELETE_DOCTOR_SELF,
        actions.GET_PATIENT
    ],
    nurse: [
        actions.GET_NURSE_SELF,
        actions.UPDATE_NURSE_SELF,
        actions.DELETE_NURSE_SELF,
        actions.GET_PATIENT
    ]
}

module.exports = {
    actions,
    permissions
}
