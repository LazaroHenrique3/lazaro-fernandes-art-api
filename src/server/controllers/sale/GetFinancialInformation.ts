import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { SaleProvider } from '../../database/providers/sale'


export const getFinancialInformation = async (req: Request<{}, {}, {}, {}>, res: Response) => {
   

    const result = await SaleProvider.getFinancialInformation()

    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: { default: result.message }
        })
    } 

    return res.status(StatusCodes.OK).json(result)
}
 