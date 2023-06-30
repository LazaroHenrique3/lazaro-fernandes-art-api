

//FUNÇÕES RELACIONADOS AO |CRUD|
//--Faz a criação da nova categoria no banco de dados


//Faz a atualização da categoria no banco de dados




//------//------//

//FUNÇÕES DE VALIDAÇÃO
//--Verifica se o id informado é válido


import * as crudFunctions from './crudFunctions'
import * as checkFunctions from './checkFunctions'

export const CategoryUtil = {
    ...crudFunctions,
    ...checkFunctions,
}




