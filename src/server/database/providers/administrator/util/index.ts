import * as crudFunctions from './crudFunctions'
import * as checkFunctions from './checkFunctions'
import * as formatFunctions from './formatFunctions'


export const AdministratorUtil = {
    ...crudFunctions,
    ...checkFunctions,
    ...formatFunctions
}